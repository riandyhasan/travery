// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

const API_KEY = Constants?.manifest?.extra?.apiKey;
const AUTH_DOMAIN = Constants?.manifest?.extra?.authDomain;
const PROJECT_ID = Constants?.manifest?.extra?.projectId;
const STORAGE_BUCKET = Constants?.manifest?.extra?.storageBucket;
const MESSAGING_SENDER_ID = Constants?.manifest?.extart?.messagingSenderId;
const APP_ID = Constants?.manifest?.extra?.appId;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };
