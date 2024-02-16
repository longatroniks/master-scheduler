export class Lecture {
    public id?: string;
  
    constructor(
      public classroom_id: string,
      public day: string,
      public end_time: string,
      public section_id: string,
      public start_time: string,
      public lecture_amount: number,
      id?: string
    ) {
      if (id) this.id = id;
    }
  
    toFirestore() {
      return {
        classroom_id: this.classroom_id,
        day: this.day,
        end_time: this.end_time,
        section_id: this.section_id,
        start_time: this.start_time,
        lecture_amount: this.lecture_amount,
      };
    }
  
    updateFields(fields: Partial<Lecture>) {
      return new Lecture(
        fields.classroom_id ?? this.classroom_id,
        fields.day ?? this.day,
        fields.end_time ?? this.end_time,
        fields.section_id ?? this.section_id,
        fields.start_time ?? this.start_time,
        fields.lecture_amount ?? this.lecture_amount,
        this.id
      );
    }
  }
  