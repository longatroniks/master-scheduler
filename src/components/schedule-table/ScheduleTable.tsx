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
} from '@mui/material';
import { timeSlots, daysOfWeek } from 'src/assets/data';
import { SCHEDULE_COLORS_LIGHT, SCHEDULE_COLORS_DARK } from 'src/theme/palette';

export interface TransScheduleItem {
  durationSlots?: number;
  sectionId: string;
  courseName: string;
  sectionName: string;
  classroomName?: string;
}

interface AvailableSlots {
  [day: string]: {
    [time: string]: {
      [classroomId: string]: boolean;
    };
  };
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
  isEditMode?: boolean;
  onLectureSelect?: (lecture: TransScheduleItem) => void;
  availableSlots?: AvailableSlots; // Updated type
}

// Type guard to check if the slot is a TransScheduleItem
function isTransScheduleItem(slot: ScheduleSlot): slot is TransScheduleItem {
  return slot !== null && slot !== 'spanned';
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedule,
  isEditMode,
  onLectureSelect,
  availableSlots,
}) => {
  const [courseColorMap, setCourseColorMap] = useState<{ [key: string]: string }>({});
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    const scheduleColors = isDarkMode ? SCHEDULE_COLORS_DARK : SCHEDULE_COLORS_LIGHT;
    const updatedMap: { [courseName: string]: string } = {};
    console.log('Available slots:', availableSlots);
    console.log('table scheduel', schedule);

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
  }, [schedule, isDarkMode, availableSlots]);

  const getBackgroundColor = (courseName: string): string => {
    const color = courseColorMap[courseName] || '#FFFFFF';
    return color;
  };

  const getCellStyles = (
    day: string,
    time: string,
    classroomId: string,
    courseName: string
  ): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      cursor: isEditMode ? 'pointer' : 'default',
      border: '1px solid',
      borderColor: '#d3d3d3',
    };

    // Adjust the condition to also check for the specific classroom ID
    if (
      availableSlots &&
      availableSlots[day] &&
      availableSlots[day][time] &&
      availableSlots[day][time][classroomId]
    ) {
      // If the slot is marked as available, apply primary color with 0.5 opacity
      return {
        ...baseStyle,
        backgroundColor: `${theme.palette.primary.main}50`, // Adjust opacity as needed
      };
    } else {
      // Otherwise, use the course's assigned color
      return {
        ...baseStyle,
        backgroundColor: getBackgroundColor(courseName),
      };
    }
  };

  const handleLectureClick = (lecture: TransScheduleItem) => {
    if (isEditMode && onLectureSelect) {
      onLectureSelect(lecture);
      console.log('selceeted lecture', lecture);
    }
  };

  return (
    <div>
      {daysOfWeek.map((day, dayIndex) => {
        if (schedule[day]) {
          return (
            <TableContainer key={day} component={Paper} style={{ marginBottom: '20px' }}>
              <Typography variant="h6" style={{ margin: '10px' }}>
                {day}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Classroom / Time</TableCell>
                    {timeSlots.map((time, timeIndex) => (
                      <TableCell key={`${day}-${timeIndex}`} align="center">
                        {time}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(schedule[day]).map(([classroomId, slots], rowIndex) => (
                    <TableRow key={`${day}-${classroomId}-${rowIndex}`}>
                      <TableCell>{classroomId}</TableCell>

                      {slots.map((slot, slotIndex) => {
                        const time = timeSlots[slotIndex];
                        if (slot === null) {
                          return (
                            <TableCell
                              key={`${day}-${time}-${slotIndex}`}
                              style={getCellStyles(day, time, classroomId, '')}
                            />
                          );
                        }
                        if (slot === 'spanned') {
                          return null;
                        }

                        // Calculate colSpan based on durationSlots
                        const colSpan = slot.durationSlots || 1;

                        return (
                          <TableCell
                            key={`${day}-${time}-${slotIndex}`}
                            colSpan={colSpan}
                            onClick={() => handleLectureClick(slot)}
                            style={getCellStyles(day, time, classroomId, slot.courseName)}
                          >
                            {`${slot.courseName} - ${slot.sectionName}`}
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
