import { Slider, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { timeSlots } from 'src/assets/data';

interface AvailabilitySliderProps {
  day: string;
  onChange: (selectedDay: string, startTime: string, endTime: string) => void;
  initialValues?: [string, string];
}

const timeToIndex = (time: string) => timeSlots.indexOf(time);

const indexToTime = (index: number): string =>
  timeSlots[Math.max(0, Math.min(index, timeSlots.length - 1))];

export const AvailabilitySlider: React.FC<AvailabilitySliderProps> = ({
  day,
  onChange,
  initialValues = ['08:00', '16:00'],
}) => {
  const initialIndices = initialValues.map((time) => timeToIndex(time)) as [
    number,
    number,
  ];
  const [value, setValue] = useState<[number, number]>(initialIndices);

  useEffect(() => {
    const newIndices = initialValues.map((time) => timeToIndex(time)) as [
      number,
      number,
    ];
    setValue(newIndices);
  }, [initialValues]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const [startIndex, endIndex] = newValue;
  
      // Calculate the number of selected slots
      const slotCount = endIndex - startIndex + 1; // +1 to include both start and end in the count
  
      // Check if the selection exceeds 8 hours (16 slots)
      if (slotCount <= 17) {
        setValue(newValue as [number, number]);
        onChange(day, indexToTime(startIndex), indexToTime(endIndex));
      } else {
        // Optionally, provide feedback to the user here (e.g., through a UI element)
        console.warn("Selected range exceeds 8 hours. Please select a shorter range.");
      }
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
        getAriaValueText={(sliderValue: number) => indexToTime(sliderValue)}
        min={0}
        max={timeSlots.length - 1}
        valueLabelFormat={(sliderValue: number) => indexToTime(sliderValue)}
      />
    </>
  );
};
