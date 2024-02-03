import { Lecture } from "../models/Lecture.ts";
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

export class LectureService {
  private collectionRef = collection(db, "lectures");

  async createLecture(lecture: Lecture): Promise<void> {
    await addDoc(this.collectionRef, lecture.toFirestore());
  }

  async getLecture(lectureId: string): Promise<Lecture | undefined> {
    const lectureRef = doc(db, "lectures", lectureId);
    const lectureDoc = await getDoc(lectureRef);
    if (lectureDoc.exists()) {
      return new Lecture(
        lectureDoc.data().classroom_id,
        lectureDoc.data().day,
        lectureDoc.data().end_time,
        lectureDoc.data().section_id,
        lectureDoc.data().start_time
      );
    } else {
      console.log("No such document!");
      return undefined;
    }
  }

  async getLectures(): Promise<Lecture[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (doc) =>
        new Lecture(
          doc.data().classroom_id,
          doc.data().day,
          doc.data().end_time,
          doc.data().section_id,
          doc.data().start_time,
          doc.id
        )
    );
  }

  async updateLecture(lecture: Lecture): Promise<void> {
    if (!lecture.id) {
      throw new Error("Lecture ID is missing");
    }
    const lectureRef = doc(db, "lectures", lecture.id);
    const updateData = lecture.toFirestore();
    await updateDoc(lectureRef, updateData);
  }

  async deleteLecture(lectureId: string): Promise<void> {
    const lectureRef = doc(db, "lectures", lectureId);
    await deleteDoc(lectureRef);
  }
}
