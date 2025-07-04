import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase";

export const loginDoctor = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Additional verification if needed
    if (!userCredential.user) {
      throw new Error("No user returned from authentication");
    }
    
    return userCredential.user;
  } catch (error) {
    console.error("Authentication error:", error);
    
    let errorMessage = "Login failed";
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/user-disabled":
        errorMessage = "Account disabled";
        break;
      case "auth/user-not-found":
        errorMessage = "No account found with this email";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many attempts. Account temporarily locked";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection";
        break;
      default:
        errorMessage = error.message || "Authentication failed";
    }
    
    throw new Error(errorMessage);
  }
};

export const logoutDoctor = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed: " + (error.message || "Please try again"));
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};