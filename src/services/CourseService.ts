import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Course } from '../models/Course';

export class CourseService {
  private collectionRef = collection(db, 'courses');

  // CREATE: Add a new Course
  async createCourse(course: Course): Promise<void> {
    await addDoc(this.collectionRef, course.toFirestore());
  }

  // READ: Get a single Course by id
  async getCourse(courseId: string): Promise<Course | undefined> {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    if (courseDoc.exists()) {
      return new Course(
        courseDoc.data().abbreviation,
        courseDoc.data().name,
        courseDoc.data().program,
        courseDoc.data().year_level
      );
    }
    console.log('No such document!');
    return undefined;
  }

  // READ: Get all Courses
  async getCourses(): Promise<Course[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (document) =>
        new Course(
          document.data().abbreviation,
          document.data().name,
          document.data().program,
          document.data().year_level,
          document.id // Include the document ID
        )
    );
  }

  // UPDATE: Update a Course's details
  async updateCourse(course: Course): Promise<void> {
    if (!course.id) {
      throw new Error('Course ID is missing');
    }
    const courseRef = doc(db, 'courses', course.id);
    const updateData = course.toFirestore();
    await updateDoc(courseRef, updateData);
  }

  // DELETE: Remove a Course
  async deleteCourse(courseId: string): Promise<void> {
    const courseRef = doc(db, 'courses', courseId);
    await deleteDoc(courseRef);
  }
}
