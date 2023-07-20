import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkP-ZXPPi8thNBDeNQ2V_4XiurCUCZxjM",
  authDomain: "emtruck-557d1.firebaseapp.com",
  projectId: "emtruck-557d1",
  storageBucket: "emtruck-557d1.appspot.com",
  messagingSenderId: "755291965614",
  appId: "1:755291965614:web:ed0adadf17c7acbe22053f",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
