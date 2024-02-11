import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';
import { ClassroomController } from '../controllers/ClassroomController';
import { Classroom } from '../models/Classroom';

const ClassroomTable = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const classroomController = new ClassroomController();

  useEffect(() => {
    const fetchClassrooms = async () => {
      const fetchedClassrooms = await classroomController.fetchClassrooms();
      setClassrooms(fetchedClassrooms || []);
    };

    fetchClassrooms();
  }, []);

  const handleOpenCreateEditModal = (classroom: Classroom | null) => {
    if (classroom) {
      setEditingClassroom(classroom);
    } else {
      // Create a new Classroom instance with empty fields for adding a new Classroom
      setEditingClassroom(new Classroom(0, false, ''));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleDeleteClassroom = async (classroom: Classroom) => {
    if (window.confirm(`Are you sure you want to delete ${classroom.name}?`)) {
      await classroomController.removeClassroom(classroom.id as string); // Use the Classroom's ID for deletion
      setClassrooms(classrooms.filter((u) => u.id !== classroom.id));
    }
  };

  const handleSaveClassroom = async () => {
    if (editingClassroom) {
      if (editingClassroom.id) {
        await classroomController.updateClassroom(editingClassroom); // Update existing Classroom
      } else {
        await classroomController.addClassroom(editingClassroom); // Add new Classroom
      }
      const updatedClassrooms = await classroomController.fetchClassrooms(); // Refetch Classrooms to update the list
      setClassrooms(updatedClassrooms || []);
    }
    handleCloseCreateEditModal();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingClassroom((prev) => (prev ? prev.updateFields({ [name]: value }) : null));
  };

  return (
    <div>
      <h1>Classrooms</h1>
      <Button onClick={() => handleOpenCreateEditModal(null)}>Add Classroom</Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Lab</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classrooms.map((classroom) => (
              <TableRow key={classroom.id}>
                <TableCell component="th" scope="row">
                  {classroom.name}
                </TableCell>
                <TableCell>{classroom.lab ? 'Yes' : 'No'}</TableCell>{' '}
                <TableCell>{classroom.capacity}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenCreateEditModal(classroom)}>Edit</Button>
                  <Button onClick={() => handleDeleteClassroom(classroom)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>{editingClassroom ? 'Edit Classroom' : 'Add Classroom'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            name="name"
            value={editingClassroom?.name || ''}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editingClassroom?.lab || false}
                onChange={(e) =>
                  setEditingClassroom((prev) => {
                    if (!prev) return null;
                    return prev.updateFields({ lab: e.target.checked });
                  })
                }
                name="lab"
              />
            }
            label="Is Lab"
          />
          <TextField
            margin="dense"
            id="capacity"
            label="Capacity"
            type="number"
            fullWidth
            variant="standard"
            name="capacity"
            value={editingClassroom?.capacity || ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateEditModal}>Cancel</Button>
          <Button onClick={handleSaveClassroom}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClassroomTable;
