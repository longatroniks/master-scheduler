export class Section {
    constructor(
      public capacity: number,
      public course_id: string,
      public lecturer_id: string,
      public name: string,
    ) {}
  
    toFirestore() {
      return {
        capacity: this.capacity,
        course_id: this.course_id,
        lecturer_id: this.lecturer_id,
        name: this.name,
      };
    }
  }
  