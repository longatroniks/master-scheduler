import React, { useState } from 'react';
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
import { timeSlots } from 'src/assets/data/timeslots';
import { daysOfWeek } from 'src/assets/data/daysOfWeek';

interface ScheduleItem {
  durationSlots?: number;
  sectionId: string;
  courseName: string;
  sectionName: string;
  classroomName?: string;
}

interface ScheduleDay {
  [classroomId: string]: (ScheduleItem | null)[];
}

interface Schedule {
  [day: string]: ScheduleDay;
}

interface ScheduleTableProps {
  schedule: Schedule;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
  const [courseColorMap] = useState<{ [key: string]: string }>({});

  // Define a list of nice colors
  const niceColors = [
    '#FFB6C1', // LightPink
    '#FFD700', // Gold
    '#FFA07A', // LightSalmon
    '#20B2AA', // LightSeaGreen
    '#87CEFA', // LightSkyBlue
    '#9370DB', // MediumPurple
    '#FF6347', // Tomato
    '#40E0D0', // Turquoise
    '#EE82EE', // Violet
    '#F08080', // LightCoral
    '#DAA520', // GoldenRod
    '#C71585', // MediumVioletRed
    '#FF4500', // OrangeRed
    '#DA70D6', // Orchid
    '#98FB98', // PaleGreen
  ];

  // Function to get or assign a color to a course based on its ID
  const getBackgroundColor = (courseId: string): string => {
    if (!courseColorMap[courseId]) {
      // Use a simple hash function to convert the courseId into an index for the niceColors array
      const colorIndex =
        Array.from(courseId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % niceColors.length;
      courseColorMap[courseId] = niceColors[colorIndex];
    }
    return courseColorMap[courseId];
  };

  return (
    <div>
      {daysOfWeek.map((day) => {
        if (Object.prototype.hasOwnProperty.call(schedule, day)) {
          return (
            <TableContainer key={day} component={Paper} style={{ marginBottom: '20px' }}>
              <Typography variant="h6" style={{ margin: '10px' }}>
                {day}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      Classroom / Time
                    </TableCell>
                    {timeSlots.map((time) => (
                      <TableCell key={time} sx={{ paddingLeft: 0}}>
                        {time}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(schedule[day]).map((classroomId) => (
                    <TableRow key={classroomId}>
                      <TableCell style={{ backgroundColor: '#f0f0f0' }}>
                        {schedule[day][classroomId][0]?.classroomName || 'Unknown Classroom'}
                      </TableCell>
                      {schedule[day][classroomId].map((item, index) => (
                        <TableCell
                          key={index}
                          colSpan={item ? item.durationSlots || 1 : 1}
                          style={{
                            backgroundColor: item ? getBackgroundColor(item.sectionId) : undefined,
                            border: '1px solid',
                            borderColor: '#d3d3d3'
                          }}
                        >
                          {item ? `${item.courseName} - ${item.sectionName}` : ''}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ScheduleTable;
