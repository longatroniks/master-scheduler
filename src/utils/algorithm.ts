import { Classroom } from 'src/models/Classroom';
import { Course } from 'src/models/Course';
import { Lecturer } from 'src/models/Lecturer';
import { Section } from 'src/models/Section';

// Define the structure for each scheduled item
interface ScheduleItem {
  classroomId: string;
  classroomName: string; // Adding classroom name for readability
  courseId: string;
  courseName: string; // Adding course name
  sectionId: string;
  sectionName: string; // Adding section name
  lecturerId: string;
  lecturerName: string; // Adding lecturer name
  day: string;
  startTime: string;
  endTime: string;
}

// Function to check if a classroom is available at the given time
function isClassroomAvailable(
  classroom: Classroom,
  day: string,
  startTime: string,
  endTime: string,
  schedule: ScheduleItem[]
): boolean {
  // Check against the current schedule to see if the classroom is already booked
  const isBooked = schedule.some(
    (item) =>
      item.classroomId === classroom.id &&
      item.day === day &&
      ((item.startTime <= startTime && item.endTime > startTime) ||
        (item.startTime < endTime && item.endTime >= endTime))
  );
  return !isBooked; // Classroom is available if it's not already booked
}

function isLecturerAvailable(
  lecturerId: string,
  day: string,
  startTime: string,
  endTime: string,
  schedule: ScheduleItem[]
): boolean {
  const isBooked = schedule.some(
    (item) =>
      item.lecturerId === lecturerId &&
      item.day === day &&
      ((item.startTime <= startTime && item.endTime > startTime) ||
        (item.startTime < endTime && item.endTime >= endTime))
  );
  return !isBooked; // Lecturer is available if they are not already booked
}

// Function to add a certain number of minutes to a time string
function addMinutesToTime(startTime: string, minutes: number): string {
  let [hours, mins] = startTime.split(':').map(Number);
  mins += minutes;
  hours += Math.floor(mins / 60);
  mins %= 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Helper function to check availability and schedule a lecture
function tryScheduleLecture(
  day: string,
  currentTime: string,
  lectureLengthMinutes: number,
  sectionLecturer: Lecturer | undefined,
  course: Course,
  section: Section,
  classrooms: any[],
  schedule: {
    classroomId: any;
    classroomName: any;
    courseId: any;
    courseName: any;
    sectionId: any;
    sectionName: any;
    lecturerId: any;
    lecturerName: string;
    day: any;
    startTime: any;
    endTime: string;
  }[]
) {
  const currentEndTime = addMinutesToTime(currentTime, lectureLengthMinutes);

  const availableClassroom = classrooms.find(
    (classroom) =>
      isClassroomAvailable(classroom, day, currentTime, currentEndTime, schedule) &&
      isLecturerAvailable(sectionLecturer.id, day, currentTime, currentEndTime, schedule)
  );

  if (availableClassroom) {
    schedule.push({
      classroomId: availableClassroom.id,
      classroomName: availableClassroom.name,
      courseId: course.id,
      courseName: course.name,
      sectionId: section.id,
      sectionName: section.name,
      lecturerId: sectionLecturer.id,
      lecturerName: `${sectionLecturer.firstName} ${sectionLecturer.lastName}`,
      day,
      startTime: currentTime,
      endTime: currentEndTime,
    });
    console.log(
      `Lecture scheduled for section ${`${course.abbreviation} - ${  section.name}`} in classroom ${availableClassroom.name} on ${day} from ${currentTime} to ${currentEndTime}`
    );
    return true; // Successfully scheduled
  } 
    console.log(
      `No available classroom found for section ${section.name} on ${day} from ${currentTime} to ${currentEndTime}`
    );
    return false; // Not scheduled
  
}

export async function generateSchedule(
  courses: Course[],
  sections: Section[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Promise<ScheduleItem[]> {
  console.log('Starting schedule generation');
  const sortedCourses = courses.sort(
    (a, b) => b.year_level - a.year_level || Number(b.requires_lab) - Number(a.requires_lab)
  );
  const schedule: ScheduleItem[] = [];

  sortedCourses.forEach((course) => {
    const courseSections = sections.filter((section) => section.course_id === course.id);

    courseSections.forEach((section) => {
      const lectureLengthMinutes = (course.boxes / course.lecture_amount) * 30;
      const sectionLecturer = lecturers.find((lecturer) => lecturer.id === section.lecturer_id);
      let lecturesScheduledForSection = 0; // Counter for the number of lectures scheduled for this section

      Object.entries(sectionLecturer.availability).forEach(([day, timeSlots]) => {
        if (lecturesScheduledForSection >= course.lecture_amount) {
          return; // Skip to next section if required lectures are scheduled
        }

        timeSlots.forEach((timeSlot) => {
          if (lecturesScheduledForSection >= course.lecture_amount) {
            return; // Skip to next time slot if required lectures are scheduled
          }

          let currentTime = timeSlot.start_time;
          const endTime = timeSlot.end_time;

          while (currentTime < endTime && lecturesScheduledForSection < course.lecture_amount) {
            const currentEndTime = addMinutesToTime(currentTime, lectureLengthMinutes);
            if (currentEndTime > endTime) break;

            if (
              tryScheduleLecture(
                day,
                currentTime,
                lectureLengthMinutes,
                sectionLecturer,
                course,
                section,
                classrooms,
                schedule
              )
            ) {
              lecturesScheduledForSection += 1; // Increment the counter upon successful scheduling
              break; // Break out of the while loop once a lecture is scheduled
            }

            currentTime = addMinutesToTime(currentTime, lectureLengthMinutes); // Increment currentTime for the next iteration
          }
        });
      });
    });
  });

  console.log('Schedule generation completed');
  return schedule;
}
