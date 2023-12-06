import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Lecture } from "../models/Lecture.ts";
import { Classroom } from "../models/Classroom.ts";
import { LectureController } from "../controllers/LectureController.ts";
import { ClassroomController } from "../controllers/ClassroomController.ts";
import { SectionController } from "../controllers/SectionController.ts";
import { CourseController } from "../controllers/CourseController.ts";
import { Section } from "../models/Section.ts";
import { Course } from "../models/Course.ts";

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const calculateDurationInSlots = (startTime, endTime) => {
  const startIndex = timeSlots.indexOf(startTime);
  const endIndex = timeSlots.indexOf(endTime);
  return endIndex - startIndex;
};

export const MasterSchedule = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sectionCourseMap, setSectionCourseMap] = useState<{
    [key: string]: Course;
  }>({});

  const sectionController = new SectionController();
  const courseController = new CourseController();
  const lectureController = new LectureController();
  const classroomController = new ClassroomController();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lectures = await lectureController.fetchLectures();
        const classrooms = await classroomController.fetchClassrooms();
        const sections = await sectionController.fetchSections();
        const courses = await courseController.fetchCourses();

        const sectionToCourse = sections.reduce((acc, section) => {
          const course = courses.find((c) => c.id === section.course_id);
          if (course) {
            acc[section.id as string] = course;
          }
          return acc;
        }, {});

        setLectures(lectures);
        setClassrooms(classrooms);
        setSections(sections);
        setCourses(courses);
        setSectionCourseMap(sectionToCourse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const schedule = {};
  lectures.forEach((lecture) => {
    const durationSlots = calculateDurationInSlots(
      lecture.start_time,
      lecture.end_time
    );
    if (!schedule[lecture.day]) {
      schedule[lecture.day] = {};
    }
    if (!schedule[lecture.day][lecture.classroom_id]) {
      schedule[lecture.day][lecture.classroom_id] = timeSlots.map(() => null);
    }
    const startIndex = timeSlots.indexOf(lecture.start_time);
    schedule[lecture.day][lecture.classroom_id].fill(
      lecture,
      startIndex,
      startIndex + durationSlots
    );
  });

  const getBackgroundColor = (sectionId: string) => {
    const course = sectionCourseMap[sectionId];
    console.log(course.year_level);
    switch (course?.year_level) {
      case 1:
        return "yellow";
      case 2:
        return "green";
      case 3:
        return "blue";
      case 4:
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <div>
      {Object.keys(schedule)
        .sort()
        .map((day) => (
          <TableContainer
            key={day}
            component={Paper}
            style={{ marginBottom: "20px" }}
          >
            <Typography variant="h6" style={{ margin: "10px" }}>
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
                    <TableCell style={{ backgroundColor: "#f0f0f0" }}>
                      {classroom.name}
                    </TableCell>
                    {schedule[day] && schedule[day][classroom.id]
                      ? schedule[day][classroom.id].map((lecture, index) => {
                          if (lecture) {
                            if (
                              index === timeSlots.indexOf(lecture.start_time)
                            ) {
                              const backgroundColor =
                                lecture.section_id &&
                                sectionCourseMap[lecture.section_id]
                                  ? getBackgroundColor(lecture.section_id)
                                  : "gray";
                              return (
                                <TableCell
                                  key={`${classroom.id}-${index}`}
                                  colSpan={calculateDurationInSlots(
                                    lecture.start_time,
                                    lecture.end_time
                                  )}
                                  style={{ backgroundColor }}
                                ></TableCell>
                              );
                            } else if (
                              schedule[day][classroom.id][index - 1] === lecture
                            ) {
                              return null;
                            }
                          }
                          return (
                            <TableCell
                              key={`${classroom.id}-${index}`}
                            ></TableCell>
                          );
                        })
                      : timeSlots.map((_, index) => (
                          <TableCell
                            key={`${classroom.id}-${index}`}
                          ></TableCell>
                        ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
    </div>
  );
};
