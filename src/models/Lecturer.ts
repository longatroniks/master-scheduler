export class Lecturer {
    public id?: string;
  
    constructor(
      public sections: string[],
      public firstName: string,
      public lastName: string,
      public outsideAffiliate: boolean,
      id?: string
    ) {
      if (id) this.id = id;
    }
  
    toFirestore() {
      return {
        sections: this.sections,
        firstName: this.firstName,
        lastName: this.lastName,
        outsideAffiliate: this.outsideAffiliate,
      };
    }
  
    updateFields(fields: Partial<Lecturer>) {
      return new Lecturer(
        fields.sections ?? this.sections,
        fields.firstName ?? this.firstName,
        fields.lastName ?? this.lastName,
        fields.outsideAffiliate ?? this.outsideAffiliate,
        this.id
      );
    }
  }
  