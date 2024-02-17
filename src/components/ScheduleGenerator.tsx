// ScheduleGenerator.jsx
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

interface ScheduleData {
  classrooms: Classroom[];
  courses: Course[];
  lectures: Lecture[];
  lecturers: Lecturer[];
  sections: Section[];
}

const ScheduleGenerator: React.FC = () => {
  const [data, setData] = useState<ScheduleData>({
    classrooms: [],
    courses: [],
    lectures: [],
    lecturers: [],
    sections: [],
  });

  useEffect(() => {
    const fetchData = async () => {
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
    // Once all data is fetched, call the scheduling algorithm
    if (
      data.classrooms.length &&
      data.courses.length &&
      data.lecturers.length &&
      data.sections.length
    ) {
      generateSchedule(data.courses, data.sections, data.lecturers, data.classrooms)
        .then((schedule: any) => {
          console.log('Generated Schedule:', schedule); // Log the resulting schedule
        })
        .catch(console.error);
    }
  }, [data]); // This useEffect is dependent on the 'data' state

  // Placeholder for the schedule generation component's UI
  return <div>Schedule Generator Component</div>;
};

export default ScheduleGenerator;
