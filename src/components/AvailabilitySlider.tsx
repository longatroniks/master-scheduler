import { Slider, Typography } from '@mui/material';
import React, { useState } from 'react';

interface AvailabilitySliderProps {
  day: string;
  timeSlots: string[];
  onChange: (selectedDay: string, startTime: string, endTime: string) => void;
}

// Converts a slider value to a time slot index
const valueToTimeSlot = (value: number, timeSlots: string[]): string => {
  const index = Math.round(value);
  return timeSlots[Math.min(Math.max(index, 0), timeSlots.length - 1)];
};

// Component for selecting availability
export const AvailabilitySlider: React.FC<AvailabilitySliderProps> = ({ day, timeSlots, onChange }) => {
  const [value, setValue] = useState<[number, number]>([8, 16]); // Default to 08:00 to 16:00

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setValue(newValue);
      onChange(day, valueToTimeSlot(newValue[0], timeSlots), valueToTimeSlot(newValue[1], timeSlots));
    }
  };

  return (
    <>
      <Typography gutterBottom>
        {day.charAt(0).toUpperCase() + day.slice(1)} Availability
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={(value: number) => `${valueToTimeSlot(value, timeSlots)}`}
        min={0}
        max={timeSlots.length - 1}
        valueLabelFormat={(value: number) => valueToTimeSlot(value, timeSlots)}
      />
    </>
  );
};
