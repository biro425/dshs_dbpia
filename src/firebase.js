import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA9yvIHfOmrIV-KLpm_BBEDG0VFrUnf7Z0",
    authDomain: "dshs-f8a92.firebaseapp.com",
    projectId: "dshs-f8a92",
    storageBucket: "dshs-f8a92.appspot.com",
    messagingSenderId: "736840004259",
    appId: "1:736840004259:web:2f6e89f3bcdbf431970516",
    measurementId: "G-WKNY95BRGY"
  };

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 객체 내보내기
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); 