const lectureAmounts = [1, 2, 3];
const programs = ['WMC', 'IB', 'HT', 'ALL'];
const yearLevels = [0, 1, 2, 3, 4];
const credits = [0, 3, 4]; // Does not conflict, only matters for prioritizing
const boxes = [2, 3, 4, 6]; // 2 boxes = 1h, 3 boxes = 1h 30m,, 4 boxes = 2h, 6 boxes = 3h
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
  '20:30',
  '21:00',
];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export { lectureAmounts, programs, yearLevels, credits, boxes, timeSlots, daysOfWeek };
