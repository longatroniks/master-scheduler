// ScheduleGenerator.jsx

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

const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const calculateDurationInSlots = (startTime: string, endTime: string) => {
  const startIndex = timeSlots.indexOf(startTime);
  const endIndex = timeSlots.indexOf(endTime);
  return endIndex - startIndex;
};

const ScheduleGenerator = () => {
  const [generatedSchedule, setGeneratedSchedule] = useState<{
    classrooms: { id: string; name: string }[];
    lectures: {
      id: string;
      classroom_id: string;
      day: string;
      start_time: string;
      end_time: string;
      section_id: string;
    }[];
  } | null>(null);

  const courseController = new CourseController();
  const lectureController = new LectureController();

  const generateSchedule = async () => {
    const dummyData = generateDummyData();
    setGeneratedSchedule(dummyData as any);
  };
  const generateDummyData = () => {
    // Dummy data for classrooms
    const classrooms = [
      { id: '1', name: 'Classroom A' },
      { id: '2', name: 'Classroom B' },
      // ... add more classrooms
    ];

    // Dummy data for lectures
    const lectures = [
      // Monday
      {
        id: '1',
        classroom_id: '1',
        day: 'Monday',
        start_time: '09:00',
        end_time: '11:00',
        section_id: '1',
      },
      {
        id: '2',
        classroom_id: '2',
        day: 'Monday',
        start_time: '13:00',
        end_time: '15:00',
        section_id: '2',
      },
      // Tuesday
      {
        id: '3',
        classroom_id: '1',
        day: 'Tuesday',
        start_time: '10:00',
        end_time: '12:00',
        section_id: '3',
      },
      {
        id: '4',
        classroom_id: '2',
        day: 'Tuesday',
        start_time: '14:00',
        end_time: '16:00',
        section_id: '4',
      },
      // Wednesday
      {
        id: '5',
        classroom_id: '1',
        day: 'Wednesday',
        start_time: '09:00',
        end_time: '11:00',
        section_id: '5',
      },
      {
        id: '6',
        classroom_id: '2',
        day: 'Wednesday',
        start_time: '13:00',
        end_time: '15:00',
        section_id: '6',
      },
      // Thursday
      {
        id: '7',
        classroom_id: '1',
        day: 'Thursday',
        start_time: '10:00',
        end_time: '12:00',
        section_id: '7',
      },
      {
        id: '8',
        classroom_id: '2',
        day: 'Thursday',
        start_time: '14:00',
        end_time: '16:00',
        section_id: '8',
      },
      // Friday
      {
        id: '9',
        classroom_id: '1',
        day: 'Friday',
        start_time: '09:00',
        end_time: '11:00',
        section_id: '9',
      },
      {
        id: '10',
        classroom_id: '2',
        day: 'Friday',
        start_time: '13:00',
        end_time: '15:00',
        section_id: '10',
      },
      // ... add more lectures
    ];

    return { classrooms, lectures };
  };

  const renderScheduleTable = (day: string) => (
    <div key={day}>
      <Typography variant="h6" style={{ margin: '10px' }}>
        {day} Schedule
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
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
            {generatedSchedule!.classrooms.map((classroom) => (
              <TableRow key={classroom.id}>
                <TableCell style={{ backgroundColor: '#f0f0f0' }}>{classroom.name}</TableCell>
                {timeSlots.map((_, index) => {
                  const lecture = generatedSchedule!.lectures.find(
                    (l) =>
                      l.classroom_id === classroom.id &&
                      l.day === day &&
                      timeSlots.indexOf(l.start_time) === index
                  );

                  if (lecture) {
                    const backgroundColor = 'lightblue';
                    const durationSlots = calculateDurationInSlots(
                      lecture.start_time,
                      lecture.end_time
                    );

                    return (
                      <TableCell
                        key={`${classroom.id}-${index}`}
                        colSpan={durationSlots}
                        style={{ backgroundColor }}
                      />
                    );
                  }

                  return <TableCell key={`${classroom.id}-${index}`} />;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <div>
      <Button variant="contained" onClick={generateSchedule}>
        Generate Schedule
      </Button>

      {generatedSchedule && (
        <div>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) =>
            renderScheduleTable(day)
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleGenerator;
