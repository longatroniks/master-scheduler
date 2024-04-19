import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { timeSlots } from 'src/assets/data';

import { Lecture } from '../models/Lecture';
import { Classroom } from '../models/Classroom';
import { LectureController } from '../controllers/LectureController';
import { ClassroomController } from '../controllers/ClassroomController';
import { SectionController } from '../controllers/SectionController';
import { CourseController } from '../controllers/CourseController';
import { Section } from '../models/Section';
import { Course } from '../models/Course';

// Assuming the structure for the item in the schedule map
interface ScheduleItem {
  lecture: Lecture;
  courseName: string;
  sectionName: string;
}

export const MasterSchedule = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionCourseMap, setSectionCourseMap] = useState<{ [key: string]: Course }>({});

  const calculateDurationInSlots = (startTime: string, endTime: string): number => {
    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    return endIndex - startIndex;
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLectures = await new LectureController().fetchLectures();
      const fetchedClassrooms = await new ClassroomController().fetchClassrooms();
      const fetchedSections = await new SectionController().fetchSections();
      const fetchedCourses = await new CourseController().fetchCourses();

      const sectionToCourse = fetchedSections.reduce<{ [key: string]: Course }>((acc, section) => {
        const course = fetchedCourses.find((c) => c.id === section.course_id);
        if (course) {
          acc[section.id as string] = course;
        }
        return acc;
      }, {});

      setLectures(fetchedLectures);
      setClassrooms(fetchedClassrooms);
      setSections(fetchedSections);
      setSectionCourseMap(sectionToCourse);
    };

    fetchData();
  }, []);

  const schedule: any = {};

  lectures.forEach((lecture) => {
    const durationSlots = calculateDurationInSlots(lecture.start_time, lecture.end_time);
    if (!schedule[lecture.day]) {
      schedule[lecture.day] = {};
    }
    if (!schedule[lecture.day][lecture.classroom_id]) {
      schedule[lecture.day][lecture.classroom_id] = timeSlots.map(() => null);
    }
    const startIndex = timeSlots.indexOf(lecture.start_time);
    const section = sections.find((s) => s.id === lecture.section_id);
    const course = section ? sectionCourseMap[section.id as string] : null;
    schedule[lecture.day][lecture.classroom_id].fill(
      {
        lecture,
        courseName: course ? course.name : '',
        sectionName: section ? section.name : '',
      },
      startIndex,
      startIndex + durationSlots
    );
  });

  const getBackgroundColor = (sectionId: string) => {
    const course = sectionCourseMap[sectionId];
    switch (course?.year_level) {
      case 1:
        return 'yellow';
      case 2:
        return 'green';
      case 3:
        return 'blue';
      case 4:
        return 'orange';
      default:
        return 'lightGray';
    }
  };

  return (
    <div>
      {Object.keys(schedule)
        .sort()
        .map((day) => (
          <TableContainer key={day} component={Paper} style={{ marginBottom: '20px' }}>
            <Typography variant="h6" style={{ margin: '10px' }}>
              {day}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Classroom / Time</TableCell>
                  {timeSlots.map((time) => (
                    <TableCell key={time}>{time}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {classrooms.map((classroom) => (
                  <TableRow key={classroom.id}>
                    <TableCell style={{ backgroundColor: '#f0f0f0' }}>{classroom.name}</TableCell>
                    {classroom.id && schedule[day][classroom.id]
                      ? schedule[day][classroom.id].map(
                          (item: ScheduleItem | null, index: number) => {
                            if (item && item.lecture) {
                              if (index === timeSlots.indexOf(item.lecture.start_time)) {
                                const backgroundColor = item.lecture.section_id
                                  ? getBackgroundColor(item.lecture.section_id)
                                  : 'lightGray';
                                return (
                                  <TableCell
                                    key={`${classroom.id}-${index}`}
                                    colSpan={calculateDurationInSlots(
                                      item.lecture.start_time,
                                      item.lecture.end_time
                                    )}
                                    style={{ backgroundColor }}
                                  >
                                    {`${item.courseName} - ${item.sectionName}`}{' '}
                                  </TableCell>
                                );
                              }
                              if (
                                classroom.id &&
                                schedule[day][classroom.id][index - 1] &&
                                schedule[day][classroom.id][index - 1]?.lecture === item.lecture
                              ) {
                                return null;
                              }
                            }
                            return <TableCell key={`${classroom.id}-${index}`} />;
                          }
                        )
                      : timeSlots.map((_, index) => <TableCell key={`${classroom.id}-${index}`} />)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
    </div>
  );
};
