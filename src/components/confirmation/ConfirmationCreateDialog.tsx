
import React from 'react';
import { Snackbar } from '@mui/material';

interface ConfirmationCreateDialogProps {
  open: boolean;
  onClose: () => void;
  action: React.ReactNode;
}

const ConfirmationCreateDialog: React.FC<ConfirmationCreateDialogProps> = ({
  open,
  onClose,
  action,
}) => (
  <Snackbar
    open={open}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    autoHideDuration={3000}
    onClose={onClose}
    message="Successfully created"
    action={action}
  />
);

export default ConfirmationCreateDialog;
