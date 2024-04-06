/* eslint-disable class-methods-use-this */
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Classroom } from '../models/Classroom';

export class ClassroomService {
  private collectionRef = collection(db, 'classrooms');

  async createClassroom(classroom: Classroom): Promise<void> {
    await addDoc(this.collectionRef, classroom.toFirestore());
  }

  async getClassroom(classroomId: string): Promise<Classroom | undefined> {
    const classroomRef = doc(db, 'classrooms', classroomId);
    const classroomDoc = await getDoc(classroomRef);
    if (classroomDoc.exists()) {
      return new Classroom(
        classroomDoc.data().capacity,
        classroomDoc.data().lab,
        classroomDoc.data().name,
        classroomDoc.data().location,
        classroomDoc.id
      );
    }
    console.log('No such document!');
    return undefined;
  }

  async getClassrooms(): Promise<Classroom[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (document) =>
        new Classroom(
          document.data().capacity,
          document.data().lab,
          document.data().name,
          document.data().location,
          document.id // Include the document ID
        )
    );
  }

  // UPDATE: Update a Classroom's details
  async updateClassroom(classroom: Classroom): Promise<void> {
    if (!classroom.id) {
      throw new Error('Classroom ID is missing');
    }
    const classroomRef = doc(db, 'classrooms', classroom.id);
    const updateData = classroom.toFirestore();
    await updateDoc(classroomRef, updateData);
  }

  // DELETE: Remove a Classroom
  async deleteClassroom(classroomId: string): Promise<void> {
    const classroomRef = doc(db, 'classrooms', classroomId);
    await deleteDoc(classroomRef);
  }
}
