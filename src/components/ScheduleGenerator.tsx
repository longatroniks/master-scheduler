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
import ScheduleTable from './schedule-table/ScheduleTable';
import ScheduleModal from './schedule-table/ScheduleModal';
import RenderFetchedData from './render-data/RenderFetchedData';

const ScheduleGenerator: React.FC = () => {
  const { data, dataLoading } = useScheduleData();
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

      <ScheduleTable schedule={transformedSchedule} />

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
