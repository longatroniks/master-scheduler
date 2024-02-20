import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { timeSlots, daysOfWeek } from 'src/assets/data';
import { SCHEDULE_COLORS_LIGHT, SCHEDULE_COLORS_DARK } from 'src/theme/palette';

interface TransScheduleItem {
  durationSlots?: number;
  sectionId: string;
  courseName: string;
  sectionName: string;
  classroomName?: string;
}

type ScheduleSlot = TransScheduleItem | 'spanned' | null;

interface ScheduleDay {
  [classroomId: string]: ScheduleSlot[];
}

interface Schedule {
  [day: string]: ScheduleDay;
}

interface ScheduleTableProps {
  schedule: Schedule;
}

// Type guard to check if the slot is a TransScheduleItem
function isTransScheduleItem(slot: ScheduleSlot): slot is TransScheduleItem {
  return slot !== null && slot !== 'spanned';
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
  const [courseColorMap, setCourseColorMap] = useState<{ [key: string]: string }>({});
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    const scheduleColors = isDarkMode ? SCHEDULE_COLORS_DARK : SCHEDULE_COLORS_LIGHT;
    const updatedMap: { [courseName: string]: string } = {}; // Explicitly type the temporary map
    let colorIndex = 0;

    Object.values(schedule).forEach((day) => {
      Object.values(day).forEach((slots) => {
        slots.forEach((slot) => {
          if (slot !== null && slot !== 'spanned' && !updatedMap[slot.courseName]) {
            updatedMap[slot.courseName] = scheduleColors[colorIndex % scheduleColors.length];
            colorIndex += 1;
          }
        });
      });
    });

    setCourseColorMap(updatedMap);
  }, [schedule, isDarkMode]);

  const getBackgroundColor = (courseName: string): string => {
    const color = courseColorMap[courseName] || '#FFFFFF';
    return color;
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
                    <TableCell align="left">Classroom / Time</TableCell>
                    {timeSlots.map((time) => (
                      <TableCell key={time} sx={{ paddingLeft: 0 }}>
                        {time}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(schedule[day]).map((classroomId) => (
                    <TableRow key={classroomId}>
                      <TableCell>
                        {schedule[day][classroomId].find(isTransScheduleItem)?.classroomName ||
                          'Unknown Classroom'}
                      </TableCell>
                      {schedule[day][classroomId].map((item, index) => {
                        if (item === 'spanned') {
                          return null; // Skip rendering for 'spanned' slots
                        }

                        if (item === null) {
                          // Render an empty cell for null slots to represent gaps
                          return <TableCell key={index} />;
                        }

                        // Render a cell for TransScheduleItem
                        return (
                          <TableCell
                            key={index}
                            colSpan={item.durationSlots || 1}
                            style={{
                              backgroundColor: getBackgroundColor(item.courseName),
                              border: '1px solid',
                              borderColor: '#d3d3d3',
                            }}
                          >
                            {`${item.courseName} - ${item.sectionName}`}
                          </TableCell>
                        );
                      })}
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
