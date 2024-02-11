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
  MenuItem,
} from '@mui/material';
import React, { useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react';
import { CourseController } from '../controllers/CourseController';
import { Course } from '../models/Course';

const CourseTable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  // const courseController = new CourseController();
  const yearLevels = [0, 1, 2, 3, 4];
  const programs = ['WMC', 'IB', 'HT', 'ALL'];

  const courseController = useMemo(() => new CourseController(), []); // Wrap in useMemo

  const fetchCourses = useCallback(async () => {
    const fetchedCourses = await courseController.fetchCourses();
    setCourses(fetchedCourses || []);
  }, [courseController]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreateEditModal = (course: Course | null) => {
    if (course) {
      setEditingCourse(course);
    } else {
      // Create a new Course instance with empty fields for adding a new Course
      setEditingCourse(new Course('', '', '', 0));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleDeleteCourse = async (course: Course) => {
    if (window.confirm(`Are you sure you want to delete Course ${course.name}?`)) {
      await courseController.removeCourse(course.id as string); // Use the Course's ID for deletion
      setCourses(courses.filter((u) => u.id !== course.id));
    }
  };

  const handleSaveCourse = async () => {
    if (editingCourse) {
      if (editingCourse.id) {
        await courseController.updateCourse(editingCourse); // Update existing Course
      } else {
        await courseController.addCourse(editingCourse); // Add new Course
      }
      const updatedCourses = await courseController.fetchCourses(); // Refetch Courses to update the list
      setCourses(updatedCourses || []);
    }
    handleCloseCreateEditModal();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingCourse((prev) => (prev ? prev.updateFields({ [name]: value }) : null));
  };

  return (
    <div>
      <h1>Courses</h1>
      <Button onClick={() => handleOpenCreateEditModal(null)}>Add Course</Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Abbreviation</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Year Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell component="th" scope="row">
                  {course.name}
                </TableCell>
                <TableCell>{course.abbreviation}</TableCell>
                <TableCell>{course.program}</TableCell>
                <TableCell>{course.year_level}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenCreateEditModal(course)}>Edit</Button>
                  <Button onClick={() => handleDeleteCourse(course)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>{editingCourse ? 'Edit Course' : 'Add Course'}</DialogTitle>
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
            value={editingCourse?.name || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="abbreviation"
            label="Abbreviation"
            type="text"
            fullWidth
            variant="standard"
            name="abbreviation"
            value={editingCourse?.abbreviation || ''}
            onChange={handleChange}
          />
          <TextField
            select
            margin="dense"
            id="program"
            label="Program"
            fullWidth
            variant="standard"
            name="program"
            value={editingCourse?.program || ''}
            onChange={handleChange}
          >
            {programs.map((program) => (
              <MenuItem key={program} value={program}>
                {program}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            id="year_level"
            label="Year level"
            fullWidth
            variant="standard"
            name="year_level"
            value={editingCourse?.year_level || ''}
            onChange={handleChange}
          >
            {yearLevels.map((yearLevel) => (
              <MenuItem key={yearLevel} value={yearLevel}>
                {yearLevel}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateEditModal}>Cancel</Button>
          <Button onClick={handleSaveCourse}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CourseTable;
