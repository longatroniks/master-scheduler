import React, { useState, useEffect, ChangeEvent } from 'react';
import { SectionController } from '../controllers/SectionController';
import { CourseController } from '../controllers/CourseController'; // Import CourseController
import { Section } from '../models/Section';
import { Course } from '../models/Course'; // Import Course model
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

const SectionTable = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const sectionController = new SectionController();

  const [courses, setCourses] = useState<Course[]>([]);
  const courseController = new CourseController();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSections = await sectionController.fetchSections();
      const fetchedCourses = await courseController.fetchCourses();
      setSections(fetchedSections || []);
      setCourses(fetchedCourses || []);
    };

    fetchData();
  }, []);

  const handleOpenCreateEditModal = (section: Section | null) => {
    if (section) {
      setEditingSection(section);
    } else {
      // Create a new Section instance with empty fields for adding a new section
      setEditingSection(new Section(0, '', '', ''));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleDeleteSection = async (section: Section) => {
    if (
      window.confirm(
        `Are you sure you want to delete section ${section.name} from ${section.course_id}?`
      )
    ) {
      await sectionController.removeSection(section.id as string); // Use the section's ID for deletion
      setSections(sections.filter((u) => u.id !== section.id));
    }
  };

  const handleSaveSection = async () => {
    if (editingSection) {
      if (editingSection.id) {
        await sectionController.updateSection(editingSection); // Update existing section
      } else {
        await sectionController.addSection(editingSection); // Add new section
      }
      const updatedSections = await sectionController.fetchSections(); // Refetch sections to update the list
      setSections(updatedSections || []);
    }
    handleCloseCreateEditModal();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingSection((prev) => (prev ? prev.updateFields({ [name]: value }) : null));
  };

  return (
    <div>
      <h1>Sections</h1>
      <Button onClick={() => handleOpenCreateEditModal(null)}>Add Section</Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Lecturer ID</TableCell>
              <TableCell>Course ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id}>
                {' '}
                {/* Use ID for key */}
                <TableCell component="th" scope="row">
                  {section.name}
                </TableCell>
                <TableCell>{section.capacity}</TableCell>
                <TableCell>{section.lecturer_id}</TableCell>
                <TableCell>{section.course_id}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenCreateEditModal(section)}>Edit</Button>
                  <Button onClick={() => handleDeleteSection(section)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>{editingSection ? 'Edit Section' : 'Add Section'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="capacity"
            label="Capacity"
            type="number"
            fullWidth
            variant="standard"
            name="capacity"
            value={editingSection?.capacity || 0}
            onChange={handleChange}
          />
          <TextField
            select
            margin="dense"
            id="course_id"
            label="Course"
            fullWidth
            variant="standard"
            name="course_id"
            value={editingSection?.course_id || ''}
            onChange={handleChange}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            id="lecturer_id"
            label="Lecturer ID"
            type="text"
            fullWidth
            variant="standard"
            name="lecturer_id"
            value={editingSection?.lecturer_id || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            name="name"
            value={editingSection?.name || ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateEditModal}>Cancel</Button>
          <Button onClick={handleSaveSection}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SectionTable;
