import { LectureService } from '../services/LectureService';
import { Lecture } from '../models/Lecture';

export class LectureController {
  lectureService: LectureService;

  constructor() {
    this.lectureService = new LectureService();
  }

  async fetchLectures() {
    try {
      const lectures = await this.lectureService.getLectures();
      return lectures;
    } catch (error) {
      console.error('Error fetching Lectures: ', error);
      throw error;
    }
  }

  async addLecture(lectureData: Lecture) {
    try {
      await this.lectureService.createLecture(lectureData);
    } catch (error) {
      console.error('Error adding Lecture: ', error);
      throw error;
    }
  }

  async updateLecture(lecture: Lecture) {
    try {
      await this.lectureService.updateLecture(lecture);
    } catch (error) {
      console.error('Error updating Lecture: ', error);
      throw error;
    }
  }

  async removeLecture(lectureId: string) {
    try {
      await this.lectureService.deleteLecture(lectureId);
    } catch (error) {
      console.error('Error removing Lecture: ', error);
      throw error;
    }
  }

  async fetchLectureById(lectureId: string) {
    try {
      const lecture = await this.lectureService.getLecture(lectureId);
      return lecture;
    } catch (error) {
      console.error('Error fetching Lecture by id: ', error);
      throw error;
    }
  }
}
