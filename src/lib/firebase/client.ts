import 'client-only'
import { Analytics, getAnalytics, isSupported } from "@firebase/analytics";
import { getApp, getApps, initializeApp } from "@firebase/app";
import { GoogleAuthProvider, getAuth } from "@firebase/auth"

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Google Authentication Provider
const googleProvider = new GoogleAuthProvider()

// Initialize Analytics
let analytics: Analytics;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes && process.env.NODE_ENV === 'production') {
      analytics = getAnalytics(getApp());
    }
  });
}

// Initialize Firebase Client App
!getApps().length && initializeApp(firebaseConfig);

// Get and export auth object
const auth = getAuth()

export {
  googleProvider,
  auth
}
