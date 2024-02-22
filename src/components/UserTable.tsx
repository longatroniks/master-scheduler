/* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem
} from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';
import { UserController } from '../controllers/UserController';
import { User } from '../models/User';

import DeleteDialog from './confirmation/ConfirmationDeleteDialog';
import CreateDialog from './confirmation/ConfirmationCreateDialog';

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const userController = new UserController();


  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State for selected sClassroomection
  const [modalMessage, setModalMessage] = useState('');

  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false); // State for delete confirmation modal

  const [createConfirmationModalOpen, setCreateConfirmationModalOpen] = useState(false); // State for delete confirmation modal


  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await userController.fetchUsers();
      setUsers(fetchedUsers || []);
    };

    fetchUsers();
  }, []);

  const handleOpenCreateEditModal = (user: User | null) => {
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser(new User('', '', '', '', ''));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

 

  const handleDeleteUser = (user: User) => {
    
    setSelectedUser(user); // Ensure course is set before opening modal
    setDeleteConfirmationModalOpen(true); // Update state immediately
    
  };

  const handleConfirmDeleteCourse = async () => {
    if (selectedUser) {
      await userController.removeUser(selectedUser.id as string); // Use the user's ID for deletion
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setDeleteConfirmationModalOpen(false); // Close the delete confirmation modal
    }
  };

  const handleOpenSnackbarCreate = () => {
    setCreateConfirmationModalOpen(true);
    setTimeout(() => {
      setCreateConfirmationModalOpen(false);
    }, 3000);
  };
  
  const handleCloseSnackbarCreate = () => {
    setCreateConfirmationModalOpen(false);
  };
  
  
  const handleCancelDeleteSection = () => {
    setDeleteConfirmationModalOpen(false); 
  };

 

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  const disallowedChars = /[!#$%&/()=?*+'.,;:-_]/;
  const handleSaveUser = async () => {
    if (editingUser) {
      if (!editingUser.first_name || !editingUser.last_name || !editingUser.email || !editingUser.role) {
        setModalMessage('Please fill in all required fields!');
        setModalOpen(true);
        return;
      }

      if (disallowedChars.test(editingUser.first_name) || disallowedChars.test(editingUser.last_name)) {
        setModalMessage('Names cannot contain characters like "!", "&", "#", etc.');
        setModalOpen(true);
        return;
      }

      if (/\d/.test(editingUser.first_name) || /\d/.test(editingUser.last_name)) {
        setModalMessage('Names cannot contain numbers.');
        setModalOpen(true);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editingUser.email)) {
        setModalMessage('Please enter a valid email address.');
        setModalOpen(true);
        return;
      }

      if (editingUser.id) {
        await userController.updateUser(editingUser);
      } else {
        await userController.addUser(editingUser);
      }
      const updatedUsers = await userController.fetchUsers();
      setUsers(updatedUsers || []);
    }
    handleCloseCreateEditModal();
    handleOpenSnackbarCreate();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    
    setEditingUser((prev) => (prev ? prev.updateFields({ [name]: value }) : null));
  };

  

  return (
    <div>

<DeleteDialog
  open={deleteConfirmationModalOpen}
  onClose={handleCancelDeleteSection}
  message={`Are you sure you want to delete user ${selectedUser?.first_name} ${selectedUser?.last_name}?`}
  onConfirm={handleConfirmDeleteCourse}
      />

      <CreateDialog
        open={createConfirmationModalOpen}
        onClose={handleCloseSnackbarCreate}
        action={null}
      />

      <h1>Users</h1>
      <Button onClick={() => handleOpenCreateEditModal(null)}>Add User</Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {' '}
                {/* Use ID for key */}
                <TableCell component="th" scope="row">
                  {user.first_name}
                </TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenCreateEditModal(user)}>Edit</Button>
                  <Button onClick={() => handleDeleteUser(user)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openCreateEditModal} onClose={handleCloseCreateEditModal}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>

        <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <p>{modalMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>

        <DialogContent>
          <TextField
            required
            autoFocus
            margin="dense"
            id="first_name"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            name="first_name"
            value={editingUser?.first_name || ''}
            onChange={handleChange}
            inputProps={{ maxLength: 12 }}
          />
          <TextField
            required
            margin="dense"
            id="last_name"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            name="last_name"
            value={editingUser?.last_name || ''}
            onChange={handleChange}
            inputProps={{ maxLength: 20 }}
          />
          <TextField
            required
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            name="email"
            value={editingUser?.email || ''}
            onChange={handleChange}
          />

          
          <TextField
            select
            margin="dense"
            id="role"
            label="Role"
            fullWidth
            variant="standard"
            name="role"
            value={editingUser?.role || ''}
            onChange={handleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="guest">Guest</MenuItem>
              

            </TextField>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateEditModal}>Cancel</Button>
          <Button onClick={handleSaveUser}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;
