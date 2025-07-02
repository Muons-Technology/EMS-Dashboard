import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Log in using Firebase Email/Password Auth
 * @param {string} email - The doctor's email
 * @param {string} password - The doctor's password
 * @returns {Promise<void>}
 */
export const loginDoctor = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

/**
 * Log out the currently authenticated doctor
 * @returns {Promise<void>}
 */
export const logoutDoctor = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Logout failed: " + error.message);
  }
};
