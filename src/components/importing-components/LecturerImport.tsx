/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LecturerService } from 'src/services/LecturerService';
import { Lecturer } from 'src/models/Lecturer';

const Input = styled('input')({
  display: 'none',
});

interface Availability {
  [key: string]: { start_time: string; end_time: string }[];
}

const LecturerImport = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const lecturerService = new LecturerService();
  const handleConfirm = async () => {
    try {
      lecturers.forEach(async (lecturer) => {
        await lecturerService.createLecturer(lecturer);
      });
      setLecturers([]);
      setOpenDialog(false);
      setSnackbarMessage('All lecturers uploaded successfully!');
      setSnackbarSeverity('success'); // Set severity to success
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error uploading lecturer: ', error);
      setSnackbarMessage('Failed to upload lecturers. Please try again.');
      setSnackbarSeverity('error'); // Set severity to error
      setSnackbarOpen(true);
    }
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = event.target;
    if (files && files[0]) {
      Papa.parse(files[0], {
        header: true,
        complete: (result) => {
          const transformedData = transformData(result.data);
          setLecturers(transformedData);
          handleOpenDialog();
        },
      });
    }
  };

  function transformData(data: any[]): Lecturer[] {
    return data.map(
      (row) =>
        new Lecturer(
          row.firstName,
          row.lastName,
          row.outsideAffiliate.toLowerCase() === 'true',
          transformAvailability(row),
          row.id
        )
    );
  }

  function transformAvailability(row: any): Availability {
    const availability: Availability = {};
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day) => {
      const startKey = `${day.toLowerCase()}_start`;
      const endKey = `${day.toLowerCase()}_end`;
      if (row[startKey] && row[endKey]) {
        availability[day] = [{ start_time: row[startKey], end_time: row[endKey] }];
      }
    });
    return availability;
  }

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <label htmlFor="contained-button-file">
        <Input
          accept=".csv"
          id="contained-button-file"
          multiple
          type="file"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
        <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
          Upload CSV
        </Button>
      </label>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Review and Confirm Lecturers&apos; Data</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {lecturers.map((lecturer, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1">{`${lecturer.firstName} ${lecturer.lastName}`}</Typography>
                  <Typography variant="body2" gutterBottom>{`Affiliate: ${
                    lecturer.outsideAffiliate ? 'Yes' : 'No'
                  }`}</Typography>
                  <List dense>
                    {Object.entries(lecturer.availability).map(([day, slots]) =>
                      slots.map((slot, slotIndex) => (
                        <ListItem key={`${day}-${slotIndex}`}>
                          <ListItemText primary={`${day}: ${slot.start_time} - ${slot.end_time}`} />
                        </ListItem>
                      ))
                    )}
                  </List>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LecturerImport;
