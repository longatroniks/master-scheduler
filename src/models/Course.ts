export class Course {
  public id?: string;

  constructor(
    public abbreviation: string,
    public name: string,
    public program: string,
    public year_level: number,
    public credits: number,
    public boxes: number,
    public lecture_amount: number,
    public requires_lab: boolean,
    id?: string
  ) {
    if (id) this.id = id;
  }

  toFirestore() {
    const yearLevelAsNumber = Number(this.year_level);
    if (Number.isNaN(yearLevelAsNumber)) {
      return {
        abbreviation: this.abbreviation,
        name: this.name,
        program: this.program,
        year_level: 0,
        credits: this.credits,
        boxes: this.boxes,
        requires_lab: this.requires_lab,
        lecture_amount: this.lecture_amount,
      };
    }
    return {
      abbreviation: this.abbreviation,
      name: this.name,
      program: this.program,
      year_level: yearLevelAsNumber,
      credits: this.credits,
      boxes: this.boxes,
      lecture_amount: this.lecture_amount,
      requires_lab: this.requires_lab,
    };
  }

  updateFields(fields: Partial<Course>) {
    return new Course(
      fields.abbreviation ?? this.abbreviation,
      fields.name ?? this.name,
      fields.program ?? this.program,
      fields.year_level ?? this.year_level,
      fields.credits ?? this.credits,
      fields.boxes ?? this.boxes,
      fields.lecture_amount ?? this.lecture_amount,
      fields.requires_lab ?? this.requires_lab,
      this.id
    );
  }
}
