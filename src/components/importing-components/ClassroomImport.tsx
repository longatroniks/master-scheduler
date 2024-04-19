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
  styled,
  Box,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Classroom } from 'src/models/Classroom';
import { ClassroomService } from 'src/services/ClassroomService';

const Input = styled('input')({
  display: 'none',
});

// UPDEJTATI KADA ZAVRSIMO LOKACIJE

const ClassroomImport = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const classroomService = new ClassroomService();

  const handleConfirm = async () => {
    try {
      await Promise.all(classrooms.map((classroom) => classroomService.createClassroom(classroom)));
      setClassrooms([]);
      setOpenDialog(false);
      setSnackbarMessage('All classrooms uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error uploading classrooms: ', error);
      setSnackbarMessage('Failed to upload classrooms. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      Papa.parse(files[0], {
        header: true,
        complete: (result) => {
          const transformedData = transformData(result.data);
          setClassrooms(transformedData);
          setOpenDialog(true);
        },
      });
    }
  };

  const transformData = (data: any[]): Classroom[] =>
    data.map(
      (row) =>
        new Classroom(
          parseInt(row.capacity, 10),
          row.lab.toLowerCase() === 'true',
          row.name,
          row.location.split(';'), // Assuming locations are separated by semicolons
          row.id
        )
    );

  return (
    <Box>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Review and Confirm Classrooms Data</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {classrooms.map((classroom, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography variant="subtitle1">{classroom.name}</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary={`Capacity: ${classroom.capacity}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Lab: ${classroom.lab ? 'Yes' : 'No'}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Location: ${classroom.location.join(', ')}`} />
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
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
    </Box>
  );
};

export default ClassroomImport;
