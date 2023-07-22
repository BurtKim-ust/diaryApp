import { getAuth, signOut } from "firebase/auth";

export const logout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully!");
      // You can add additional actions after logout if needed
    })
    .catch((error) => {
      console.log("Error signing out:", error);
    });
};