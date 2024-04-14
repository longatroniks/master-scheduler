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
  FormControlLabel,
  Switch,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useState, useEffect } from 'react';

import { timeSlots, daysOfWeek } from 'src/assets/data';

import { Lecturer } from '../models/Lecturer';
import { AvailabilitySlider } from './AvailabilitySlider';

import { LecturerController } from '../controllers/LecturerController';

import DeleteDialog from './confirmation/ConfirmationDeleteDialog';
import CreateDialog from './confirmation/ConfirmationCreateDialog';
import LecturerImport from './importing-components/LecturerImport';

const initialAvailability: { [key: string]: { start_time: string; end_time: string }[] } = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
};

const LecturerTable = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);
  const [availability, setAvailability] = useState<{
    [key: string]: { start_time: string; end_time: string }[];
  }>(initialAvailability);

  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null); // State for selected Lecturer
  const [modalMessage] = useState('');

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false); // State for delete confirmation modal

  const [createConfirmationModalOpen, setCreateConfirmationModalOpen] = useState(false); // State for delete confirmation modal

  const lecturerController = new LecturerController();
  const [sortKey, setSortKey] = useState('lastName');

  const fetchLecturers = async () => {
    const fetchedLecturers = await lecturerController.fetchLecturers();
    setLecturers(fetchedLecturers || []);
    console.log(fetchedLecturers);
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const handleOpenCreateEditModal = (lecturer: Lecturer | null) => {
    const newLecturer = new Lecturer('', '', false, initialAvailability); // Initialize with default values
    setEditingLecturer(lecturer || newLecturer); // Use existing lecturer or new one if adding
    setAvailability(
      lecturer ? prepareAvailabilityForLecturer(lecturer.availability) : initialAvailability
    );
    setOpenCreateEditModal(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDeleteLecturer = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer); // Ensure course is set before opening modal
    setDeleteConfirmationModalOpen(true); // Update state immediately
  };

  const handleConfirmDeleteLecturer = async () => {
    if (selectedLecturer) {
      await lecturerController.removeLecturer(selectedLecturer.id as string);
      setLecturers(lecturers.filter((l) => l.id !== selectedLecturer.id));
      setDeleteConfirmationModalOpen(false); // Close the delete confirmation modal
    }
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const prepareAvailabilityForLecturer = (availabilityData: {
    [key: string]: { start_time: string; end_time: string }[];
  }) => {
    const preparedAvailability = daysOfWeek.reduce<{
      [key: string]: { start_time: string; end_time: string }[];
    }>((acc, day) => {
      acc[day] = availabilityData[day] || [{ start_time: '08:00', end_time: '16:00' }];
      return acc;
    }, {});
    return preparedAvailability;
  };

  const timeToIndex = (time: string) => timeSlots.indexOf(time);

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

  const handleSaveLecturer = async () => {
    const exceedsTimeLimit = Object.entries(availability).some(([day, slots]) =>
      slots.some(({ start_time, end_time }) => {
        const startIndex = timeToIndex(start_time);
        const endIndex = timeToIndex(end_time);
        return endIndex - startIndex > 16;
      })
    );

    if (exceedsTimeLimit) {
      alert('One or more time slots exceed the 8-hour limit. Please adjust the time ranges.');
      return;
    }

    if (editingLecturer) {
      const updatedLecturer = new Lecturer(
        editingLecturer.firstName,
        editingLecturer.lastName,
        editingLecturer.outsideAffiliate,
        availability,
        editingLecturer.id
      );

      try {
        if (editingLecturer.id) {
          await lecturerController.updateLecturer(updatedLecturer);
          const updatedLecturers = lecturers.map((l) =>
            l.id === editingLecturer.id ? updatedLecturer : l
          );
          setLecturers(updatedLecturers);
        } else {
          await lecturerController.addLecturer(updatedLecturer);
          fetchLecturers();
        }
      } catch (error) {
        console.error('Error saving lecturer:', error);
      }
    }

    handleCloseCreateEditModal();
    handleOpenSnackbarCreate();
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    checked?: boolean
  ) => {
    const field = event.target.name as keyof Lecturer;

    const isCheckbox = checked !== undefined;
    const value: any = isCheckbox ? checked : event.target.value;

    setEditingLecturer((prev) => {
      if (!prev) return null;

      const updatedLecturer: Partial<Lecturer> = { ...prev, [field]: value };

      return new Lecturer(
        updatedLecturer.firstName || prev.firstName,
        updatedLecturer.lastName || prev.lastName,
        updatedLecturer.outsideAffiliate !== undefined
          ? updatedLecturer.outsideAffiliate
          : prev.outsideAffiliate,
        updatedLecturer.availability || prev.availability,
        prev.id
      );
    });
  };

  return (
    <div>
      <DeleteDialog
        open={deleteConfirmationModalOpen}
        onClose={handleCancelDeleteSection}
        message=" Are you sure you want to delete this lecturer "
        onConfirm={handleConfirmDeleteLecturer}
      />

      <CreateDialog
        open={createConfirmationModalOpen}
        onClose={handleCloseSnackbarCreate}
        action={null}
      />

      <h1>Lecturers</h1>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" sx={{ marginBottom: 2, gap: 2 }}>
          <Button
            onClick={() => handleOpenCreateEditModal(null)}
            color="primary"
            variant="contained"
            sx={{ textTransform: 'none', height: '40px' }} // Ensures button height is uniform
          >
            Add Lecturer
          </Button>

          <LecturerImport />

          <Button
            variant="outlined"
            component="a"
            href="https://res.cloudinary.com/dcl3zybft/raw/upload/v1712566231/ImportLecturers_vyi28g.xlsx"
            download="LecturerImportTable.xlsx"
            sx={{ textTransform: 'none'}} // Standardizes button height
          >
            Example Sheet for Import
          </Button>
        </Box>
        <Box display="flex" alignItems="center" sx={{ marginBottom: 2, gap: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 180 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="lastName">Last Name</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ overflowX: 'initial', position: 'sticky', top: '200px' }}>
        <Table aria-label="simple table">
          <TableHead sx={{ position: 'sticky', top: '62.5px', zIndex: '20' }}>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Affiliate</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lecturers
              .sort((a, b) => {
                const sortA = (a[sortKey as keyof Lecturer] || '') as string;
                const sortB = (b[sortKey as keyof Lecturer] || '') as string;
                return sortA.localeCompare(sortB);
              })
              .map((lecturer) => (
                <TableRow key={lecturer.id}>
                  <TableCell>{lecturer.firstName}</TableCell>
                  <TableCell>{lecturer.lastName}</TableCell>
                  <TableCell>{lecturer.outsideAffiliate ? 'OUTSIDE' : 'FULL-TIME'}</TableCell>

                  <TableCell>
                    <Tooltip
                      title={
                        <Table size="small" sx={{ bgcolor: 'background.paper' }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Day</TableCell>
                              <TableCell>Start Time</TableCell>
                              <TableCell>End Time</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {daysOfWeek.map((day) => {
                              // Accessing each lecturer's availability directly
                              const dayAvailability = lecturer.availability[day];
                              return (
                                <TableRow key={day}>
                                  <TableCell>
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                  </TableCell>
                                  <TableCell>
                                    {dayAvailability && dayAvailability.length > 0
                                      ? dayAvailability[0].start_time
                                      : 'N/A'}
                                  </TableCell>
                                  <TableCell>
                                    {dayAvailability && dayAvailability.length > 0
                                      ? dayAvailability[0].end_time
                                      : 'N/A'}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      }
                      placement="right"
                      arrow
                    >
                      <IconButton>
                        <AccessTimeIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => handleOpenCreateEditModal(lecturer)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="secondary"
                      variant="contained"
                      sx={{ ml: 0.3 }}
                      onClick={() => handleDeleteLecturer(lecturer)}
                    >
                      Delete
                    </Button>
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

          {daysOfWeek.map((day) => (
            <AvailabilitySlider
              key={day}
              day={day}
              initialValues={
                availability[day]?.length
                  ? [availability[day][0].start_time, availability[day][0].end_time]
                  : ['08:00', '16:00']
              }
              onChange={(scheduleDay, startTime, endTime) => {
                setAvailability((prev) => ({
                  ...prev,
                  [scheduleDay]: [{ start_time: startTime, end_time: endTime }],
                }));
              }}
            />
          ))}
        </DialogContent>

        <Dialog open={modalOpen} onClose={handleCloseModal}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <p>{modalMessage}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>

        <DialogActions>
          <Button onClick={handleCloseCreateEditModal}>Cancel</Button>
          <Button onClick={handleSaveLecturer}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LecturerTable;
