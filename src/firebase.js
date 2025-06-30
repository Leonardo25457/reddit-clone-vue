import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8RzIz0TY0GMBl93_Kvmi3uHyl1yLuwJ4",
  authDomain: "reddit-aut-test.firebaseapp.com",
  projectId: "reddit-aut-test",
  appId: "1:104635255993:web:12fbf06c7a9aa668d91f68",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
