import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

async function testKey(key) {
  const app = initializeApp({
    apiKey: key,
    authDomain: "my-portfolio-946a9.firebaseapp.com",
    projectId: "my-portfolio-946a9",
  }, key); // Use key as app name to isolate
  
  const auth = getAuth(app);
  try {
    await signInWithEmailAndPassword(auth, "test@test.com", "test");
    console.log(`Key ${key} is VALID! (got something other than api-key-not-valid)`);
  } catch (e) {
    if (e.code === 'auth/api-key-not-valid') {
      console.log(`Key ${key} is INVALID.`);
    } else {
      console.log(`Key ${key} is VALID! (Error: ${e.code})`);
    }
  }
}

const keysToTest = [
  "AIzaSyC_EIPZVphY-RHJLl49hCKwGxvykvl0uSY", // E, I, P ... l, 0
  "AIzaSyC_ElPZVphY-RHJLl49hCKwGxvykvl0uSY", // E, l, P ... l, 0
  "AIzaSyC_EIPZVphY-RHJLl49hCKwGxvykvlouSY", // E, I, P ... l, o
  "AIzaSyC_ElPZVphY-RHJLl49hCKwGxvykvlouSY", // E, l, P ... l, o
  "AIzaSyC_EIPZVphY-RHJLl49hCKwGxvykv10uSY", // E, I, P ... 1, 0
  "AIzaSyC_ElPZVphY-RHJLl49hCKwGxvykv10uSY", // E, l, P ... 1, 0
  "AIzaSyC_EIPZVphY-RHJL149hCKwGxvykvl0uSY", // E, I, P ... RHJL149... l, 0
  "AIzaSyC_EIPZVphY-RHJLI49hCKwGxvykvl0uSY", // E, I, P ... RHJLI49... l, 0
  "AIzaSyC_EIPZVphY-RHJLl49hCKwGxvykvlOuSY", // E, I, P ... l, O
  "AIzaSyC_EIPZVphY-RHJLI49hCKwGxvykvlouSY",
];

async function run() {
  for (const k of keysToTest) {
    await testKey(k);
  }
  process.exit(0);
}

run();
