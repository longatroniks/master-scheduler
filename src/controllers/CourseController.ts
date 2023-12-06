import { CourseService } from "../services/CourseService.ts";
import { Course } from "../models/Course.ts";

export class CourseController {
    courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  async fetchCourses() {
    try {
      const courses = await this.courseService.getCourses();
      return courses;
    } catch (error) {
      console.error("Error fetching Courses: ", error);
      throw error;
    }
  }

  async addCourse(courseData: Course) {
    try {
      await this.courseService.createCourse(courseData);
    } catch (error) {
      console.error("Error adding Course: ", error);
      throw error;
    }
  }

  async updateCourse(course: Course) { // Updated to take a Course object
    try {
      await this.courseService.updateCourse(course);
    } catch (error) {
      console.error("Error updating Course: ", error);
      throw error;
    }
  }

  async removeCourse(courseId: string) {
    try {
      await this.courseService.deleteCourse(courseId);
    } catch (error) {
      console.error("Error removing Course: ", error);
      throw error;
    }
  }

  async fetchCourseById(courseId: string) {
    try {
      const Course = await this.courseService.getCourse(courseId);
      return Course;
    } catch (error) {
      console.error("Error fetching Course by id: ", error);
      throw error;
    }
  }
}
