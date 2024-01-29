import { Section } from '../models/Section';
import { db } from '../firebase';
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export class SectionService {
  private collectionRef = collection(db, 'sections');

  // CREATE: Add a new Section
  async createSection(section: Section): Promise<void> {
    await addDoc(this.collectionRef, section.toFirestore());
  }

  // READ: Get a single Section by id
  async getSection(sectionId: string): Promise<Section | undefined> {
    const sectionRef = doc(db, 'sections', sectionId);
    const sectionDoc = await getDoc(sectionRef);
    if (sectionDoc.exists()) {
      return new Section(
        sectionDoc.data().capacity,
        sectionDoc.data().course_id,
        sectionDoc.data().lecturer_id,
        sectionDoc.data().name
      );
    } else {
      console.log('No such document!');
      return undefined;
    }
  }

  // READ: Get all sections
  async getSections(): Promise<Section[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (doc) =>
        new Section(
          doc.data().capacity,
          doc.data().course_id,
          doc.data().lecturer_id,
          doc.data().name,
          doc.id // Include the document ID
        )
    );
  }

  // UPDATE: Update a section's details
  async updateSection(section: Section): Promise<void> {
    if (!section.id) {
      throw new Error('section ID is missing');
    }
    const sectionRef = doc(db, 'sections', section.id);
    const updateData = section.toFirestore();
    await updateDoc(sectionRef, updateData);
  }

  // DELETE: Remove a section
  async deleteSection(sectionId: string): Promise<void> {
    const sectionRef = doc(db, 'sections', sectionId);
    await deleteDoc(sectionRef);
  }
}
