/* eslint-disable class-methods-use-this */
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Lecturer } from '../models/Lecturer';

export class LecturerService {
  private collectionRef = collection(db, 'lecturers');

  async createLecturer(lecturer: Lecturer): Promise<void> {
    await addDoc(this.collectionRef, lecturer.toFirestore());
  }

  async getLecturer(lecturerId: string): Promise<Lecturer | undefined> {
    const lecturerRef = doc(db, 'lecturers', lecturerId);
    const lecturerDoc = await getDoc(lecturerRef);
    if (lecturerDoc.exists()) {
      return new Lecturer(
        lecturerDoc.data().sections,
        lecturerDoc.data().firstName,
        lecturerDoc.data().lastName,
        lecturerDoc.data().outsideAffiliate,
        lecturerDoc.data().availability,
      );
    }
    console.log('No such document!');
    return undefined;
  }

  async getLecturers(): Promise<Lecturer[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (document) =>
        new Lecturer(
          document.data().sections,
          document.data().firstName,
          document.data().lastName,
          document.data().outsideAffiliate,
          document.data().availability,
          document.id // Include the document ID
        )
    );
  }

  // eslint-disable-next-line class-methods-use-this
  async updateLecturer(lecturer: Lecturer): Promise<void> {
    if (!lecturer.id) {
      throw new Error('Lecturer ID is missing');
    }
    const lecturerRef = doc(db, 'lecturers', lecturer.id);
    const updateData = lecturer.toFirestore();
    await updateDoc(lecturerRef, updateData);
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteLecturer(lecturerId: string): Promise<void> {
    const lecturerRef = doc(db, 'lecturers', lecturerId);
    await deleteDoc(lecturerRef);
  }
}
