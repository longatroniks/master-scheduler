import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { TransformedSchedule } from 'src/types/types';
import ScheduleTable from './ScheduleTable';

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  schedule: TransformedSchedule;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ open, onClose, schedule }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="schedule-modal-title"
    aria-describedby="schedule-modal-description"
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        overflow: 'auto',
        maxHeight: '90%',
      }}
    >
      <Typography id="schedule-modal-title" variant="h6" component="h2">
        Generated Schedule
      </Typography>
      <ScheduleTable schedule={schedule} />
    </Box>
  </Modal>
);

export default ScheduleModal;
