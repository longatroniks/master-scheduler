import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from 'src/firebase'; // Adjust the import according to your firebase config initialization file
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import ScheduleModal from 'src/components/schedule-table/ScheduleModal'; // Adjust the import path as necessary
import { exportScheduleToCSV } from 'src/utils/exporter';
import { ScheduleItem, TransformedSchedule } from 'src/types/types';

interface ScheduletoShow {
  name: string;
  id: string;
  schedule: any; // Replace 'any' with a more specific type if you know the structure of your schedule objects
  createdAt?: any; // Replace 'any' with Date or firebase.firestore.Timestamp based on how you store dates
}

type Timeslot = ScheduleItem | 'spanned' | null;

interface ClassroomSchedule {
  [classroomId: string]: Timeslot[];
}

interface WeeklySchedule {
  [day: string]: ClassroomSchedule;
}

const SchedulesList = () => {
  const [schedules, setSchedules] = useState<ScheduletoShow[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<TransformedSchedule | undefined>(
    undefined
  );

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedulesRef = collection(db, 'schedules');
      const schedulesQuery = query(schedulesRef);
      const querySnapshot = await getDocs(schedulesQuery);
      const fetchedSchedules = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name, // Fetch the name
        schedule: doc.data().schedule,
        createdAt: doc.data().createdAt,
      }));
      setSchedules(fetchedSchedules);
    };
    fetchSchedules();
  }, []);

  const handleOpenModal = (schedule: TransformedSchedule) => {
    // Ensure this type matches your actual schedule type
    setSelectedSchedule(schedule);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  function flattenSchedule(weeklySchedule: WeeklySchedule): ScheduleItem[] {
    const flattened: ScheduleItem[] = [];

    Object.entries(weeklySchedule).forEach(([day, classrooms]) => {
      Object.values(classrooms).forEach((timeslots) => {
        timeslots.forEach((timeslot) => {
          if (timeslot && timeslot !== 'spanned') {
            flattened.push({
              ...timeslot,
              day,
            });
          }
        });
      });
    });

    return flattened;
  }

  return (
    <div>
      <h1>Schedules</h1>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Schedule ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell component="th" scope="row">
                  {schedule.name}
                </TableCell>
                <TableCell>{schedule.createdAt?.toDate().toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal(schedule.schedule)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      const flatSchedule = flattenSchedule(schedule.schedule); // Assuming `schedule.schedule` is your complex data structure
                      console.log('Flat schedule for export:', flatSchedule);
                      exportScheduleToCSV(flatSchedule);
                    }}
                  >
                    Export
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedSchedule && ( // Render ScheduleModal only if selectedSchedule is not undefined
        <ScheduleModal open={modalOpen} onClose={handleCloseModal} schedule={selectedSchedule} />
      )}
    </div>
  );
};

export default SchedulesList;
