export class Lecturer {
    public id?: string;
  
    constructor(
      public courses: string[],
      public firstName: string,
      public lastName: string,
      id?: string
    ) {
      if (id) this.id = id;
    }
  
    toFirestore() {
      return {
        courses: this.courses,
        firstName: this.firstName,
        lastName: this.lastName,
      };
    }
  
    updateFields(fields: Partial<Lecturer>) {
      return new Lecturer(
        fields.courses ?? this.courses,
        fields.firstName ?? this.firstName,
        fields.lastName ?? this.lastName,
        this.id
      );
    }
  }
  