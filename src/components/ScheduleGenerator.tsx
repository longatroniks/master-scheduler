import React, { useEffect, useState } from 'react';
import { Button, Grid, List, ListItem, Paper, Typography } from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useRouter } from 'src/routes/hooks';
import { ScheduleItem, TransformedSchedule, TransformedScheduleDay } from 'src/types/types';
import { useScheduleData } from 'src/hooks/use-schedule-data';
import { generateSchedule } from 'src/utils/algo2';
import { timeSlots } from 'src/assets/data';
import { paths } from 'src/routes/paths';
import ScheduleTable from './schedule-table/ScheduleTable';
import ScheduleModal from './schedule-table/ScheduleModal';
import RenderFetchedData from './render-data/RenderFetchedData';

const ScheduleGenerator: React.FC = () => {
  const { data, dataLoading, setData } = useScheduleData();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [transformedSchedule, setTransformedSchedule] = useState<TransformedSchedule>({});
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [setScheduleDone, setSetScheduleDone] = useState(false);

  const [openDataModal, setOpenDataModal] = useState(false);
  const handleOpenDataModal = () => setOpenDataModal(true);
  const handleCloseDataModal = () => setOpenDataModal(false);

  const db = getFirestore();

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

  return (
    <div>
      <h2>Schedule Generator</h2>

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
