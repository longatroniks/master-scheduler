// Classrooms.tsx
import React from 'react';
import { Typography, Paper, List, ListItem, Button } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

type Classroom = {
  name: string;
  capacity: number;
};

type ClassroomsProps = {
  classrooms: Classroom[];
};

export const RenderClassrooms: React.FC<ClassroomsProps> = ({ classrooms }) => {
  const router = useRouter();
  return (
    <Paper elevation={2} sx={{ position: 'relative', padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Classrooms:
      </Typography>
      <List>
        {classrooms.map((classroom, index) => (
          <ListItem key={index} divider>
            <Typography variant="body1">{`${classroom.name} (Capacity: ${classroom.capacity})`}</Typography>
          </ListItem>
        ))}
      </List>
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => router.push(paths.dashboard.classrooms)}
      >
        View All
      </Button>
    </Paper>
  );
};

// Do the same for Courses and Sections
