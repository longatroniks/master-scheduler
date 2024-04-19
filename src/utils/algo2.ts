import { Classroom } from 'src/models/Classroom';
import { Course } from 'src/models/Course';
import { Lecturer } from 'src/models/Lecturer';
import { Section } from 'src/models/Section';

// Define the structure for each scheduled item
interface ScheduleItem {
  classroomId: string;
  classroomName: string;
  courseId: string;
  courseName: string;
  sectionId: string;
  sectionName: string;
  lecturerId: string;
  lecturerName: string;
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

function isSectionAvailable(
  sectionId: string,
  day: string,
  startTime: string,
  endTime: string,
  schedule: ScheduleItem[]
): boolean {
  return !schedule.some(
    (item) =>
      item.sectionId === sectionId &&
      item.day === day &&
      ((item.startTime <= startTime && item.endTime > startTime) ||
        (item.startTime < endTime && item.endTime >= endTime))
  );
}

// Function to add a certain number of minutes to a time string
function addMinutesToTime(startTime: string, minutes: number): string {
  let [hours, mins] = startTime.split(':').map(Number);
  mins += minutes;
  hours += Math.floor(mins / 60);
  mins %= 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Function to generate the schedule
export async function generateSchedule(
  courses: Course[],
  sections: Section[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Promise<ScheduleItem[]> {
  console.log('Starting schedule generation');

  // Step 0: Sort the classes by credits, lab requirement, year level
  const sortedCourses = courses.sort(
    (a, b) =>
      b.credits - a.credits ||
      Number(b.requires_lab) - Number(a.requires_lab) ||
      b.year_level - a.year_level
  );

  const schedule: ScheduleItem[] = [];

  sortedCourses.forEach((course) => {
    const courseSections = sections.filter((section) => section.course_id === course.id);

    courseSections.forEach((section) => {
      const lectureLengthMinutes = (course.boxes / course.lecture_amount) * 30;
      const sectionLecturer = lecturers.find((lecturer) => lecturer.id === section.lecturer_id);
      if (!sectionLecturer) {
        console.error('Lecturer not found for section, cannot schedule lecture.');
        return; // Skip further processing for this section
      }

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

            // Step 1: Try to insert a class in the first available time at the first available day
            // Step 2: If the professor is not free at that time, find the first available time on the first available day that the professor is available
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

// Function to try scheduling a lecture
function tryScheduleLecture(
  day: string,
  currentTime: string,
  lectureLengthMinutes: number,
  sectionLecturer: Lecturer,
  course: Course,
  section: Section,
  classrooms: Classroom[],
  schedule: ScheduleItem[]
): boolean {
  const currentEndTime = addMinutesToTime(currentTime, lectureLengthMinutes);

  // Function to handle the actual scheduling logic, avoiding repetition
  const scheduleInClassroom = (classroom: Classroom) => {
    schedule.push({
      classroomId: classroom.id ?? 'unknown',
      classroomName: classroom.name,
      courseId: course.id ?? 'unknown',
      courseName: course.name,
      sectionId: section.id ?? 'unknown',
      sectionName: section.name,
      lecturerId: sectionLecturer.id ?? 'unknown',
      lecturerName: `${sectionLecturer.firstName} ${sectionLecturer.lastName}`,
      day,
      startTime: currentTime,
      endTime: currentEndTime,
    });
    console.log(
      `Lecture scheduled for section ${course.abbreviation} - ${section.name} in location ${section.location} in classroom ${classroom.name} on ${day} from ${currentTime} to ${currentEndTime}`
    );
  };

  if (!sectionLecturer.id) {
    console.log('Lecturer id not defined');
    return false;
  }

  // Filter classrooms based on the course's lab requirement
  const suitableClassrooms = classrooms.filter(
    (classroom) =>
      (course.requires_lab ? classroom.lab : true) &&
      section.location.every((location) => classroom.location.includes(location))
  );

  let preferredClassroom: Classroom | undefined;
  // Check for back-to-back scheduling preference
  schedule.forEach((item) => {
    if (item.courseId === course.id && item.lecturerId === sectionLecturer.id && item.day === day) {
      const itemEndTime = item.endTime;
      if (addMinutesToTime(itemEndTime, 0) === currentTime) {
        // Ensure the preferred classroom also meets the lab requirement
        preferredClassroom = suitableClassrooms.find(
          (classroom) => classroom.id === item.classroomId
        );
      }
    }
  });

  if (section.joined) {
    const classroomsInZagreb = classrooms.filter((classroom) =>
      classroom.location.includes('Zagreb')
    );
    const classroomsInDubrovnik = classrooms.filter((classroom) =>
      classroom.location.includes('Dubrovnik')
    );

    const availableZagrebClassroom = classroomsInZagreb.find((classroom) =>
      isClassroomAvailable(classroom, day, currentTime, currentEndTime, schedule)
    );
    const availableDubrovnikClassroom = classroomsInDubrovnik.find((classroom) =>
      isClassroomAvailable(classroom, day, currentTime, currentEndTime, schedule)
    );

    if (availableZagrebClassroom && availableDubrovnikClassroom) {
      // Schedule in both locations
      scheduleInClassroom(availableZagrebClassroom);
      scheduleInClassroom(availableDubrovnikClassroom);
      return true; // Return true when both locations are successfully scheduled
    }
    return false; // Return false if unable to schedule in both locations
  }

  // Attempt to schedule in the preferred classroom first, if it exists and is available
  if (
    preferredClassroom &&
    isClassroomAvailable(preferredClassroom, day, currentTime, currentEndTime, schedule) &&
    isLecturerAvailable(sectionLecturer.id, day, currentTime, currentEndTime, schedule) &&
    isSectionAvailable(section.id ?? '', day, currentTime, currentEndTime, schedule)
  ) {
    scheduleInClassroom(preferredClassroom);
    return true;
  }

  // If no preferred classroom or it's unavailable, find any suitable available classroom
  const availableClassroom = suitableClassrooms.find(
    (classroom) =>
      sectionLecturer.id &&
      isClassroomAvailable(classroom, day, currentTime, currentEndTime, schedule) &&
      isLecturerAvailable(sectionLecturer.id, day, currentTime, currentEndTime, schedule) &&
      isSectionAvailable(section.id ?? '', day, currentTime, currentEndTime, schedule)
  );

  if (availableClassroom) {
    scheduleInClassroom(availableClassroom);
    return true;
  }

  return false; // If no classroom is available or other scheduling constraints prevent it
}
