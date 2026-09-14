// src/firebase.ts
// Firebase 프로젝트 접속 통로, auth/db를 다른 파일들에 내보냄
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfqZ1utjtlCwF4qPZvwYrpl-Ab-iazGc8",
  authDomain: "objet-b-shop.firebaseapp.com",
  projectId: "objet-b-shop",
  storageBucket: "objet-b-shop.firebasestorage.app",
  messagingSenderId: "325589230027",
  appId: "1:325589230027:web:aab4e2f95c56e326e8164e",
  measurementId: "G-R0TTFMV5RP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
