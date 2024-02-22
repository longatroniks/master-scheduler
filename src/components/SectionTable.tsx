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
  MenuItem,
} from '@mui/material';
import { SectionController } from '../controllers/SectionController';
import { CourseController } from '../controllers/CourseController';
import { LecturerController } from '../controllers/LecturerController';

import { Section } from '../models/Section';
import { Course } from '../models/Course';
import { Lecturer } from '../models/Lecturer';

const SectionTable = () => {
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  const courseController = new CourseController();
  const sectionController = new SectionController();
  const lecturerController = new LecturerController();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSections = await sectionController.fetchSections();
      const fetchedCourses = await courseController.fetchCourses();
      const fetchedLecturers = await lecturerController.fetchLecturers();

      setSections(fetchedSections || []);
      setCourses(fetchedCourses || []);
      setLecturers(fetchedLecturers || []);
    };

    fetchData();
  }, []);

  const handleOpenCreateEditModal = (section: Section | null) => {
    if (section) {
      setEditingSection(section);
    } else {
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
      await sectionController.removeSection(section.id as string);
      setSections(sections.filter((u) => u.id !== section.id));
    }
  };

  const handleSaveSection = async () => {
    if (!editingSection) {
      alert('No section selected for editing or addition.');
      return;
    }

    const { capacity, lecturer_id, course_id } = editingSection;

    if (!capacity || !lecturer_id || !course_id) {
      alert('All fields are required.');
      return;
    }

    if (Number.isNaN(capacity) || capacity <= 0 || capacity >= 100) {
      alert('Capacity must be a positive number smaller than 100.');
      return;
    }

    const specialCharsPattern = /[.,\-!"#]/;
    if (
      specialCharsPattern.test(lecturer_id) ||
      lecturer_id.length < 5 ||
      lecturer_id.length > 25
    ) {
      alert(
        'Lecturer ID cannot contain special characters, must be between 5 and 25 characters long.'
      );
      return;
    }

    if (specialCharsPattern.test(course_id) || course_id.length < 5 || course_id.length > 25) {
      alert(
        'Course ID cannot contain special characters, must be between 5 and 25 characters long.'
      );
      return;
    }

    const existingSections = sections.filter((section) => section.course_id === course_id);
    const sectionNumbers = existingSections.map((section) => parseInt(section.name, 10));
    let newName = '800';
    for (let i = 800; i <= 802; i += 1) {
      if (!sectionNumbers.includes(i)) {
        newName = i.toString();
        break;
      }
    }

    const updatedSection = editingSection.updateFields({
      name: newName,
      course_id,
      lecturer_id,
      capacity,
    });

    try {
      if (editingSection.id) {
        await sectionController.updateSection(updatedSection);
      } else {
        await sectionController.addSection(updatedSection);
      }
      const updatedSections = await sectionController.fetchSections();
      setSections(updatedSections || []);
      handleCloseCreateEditModal();
    } catch (error) {
      if (error.message) {
        alert(`Validation Error: ${error.message}`);
      } else {
        console.error('Failed to save section:', error);
        alert('An error occurred while saving the section. Please try again.');
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === 'course_id') {
      const existingSectionsCount = sections.filter((section) => section.course_id === value).length;
  
      if (existingSectionsCount >= 3) {
        alert('Maximum number of sections for this course already reached.');
        if (editingSection) {
          setEditingSection(editingSection.updateFields({ course_id: '' }));
        }
        return;
      }
    }
  
    setEditingSection((prev) => {
      if (prev) {
        return prev.updateFields({ [name]: value });
      }
      return null;
    });
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
              <TableCell>Lecturer</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => {
              const courseName =
                courses.find((course) => course.id === section.course_id)?.name || 'Unknown Course';

              const lecturer = lecturers.find((lect) => lect.id === section.lecturer_id);
              const lecturerFullName = lecturer
                ? `${lecturer.firstName} ${lecturer.lastName}`
                : 'Unknown Lecturer';

              return (
                <TableRow key={section.id}>
                  <TableCell component="th" scope="row">
                    {section.name}
                  </TableCell>
                  <TableCell>{section.capacity}</TableCell>
                  <TableCell>{lecturerFullName}</TableCell>
                  <TableCell>{courseName}</TableCell>
                  <TableCell>
                    <Button
                    color="primary"
                    onClick={() => handleOpenCreateEditModal(section)}>Edit</Button>
                    <Button
                    color="primary"
                    onClick={() => handleDeleteSection(section)}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
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
            select
            margin="dense"
            id="lecturer_id"
            label="Lecturer"
            fullWidth
            variant="standard"
            name="lecturer_id"
            value={editingSection?.lecturer_id || ''}
            onChange={handleChange}
          >
            {lecturers.map((lecturer) => (
              <MenuItem key={lecturer.id} value={lecturer.id}>
                {`${lecturer.firstName} ${lecturer.lastName}`}
              </MenuItem>
            ))}
          </TextField>
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
