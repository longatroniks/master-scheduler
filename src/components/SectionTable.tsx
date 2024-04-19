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
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import { sectionLocations } from '../assets/data';

import { SectionController } from '../controllers/SectionController';
import { CourseController } from '../controllers/CourseController';
import { LecturerController } from '../controllers/LecturerController';

import { Section } from '../models/Section';
import { Course } from '../models/Course';
import { Lecturer } from '../models/Lecturer';

import DeleteDialog from './confirmation/ConfirmationDeleteDialog';
import CreateDialog from './confirmation/ConfirmationCreateDialog';

const SectionTable = () => {
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);

  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [selectedSection, setSelectedSection] = useState<Section | null>(null); // State for selected section
  const [modalMessage, setModalMessage] = useState('');

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false); // State for delete confirmation modal

  const [createConfirmationModalOpen, setCreateConfirmationModalOpen] = useState(false); // State for delete confirmation modal

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]); // State for selected locations

  const [sortKey, setSortKey] = useState('course'); // Possible values: 'course', 'lecturer'

  const courseController = new CourseController();
  const sectionController = new SectionController();
  const lecturerController = new LecturerController();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedSections = await sectionController.fetchSections();
      const fetchedCourses = await courseController.fetchCourses();
      const fetchedLecturers = await lecturerController.fetchLecturers();
      fetchedLecturers.sort((a, b) => a.lastName.localeCompare(b.lastName));
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
      setEditingSection(new Section(0, '', '', '', ['']));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDeleteSection = (section: Section) => {
    setSelectedSection(section);
    setDeleteConfirmationModalOpen(true);
  };

  const handleConfirmDeleteSection = async () => {
    if (selectedSection) {
      await sectionController.removeSection(selectedSection.id as string);
      setSections(sections.filter((u) => u.id !== selectedSection.id));
      setDeleteConfirmationModalOpen(false); // Close the delete confirmation modal
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

  const handleSaveSection = async () => {
    if (!editingSection) {
      setModalMessage('No section selected for editing or addition.');
      setModalOpen(true);
      return;
    }

    const { capacity, lecturer_id, course_id } = editingSection;

    if (!capacity || !lecturer_id || !course_id || !selectedLocations.length) {
      setModalMessage('All fields are required.');
      setModalOpen(true);
      return;
    }

    if (Number.isNaN(capacity) || capacity <= 0 || capacity >= 100) {
      setModalMessage('Capacity must be a positive number smaller than 100.');
      setModalOpen(true);
      return;
    }

    const specialCharsPattern = /[.,\-!"#]/;
    if (
      specialCharsPattern.test(lecturer_id) ||
      lecturer_id.length < 5 ||
      lecturer_id.length > 25
    ) {
      setModalMessage(
        'Lecturer ID cannot contain special characters, must be between 5 and 25 characters long.'
      );
      setModalOpen(true);
      return;
    }

    if (specialCharsPattern.test(course_id) || course_id.length < 5 || course_id.length > 25) {
      setModalMessage(
        'Course ID cannot contain special characters, must be between 5 and 25 characters long.'
      );
      setModalOpen(true);
      return;
    }

    const existingSections = sections.filter((section) => section.course_id === course_id);
    const sectionNumbers = existingSections.map((section) => parseInt(section.name, 10));
    let newName = '800';
    for (let i = 800; i <= 804; i += 1) {
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
      location: selectedLocations,
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
      handleOpenSnackbarCreate();
    } catch (error) {
      if (error.message) {
        alert(`Validation Error: ${error.message}`);
      } else {
        console.error('Failed to save section:', error);
        alert('An error occurred while saving the section. Please try again.');
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
    const { name, value } = e.target;

    if (name === 'course_id') {
      const existingSectionsCount = sections.filter(
        (section) => section.course_id === value
      ).length;

      if (existingSectionsCount >= 5) {
        setModalMessage('Maximum number of sections for this course already reached.');
        setModalOpen(true);
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
      <Stack direction="row" py={3} spacing={2} alignItems="center" justifyContent="space-between">
        <Button color="primary" variant="contained" onClick={() => handleOpenCreateEditModal(null)}>
          Add Section
        </Button>

        <FormControl
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            maxWidth: '250px', // Adjust based on your layout needs
          }}
          margin="normal"
        >
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortKey}
            label="Sort By"
            onChange={(e) => setSortKey(e.target.value)}
          >
            <MenuItem value="course">Course Name</MenuItem>
            <MenuItem value="lecturer">Lecturer Last Name</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ overflowX: 'initial', position: 'sticky', top: '200px' }}
      >
        <Table aria-label="simple table">
          <TableHead sx={{ position: 'sticky', top: '62.5px', zIndex: '20' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Lecturer</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections
              .sort((a, b) => {
                if (sortKey === 'course') {
                  const courseA = courses.find((course) => course.id === a.course_id)?.name || '';
                  const courseB = courses.find((course) => course.id === b.course_id)?.name || '';
                  return courseA.localeCompare(courseB);
                }
                const lecturerA = lecturers.find((lect) => lect.id === a.lecturer_id) || {
                  lastName: '',
                };
                const lecturerB = lecturers.find((lect) => lect.id === b.lecturer_id) || {
                  lastName: '',
                };
                return lecturerA.lastName.localeCompare(lecturerB.lastName);
              })
              .map((section) => {
                const courseName =
                  courses.find((course) => course.id === section.course_id)?.name ||
                  'Unknown Course';

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
                      {Array.isArray(section.location) ? section.location.join(', ') : 'UNKNOWN'}
                    </TableCell>
                    <TableCell>{section.joined ? 'JOINED' : 'no'}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleOpenCreateEditModal(section)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="secondary"
                        variant="contained"
                        sx={{ ml: 0.3 }}
                        onClick={() => handleDeleteSection(section)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>{editingSection?.id ? 'Edit Section' : 'Add Section'}</DialogTitle>

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
            id="capacity"
            label="Capacity"
            type="number"
            fullWidth
            variant="standard"
            name="capacity"
            value={editingSection?.capacity || 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
          >
            {courses
              .map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))
              .sort((a, b) => a.props.children.localeCompare(b.props.children))}
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
          >
            {lecturers.map((lecturer) => (
              <MenuItem key={lecturer.id} value={lecturer.id}>
                {`${lecturer.firstName} ${lecturer.lastName}`}
              </MenuItem>
            ))}
          </TextField>

          <Select
            multiple
            margin="dense"
            id="location"
            label="Location"
            fullWidth
            variant="standard"
            name="location"
            value={selectedLocations}
            onChange={(e) =>
              setSelectedLocations(
                Array.isArray(e.target.value) ? e.target.value : [e.target.value]
              )
            }
          >
            {sectionLocations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
          <FormControlLabel
            control={
              <Checkbox
                checked={editingSection?.joined || false}
                onChange={(e) =>
                  handleChange({
                    target: { name: 'joined', value: e.target.checked },
                  } as unknown as ChangeEvent<HTMLInputElement>)
                }
                name="joined"
              />
            }
            label="Is Joined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateEditModal}>Cancel</Button>
          <Button onClick={handleSaveSection}>Save</Button>
        </DialogActions>
      </Dialog>

      <DeleteDialog
        open={deleteConfirmationModalOpen}
        onClose={handleCancelDeleteSection}
        message={`Are you sure you want to delete section ${selectedSection?.name} from ${selectedSection?.course_id}?`}
        onConfirm={handleConfirmDeleteSection}
      />

      <CreateDialog
        open={createConfirmationModalOpen}
        onClose={handleCloseSnackbarCreate}
        action={null}
      />
    </div>
  );
};

export default SectionTable;
