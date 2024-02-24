import { useState, useEffect } from 'react';
import { ScheduleItem, TransformedSchedule, TransformedScheduleDay } from 'src/types/types';
import { timeSlots } from 'src/assets/data';

export const useTransformedSchedule = (schedule: ScheduleItem[]) => {
  const [transformedSchedule, setTransformedSchedule] = useState<TransformedSchedule>({});

  useEffect(() => {
    const transformSchedule = (generatedSchedule: ScheduleItem[]): TransformedSchedule => {
      const transformed: TransformedSchedule = {};
      const timeSlotsMap: { [key: string]: number } = timeSlots.reduce(
        (acc, time, index) => ({ ...acc, [time]: index }),
        {}
      );

      generatedSchedule.forEach((item) => {
        if (!transformed[item.day]) {
          transformed[item.day] = {};
        }
        if (!transformed[item.day][item.classroomId]) {
          transformed[item.day][item.classroomId] = Array(timeSlots.length).fill(null);
        }

        const daySchedule: TransformedScheduleDay = transformed[item.day];
        const classroomSchedule =
          daySchedule[item.classroomId] || Array(timeSlots.length).fill(null);

        const startIndex = timeSlotsMap[item.startTime];
        const endIndex = timeSlotsMap[item.endTime];
        const durationSlots = item.durationSlots || endIndex - startIndex;

        for (let i = startIndex; i < startIndex + durationSlots; i += 1) {
          classroomSchedule[i] = i === startIndex ? { ...item, durationSlots } : 'spanned';
        }

        daySchedule[item.classroomId] = classroomSchedule;
      });

      return transformed;
    };

    if (schedule.length > 0) {
      const newTransformedSchedule = transformSchedule(schedule);
      setTransformedSchedule(newTransformedSchedule);
    }
  }, [schedule]);

  return transformedSchedule;
};
