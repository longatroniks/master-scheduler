// Lecturers.tsx
import React from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  Tooltip,
  IconButton,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

type Lecturer = {
  firstName: string;
  lastName: string;
  availability: Record<string, any>; // Replace 'any' with the type of your availability data
};

type LecturersProps = {
  lecturers: Lecturer[];
};

export const RenderLecturers: React.FC<LecturersProps> = ({ lecturers }) => {
  const router = useRouter();
  return (
    <Paper elevation={2} sx={{ position: 'relative', padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lecturers:
      </Typography>
      <List>
        {lecturers.map((lecturer, index) => (
          <ListItem key={index} divider>
            <Typography variant="body1">{`${lecturer.firstName} ${lecturer.lastName}`}</Typography>
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
                    {Object.entries(lecturer.availability).map(([day, slots]) => (
                      <TableRow key={day}>
                        <TableCell>{day.charAt(0).toUpperCase() + day.slice(1)}</TableCell>
                        <TableCell>{slots.length > 0 ? slots[0].start_time : 'N/A'}</TableCell>
                        <TableCell>{slots.length > 0 ? slots[0].end_time : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
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
          </ListItem>
        ))}
      </List>
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => router.push(paths.dashboard.lecturers)}
      >
        View All
      </Button>
    </Paper>
  );
};

// Do the same for Classrooms, Courses, and Sections
