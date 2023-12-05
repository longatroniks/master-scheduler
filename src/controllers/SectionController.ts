import { SectionService } from "../services/SectionService.ts";
import { Section } from "../models/Section.ts";

export class SectionController {
  sectionService: SectionService;

  constructor() {
    this.sectionService = new SectionService();
  }

  async fetchSections() {
    try {
      const sections = await this.sectionService.getSections();
      return sections;
    } catch (error) {
      console.error("Error fetching Sections: ", error);
      throw error;
    }
  }

  async addSection(SectionData: Section) {
    try {
      await this.sectionService.createSection(SectionData);
    } catch (error) {
      console.error("Error adding Section: ", error);
      throw error;
    }
  }

  async updateSection(Section: Section) { // Updated to take a Section object
    try {
      await this.sectionService.updateSection(Section);
    } catch (error) {
      console.error("Error updating Section: ", error);
      throw error;
    }
  }

  async removeSection(SectionId: string) {
    try {
      await this.sectionService.deleteSection(SectionId);
    } catch (error) {
      console.error("Error removing Section: ", error);
      throw error;
    }
  }

  async fetchSectionById(SectionId: string) {
    try {
      const Section = await this.sectionService.getSection(SectionId);
      return Section;
    } catch (error) {
      console.error("Error fetching Section by id: ", error);
      throw error;
    }
  }
}
