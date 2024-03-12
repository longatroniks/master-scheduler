import { daysOfWeek } from 'src/assets/data';
import { Classroom } from 'src/models/Classroom';
import { Course } from 'src/models/Course';
import { Lecturer } from 'src/models/Lecturer';
import { Section } from 'src/models/Section';
import { ScheduleItem } from 'src/types/types';

export function findAlternativeTimeslots(
  lecture: ScheduleItem,
  courses: Course[],
  sections: Section[],
  lecturers: Lecturer[],
  classrooms: Classroom[],
  currentSchedule: ScheduleItem[]
): ScheduleItem[] {
  const alternatives: ScheduleItem[] = [];

  const startTime = '08:00';
  const endTime = '21:00';
  const timeIncrement = 30; // Increment in minutes
  const lectureDuration = lecture.durationSlots ? lecture.durationSlots * 30 : 0;

  const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const resultHours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, '0');
    const resultMinutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${resultHours}:${resultMinutes}`;
  };

  daysOfWeek.forEach((day) => {
    let currentTime = startTime;
    while (currentTime < endTime) {
      const currentEndTime = addMinutesToTime(currentTime, lectureDuration);

      if (currentEndTime <= endTime) {
        // Exclude the current lecture's time slot from alternatives
        if (day !== lecture.day || currentTime !== lecture.startTime) {
          const lecturer = lecturers.find((l) => l.id === lecture.lecturerId);
          if (
            isLecturerAvailable(lecturer, day, currentTime, currentEndTime) &&
            isClassroomAvailable(
              lecture.classroomId,
              day,
              currentTime,
              currentEndTime,
              currentSchedule
            )
          ) {
            alternatives.push({ ...lecture, day, startTime: currentTime, endTime: currentEndTime });
          }
        }
      }

      currentTime = addMinutesToTime(currentTime, timeIncrement);
    }
  });
  console.log('Calculated alternative timeslots:', alternatives);
  // Deduplicate entries
  return alternatives.filter(
    (alt, index, self) =>
      index === self.findIndex((t) => t.day === alt.day && t.startTime === alt.startTime)
  );
}

function isClassroomAvailable(
  classroomId: string,
  day: string,
  startTime: string,
  endTime: string,
  schedule: ScheduleItem[]
): boolean {
  // Log the items being checked for the specified classroom and day

  return !schedule.some((item) => {
    const overlaps =
      item.classroomId === classroomId &&
      item.day === day &&
      item.startTime < endTime &&
      item.endTime > startTime;

    return overlaps;
  });
}

function isLecturerAvailable(
  lecturer: Lecturer | undefined,
  day: string,
  startTime: string,
  endTime: string
): boolean {
  if (!lecturer || !lecturer.availability || !lecturer.availability[day]) {
    return false;
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes; // Convert time to minutes for easier comparison
  };

  const startMinutes = formatTime(startTime);
  const endMinutes = formatTime(endTime);

  return lecturer.availability[day].some(({ start_time, end_time }) => {
    const startAvailableMinutes = formatTime(start_time);
    const endAvailableMinutes = formatTime(end_time);
    return startAvailableMinutes <= startMinutes && endAvailableMinutes >= endMinutes;
  });
}
