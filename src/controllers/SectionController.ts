import { SectionService } from '../services/SectionService.ts';

export class SectionController {
  sectionService: SectionService;

  constructor() {
    this.sectionService = new SectionService();
  }

  async fetchSections() {
    try {
      const sections = await this.sectionService.getSections();
      // Handle the fetched Sections (e.g., store in state, pass to components)
      return sections;
    } catch (error) {
      console.error("Error fetching Sections: ", error);
      // Handle errors appropriately
    }
  }

  // Additional methods (e.g., createSection, deleteSection) can be added here
}
