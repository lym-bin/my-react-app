// src/firebase.ts
// Firebase 프로젝트 접속 통로, auth/db를 다른 파일들에 내보냄(export)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// 어느 Firebase 프로젝트에 연결할지 알려주는 정보
const firebaseConfig = {
  apiKey: "AIzaSyDfqZ1utjtlCwF4qPZvwYrpl-Ab-iazGc8",
  authDomain: "objet-b-shop.firebaseapp.com",
  projectId: "objet-b-shop",
  storageBucket: "objet-b-shop.firebasestorage.app",
  messagingSenderId: "325589230027",
  appId: "1:325589230027:web:aab4e2f95c56e326e8164e",
  measurementId: "G-R0TTFMV5RP",
};

// 접속 + 서비스별 통로 발급
const app = initializeApp(firebaseConfig); // Firebase 프로젝트에 접속
export const auth = getAuth(app); // 인증 서비스 통로
export const analytics = getAnalytics(app); // 분석 서비스 통로
export const db = getFirestore(app); // DB 서비스 통로
