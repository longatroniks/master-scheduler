/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
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
import { LectureController } from '../controllers/LectureController';
import { ClassroomController } from '../controllers/ClassroomController';
import { SectionController } from '../controllers/SectionController';
import { Lecture } from '../models/Lecture';
import { Classroom } from '../models/Classroom';
import { Section } from '../models/Section';
import { CourseController } from '../controllers/CourseController';
import { Course } from '../models/Course';

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

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
  ];

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

    // Fetch classroom and section names
    const classroomNames = classrooms.map((classroom) => classroom.name);
    const sectionNames = sections.map((section) => section.name);

    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleDeleteLecture = async (lecture: Lecture) => {
    if (window.confirm(`Are you sure you want to delete ${lecture.id}?`)) {
      await lectureController.removeLecture(lecture.id as string);
      setLectures(lectures.filter((u) => u.id !== lecture.id));
    }
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
      } else {
        alert('End time cannot be before start time.');
      }
    } else {
      alert('Please fill in all fields to save the lecture.');
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
