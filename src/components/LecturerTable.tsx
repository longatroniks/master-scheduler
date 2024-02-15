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
  FormControlLabel,
  Switch,
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
      setEditingLecturer(new Lecturer([], '', '', false));
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

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    checked?: boolean
  ) => {
    const field = event.target.name as keyof Lecturer;

    // Use type guards to safely cast 'value' to the expected type
    const isCheckbox = checked !== undefined; // Identifies if the source is a Switch/Checkbox
    const value: any = isCheckbox ? checked : event.target.value;

    setEditingLecturer((prev) => {
      if (!prev) return null;

      // Create a shallow copy to manipulate and update
      const updatedLecturer: Partial<Lecturer> = { ...prev };

      if (field === 'courses' && Array.isArray(value)) {
        // Safely assert 'value' as string[] for 'courses'
        updatedLecturer[field] = value.map(String);
      } else {
        // For other fields, including 'outsideAffiliate', directly assign 'value'
        updatedLecturer[field] = value;
      }

      // Ensure the updated lecturer object conforms to the Lecturer type
      // This might require further validation or type assertions depending on your model
      return new Lecturer(
        updatedLecturer.courses || prev.courses,
        updatedLecturer.firstName || prev.firstName,
        updatedLecturer.lastName || prev.lastName,
        updatedLecturer.outsideAffiliate !== undefined
          ? updatedLecturer.outsideAffiliate
          : prev.outsideAffiliate,
        prev.id // Preserve the ID
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
              <TableCell>Affiliate</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lecturers.map((lecturer) => (
              <TableRow key={lecturer.id}>
                <TableCell>{lecturer.firstName}</TableCell>
                <TableCell>{lecturer.lastName}</TableCell>
                <TableCell>{lecturer.outsideAffiliate ? 'OUTSIDE' : 'INSIDE'}</TableCell>
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
          <FormControlLabel
            control={
              <Switch
                checked={editingLecturer?.outsideAffiliate || false}
                onChange={(e, checked) => handleChange(e, checked)}
                name="outsideAffiliate"
              />
            }
            label="Is Outside Affiliate"
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
