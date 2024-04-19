import React from 'react';
import { Section } from 'src/models/Section';
import { Grid, Paper, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { RenderLecturers } from './RenderLecturers';
import { RenderClassrooms } from './RenderClassrooms';
import { RenderCourses } from './RenderCourses';
import RenderSections from './RenderSections';

interface RenderFetchedDataProps {
  data: any;
  getLecturerNameById: (id: string) => string;
  getCourseNameById: (id: string) => string;
  router: any;
  paths: any;
  open: boolean;
  onClose: () => void;
}

const RenderFetchedData: React.FC<RenderFetchedDataProps> = ({
  data,
  getLecturerNameById,
  getCourseNameById,
  router,
  paths,
  open,
  onClose,
}) => {
  const splitArrayInHalf = <T,>(array: T[]): [T[], T[]] => {
    const middleIndex = Math.ceil(array.length / 2);
    const firstHalf = array.slice(0, middleIndex);
    const secondHalf = array.slice(middleIndex);
    return [firstHalf, secondHalf];
  };

  const [firstHalfSections, secondHalfSections] = splitArrayInHalf(data.sections);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Data Review</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <RenderLecturers lecturers={data.lecturers} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RenderClassrooms classrooms={data.classrooms} />
          </Grid>
          <Grid item xs={12} md={12}>
            <RenderCourses courses={data.courses} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ padding: 2, position: 'relative', marginBottom: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sections
              </Typography>
              <RenderSections
                sections={firstHalfSections as Section[]}
                getLecturerNameById={getLecturerNameById}
                getCourseNameById={getCourseNameById}
              />
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{ position: 'absolute', top: 8, right: 8 }}
                onClick={() => router.push(paths.dashboard.sections)}
              >
                View All
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ padding: 2, position: 'relative', marginBottom: 2 }}>
              <RenderSections
                sections={secondHalfSections as Section[]}
                getLecturerNameById={getLecturerNameById}
                getCourseNameById={getCourseNameById}
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RenderFetchedData;
