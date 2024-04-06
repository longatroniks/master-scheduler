export class Classroom {
  public id?: string;

  constructor(
    public capacity: number,
    public lab: boolean,
    public name: string,
    public location: string[],
    id?: string
  ) {
    if (id) this.id = id;
  }

  toFirestore() {
    return {
      capacity: this.capacity,
      lab: this.lab,
      name: this.name,
      location: this.location,
    };
  }

  updateFields(fields: Partial<Classroom>) {
    return new Classroom(
      fields.capacity ?? this.capacity,
      fields.lab ?? this.lab,
      fields.name ?? this.name,
      fields.location ?? this.location,
      this.id
    );
  }
}
