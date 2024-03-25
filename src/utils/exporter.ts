// exportUtils.js
export const exportScheduleToCSV = (schedule: any[]) => {
  const csvRows = [
    // CSV Header
    [
      'Day',
      'Start Time',
      'End Time',
      'Course Name',
      'Section Name',
      'Lecturer Name',
      'Classroom Name',
    ],
    // Data
    ...schedule.map((item) => [
      item.day,
      item.startTime,
      item.endTime,
      `"${item.courseName}"`, // Quotes for strings to handle commas within text
      item.sectionName,
      `"${item.lecturerName}"`,
      item.classroomName,
    ]),
  ]
    .map((e) => e.join(','))
    .join('\n');

  const blob = new Blob([csvRows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'schedule.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
