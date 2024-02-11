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
} from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';
import { UserController } from '../controllers/UserController';
import { User } from '../models/User';

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const userController = new UserController();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await userController.fetchUsers();
      setUsers(fetchedUsers || []);
    };

    fetchUsers();
  });

  const handleOpenCreateEditModal = (user: User | null) => {
    if (user) {
      setEditingUser(user);
    } else {
      // Create a new User instance with empty fields for adding a new user
      setEditingUser(new User('', '', '', '', ''));
    }
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateEditModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      await userController.removeUser(user.id as string); // Use the user's ID for deletion
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  const handleSaveUser = async () => {
    if (editingUser) {
      if (editingUser.id) {
        await userController.updateUser(editingUser); // Update existing user
      } else {
        await userController.addUser(editingUser); // Add new user
      }
      const updatedUsers = await userController.fetchUsers(); // Refetch users to update the list
      setUsers(updatedUsers || []);
    }
    handleCloseCreateEditModal();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingUser((prev) => (prev ? prev.updateFields({ [name]: value }) : null));
  };

  return (
    <div>
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
        <DialogContent>
          <TextField
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
          />
          <TextField
            margin="dense"
            id="last_name"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            name="last_name"
            value={editingUser?.last_name || ''}
            onChange={handleChange}
          />
          <TextField
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
            margin="dense"
            id="role"
            label="Role"
            type="text"
            fullWidth
            variant="standard"
            name="role"
            value={editingUser?.role || ''}
            onChange={handleChange}
          />
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
