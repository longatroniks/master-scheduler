// Courses.tsx
import React from 'react';
import { Typography, Paper, List, ListItem, Button } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Course } from 'src/models/Course';

type CoursesProps = {
  courses: Course[];
};

export const RenderCourses: React.FC<CoursesProps> = ({ courses }) => {
  const router = useRouter();
  return (
    <Paper elevation={2} sx={{ position: 'relative', padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Courses:
      </Typography>
      <List>
        {courses.map((course, index) => (
          <ListItem key={index} divider>
            <Typography variant="body1">{`${course.name} (Code: ${course.abbreviation})`}</Typography>
          </ListItem>
        ))}
      </List>
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={() => router.push(paths.dashboard.courses)}
      >
        View All
      </Button>
    </Paper>
  );
};
