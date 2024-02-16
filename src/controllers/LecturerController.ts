import { LecturerService } from '../services/LecturerService';
import { Lecturer } from '../models/Lecturer';

export class LecturerController {
  lecturerService: LecturerService;

  constructor() {
    this.lecturerService = new LecturerService();
  }

  async fetchLecturers() {
    try {
      const lecturers = await this.lecturerService.getLecturers();
      return lecturers;
    } catch (error) {
      console.error('Error fetching Lecturers: ', error);
      throw error;
    }
  }

  async addLecturer(lecturerData: Lecturer) {
    try {
      await this.lecturerService.createLecturer(lecturerData);
    } catch (error) {
      console.error('Error adding Lecturer: ', error);
      throw error;
    }
  }

  async updateLecturer(lecturer: Lecturer) {
    try {
      await this.lecturerService.updateLecturer(lecturer);
    } catch (error) {
      console.error('Error updating Lecturer: ', error);
      throw error;
    }
  }

  async removeLecturer(lecturerId: string) {
    try {
      await this.lecturerService.deleteLecturer(lecturerId);
    } catch (error) {
      console.error('Error removing Lecturer: ', error);
      throw error;
    }
  }

  async fetchLecturerById(lecturerId: string) {
    try {
      const lecturer = await this.lecturerService.getLecturer(lecturerId);
      return lecturer;
    } catch (error) {
      console.error('Error fetching Lecturer by id: ', error);
      throw error;
    }
  }
}
