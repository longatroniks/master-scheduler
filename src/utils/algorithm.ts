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

// Function to add a certain number of minutes to a time string
function addMinutesToTime(startTime: string, minutes: number): string {
  let [hours, mins] = startTime.split(':').map(Number);
  mins += minutes;
  hours += Math.floor(mins / 60);
  mins %= 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Main function to generate the schedule
export async function generateSchedule(
  courses: Course[],
  sections: Section[],
  lecturers: Lecturer[],
  classrooms: Classroom[]
): Promise<ScheduleItem[]> {
  console.log('Starting schedule generation');
  // Sort courses by year level and lab requirements
  const sortedCourses = courses.sort(
    (a, b) => b.year_level - a.year_level || Number(b.requires_lab) - Number(a.requires_lab)
  );
  const schedule: ScheduleItem[] = []; // Initialize the schedule array

  // Iterate over each course
  sortedCourses.forEach((course) => {
    console.log(
      `Scheduling course: ${course.name}, Year Level: ${course.year_level}, Requires Lab: ${course.requires_lab}`
    );
    // Filter sections that belong to the current course
    const courseSections = sections.filter((section) => section.course_id === course.id);

    // Check if there are no sections for the course
    if (courseSections.length === 0) {
      console.log(
        `No sections found for course: ${course.name}. Please add sections for this course.`
      );
    }

    // Iterate over each section of the current course
    courseSections.forEach((section) => {
      console.log(`Scheduling section: ${section.name} for course: ${course.name}`);
      // Calculate the length of each lecture
      const lectureLengthMinutes = (course.boxes / course.lecture_amount) * 30;
      // Find the lecturer assigned to the current section
      const sectionLecturer = lecturers.find((lecturer) => lecturer.id === section.lecturer_id);

      if (!sectionLecturer) {
        console.log(
          `No lecturer assigned to section: ${section.name}. Please assign a lecturer to this section.`
        );
        return; // Skip this section if no lecturer is assigned
      }

      let lectureScheduled = false; // Flag to indicate if a lecture has been scheduled
      // Iterate over the number of lectures needed for the course
      Array.from({ length: course.lecture_amount }).forEach((_, i) => {
        if (lectureScheduled) return; // Skip if a lecture has already been scheduled

        // Iterate over the lecturer's availability
        Object.entries(sectionLecturer.availability).forEach(([day, timeSlots]) => {
          if (lectureScheduled) return; // Skip if a lecture has already been scheduled

          // Iterate over each time slot in the lecturer's availability
          timeSlots.forEach((timeSlot) => {
            if (lectureScheduled) return; // Skip if a lecture has already been scheduled

            // Filter classrooms based on the lab requirement of the course
            const suitableClassrooms = classrooms.filter(
              (classroom) => !course.requires_lab || classroom.lab
            );

            if (suitableClassrooms.length === 0) {
              console.log(
                `No suitable classrooms found for course: ${course.name} on ${day}. Please ensure classrooms meet the course requirements.`
              );
            }

            // Iterate over each suitable classroom
            suitableClassrooms.some((classroom) => {
              // Check if the classroom is available
              if (
                isClassroomAvailable(
                  classroom,
                  day,
                  timeSlot.start_time,
                  addMinutesToTime(timeSlot.start_time, lectureLengthMinutes),
                  schedule
                )
              ) {
                // Schedule the lecture and add it to the schedule array
                schedule.push({
                  classroomId: classroom.id ?? 'unknown',
                  classroomName: classroom.name, // Add classroom name
                  courseId: course.id ?? 'unknown',
                  courseName: course.name, // Add course name
                  sectionId: section.id ?? 'unknown',
                  sectionName: section.name, // Add section name
                  lecturerId: sectionLecturer.id ?? 'unknown',
                  lecturerName: `${sectionLecturer.firstName} ${sectionLecturer.lastName}`, // Add lecturer name
                  day,
                  startTime: timeSlot.start_time,
                  endTime: addMinutesToTime(timeSlot.start_time, lectureLengthMinutes),
                });
                console.log(
                  `Lecture scheduled for section ${section.name} in classroom ${classroom.name} (${
                    classroom.id
                  }) on ${day} from ${timeSlot.start_time} to ${addMinutesToTime(
                    timeSlot.start_time,
                    lectureLengthMinutes
                  )}`
                );
                lectureScheduled = true; // Mark as scheduled
                return true; // Break the iteration
              }
              return false; // Continue iterating if the classroom is not available
            });
          });
        });
      });

      if (!lectureScheduled) {
        console.log(
          `Unable to schedule any lectures for section: ${section.name} of course: ${course.name}. Please check lecturer and classroom availability.`
        );
      }
    });
  });

  console.log('Schedule generation completed');
  return schedule; // Return the complete schedule
}
