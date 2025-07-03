// src/Utils/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4ZQ_hkrHpEEK3txELtPoTXEqXku-bIT8",
  authDomain: "ems-dashboard-105f7.firebaseapp.com",
  projectId: "ems-dashboard-105f7",
  storageBucket: "ems-dashboard-105f7.firebasestorage.app",
  messagingSenderId: "967794875589",
  appId: "1:967794875589:web:bbb2b4e44fe8d1175624ac",
  measurementId: "G-QQX10QYDRL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
