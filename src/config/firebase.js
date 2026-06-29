import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC_EIPZVPhY-RHJLl49hCKwGxvykv1ouSY",
  authDomain: "my-portfolio-946a9.firebaseapp.com",
  projectId: "my-portfolio-946a9",
  storageBucket: "my-portfolio-946a9.firebasestorage.app",
  messagingSenderId: "258358649196",
  appId: "1:258358649196:web:f7dcf6c63dafb532645349",
  measurementId: "G-ZQJ5LFQFN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
