import React, { useEffect, useState } from 'react';
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
  Typography,
} from '@mui/material';
import ScheduleModal from 'src/components/schedule-table/ScheduleModal'; // Adjust the import path as necessary

interface ScheduletoShow {
  id: string;
  schedule: any; // Replace 'any' with a more specific type if you know the structure of your schedule objects
  createdAt?: any; // Replace 'any' with Date or firebase.firestore.Timestamp based on how you store dates
}

const SchedulesList = () => {
  const [schedules, setSchedules] = useState<ScheduletoShow[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedulesRef = collection(db, 'schedules');
      const schedulesQuery = query(schedulesRef);
      const querySnapshot = await getDocs(schedulesQuery);
      const fetchedSchedules = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        schedule: doc.data().schedule, // Assuming 'schedule' is a field in your document
        createdAt: doc.data().createdAt, // Include other necessary fields similarly
      }));
      setSchedules(fetchedSchedules);
    };
    fetchSchedules();
  }, []);

  const handleOpenModal = (schedule: React.SetStateAction<null>) => {
    setSelectedSchedule(schedule);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
                  {schedule.id}
                </TableCell>
                <TableCell>{schedule.createdAt?.toDate().toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(schedule.schedule)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

     {/* <ScheduleModal open={modalOpen} onClose={handleCloseModal} schedule={selectedSchedule} /> */}
    </div>
  );
};

export default SchedulesList;
