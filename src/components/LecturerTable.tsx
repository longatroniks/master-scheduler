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
import { useState, useEffect } from 'react';
import { LecturerController } from '../controllers/LecturerController';
import { SectionController } from '../controllers/SectionController'; // Ensure the path is correct
import { Lecturer } from '../models/Lecturer';
import { Section } from '../models/Section';

const LecturerTable = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [sections, setSections] = useState<Section[]>([]); // State to hold sections
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);
  const lecturerController = new LecturerController();
  const sectionController = new SectionController(); // Initialize the section controller

  useEffect(() => {
    const fetchLecturers = async () => {
      const fetchedLecturers = await lecturerController.fetchLecturers();
      setLecturers(fetchedLecturers || []);
    };

    const fetchSections = async () => {
      const fetchedSections = await sectionController.fetchSections();
      setSections(fetchedSections || []);
    };

    fetchLecturers();
    fetchSections();
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

    const isCheckbox = checked !== undefined; // Identifies if the source is a Switch/Checkbox
    const value: any = isCheckbox ? checked : event.target.value;

    setEditingLecturer((prev) => {
      if (!prev) return null;

      // Create a shallow copy to manipulate and update
      const updatedLecturer: Partial<Lecturer> = { ...prev };

      if (field === 'sections' && Array.isArray(value)) {
        updatedLecturer[field] = value.map(String);
      } else {
        updatedLecturer[field] = value;
      }

      return new Lecturer(
        updatedLecturer.sections || prev.sections,
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
              <TableCell>Sections</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lecturers.map((lecturer) => (
              <TableRow key={lecturer.id}>
                <TableCell>{lecturer.firstName}</TableCell>
                <TableCell>{lecturer.lastName}</TableCell>
                <TableCell>{lecturer.outsideAffiliate ? 'OUTSIDE' : 'FULL-TIME'}</TableCell>
                <TableCell>
                  {lecturer.sections
                    .map(
                      (sectionId) =>
                        sections.find((section) => section.id === sectionId)?.name || 'Unknown'
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
            <InputLabel id="sections-label">Sections</InputLabel>
            <Select
              labelId="sections-label"
              id="sections"
              multiple
              value={editingLecturer?.sections || []}
              onChange={(event) => {
                const value = event.target.value;
                handleChange({
                  target: {
                    name: 'sections',
                    value: typeof value === 'string' ? value.split(',') : value,
                  },
                } as React.ChangeEvent<{ name?: string; value: unknown }>);
              }}
              name="sections"
              renderValue={(selected) =>
                selected
                  .map(
                    (sectionId) => sections.find((section) => section.id === sectionId)?.name || sectionId
                  )
                  .join(', ')
              }
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name}
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
