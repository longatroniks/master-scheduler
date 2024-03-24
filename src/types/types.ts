import { Classroom } from 'src/models/Classroom';
import { Course } from 'src/models/Course';
import { Lecture } from 'src/models/Lecture';
import { Lecturer } from 'src/models/Lecturer';
import { Section } from 'src/models/Section';

// types.ts
export interface ScheduleData {
  classrooms: Classroom[];
  courses: Course[];
  lectures: Lecture[];
  lecturers: Lecturer[];
  sections: Section[];
}

export interface ScheduleItem {
  id?: string;
  durationSlots?: number;
  classroomId: string;
  classroomName: string;
  courseId: string;
  courseName: string;
  sectionId: string;
  sectionName: string;
  lecturerId: string;
  lecturerName: string;
  day: string;
  startTime: any;
  endTime: any;
}

export interface TransformedScheduleItem extends Omit<ScheduleItem, 'startTime' | 'endTime'> {
  durationSlots: number;
}
export interface TransformedScheduleDay {
  [classroomId: string]: TransformedScheduleDaySlot[];
}

export interface TransformedSchedule {
  [day: string]: TransformedScheduleDay;
}

export interface TransformedScheduleItem {
  durationSlots: number;
  sectionId: string;
  courseName: string;
  sectionName: string;
  classroomName: string;
  // startTime can be included if you plan to use it for display or sorting
  startTime?: string; // You can adjust the type based on your actual data format, e.g., Date or string
}
export type TransformedScheduleDaySlot = TransformedScheduleItem | 'spanned' | null;
