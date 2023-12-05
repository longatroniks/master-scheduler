import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { LectureController } from "../controllers/LecturesController.ts";
import { Lecture } from "../models/Lecture.ts";

export const LectureSchedule = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const lectureController = new LectureController();

  useEffect(() => {
    const fetchLecturesData = async () => {
      try {
        const fetchedLectures = await lectureController.fetchLectures();
        setLectures(fetchedLectures || []);
      } catch (error) {
        console.error("Error fetching lectures: ", error);
        // Handle errors as needed
      }
    };

    fetchLecturesData();
  }, []);

  const timeSlots = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time / Day</TableCell>
            {days.map((day) => (
              <TableCell key={day}>{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((time) => (
            <TableRow key={time}>
              <TableCell>{time}</TableCell>
              {days.map((day) => (
                <TableCell key={day}>

                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
