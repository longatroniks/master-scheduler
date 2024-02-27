import React from 'react';
import { Typography, List, ListItem } from '@mui/material';
import { Section } from 'src/models/Section';

interface RenderSectionsProps {
  sections: Section[];
  getLecturerNameById: (id: string) => string;
  getCourseNameById: (id: string) => string;
}

const RenderSections: React.FC<RenderSectionsProps> = ({
  sections,
  getLecturerNameById,
  getCourseNameById,
}) => (
  <List>
    {sections.map((section, index) => (
      <ListItem key={index} divider>
        <Typography variant="subtitle1">Section: {section.name}</Typography>
        <Typography variant="body2">
          Lecturer: {getLecturerNameById(section.lecturer_id)}
        </Typography>
        <Typography variant="body2">Course: {getCourseNameById(section.course_id)}</Typography>
      </ListItem>
    ))}
  </List>
);

export default RenderSections;
