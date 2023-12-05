import React, { useState, useEffect } from 'react';
import { UserController } from '../controllers/UserController.ts';
import { User } from '../models/User';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const userController = new UserController();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await userController.fetchUsers();
      setUsers(fetchedUsers || []);
    };

    fetchUsers();
  });

  return (
    <div>
      <h1>Users</h1>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell component="th" scope="row">
                  {user.first_name}
                </TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserTable;
