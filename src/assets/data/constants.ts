const lectureAmounts = [1, 2, 3];
const programs = ['WMC', 'IB', 'HT', 'NMD', 'ALL'];
const yearLevels = [0, 1, 2, 3, 4];
const credits = [0, 3, 4]; // Does not conflict, only matters for prioritizing
const boxes = [2, 3, 4, 6, 8, 12]; // 2 boxes = 1h, 3 boxes = 1h 30m,, 4 boxes = 2h, 6 boxes = 3h, 12 boxes = 6h
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

const yearLevelColors = {
  0: 'lightGray',
  1: 'yellow',
  2: 'green',
  3: 'blue',
  4: 'orange',
};

const sectionLocations = ['Zagreb', 'Online', 'Dubrovnik'];

const classroomLocations = ['Zagreb', 'Online', 'Dubrovnik'];

export {
  lectureAmounts,
  programs,
  yearLevels,
  credits,
  boxes,
  timeSlots,
  daysOfWeek,
  niceColors,
  yearLevelColors,
  sectionLocations,
  classroomLocations,
};
