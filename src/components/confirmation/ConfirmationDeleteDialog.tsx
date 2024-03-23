import React from 'react';
import { Snackbar, Button } from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
}

const ConfirmationDeleteDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  message,
  onConfirm,
}) => (
  <Snackbar
  
    open={open}
    message={message}
    action={
      <>
        <Button color="secondary" size="small" onClick={onConfirm}>
          Confirm
        </Button>
        <Button color="inherit" size="small" onClick={onClose}>
          Cancel
        </Button>
      </>
    }
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    onClose={onClose}
    autoHideDuration={6000}
  />
);

export default ConfirmationDeleteDialog;
