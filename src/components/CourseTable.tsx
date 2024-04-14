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
  Box,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react';
import { lectureAmounts, boxes, programs, yearLevels, credits } from 'src/assets/data';

import { Course } from '../models/Course';

import { CourseController } from '../controllers/CourseController';

import DeleteDialog from './confirmation/ConfirmationDeleteDialog';
import CreateDialog from './confirmation/ConfirmationCreateDialog';
import CourseImport from './importing-components/CourseImport';

const CourseTable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sortKey, setSortKey] = useState('name'); // New state for sorting
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

  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // State for selected sClassroomection
  const [modalMessage, setModalMessage] = useState('');

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false); // State for delete confirmation modal

  const [createConfirmationModalOpen, setCreateConfirmationModalOpen] = useState(false); // State for delete confirmation modal

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

  const handleOpenCreateEditModal = (course: Course | null) => {
    if (course) {
      setEditingCourse(course);
    } else {
      setEditingCourse(new Course('', '', '', 0, 0, 0, 0, false));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course); // Ensure course is set before opening modal
    setDeleteConfirmationModalOpen(true); // Update state immediately
  };

  const handleConfirmDeleteCourse = async () => {
    if (selectedCourse) {
      await courseController.removeCourse(selectedCourse.id as string);
      setCourses(courses.filter((u) => u.id !== selectedCourse.id));
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

  const handleSaveCourse = async () => {
    if (
      editingCourse &&
      editingCourse.name &&
      editingCourse.abbreviation &&
      editingCourse.program &&
      editingCourse.year_level !== null &&
      editingCourse.year_level !== undefined &&
      editingCourse.credits !== null &&
      editingCourse.credits !== undefined
    ) {
      if (editingCourse.id) {
        await courseController.updateCourse(editingCourse);
      } else {
        await courseController.addCourse(editingCourse);
      }
      const updatedCourses = await courseController.fetchCourses();
      setCourses(updatedCourses || []);
      handleCloseCreateEditModal();
      handleOpenSnackbarCreate();
    } else {
      setModalMessage('Please fill in all fields.');
      setModalOpen(true);
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
      case 8:
          setFilteredLectureAmounts([2]); // 2 lectures are possible
          break; 
      case 12:
        setFilteredLectureAmounts([2, 3]); // 2, 3 lectures are possible
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

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortKey(event.target.value as 'name' | 'abbreviation');
  };

  return (
    <div>
      <DeleteDialog
        open={deleteConfirmationModalOpen}
        onClose={handleCancelDeleteSection}
        message={`Are you sure you want to delete section ${selectedCourse?.name} ?`}
        onConfirm={handleConfirmDeleteCourse}
      />

      <CreateDialog
        open={createConfirmationModalOpen}
        onClose={handleCloseSnackbarCreate}
        action={null}
      />

      <h1>Courses</h1>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Box display="flex" gap={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleOpenCreateEditModal(null)}
          >
            Add Course
          </Button>
          <CourseImport />
          <Button
            variant="outlined"
            component="a"
            href="https://res.cloudinary.com/dcl3zybft/raw/upload/v1712563991/ImportCourses_1_xr0cy0.xlsx"
            download="CourseImportTable.xlsx"
          >
            Example Sheet for Import
          </Button>
        </Box>
        <FormControl variant="outlined">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortKey}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="abbreviation">Abbreviation</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: 'initial', position: 'sticky', top: '200px' }}>
        <Table aria-label="simple table">
          <TableHead sx={{ position: 'sticky', top: '62.5px', zIndex: '20' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Abbreviation</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Year Level</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Boxes</TableCell>
              <TableCell>Lecture Amount</TableCell>
              <TableCell>Requires Lab</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses
              .sort((a, b) => {
                if (sortKey === 'name') {
                  return a.name.localeCompare(b.name);
                }
                return a.abbreviation.localeCompare(b.abbreviation);
              })
              .map((course) => (
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenCreateEditModal(course)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ my: 1 }}
                      onClick={() => handleDeleteCourse(course)}
                    >
                      Delete
                    </Button>
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
