import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
} from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useRouter } from 'src/routes/hooks';
import { ScheduleItem } from 'src/types/types';
import { useScheduleData } from 'src/hooks/use-schedule-data';
import { generateSchedule } from 'src/utils/algo2';
import { useTransformedSchedule } from 'src/hooks/use-transform-schedule';
import { paths } from 'src/routes/paths';
import ScheduleTable, { TransScheduleItem } from './schedule-table/ScheduleTable';
import ScheduleModal from './schedule-table/ScheduleModal';
import RenderFetchedData from './render-data/RenderFetchedData';
import { findAlternativeTimeslots } from 'src/utils/checker';

interface AvailableSlots {
  [day: string]: {
    [time: string]: {
      [classroomId: string]: boolean;
    };
  };
}

const ScheduleGenerator: React.FC = () => {
  const { data, dataLoading, setData } = useScheduleData();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [setScheduleDone, setSetScheduleDone] = useState(false);
  const [openDataModal, setOpenDataModal] = useState(false);
  const handleOpenDataModal = () => setOpenDataModal(true);
  const handleCloseDataModal = () => setOpenDataModal(false);
  const transformedSchedule = useTransformedSchedule(schedule);
  const [isEditMode, setIsEditMode] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>({});

  const [editLecture, setEditLecture] = useState<ScheduleItem | null>(null);
  const [editTimeslot, setEditTimeslot] = useState<{ startTime: string; endTime: string } | null>(
    null
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [timeslotSelectionOpen, setTimeslotSelectionOpen] = useState(false);
  const [selectedTimeslotIndex, setSelectedTimeslotIndex] = useState<number>(0);

  const db = getFirestore();
  // TODO: CREATE new schedule model, serivces
  const saveScheduleToFirebase = async (savedSchedule: any) => {
    try {
      // Use the new modular syntax for Firestore
      const docRef = await addDoc(collection(db, 'schedules'), {
        schedule: savedSchedule,
        createdAt: new Date(),
      });
      console.log('Schedule saved with ID: ', docRef.id);
    } catch (error) {
      console.error('Error saving schedule: ', error);
    }
  };

  const exportScheduleToCSV = (schedule: any) => {
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
      ...schedule.map(
        (item: {
          day: any;
          startTime: any;
          endTime: any;
          courseName: any;
          sectionName: any;
          lecturerName: any;
          classroomName: any;
        }) => [
          item.day,
          item.startTime,
          item.endTime,
          `"${item.courseName}"`, // Quotes for strings to handle commas within text
          item.sectionName,
          `"${item.lecturerName}"`,
          item.classroomName,
        ]
      ),
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

  const handleGenerateSchedule = async () => {
    if (
      data.classrooms.length &&
      data.courses.length &&
      data.lecturers.length &&
      data.sections.length
    ) {
      console.log('Starting schedule generation...'); // Initial log
      setSetScheduleDone(false);
      try {
        const generatedSchedule = await generateSchedule(
          data.courses,
          data.sections,
          data.lecturers,
          data.classrooms
        );
        console.log('Schedule generated:', generatedSchedule); // Log on success
        setSchedule(generatedSchedule);
        setSetScheduleDone(true);
      } catch (error) {
        console.error('Error generating schedule:', error);
      }
    } else {
      console.log('Data not ready for schedule generation'); // Log if data isn't ready
    }
  };
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      // Clear available slots when exiting edit mode
      setAvailableSlots({});
    }
  };

  // Example function adjustment to setAvailableSlots
  const handleLectureSelect = (lecture: ScheduleItem) => {
    const alternatives = findAlternativeTimeslots(
      lecture,
      data.courses,
      data.sections,
      data.lecturers,
      data.classrooms,
      schedule
    );

    // Here, you'll need to convert alternatives (ScheduleItem[]) to match AvailableSlots structure
    // This is a simplistic approach; you'll need to adjust it based on how you define AvailableSlots
    const formattedAlternatives: AvailableSlots = alternatives.reduce((acc, curr) => {
      const key = `${curr.day}-${curr.startTime}`;
      if (!acc[curr.day]) acc[curr.day] = {};
      if (!acc[curr.day][curr.startTime]) acc[curr.day][curr.startTime] = {};
      acc[curr.day][curr.startTime][curr.classroomId] = true;
      return acc;
    }, {} as AvailableSlots);

    setAvailableSlots(formattedAlternatives);
    console.log('formated', formattedAlternatives);

    setEditLecture(lecture);
    // Assuming you have a state to manage opening the dialog that lists alternatives
  };
  const calculateEndTimeBasedOnDuration = (
    startTime: string,
    durationSlots: number | undefined
  ): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + (durationSlots || 0) * 30;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  interface Timeslot {
    day: string;
    startTime: string;
    classroomId: string;
    label: string;
  }

  interface AvailableSlots {
    [day: string]: {
      [time: string]: {
        [classroomId: string]: boolean;
      };
    };
  }

  const transformAvailableSlotsToList = (availableSlots: AvailableSlots): Timeslot[] => {
    let list: Timeslot[] = [];
    Object.entries(availableSlots).forEach(([day, times]) => {
      Object.entries(times).forEach(([time, classrooms]) => {
        Object.keys(classrooms).forEach((classroomId) => {
          const label = `${day} ${time}`;
          list.push({ day, startTime: time, classroomId, label });
        });
      });
    });
    return list;
  };
  const handleTimeslotSelectionConfirm = () => {
    // Ensure a valid timeslot and lecture are selected
    if (!editLecture) {
      console.error('No lecture selected for updating.');
      return;
    }

    const timeslotList = transformAvailableSlotsToList(availableSlots);
    if (selectedTimeslotIndex < 0 || selectedTimeslotIndex >= timeslotList.length) {
      console.error('Selected timeslot index is out of bounds.');
      return;
    }

    const selectedTimeslot = timeslotList[selectedTimeslotIndex];
    const newEndTime = calculateEndTimeBasedOnDuration(
      selectedTimeslot.startTime,
      editLecture.durationSlots
    );

    // Create a new updated schedule
    const updatedSchedule = schedule.map((lecture) => {
      if (
        lecture.classroomId === editLecture.classroomId &&
        lecture.courseId === editLecture.courseId &&
        lecture.sectionId === editLecture.sectionId &&
        lecture.day === editLecture.day &&
        lecture.startTime === editLecture.startTime
      ) {
        // Found the lecture to update
        return {
          ...lecture,
          day: selectedTimeslot.day,
          startTime: selectedTimeslot.startTime,
          endTime: newEndTime,
          classroomId: selectedTimeslot.classroomId,
        };
      }
      return lecture;
    });

    setSchedule(updatedSchedule); // Update the schedule state
    console.log('Schedule successfully updated with new timeslot.');
    // Close any open dialogs or reset any states as necessary
    setTimeslotSelectionOpen(false);
    setSelectedTimeslotIndex(0); // Reset selection
  };

  const getLecturerNameById = (lecturerId: string) => {
    const lecturer = data.lecturers.find((l) => l.id === lecturerId);
    return lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : 'Unknown';
  };

  const getCourseNameById = (courseId: string) => {
    const course = data.courses.find((c) => c.id === courseId);
    return course ? course.name : 'Unknown';
  };

  const handleRandomizeLecture = () => {
    if (schedule.length === 0) {
      console.log('No lectures to randomize');
      return;
    }

    // Simple list of example timeslots (start time and end time)
    const exampleTimeslots = [
      { startTime: '09:00', endTime: '10:30' },
      { startTime: '11:00', endTime: '12:30' },
      { startTime: '13:00', endTime: '14:30' },
      { startTime: '15:00', endTime: '16:30' },
    ];

    // Select a random lecture from the schedule
    const randomLectureIndex = Math.floor(Math.random() * schedule.length);
    const randomLecture = schedule[randomLectureIndex];

    // Select a random new timeslot
    const newTimeslot = exampleTimeslots[Math.floor(Math.random() * exampleTimeslots.length)];

    // Update the lecture with the new timeslot
    const updatedLecture = {
      ...randomLecture,
      startTime: newTimeslot.startTime,
      endTime: newTimeslot.endTime,
    };

    // Create a new schedule array with the updated lecture
    const newSchedule = [
      ...schedule.slice(0, randomLectureIndex),
      updatedLecture,
      ...schedule.slice(randomLectureIndex + 1),
    ];

    // Update the state with the new schedule
    setSchedule(newSchedule);

    console.log('Lecture randomized:', updatedLecture);
  };

  // Dialog for timeslot selection
  const timeslotSelectionDialog = (
    <Dialog open={timeslotSelectionOpen} onClose={() => setTimeslotSelectionOpen(false)}>
      <DialogTitle>Select New Timeslot</DialogTitle>
      <DialogContent>
        <Select
          fullWidth
          value={selectedTimeslotIndex}
          onChange={(event) => setSelectedTimeslotIndex(Number(event.target.value))}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select a timeslot
          </MenuItem>
          {transformAvailableSlotsToList(availableSlots).map((option, index) => (
            <MenuItem key={index} value={index}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setTimeslotSelectionOpen(false)}>Cancel</Button>
        <Button onClick={handleTimeslotSelectionConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div>
      <h2>Schedule Generator</h2>
      <Box display="flex" justifyContent="" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateSchedule}
          startIcon={<AutoFixHighIcon />}
          disabled={dataLoading}
          sx={{ mr: 3 }}
        >
          Generate Schedule
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDataModal}
          startIcon={<OpenInFullIcon />}
          disabled={dataLoading}
        >
          Review Data
        </Button>

        {/* <Button
          variant="contained"
          color="secondary"
          onClick={handleRandomizeLecture}
          sx={{ ml: 2 }}
        >
          Randomize Lecture Timeslot
        </Button> */}

        <Button
          variant="contained"
          color="primary"
          onClick={() => setTimeslotSelectionOpen(true)} // This line is updated
          disabled={!editLecture} // Disable button if no lecture is selected
        >
          Move selected Lecture
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          startIcon={<OpenInFullIcon />}
          disabled={!setScheduleDone || dataLoading}
          sx={{ marginLeft: 3 }}
        >
          View Schedule
        </Button>
        {setScheduleDone && ( // This line ensures the button is only rendered when a schedule is generated
          <Button
            variant={isEditMode ? 'contained' : 'outlined'} // Changes appearance based on editing mode
            color="primary"
            onClick={toggleEditMode}
            startIcon={<AutoFixHighIcon />}
            sx={{ ml: 3 }} // Adjust spacing as needed
          >
            {isEditMode ? 'Finish Editing' : 'Edit Schedule'}
          </Button>
        )}
      </Box>
      <RenderFetchedData
        data={data}
        getLecturerNameById={getLecturerNameById}
        getCourseNameById={getCourseNameById}
        router={router}
        paths={paths}
        open={openDataModal}
        onClose={handleCloseDataModal}
      />
      <ScheduleTable
        schedule={transformedSchedule}
        isEditMode={isEditMode}
        onLectureSelect={handleLectureSelect as unknown as (lecture: TransScheduleItem) => void}
        availableSlots={availableSlots}
      />
      <ScheduleModal open={openModal} onClose={handleCloseModal} schedule={transformedSchedule} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => saveScheduleToFirebase(transformedSchedule)}
        disabled={!setScheduleDone || dataLoading}
      >
        Save Schedule
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => exportScheduleToCSV(schedule)}
        disabled={!setScheduleDone || dataLoading || !Array.isArray(schedule)}
        sx={{ ml: 2 }} // Adjust the margin as needed
      >
        Export Schedule
      </Button>
      {timeslotSelectionDialog}
    </div>
  );
};

export default ScheduleGenerator;
