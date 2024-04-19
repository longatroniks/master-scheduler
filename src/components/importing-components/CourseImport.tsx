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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CourseService } from 'src/services/CourseService';
import { Course } from 'src/models/Course';

const Input = styled('input')({
  display: 'none',
});

const CourseImport = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const courseService = new CourseService();

  const handleConfirm = async () => {
    try {
      courses.forEach(async (course) => {
        await courseService.createCourse(course);
      });
      setCourses([]);
      setOpenDialog(false);
      setSnackbarMessage('All courses uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error uploading courses: ', error);
      setSnackbarMessage('Failed to upload courses. Please try again.');
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
          setCourses(transformedData);
          setOpenDialog(true);
        },
      });
    }
  };

  const transformData = (data: any[]): Course[] =>
    data.map(
      (row) =>
        new Course(
          row.abbreviation,
          row.name,
          row.program,
          parseInt(row.year_level, 10),
          parseInt(row.credits, 10),
          parseInt(row.boxes, 10),
          parseInt(row.lecture_amount, 10),
          row.requires_lab.toLowerCase() === 'true',
          row.id
        )
    );

  return (
    <div>
      <label htmlFor="contained-button-file">
        <Input
          accept=".csv"
          id="contained-button-file" // Add the id attribute
          multiple
          type="file"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
        <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
          Upload CSV
        </Button>
      </label>
      <Dialog
        open={openDialog}
        scroll="paper"
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Review and Confirm Courses Data</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <DialogContent dividers>
              <Grid container spacing={2} mt={5}>
                {courses.map((course, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Typography variant="subtitle1">
                      {course.name} ({course.abbreviation})
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary={`Program: ${course.program}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`Year Level: ${course.year_level}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`Credits: ${course.credits}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`Boxes: ${course.boxes}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`Lecture Amount: ${course.lecture_amount}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Requires Lab: ${course.requires_lab ? 'Yes' : 'No'}`}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
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
    </div>
  );
};

export default CourseImport;
