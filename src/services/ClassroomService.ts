import { Classroom } from '../models/Classroom';
import { db } from '../firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export class ClassroomService {
  private collectionRef = collection(db, 'classrooms');

  // CREATE: Add a new Classroom
  async createClassroom(classroom: Classroom): Promise<void> {
    await addDoc(this.collectionRef, classroom.toFirestore());
  }

  // READ: Get a single Classroom by id
  async getClassroom(classroomId: string): Promise<Classroom | undefined> {
    const classroomRef = doc(db, 'classrooms', classroomId);
    const classroomDoc = await getDoc(classroomRef);
    if (classroomDoc.exists()) {
      return new Classroom(
        classroomDoc.data().capacity,
        classroomDoc.data().lab,
        classroomDoc.data().name
      );
    } else {
      console.log('No such document!');
      return undefined;
    }
  }

  // READ: Get all Classrooms
  async getClassrooms(): Promise<Classroom[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (doc) =>
        new Classroom(
          doc.data().capacity,
          doc.data().lab,
          doc.data().name,
          doc.id // Include the document ID
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
