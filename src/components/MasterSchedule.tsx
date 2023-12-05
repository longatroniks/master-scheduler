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

const timeSlots = [
  "8:00",
  "9:00",
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

// Utility function to calculate the index difference between start and end times
const calculateDurationInSlots = (startTime, endTime) => {
  const startIndex = timeSlots.indexOf(startTime);
  const endIndex = timeSlots.indexOf(endTime);
  return endIndex - startIndex;
};

export const MasterSchedule = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const lectureController = new LectureController();
  const classroomController = new ClassroomController();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedLectures = await lectureController.fetchLectures();
        const fetchedClassrooms = await classroomController.fetchClassrooms();
        setLectures(fetchedLectures);
        setClassrooms(fetchedClassrooms);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Process and organize the lectures into a schedule format
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
                              // Render the lecture cell with colSpan
                              return (
                                <TableCell
                                  key={`${classroom.id}-${index}`}
                                  colSpan={calculateDurationInSlots(
                                    lecture.start_time,
                                    lecture.end_time
                                  )}
                                  style={{ backgroundColor: "#e0e0e0" }} // Apply a background color to indicate the chamber is occupied
                                >
                                  {lecture.section_id}{" "}
                                  {/* Include any other lecture details you need here */}
                                </TableCell>
                              );
                            } else if (
                              schedule[day][classroom.id][index - 1] === lecture
                            ) {
                              // This time slot is part of a spanning lecture, so don't render a new cell
                              return null;
                            }
                          }
                          // This time slot is not part of a lecture
                          return (
                            <TableCell
                              key={`${classroom.id}-${index}`}
                            ></TableCell>
                          ); // Render empty cell without "No Lecture"
                        })
                      : timeSlots.map((_, index) => (
                          <TableCell
                            key={`${classroom.id}-${index}`}
                          ></TableCell>
                        )) // Render empty cells for no lectures
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}
    </div>
  );
};
