import React, { useState, useEffect, ChangeEvent } from "react";
import { LectureController } from "../controllers/LectureController.ts";
import { Lecture } from "../models/Lecture.ts";
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
} from "@mui/material";

const LectureTable = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const lectureController = new LectureController();

  useEffect(() => {
    const fetchLectures = async () => {
      const fetchedLectures = await lectureController.fetchLectures();
      setLectures(fetchedLectures || []);
    };

    fetchLectures();
  }, []);

  const handleOpenCreateEditModal = (lecture: Lecture | null) => {
    if (lecture) {
      setEditingLecture(lecture);
    } else {
      // Create a new Lecture instance with empty fields for adding a new Lecture
      setEditingLecture(new Lecture("", "", "", "", ""));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleDeleteLecture = async (lecture: Lecture) => {
    if (window.confirm(`Are you sure you want to delete ${lecture.id}?`)) {
      await lectureController.removeLecture(lecture.id as string); // Use the Lecture's ID for deletion
      setLectures(lectures.filter((u) => u.id !== lecture.id));
    }
  };

  const handleSaveLecture = async () => {
    if (editingLecture) {
      if (editingLecture.id) {
        await lectureController.updateLecture(editingLecture); // Update existing Lecture
      } else {
        await lectureController.addLecture(editingLecture); // Add new Lecture
      }
      const updatedLectures = await lectureController.fetchLectures(); // Refetch Lectures to update the list
      setLectures(updatedLectures || []);
    }
    handleCloseCreateEditModal();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingLecture((prev) =>
      prev ? prev.updateFields({ [name]: value }) : null
    );
  };

  return (
    <div>
      <h1>Lectures</h1>
      <Button onClick={() => handleOpenCreateEditModal(null)}>
        Add Lecture
      </Button>
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
                  <Button onClick={() => handleOpenCreateEditModal(lecture)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteLecture(lecture)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>
          {editingLecture ? "Edit Lecture" : "Add Lecture"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="day"
            label="Day"
            type="text"
            fullWidth
            variant="standard"
            name="day"
            value={editingLecture?.day || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="start_time"
            label="Start Time"
            type="text"
            fullWidth
            variant="standard"
            name="start_time"
            value={editingLecture?.start_time || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="end_time"
            label="End Time"
            type="text"
            fullWidth
            variant="standard"
            name="end_time"
            value={editingLecture?.end_time || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="section_id"
            label="Section ID"
            type="text"
            fullWidth
            variant="standard"
            name="section_id"
            value={editingLecture?.section_id || ""}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="classroom_id"
            label="Classroom ID"
            type="text"
            fullWidth
            variant="standard"
            name="classroom_id"
            value={editingLecture?.classroom_id || ""}
            onChange={handleChange}
          />
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
