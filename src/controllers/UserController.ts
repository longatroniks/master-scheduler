import { UserService } from '../services/UserService';
import { User } from '../models/User';

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async fetchUsers() {
    try {
      const users = await this.userService.getUsers();
      return users;
    } catch (error) {
      console.error('Error fetching users: ', error);
      throw error;
    }
  }

  async addUser(userData: User) {
    try {
      await this.userService.createUser(userData);
    } catch (error) {
      console.error('Error adding user: ', error);
      throw error;
    }
  }

  async updateUser(user: User) {
    // Updated to take a User object
    try {
      await this.userService.updateUser(user);
    } catch (error) {
      console.error('Error updating user: ', error);
      throw error;
    }
  }

  async removeUser(userId: string) {
    try {
      await this.userService.deleteUser(userId);
    } catch (error) {
      console.error('Error removing user: ', error);
      throw error;
    }
  }

  async fetchUserById(userId: string) {
    try {
      const user = await this.userService.getUser(userId);
      return user;
    } catch (error) {
      console.error('Error fetching user by id: ', error);
      throw error;
    }
  }
}
