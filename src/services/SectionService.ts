/* eslint-disable class-methods-use-this */
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Section } from '../models/Section';

export class SectionService {
  private collectionRef = collection(db, 'sections');

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
        sectionDoc.data().name,
        sectionDoc.data().location
      );
    }
    console.log('No such document!');
    return undefined;
  }

  // READ: Get all sections
  async getSections(): Promise<Section[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (document) =>
        new Section(
          document.data().capacity,
          document.data().course_id,
          document.data().lecturer_id,
          document.data().name,
          document.data().location,
          document.data().joined,
          document.id // Include the document ID
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
