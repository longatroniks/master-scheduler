/* eslint-disable react-hooks/exhaustive-deps */
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';
import { LecturerController } from '../controllers/LecturerController';
import { CourseController } from '../controllers/CourseController'; // Ensure the path is correct
import { Lecturer } from '../models/Lecturer';
import { Course } from '../models/Course';

const LecturerTable = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [courses, setCourses] = useState<Course[]>([]); // State to hold courses
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);
  const lecturerController = new LecturerController();
  const courseController = new CourseController(); // Initialize the course controller

  useEffect(() => {
    const fetchLecturers = async () => {
      const fetchedLecturers = await lecturerController.fetchLecturers();
      setLecturers(fetchedLecturers || []);
    };

    const fetchCourses = async () => {
      const fetchedCourses = await courseController.fetchCourses();
      setCourses(fetchedCourses || []);
    };

    fetchLecturers();
    fetchCourses();
  }, []);

  const handleOpenCreateEditModal = (lecturer: Lecturer | null) => {
    if (lecturer) {
      setEditingLecturer(lecturer);
    } else {
      setEditingLecturer(new Lecturer([], '', ''));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleDeleteLecturer = async (lecturer: Lecturer) => {
    if (
      window.confirm(`Are you sure you want to delete ${lecturer.firstName} ${lecturer.lastName}?`)
    ) {
      await lecturerController.removeLecturer(lecturer.id as string);
      setLecturers(lecturers.filter((l) => l.id !== lecturer.id));
    }
  };

  const handleSaveLecturer = async () => {
    if (editingLecturer) {
      if (!editingLecturer.firstName.trim() || !editingLecturer.lastName.trim()) {
        alert('Please enter first name and last name for the lecturer.');
        return;
      }

      if (editingLecturer.id) {
        await lecturerController.updateLecturer(editingLecturer);
      } else {
        await lecturerController.addLecturer(editingLecturer);
      }
      const updatedLecturers = await lecturerController.fetchLecturers();
      setLecturers(updatedLecturers || []);
    }
    handleCloseCreateEditModal();
  };

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof editingLecturer; // Extract the name of the changed property
    let value: any = event.target.value; // Directly use any here for simplicity, but consider refining this type

    if (name === 'courses' && Array.isArray(value)) {
      // Ensure the value is an array (for the courses Select component)
      value = value.map((item) => String(item)); // Ensure all items are strings
    }

    setEditingLecturer((prev) => {
      if (!prev) return null;
      return new Lecturer(
        name === 'courses' ? value : prev.courses,
        name === 'firstName' ? String(value) : prev.firstName,
        name === 'lastName' ? String(value) : prev.lastName,
        prev.id // Keep the existing ID
      );
    });
  };

  return (
    <div>
      <h1>Lecturers</h1>
      <Button onClick={() => handleOpenCreateEditModal(null)}>Add Lecturer</Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lecturers.map((lecturer) => (
              <TableRow key={lecturer.id}>
                <TableCell>{lecturer.firstName}</TableCell>
                <TableCell>{lecturer.lastName}</TableCell>
                <TableCell>
                  {lecturer.courses
                    .map(
                      (courseId) =>
                        courses.find((course) => course.id === courseId)?.name || 'Unknown'
                    )
                    .join(', ')}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenCreateEditModal(lecturer)}>Edit</Button>
                  <Button onClick={() => handleDeleteLecturer(lecturer)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>{editingLecturer ? 'Edit Lecturer' : 'Add Lecturer'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            name="firstName"
            value={editingLecturer?.firstName || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            name="lastName"
            value={editingLecturer?.lastName || ''}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="courses-label">Courses</InputLabel>
            <Select
              labelId="courses-label"
              id="courses"
              multiple
              value={editingLecturer?.courses || []}
              onChange={(event) => {
                const value = event.target.value;
                handleChange({
                  target: {
                    name: 'courses',
                    value: typeof value === 'string' ? value.split(',') : value,
                  },
                } as React.ChangeEvent<{ name?: string; value: unknown }>);
              }}
              name="courses"
              renderValue={(selected) =>
                selected
                  .map(
                    (courseId) => courses.find((course) => course.id === courseId)?.name || courseId
                  )
                  .join(', ')
              }
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateEditModal}>Cancel</Button>
          <Button onClick={handleSaveLecturer}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LecturerTable;
