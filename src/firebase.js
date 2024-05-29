
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCbgpl89HFc1-SaOthC0QeCUrZz6vE4SMQ",
  authDomain: "chat-65f7d.firebaseapp.com",
  projectId: "chat-65f7d",
  storageBucket: "chat-65f7d.appspot.com",
  messagingSenderId: "527637965334",
  appId: "1:527637965334:web:e8c679e2ab82b0966ee337"
};


 export const app = initializeApp(firebaseConfig);
 export const auth=getAuth();
 export const storage = getStorage();
 export const db=getFirestore()
