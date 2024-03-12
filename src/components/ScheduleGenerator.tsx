import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
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

  const handleLectureSelect = (lecture: ScheduleItem) => {
    console.log('Lecture selected:', lecture);
    const alternatives = findAlternativeTimeslots(
      lecture,
      data.courses,
      data.sections,
      data.lecturers,
      data.classrooms,
      schedule
    );

    // Correctly format alternatives to match the AvailableSlots type
    const formattedAlternatives = alternatives.reduce((acc: AvailableSlots, curr) => {
      const { day, startTime, classroomId } = curr; // Assuming curr contains a classroomId
      if (!acc[day]) acc[day] = {};
      if (!acc[day][startTime]) acc[day][startTime] = {};
      acc[day][startTime][classroomId] = true; // Mark the slot as available for this specific classroom
      return acc;
    }, {});

    setAvailableSlots(formattedAlternatives);
    console.log(formattedAlternatives);
  };

  const getLecturerNameById = (lecturerId: string) => {
    const lecturer = data.lecturers.find((l) => l.id === lecturerId);
    return lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : 'Unknown';
  };

  const getCourseNameById = (courseId: string) => {
    const course = data.courses.find((c) => c.id === courseId);
    return course ? course.name : 'Unknown';
  };

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
    </div>
  );
};

export default ScheduleGenerator;
