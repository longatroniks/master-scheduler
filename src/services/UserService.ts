import { User } from "../models/User.ts";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

export class UserService {
  private collectionRef = collection(db, "users");

  async createUser(user: User): Promise<void> {
    await addDoc(this.collectionRef, user.toFirestore());
  }

  async getUser(): Promise<User[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((doc) => doc.data() as User);
  }

  async getUsers(): Promise<User[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((doc) => {
      const userData = doc.data();
      return new User(
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.password,
        userData.role
      );
    });
  }
}
