import { ClassroomService } from '../services/ClassroomService';
import { Classroom } from '../models/Classroom';

export class ClassroomController {
  classroomService: ClassroomService;

  constructor() {
    this.classroomService = new ClassroomService();
  }

  async fetchClassrooms() {
    try {
      const classrooms = await this.classroomService.getClassrooms();
      return classrooms;
    } catch (error) {
      console.error('Error fetching Classrooms: ', error);
      throw error;
    }
  }

  async addClassroom(classroomData: Classroom) {
    try {
      await this.classroomService.createClassroom(classroomData);
    } catch (error) {
      console.error('Error adding Classroom: ', error);
      throw error;
    }
  }

  async updateClassroom(classroom: Classroom) {
    // Updated to take a Classroom object
    try {
      await this.classroomService.updateClassroom(classroom);
    } catch (error) {
      console.error('Error updating Classroom: ', error);
      throw error;
    }
  }

  async removeClassroom(classroomId: string) {
    try {
      await this.classroomService.deleteClassroom(classroomId);
    } catch (error) {
      console.error('Error removing Classroom: ', error);
      throw error;
    }
  }

  async fetchClassroomById(classroomId: string) {
    try {
      const classroom = await this.classroomService.getClassroom(classroomId);
      return classroom;
    } catch (error) {
      console.error('Error fetching Classroom by id: ', error);
      throw error;
    }
  }
}
