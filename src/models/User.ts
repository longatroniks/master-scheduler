export class User {
  public id?: string;

  constructor(
    public first_name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public role: string,
    id?: string
  ) {
    if (id) this.id = id;
  }

  toFirestore() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  }

  updateFields(fields: Partial<User>) {
    return new User(
      fields.first_name ?? this.first_name,
      fields.last_name ?? this.last_name,
      fields.email ?? this.email,
      this.password, // Password is not updated through this function
      fields.role ?? this.role,
      this.id // Maintain the existing ID
    );
  }
}
