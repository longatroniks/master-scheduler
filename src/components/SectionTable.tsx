import React, { useState, useEffect } from "react";
import { SectionController } from "../controllers/SectionController.ts";
import { Section } from "../models/Section";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const SectionTable = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const sectionController = new SectionController();

  useEffect(() => {
    const fetchSections = async () => {
      const fetchedSections = await sectionController.fetchSections();
      setSections(fetchedSections || []);
    };

    fetchSections();
  });

  return (
    <div>
      <h1>Sections</h1>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Course ID</TableCell>
              <TableCell>Lecturer ID</TableCell>
              <TableCell>Capacity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.name}>
                <TableCell component="th" scope="row">
                  {section.name} {/* Corrected order */}
                </TableCell>
                <TableCell>{section.course_id}</TableCell>
                <TableCell>{section.lecturer_id}</TableCell>
                <TableCell>{section.capacity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SectionTable;
