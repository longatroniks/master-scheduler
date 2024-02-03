import { Course } from "../models/Course.ts";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export class CourseService {
  private collectionRef = collection(db, "courses");

  async createCourse(course: Course): Promise<void> {
    await addDoc(this.collectionRef, course.toFirestore());
  }

  async getCourse(courseId: string): Promise<Course | undefined> {
    const courseRef = doc(db, "courses", courseId);
    const courseDoc = await getDoc(courseRef);
    if (courseDoc.exists()) {
      return new Course(
        courseDoc.data().abbreviation,
        courseDoc.data().name,
        courseDoc.data().program,
        courseDoc.data().year_level
      );
    } else {
      console.log("No such document!");
      return undefined;
    }
  }

  async getCourses(): Promise<Course[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (doc) =>
        new Course(
          doc.data().abbreviation,
          doc.data().name,
          doc.data().program,
          doc.data().year_level,
          doc.id
        )
    );
  }

  async updateCourse(course: Course): Promise<void> {
    if (!course.id) {
      throw new Error("Course ID is missing");
    }
    const courseRef = doc(db, "courses", course.id);
    const updateData = course.toFirestore();
    await updateDoc(courseRef, updateData);
  }

  async deleteCourse(courseId: string): Promise<void> {
    const courseRef = doc(db, "courses", courseId);
    await deleteDoc(courseRef);
  }
}
