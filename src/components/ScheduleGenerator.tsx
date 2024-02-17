import React, { useEffect, useState } from 'react';
import { ClassroomController } from 'src/controllers/ClassroomController';
import { CourseController } from 'src/controllers/CourseController';
import { LectureController } from 'src/controllers/LectureController';
import { LecturerController } from 'src/controllers/LecturerController';
import { SectionController } from 'src/controllers/SectionController';
import { generateSchedule } from 'src/utils/algorithm';
import { Classroom } from 'src/models/Classroom';
import { Course } from 'src/models/Course';
import { Lecture } from 'src/models/Lecture';
import { Lecturer } from 'src/models/Lecturer';
import { Section } from 'src/models/Section';
import { timeSlots } from 'src/assets/data/timeslots'; // Ensure this is correctly imported
import ScheduleTable from './schedule-table/ScheduleTable'; // Adjust the import path as necessary
import ProgressBar from './progress-bar/progress-bar';

interface ScheduleData {
  classrooms: Classroom[];
  courses: Course[];
  lectures: Lecture[];
  lecturers: Lecturer[];
  sections: Section[];
}

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

interface TransformedScheduleItem extends Omit<ScheduleItem, 'startTime' | 'endTime'> {
  durationSlots: number;
}

interface TransformedScheduleDay {
  [classroomId: string]: (TransformedScheduleItem | null)[];
}

interface TransformedSchedule {
  [day: string]: TransformedScheduleDay;
}

const ScheduleGenerator: React.FC = () => {
  const [data, setData] = useState<ScheduleData>({
    classrooms: [],
    courses: [],
    lectures: [],
    lecturers: [],
    sections: [],
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [transformedSchedule, setTransformedSchedule] = useState<TransformedSchedule>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const classroomController = new ClassroomController();
      const courseController = new CourseController();
      const lectureController = new LectureController();
      const lecturerController = new LecturerController();
      const sectionController = new SectionController();

      try {
        const classrooms = await classroomController.fetchClassrooms();
        const courses = await courseController.fetchCourses();
        const lectures = await lectureController.fetchLectures();
        const lecturers = await lecturerController.fetchLecturers();
        const sections = await sectionController.fetchSections();

        setData({ classrooms, courses, lectures, lecturers, sections });
      } catch (error) {
        console.error('Error fetching data for schedule generation:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      data.classrooms.length &&
      data.courses.length &&
      data.lecturers.length &&
      data.sections.length
    ) {
      setLoading(true);
      generateSchedule(data.courses, data.sections, data.lecturers, data.classrooms)
        .then((generatedSchedule: ScheduleItem[]) => {
          console.log('Generated Schedule:', generatedSchedule); // Log the resulting schedule
          setSchedule(generatedSchedule); // Set the schedule state
          setLoading(false);
        })
        .catch(console.error);
      setLoading(false);
    }
  }, [data]); // This useEffect is dependent on the 'data' state

  useEffect(() => {
    const transformSchedule = (generatedSchedule: ScheduleItem[]): TransformedSchedule => {
      const transformed: TransformedSchedule = {};

      generatedSchedule.forEach((item) => {
        if (!transformed[item.day]) {
          transformed[item.day] = {};
        }

        if (!transformed[item.day][item.classroomId]) {
          transformed[item.day][item.classroomId] = Array(timeSlots.length).fill(null);
        }

        const startIndex = timeSlots.indexOf(item.startTime);
        const endIndex = timeSlots.indexOf(item.endTime);
        const durationSlots = endIndex - startIndex;

        // Ensure that the item is placed only once for its duration
        if (transformed[item.day][item.classroomId][startIndex] === null) {
          transformed[item.day][item.classroomId][startIndex] = {
            ...item,
            durationSlots,
          };
        }
      });

      return transformed;
    };

    if (schedule.length > 0) {
      const newTransformedSchedule = transformSchedule(schedule);
      setTransformedSchedule(newTransformedSchedule);
    }
  }, [schedule]); // Transform the schedule whenever it changes

  return (
    <div>
      <h2>Schedule</h2>
      {loading && <ProgressBar />}
      {!loading && <ScheduleTable schedule={transformedSchedule} />}
    </div>
  );
};

export default ScheduleGenerator;
