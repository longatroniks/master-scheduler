import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useRouter } from 'src/routes/hooks';
import { ScheduleItem, TransformedSchedule, TransformedScheduleDay } from 'src/types/types';
import { useScheduleData } from 'src/hooks/use-schedule-data';
import { generateSchedule } from 'src/utils/algo2';
import { Section } from 'src/models/Section';
import { timeSlots } from 'src/assets/data';
import { paths } from 'src/routes/paths';
import ScheduleTable from './schedule-table/ScheduleTable';
import ScheduleModal from './schedule-table/ScheduleModal';

const ScheduleGenerator: React.FC = () => {
  const { data, dataLoading, setData } = useScheduleData();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [transformedSchedule, setTransformedSchedule] = useState<TransformedSchedule>({});
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [setScheduleDone, setSetScheduleDone] = useState(false);

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

  const renderLecturers = () => (
    <Paper elevation={2} sx={{ position: 'relative', padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lecturers:
      </Typography>
      <List>
        {data.lecturers.map((lecturer, index) => (
          <ListItem key={index} divider>
            <Typography variant="body1">{`${lecturer.firstName} ${lecturer.lastName}`}</Typography>
            <Tooltip
              title={
                <Table size="small" sx={{ bgcolor: 'background.paper' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(lecturer.availability).map(([day, slots]) => (
                      <TableRow key={day}>
                        <TableCell>{day.charAt(0).toUpperCase() + day.slice(1)}</TableCell>
                        <TableCell>{slots.length > 0 ? slots[0].start_time : 'N/A'}</TableCell>
                        <TableCell>{slots.length > 0 ? slots[0].end_time : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
              placement="right"
              arrow
            >
              <IconButton>
                <AccessTimeIcon />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => router.push(paths.dashboard.lecturers)}
      >
        View All
      </Button>
    </Paper>
  );

  const renderClassrooms = () => (
    <Paper elevation={2} sx={{ position: 'relative', padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Classrooms:
      </Typography>
      <List>
        {data.classrooms.map((classroom, index) => (
          <ListItem key={index} divider>
            <Typography variant="body1">
              {classroom.name} - Capacity: {classroom.capacity}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => router.push(paths.dashboard.classrooms)}
      >
        View All
      </Button>
    </Paper>
  );

  const renderCourses = () => (
    <Paper elevation={2} sx={{ position: 'relative', padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Courses:
      </Typography>
      <List>
        {data.courses.map((course, index) => (
          <ListItem key={index} divider>
            <Typography variant="body1">
              {course.name} - Year: {course.year_level}, Lectures: {course.lecture_amount}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => router.push(paths.dashboard.courses)}
      >
        View All
      </Button>
    </Paper>
  );

  const renderFetchedData = () => {
    const splitArrayInHalf = <T,>(array: T[]): [T[], T[]] => {
      const middleIndex = Math.ceil(array.length / 2);
      const firstHalf = array.slice(0, middleIndex);
      const secondHalf = array.slice(middleIndex);
      return [firstHalf, secondHalf];
    };

    const [firstHalfSections, secondHalfSections] = splitArrayInHalf(data.sections);

    const renderSections = (sections: Section[]) => (
      <List>
        {sections.map((section, index) => (
          <ListItem key={index} divider>
            <Typography variant="subtitle1">Section: {section.name}</Typography>
            <Typography variant="body2">
              Lecturer: {getLecturerNameById(section.lecturer_id)}
            </Typography>
            <Typography variant="body2">Course: {getCourseNameById(section.course_id)}</Typography>
          </ListItem>
        ))}
      </List>
    );

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {renderLecturers()}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderClassrooms()}
        </Grid>
        <Grid item xs={12} md={12}>
          {renderCourses()}
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ padding: 2, position: 'relative', marginBottom: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sections
            </Typography>
            {renderSections(firstHalfSections)}
            <Button
              size="small"
              variant="contained"
              color="primary"
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={() => router.push(paths.dashboard.sections)}
            >
              View All
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ padding: 2, position: 'relative', marginBottom: 2 }}>
            {renderSections(secondHalfSections)}
          </Paper>
        </Grid>
      </Grid>
    );
  };
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
        onClick={handleOpenModal}
        startIcon={<OpenInFullIcon />}
        disabled={!setScheduleDone}
      >
        View as modal
      </Button>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Review Schedule Data</Typography>
        </AccordionSummary>
        <AccordionDetails>{renderFetchedData()}</AccordionDetails>
      </Accordion>
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
