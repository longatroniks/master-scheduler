import { User } from "../models/User.ts";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export class UserService {
  private collectionRef = collection(db, "users");

  // CREATE: Add a new user
  async createUser(user: User): Promise<void> {
    await addDoc(this.collectionRef, user.toFirestore());
  }

  // READ: Get a single user by id
  async getUser(userId: string): Promise<User | undefined> {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return new User(
        userDoc.data().first_name,
        userDoc.data().last_name,
        userDoc.data().email,
        userDoc.data().password,
        userDoc.data().role
      );
    } else {
      console.log("No such document!");
      return undefined;
    }
  }

  // READ: Get all users
  async getUsers(): Promise<User[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map(
      (doc) =>
        new User(
          doc.data().first_name,
          doc.data().last_name,
          doc.data().email,
          doc.data().password,
          doc.data().role,
          doc.id // Include the document ID
        )
    );
  }

  // UPDATE: Update a user's details
  async updateUser(user: User): Promise<void> {
    if (!user.id) {
      throw new Error("User ID is missing");
    }
    const userRef = doc(db, "users", user.id);
    const updateData = user.toFirestore();
    await updateDoc(userRef, updateData);
  }

  // DELETE: Remove a user
  async deleteUser(userId: string): Promise<void> {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
  }
}
