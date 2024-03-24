/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent, useMemo } from 'react';
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

import { timeSlots, daysOfWeek } from 'src/assets/data';

import { Lecture } from '../models/Lecture';
import { Classroom } from '../models/Classroom';
import { Section } from '../models/Section';
import { Course } from '../models/Course';

import { LectureController } from '../controllers/LectureController';
import { ClassroomController } from '../controllers/ClassroomController';
import { SectionController } from '../controllers/SectionController';
import { CourseController } from '../controllers/CourseController';

import DeleteDialog from './confirmation/ConfirmationDeleteDialog';
import CreateDialog from './confirmation/ConfirmationCreateDialog';

const LectureTable = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const classroomController = new ClassroomController();
  const sectionController = new SectionController();
  const lectureController = new LectureController();
  const courseController = new CourseController();

  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null); // State for selected sClassroomection
  const [modalMessage, setModalMessage] = useState('');

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false); // State for delete confirmation modal

  const [createConfirmationModalOpen, setCreateConfirmationModalOpen] = useState(false); // State for delete confirmation modal

  useEffect(() => {
    const fetchLectures = async () => {
      const fetchedLectures = await lectureController.fetchLectures();
      setLectures(fetchedLectures || []);
    };

    fetchLectures();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedClassrooms = await classroomController.fetchClassrooms();
      const fetchedSections = await sectionController.fetchSections();
      const fetchedCourses = await courseController.fetchCourses();
      setClassrooms(fetchedClassrooms || []);
      setSections(fetchedSections || []);
      setCourses(fetchedCourses || []);
    };

    fetchData();
  }, []);

  const handleOpenCreateEditModal = async (lecture: Lecture | null) => {
    if (lecture) {
      setEditingLecture(lecture);
    } else {
      // Create a new Lecture instance with empty fields for adding a new Lecture
      setEditingLecture(new Lecture('', '', '', '', ''));
    }

    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDeleteLecture = (lecture: Lecture) => {
    
    setSelectedLecture(lecture); // Ensure course is set before opening modal
    setDeleteConfirmationModalOpen(true); // Update state immediately
    
  };

  const handleConfirmDeleteLecture = async () => {
    if (selectedLecture) {
      await lectureController.removeLecture(selectedLecture.id as string);
      setLectures(lectures.filter((u) => u.id !== selectedLecture.id));
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

  const handleSaveLecture = async () => {
    if (editingLecture && isLectureValid(editingLecture)) {
      if (isEndTimeValid(editingLecture)) {
        if (editingLecture.id) {
          await lectureController.updateLecture(editingLecture); // Update existing Lecture
        } else {
          await lectureController.addLecture(editingLecture); // Add new Lecture
        }
        const updatedLectures = await lectureController.fetchLectures(); // Refetch Lectures to update the list
        setLectures(updatedLectures || []);
        handleCloseCreateEditModal();
        handleOpenSnackbarCreate();
      } else {
        setModalMessage('End time cannot be before start time.');
        setModalOpen(true);
        
      }
    } else {
      setModalMessage('Please fill in all fields to save the lecture.');
      setModalOpen(true);
      
    }
  };

  const isLectureValid = (lecture: Lecture) =>
    lecture.day.trim() !== '' &&
    lecture.start_time.trim() !== '' &&
    lecture.end_time.trim() !== '' &&
    lecture.classroom_id.trim() !== '' &&
    lecture.section_id.trim() !== '';

  const isEndTimeValid = (lecture: Lecture) => {
    const startTime = new Date(`01/01/2000 ${lecture.start_time}`);
    const endTime = new Date(`01/01/2000 ${lecture.end_time}`);
    return endTime > startTime;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Parse the value to the correct type based on the field being updated
    const updatedValue = name === 'lecture_amount' ? parseInt(value, 10) : value;

    setEditingLecture((prev) => (prev ? prev.updateFields({ [name]: updatedValue }) : null));
  };

  const courseAbbreviationMap = useMemo(() => {
    const map = new Map();
    courses.forEach((course) => map.set(course.id, course.abbreviation));
    return map;
  }, [courses]);

  return (
    <div>
    <DeleteDialog
  open={deleteConfirmationModalOpen}
  onClose={handleCancelDeleteSection}
  message='Are you sure you want to delete this lecture?'
  onConfirm={handleConfirmDeleteLecture}
      />

      <CreateDialog
        open={createConfirmationModalOpen}
        onClose={handleCloseSnackbarCreate}
        action={null}
      />

      <h1>Lectures</h1>
      <Button onClick={() => handleOpenCreateEditModal(null)}>Add Lecture</Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Classroom ID</TableCell>
              <TableCell>Section ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lectures.map((lecture) => (
              <TableRow key={lecture.id}>
                <TableCell>{lecture.day}</TableCell>
                <TableCell>{lecture.start_time}</TableCell>
                <TableCell>{lecture.end_time}</TableCell>
                <TableCell component="th" scope="row">
                  {lecture.classroom_id}
                </TableCell>
                <TableCell>{lecture.section_id}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenCreateEditModal(lecture)}>Edit</Button>
                  <Button onClick={() => handleDeleteLecture(lecture)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <p>{modalMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>{editingLecture ? 'Edit Lecture' : 'Add Lecture'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            id="day"
            label="Day"
            fullWidth
            variant="standard"
            name="day"
            value={editingLecture?.day || ''}
            onChange={handleChange}
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            id="start_time"
            label="Start Time"
            fullWidth
            variant="standard"
            name="start_time"
            value={editingLecture?.start_time || ''}
            onChange={handleChange}
          >
            {timeSlots.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            id="end_time"
            label="End Time"
            fullWidth
            variant="standard"
            name="end_time"
            value={editingLecture?.end_time || ''}
            onChange={handleChange}
          >
            {timeSlots.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="dense"
            id="classroom_id"
            label="Classroom"
            fullWidth
            variant="standard"
            name="classroom_id"
            value={editingLecture?.classroom_id || ''}
            onChange={handleChange}
          >
            {classrooms.map((classroom) => (
              <MenuItem key={classroom.id} value={classroom.id}>
                {classroom.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            id="section_id"
            label="Section"
            fullWidth
            variant="standard"
            name="section_id"
            value={editingLecture?.section_id || ''}
            onChange={handleChange}
          >
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.course_id ? courseAbbreviationMap.get(section.course_id) : 'N/A'}-
                {section.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateEditModal}>Cancel</Button>
          <Button onClick={handleSaveLecture}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LectureTable;
