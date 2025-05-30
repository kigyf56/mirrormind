
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCrgi7BhG7D6XXzuvHUXz8rLlb-B4kgT8E",
  authDomain: "mirrormind-00.firebaseapp.com",
  databaseURL: "https://mirrormind-00-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mirrormind-00",
  storageBucket: "mirrormind-00.firebasestorage.app",
  messagingSenderId: "34866976120",
  appId: "1:34866976120:web:3f4ffc56cb2980fd54248d",
  measurementId: "G-G0PMBR4XGW"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
