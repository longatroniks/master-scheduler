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
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react';
import { lectureAmounts, boxes, programs, yearLevels, credits } from 'src/assets/data';

import { Course } from '../models/Course';

import { CourseController } from '../controllers/CourseController';
import { SectionController } from '../controllers/SectionController';

const CourseTable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filteredLectureAmounts, setFilteredLectureAmounts] = useState(lectureAmounts);

  /**
   * 2 boxes => only can be 1 lecture (because lecture cannot last below 1 hour)
   * 3 boxes => only can be 1 lecture (because lecture cannot last below 1 hour)
   * 4 boxes => can be 1 or 2 lectures (because 4 boxes / 2 lectures = 2 boxes (1h each))
   * 6 boxes => can be 1, 2, or 3 lectures (because 6 / 2 = 2 (1h 30 min each), 6 / 3 = 2(1h each))
   */

  const courseController = useMemo(() => new CourseController(), []); // Wrap in useMemo

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (editingCourse && editingCourse.boxes) {
      updateFilteredLectureAmounts(editingCourse.boxes);
    } else {
      setFilteredLectureAmounts(lectureAmounts); // Reset to default when dialog is opened
    }
  }, [editingCourse]);

  const fetchCourses = useCallback(async () => {
    const fetchedCourses = await courseController.fetchCourses();
    setCourses(fetchedCourses || []);
  }, [courseController]);

  const fetchAndSetEligibleLecturers = useCallback(async (courseId: string) => {
    const sectionController = new SectionController();
    const sections = await sectionController.fetchSectionsByCourseId(courseId);
    const lecturerIds = sections.map((section) => section.lecturer_id);
    const uniqueLecturerIds = Array.from(new Set(lecturerIds));

    setEditingCourse((prev) => {
      if (prev) {
        return prev.updateFields({ eligible_lecturers: uniqueLecturerIds });
      }
      return null;
    });
  }, []);

  const handleOpenCreateEditModal = (course: Course | null) => {
    if (course) {
      setEditingCourse(course);
      fetchAndSetEligibleLecturers(course.id ? course.id : '');
    } else {
      setEditingCourse(new Course('', '', '', 0, 0, 0, 0, false, []));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleDeleteCourse = async (course: Course) => {
    if (window.confirm(`Are you sure you want to delete Course ${course.name}?`)) {
      await courseController.removeCourse(course.id as string);
      setCourses(courses.filter((u) => u.id !== course.id));
    }
  };

  const handleSaveCourse = async () => {
    if (
      editingCourse &&
      editingCourse.name &&
      editingCourse.abbreviation &&
      editingCourse.program &&
      editingCourse.year_level !== null &&
      editingCourse.year_level !== undefined &&
      editingCourse.credits !== null &&
      editingCourse.credits !== undefined &&
      editingCourse.eligible_lecturers
    ) {
      if (editingCourse.id) {
        await courseController.updateCourse(editingCourse);
      } else {
        await courseController.addCourse(editingCourse);
      }
      const updatedCourses = await courseController.fetchCourses();
      setCourses(updatedCourses || []);
      handleCloseCreateEditModal();
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Function to update filtered lecture amounts based on selected boxes
  const updateFilteredLectureAmounts = (selectedBoxes: number) => {
    switch (selectedBoxes) {
      case 2:
      case 3:
        setFilteredLectureAmounts([1]); // Only 1 lecture is possible
        break;
      case 4:
        setFilteredLectureAmounts([1, 2]); // 1 or 2 lectures are possible
        break;
      case 6:
        setFilteredLectureAmounts([1, 2, 3]); // 1, 2, or 3 lectures are possible
        break;
      default:
        setFilteredLectureAmounts(lectureAmounts); // Reset to all possible values if none matches
    }
  };

  // Modify handleChange to update filtered lecture amounts when boxes change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'boxes') {
      updateFilteredLectureAmounts(Number(value));
    }
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
              <TableCell>Credits</TableCell>
              <TableCell>Boxes</TableCell>
              <TableCell>Lecture Amount</TableCell>
              <TableCell>Requires Lab</TableCell>
              <TableCell>Eligible Lecturers</TableCell>
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
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.boxes}</TableCell>
                <TableCell>{course.lecture_amount}</TableCell>
                <TableCell>{course.requires_lab ? 'LAB' : 'NO LAB'}</TableCell>
                <TableCell>
                  {course.eligible_lecturers
                    ? course.eligible_lecturers
                    : 'No sections created yet'}
                </TableCell>
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
            value={editingCourse?.year_level !== undefined ? editingCourse.year_level : ''}
            onChange={handleChange}
          >
            {yearLevels.map((yearLevel) => (
              <MenuItem key={yearLevel} value={yearLevel}>
                {yearLevel}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="dense"
            id="credits"
            label="Credits"
            fullWidth
            variant="standard"
            name="credits"
            value={editingCourse?.credits !== undefined ? editingCourse.credits : ''}
            onChange={handleChange}
          >
            {credits.map((credit) => (
              <MenuItem key={credit} value={credit}>
                {credit}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            margin="dense"
            id="boxes"
            label="Boxes"
            fullWidth
            variant="standard"
            name="boxes"
            value={editingCourse?.boxes || ''}
            onChange={handleChange}
          >
            {boxes.map((box) => (
              <MenuItem key={box} value={box}>
                {box}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            id="lecture_amount"
            label="Lecture Amount"
            fullWidth
            variant="standard"
            name="lecture_amount"
            value={editingCourse?.lecture_amount || ''}
            onChange={handleChange}
          >
            {filteredLectureAmounts.map((lectureAmount) => (
              <MenuItem key={lectureAmount} value={lectureAmount}>
                {lectureAmount}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={editingCourse?.requires_lab || false}
                onChange={(e) =>
                  setEditingCourse((prev) =>
                    prev ? prev.updateFields({ requires_lab: e.target.checked }) : null
                  )
                }
                name="requires_lab"
              />
            }
            label="Requires Lab"
          />
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
