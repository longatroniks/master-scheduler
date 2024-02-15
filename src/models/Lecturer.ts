export class Lecturer {
    public id?: string;
  
    constructor(
      public courses: string[],
      public firstName: string,
      public lastName: string,
      public outsideAffiliate: boolean,
      id?: string
    ) {
      if (id) this.id = id;
    }
  
    toFirestore() {
      return {
        courses: this.courses,
        firstName: this.firstName,
        lastName: this.lastName,
        outsideAffiliate: this.outsideAffiliate,
      };
    }
  
    updateFields(fields: Partial<Lecturer>) {
      return new Lecturer(
        fields.courses ?? this.courses,
        fields.firstName ?? this.firstName,
        fields.lastName ?? this.lastName,
        fields.outsideAffiliate ?? this.outsideAffiliate,
        this.id
      );
    }
  }
  