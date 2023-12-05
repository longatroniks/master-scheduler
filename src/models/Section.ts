export class Section {
  public id?: string;

  constructor(
    public capacity: number,
    public course_id: string,
    public lecturer_id: string,
    public name: string,
    id?: string
  ) {
    if (id) this.id = id;
  }

  toFirestore() {
    return {
      capacity: this.capacity,
      course_id: this.course_id,
      lecturer_id: this.lecturer_id,
      name: this.name,
    };
  }

  updateFields(fields: Partial<Section>) {
    return new Section(
      fields.capacity ?? this.capacity,
      fields.course_id ?? this.course_id,
      fields.lecturer_id ?? this.lecturer_id,
      fields.name ?? this.name,
      this.id // Maintain the existing ID
    );
  }
}
