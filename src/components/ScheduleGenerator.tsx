import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { Lecture } from '../models/Lecture';
import { Classroom } from '../models/Classroom';
import { CourseController } from '../controllers/CourseController';
import { LectureController } from '../controllers/LectureController';
import { ClassroomController } from '../controllers/ClassroomController';
import { LecturerController } from '../controllers/LecturerController';
import { SectionController } from '../controllers/SectionController';

const timeSlots = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
];

const ScheduleGenerator = () => <></>;

export default ScheduleGenerator;
