/* eslint-disable class-methods-use-this */
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Lecture } from '../models/Lecture';

export class LectureService {
  private collectionRef = collection(db, 'lectures');

  async createLecture(lecture: Lecture): Promise<void> {
    await addDoc(this.collectionRef, lecture.toFirestore());
  }

  async getLecture(lectureId: string): Promise<Lecture | undefined> {
    const lectureRef = doc(db, 'lectures', lectureId);
    const lectureDoc = await getDoc(lectureRef);
    if (lectureDoc.exists()) {
      return new Lecture(
        lectureDoc.data().classroom_id,
        lectureDoc.data().day,
        lectureDoc.data().end_time,
        lectureDoc.data().section_id,
        lectureDoc.data().start_time,
      );
    }
    console.log('No such document!');
    return undefined;
  }

  async getLectures(): Promise<Lecture[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (document) =>
        new Lecture(
          document.data().classroom_id,
          document.data().day,
          document.data().end_time,
          document.data().section_id,
          document.data().start_time,
          document.id
        )
    );
  }

  async updateLecture(lecture: Lecture): Promise<void> {
    if (!lecture.id) {
      throw new Error('Lecture ID is missing');
    }
    const lectureRef = doc(db, 'lectures', lecture.id);
    const updateData = lecture.toFirestore();
    await updateDoc(lectureRef, updateData);
  }

  async deleteLecture(lectureId: string): Promise<void> {
    const lectureRef = doc(db, 'lectures', lectureId);
    await deleteDoc(lectureRef);
  }
}
