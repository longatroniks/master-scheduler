import { Section } from "../models/Section.ts";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export class SectionService {
  private collectionRef = collection(db, "sections");

  async createSection(section: Section): Promise<void> {
    await addDoc(this.collectionRef, section.toFirestore());
  }

  async getSection(): Promise<Section[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((doc) => doc.data() as Section);
  }

  async getSections(): Promise<Section[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((doc) => {
      const sectionData = doc.data();
      return new Section(
        sectionData.capacity,
        sectionData.course_id,
        sectionData.lecturer_id,
        sectionData.name
      );
    });
  }
}
