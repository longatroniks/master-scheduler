export class Lecturer {
  public id?: string;

  constructor(
    public sections: string[],
    public firstName: string,
    public lastName: string,
    public outsideAffiliate: boolean,
    // Adjusting the type to meet the expected structure directly.
    public availability: { [key: string]: { start_time: string; end_time: string }[] },
    id?: string
  ) {
    this.id = id;
    // Ensure default values for each day if not provided
    this.availability = availability || {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
    };
  }

  toFirestore() {
    return {
      sections: this.sections,
      firstName: this.firstName,
      lastName: this.lastName,
      outsideAffiliate: this.outsideAffiliate,
      availability: this.availability,
    };
  }

  updateFields(fields: Partial<Lecturer>) {
    return new Lecturer(
      fields.sections ?? this.sections,
      fields.firstName ?? this.firstName,
      fields.lastName ?? this.lastName,
      fields.outsideAffiliate ?? this.outsideAffiliate,
      // Ensure the availability update is handled properly.
      fields.availability ?? this.availability,
      this.id
    );
  }
}
