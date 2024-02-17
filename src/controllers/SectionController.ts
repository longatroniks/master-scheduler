import { SectionService } from '../services/SectionService';
import { Section } from '../models/Section';

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
      console.error('Error fetching Sections: ', error);
      throw error;
    }
  }

  async addSection(sectionData: Section) {
    try {
      await this.sectionService.createSection(sectionData);
    } catch (error) {
      console.error('Error adding Section: ', error);
      throw error;
    }
  }

  async updateSection(section: Section) {
    // Updated to take a Section object
    try {
      await this.sectionService.updateSection(section);
    } catch (error) {
      console.error('Error updating Section: ', error);
      throw error;
    }
  }

  async removeSection(sectionId: string) {
    try {
      await this.sectionService.deleteSection(sectionId);
    } catch (error) {
      console.error('Error removing Section: ', error);
      throw error;
    }
  }

  async fetchSectionById(sectionId: string) {
    try {
      const section = await this.sectionService.getSection(sectionId);
      return section;
    } catch (error) {
      console.error('Error fetching Section by id: ', error);
      throw error;
    }
  }

  async fetchSectionsByCourseId(courseId: string) {
    try {
      const allSections = await this.fetchSections();
      const filteredSections = allSections.filter(section => section.course_id === courseId);
      return filteredSections;
    } catch (error) {
      console.error('Error fetching Sections by course ID: ', error);
      throw error;
    }
  }
  
}
