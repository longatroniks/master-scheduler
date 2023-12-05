import { UserService } from '../services/UserService.ts';

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async fetchUsers() {
    try {
      const users = await this.userService.getUsers();
      // Handle the fetched users (e.g., store in state, pass to components)
      return users;
    } catch (error) {
      console.error("Error fetching users: ", error);
      // Handle errors appropriately
    }
  }

  // Additional methods (e.g., createUser, deleteUser) can be added here
}
