import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_ElPZVphY-RHJLl49hCKwGxvykvlouSY",
  authDomain: "my-portfolio-946a9.firebaseapp.com",
  projectId: "my-portfolio-946a9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function registerAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "eshangunsekara@gmail.com", "Eshan@123");
    console.log("Admin user created successfully:", userCredential.user.uid);
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("Admin user already exists.");
      process.exit(0);
    } else {
      console.error("Error creating user:", error);
      process.exit(1);
    }
  }
}

registerAdmin();
