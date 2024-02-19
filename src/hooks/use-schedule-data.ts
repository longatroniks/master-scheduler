import { useEffect, useState } from 'react';
import { ClassroomController } from 'src/controllers/ClassroomController';
import { CourseController } from 'src/controllers/CourseController';
import { LectureController } from 'src/controllers/LectureController';
import { LecturerController } from 'src/controllers/LecturerController';
import { SectionController } from 'src/controllers/SectionController';
import { ScheduleData } from 'src/types/types';

export const useScheduleData = () => {
  const [data, setData] = useState<ScheduleData>({
    classrooms: [],
    courses: [],
    lectures: [],
    lecturers: [],
    sections: [],
  });

  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = async () => {
    const classroomController = new ClassroomController();
    const courseController = new CourseController();
    const lectureController = new LectureController();
    const lecturerController = new LecturerController();
    const sectionController = new SectionController();

    try {
      setDataLoading(true);
      const classrooms = await classroomController.fetchClassrooms();
      const courses = await courseController.fetchCourses();
      const lectures = await lectureController.fetchLectures();
      const lecturers = await lecturerController.fetchLecturers();
      const sections = await sectionController.fetchSections();

      setData({ classrooms, courses, lectures, lecturers, sections });
      console.log('Fetched Classrooms:', classrooms);
      console.log('Fetched Courses:', courses);
      console.log('Fetched Lectures:', lectures);
      console.log('Fetched Lecturers:', lecturers);
      console.log('Fetched Sections:', sections);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDataLoading(false); // Set data loading to false once all data has been fetched
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, dataLoading, setData };
};
