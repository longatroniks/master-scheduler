/* eslint-disable class-methods-use-this */
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Course } from '../models/Course';

export class CourseService {
  private collectionRef = collection(db, 'courses');

  async createCourse(course: Course): Promise<void> {
    await addDoc(this.collectionRef, course.toFirestore());
  }

  async getCourse(courseId: string): Promise<Course | undefined> {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    if (courseDoc.exists()) {
      return new Course(
        courseDoc.data().abbreviation,
        courseDoc.data().name,
        courseDoc.data().program,
        courseDoc.data().year_level,
        courseDoc.data().credits,
        courseDoc.data().boxes,
        courseDoc.data().lecture_amount,
        courseDoc.data().requires_lab
      );
    }
    console.log('No such document!');
    return undefined;
  }

  async getCourses(): Promise<Course[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (document) =>
        new Course(
          document.data().abbreviation,
          document.data().name,
          document.data().program,
          document.data().year_level,
          document.data().credits,
          document.data().boxes,
          document.data().lecture_amount,
          document.data().requires_lab,
          document.id
        )
    );
  }

  async updateCourse(course: Course): Promise<void> {
    if (!course.id) {
      throw new Error('Course ID is missing');
    }
    const courseRef = doc(db, 'courses', course.id);
    const updateData = course.toFirestore();
    await updateDoc(courseRef, updateData);
  }

  async deleteCourse(courseId: string): Promise<void> {
    const courseRef = doc(db, 'courses', courseId);
    await deleteDoc(courseRef);
  }
}
