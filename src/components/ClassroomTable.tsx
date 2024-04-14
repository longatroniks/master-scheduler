/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from 'react';
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
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { classroomLocations } from '../assets/data';

import { ClassroomController } from '../controllers/ClassroomController';
import { Classroom } from '../models/Classroom';

import DeleteDialog from './confirmation/ConfirmationDeleteDialog';
import CreateDialog from './confirmation/ConfirmationCreateDialog';
import ClassroomImport from './importing-components/ClassroomImport';

const ClassroomTable = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [sortKey, setSortKey] = useState('name'); // 'name' or 'capacity'
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [modalMessage, setModalMessage] = useState('');

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [createConfirmationModalOpen, setCreateConfirmationModalOpen] = useState(false);

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
      setEditingClassroom(new Classroom(0, false, '', ['']));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDeleteClassroom = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setDeleteConfirmationModalOpen(true);
  };

  const handleConfirmDeleteClassroom = async () => {
    if (selectedClassroom) {
      await classroomController.removeClassroom(selectedClassroom.id as string);
      setClassrooms(classrooms.filter((u) => u.id !== selectedClassroom.id));
      setDeleteConfirmationModalOpen(false);
    }
  };

  const handleOpenSnackbarCreate = () => {
    setCreateConfirmationModalOpen(true);
    setTimeout(() => {
      setCreateConfirmationModalOpen(false);
    }, 3000);
  };

  const handleCloseSnackbarCreate = () => {
    setCreateConfirmationModalOpen(false);
  };

  const handleCancelDeleteSection = () => {
    setDeleteConfirmationModalOpen(false);
  };

  const handleSaveClassroom = async () => {
    if (editingClassroom) {
      if (!editingClassroom.name.trim()) {
        setModalMessage('Please enter a name for the classroom.');
        setModalOpen(true);
        return;
      }

      if (Number.isNaN(Number(editingClassroom.capacity))) {
        setModalMessage('Please enter a valid number for capacity.');
        setModalOpen(true);
        return;
      }

      if (editingClassroom.capacity <= 0 || editingClassroom.capacity > 50) {
        setModalMessage('Capacity must be a number between 1 and 50.');
        setModalOpen(true);
        return;
      }

      if (editingClassroom.id) {
        await classroomController.updateClassroom(editingClassroom);
      } else {
        await classroomController.addClassroom(editingClassroom);
      }
      const updatedClassrooms = await classroomController.fetchClassrooms();
      setClassrooms(updatedClassrooms || []);
    }
    handleCloseCreateEditModal();
    handleOpenSnackbarCreate();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingClassroom((prev) => (prev ? prev.updateFields({ [name]: value }) : null));
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortKey(event.target.value as string);
  };

  return (
    <div>
      <DeleteDialog
        open={deleteConfirmationModalOpen}
        onClose={handleCancelDeleteSection}
        message={`Are you sure you want to delete section ${selectedClassroom?.name} ?`}
        onConfirm={handleConfirmDeleteClassroom}
      />

      <CreateDialog
        open={createConfirmationModalOpen}
        onClose={handleCloseSnackbarCreate}
        action={null}
      />

      <h1>Classrooms</h1>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" sx={{ marginBottom: 2, gap: 2 }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleOpenCreateEditModal(null)}
            sx={{ textTransform: 'none' }}
          >
            Add Classroom
          </Button>
          <ClassroomImport />
          <Button
            variant="outlined"
            component="a"
            href="https://res.cloudinary.com/dcl3zybft/raw/upload/v1712566184/ImportClassrooms_1_gepu0h.xlsx"
            download="ClassroomImportTable.xlsx"
            sx={{ textTransform: 'none' }}
          >
            Example Sheet for Import
          </Button>
        </Box>
        <Box display="flex" alignItems="center" sx={{ marginBottom: 2, gap: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="sort-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortKey}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="capacity">Capacity</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'initial', position: 'sticky', top: '200px' }}>
        <Table aria-label="simple table">
          <TableHead sx={{ position: 'sticky', top: '62.5px', zIndex: '20' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Lab</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classrooms
              .sort((a, b) => {
                if (sortKey === 'name') {
                  return a.name.localeCompare(b.name);
                }
                return a.capacity - b.capacity;
              })
              .map((classroom) => (
                <TableRow key={classroom.id}>
                  <TableCell component="th" scope="row">
                    {classroom.name}
                  </TableCell>
                  <TableCell>{classroom.lab ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{classroom.capacity}</TableCell>
                  <TableCell>{classroom.location || 'UNKNOWN'}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => handleOpenCreateEditModal(classroom)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="secondary"
                      sx={{ ml: 0.3 }}
                      variant="contained"
                      onClick={() => handleDeleteClassroom(classroom)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>{editingClassroom ? 'Edit Classroom' : 'Add Classroom'}</DialogTitle>

        <Dialog open={modalOpen} onClose={handleCloseModal}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <p>{modalMessage}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>

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
            inputProps={{ min: 0, max: 50 }}
          />

          <TextField
            select
            margin="dense"
            id="location"
            label="Location"
            fullWidth
            variant="standard"
            name="location"
            value={editingClassroom?.location || ''}
            onChange={handleChange}
          >
            {classroomLocations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </TextField>
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
