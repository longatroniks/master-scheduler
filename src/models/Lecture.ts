export class Lecture {
    public id?: string;
  
    constructor(
      public classroom_id: number,
      public end_time: string,
      public section_id: string,
      public start_time: string,
      id?: string
    ) {
      if (id) this.id = id;
    }
  
    toFirestore() {
      return {
        classroom_id: this.classroom_id,
        end_time: this.end_time,
        section_id: this.section_id,
        start_time: this.start_time,
      };
    }
  
    updateFields(fields: Partial<Lecture>) {
      return new Lecture(
        fields.classroom_id ?? this.classroom_id,
        fields.end_time ?? this.end_time,
        fields.section_id ?? this.section_id,
        fields.start_time ?? this.start_time,
        this.id // Maintain the existing ID
      );
    }
  }
  