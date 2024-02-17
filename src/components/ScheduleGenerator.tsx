// ScheduleGenerator.jsx
import React, { useEffect, useState } from 'react';
import { ClassroomController } from 'src/controllers/ClassroomController';
import { CourseController } from 'src/controllers/CourseController';
import { LectureController } from 'src/controllers/LectureController';
import { LecturerController } from 'src/controllers/LecturerController';
import { SectionController } from 'src/controllers/SectionController';
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
        console.log('Classrooms:', classrooms); // Log classrooms data
        const courses = await courseController.fetchCourses();
        console.log('Courses:', courses); // Log courses data
        const lectures = await lectureController.fetchLectures();
        console.log('Lectures:', lectures); // Log lectures data
        const lecturers = await lecturerController.fetchLecturers();
        console.log('Lecturers:', lecturers); // Log lecturers data
        const sections = await sectionController.fetchSections();
        console.log('Sections:', sections); // Log sections data

        setData({ classrooms, courses, lectures, lecturers, sections });
      } catch (error) {
        console.error('Error fetching data for schedule generation:', error);
      }
    };

    fetchData();
  }, []);

  // Placeholder for the schedule generation component's UI
  return <div>Schedule Generator Component</div>;
};

export default ScheduleGenerator;
