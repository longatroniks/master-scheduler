export class User {
  constructor(
    public first_name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public role: string
  ) {}

  toFirestore() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      role: this.role,
    };
  }
}
