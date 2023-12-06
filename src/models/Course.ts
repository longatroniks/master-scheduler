export class Course {
  public id?: string;

  constructor(
    public abbreviation: string,
    public name: string,
    public program: string,
    public year_level: number,
    id?: string
  ) {
    if (id) this.id = id;
  }

  toFirestore() {
    const yearLevelAsNumber = Number(this.year_level);
    if (isNaN(yearLevelAsNumber)) {
      return {
        abbreviation: this.abbreviation,
        name: this.name,
        program: this.program,
        year_level: 0,
      };
    } else {
      return {
        abbreviation: this.abbreviation,
        name: this.name,
        program: this.program,
        year_level: yearLevelAsNumber,
      };
    }
  }

  updateFields(fields: Partial<Course>) {
    return new Course(
      fields.abbreviation ?? this.abbreviation,
      fields.name ?? this.name,
      fields.program ?? this.program,
      fields.year_level ?? this.year_level,
      this.id // Maintain the existing ID
    );
  }
}
