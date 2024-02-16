export type AvailabilityDay = {
  day: string;
  slots: { start_time: string; end_time: string }[];
};

export class Lecturer {
  public id?: string;

  constructor(
    public sections: string[],
    public firstName: string,
    public lastName: string,
    public outsideAffiliate: boolean,
    public availability: { [key: string]: { start_time: string; end_time: string }[] },
    id?: string
  ) {
    if (id) this.id = id;
    this.availability = {
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
      fields.availability ?? this.availability,
      this.id
    );
  }
}
