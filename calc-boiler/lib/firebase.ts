import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDa3QRgFSOCuuW1dBxRhtG32Oo-y4MQKNc",
  authDomain: "paycalculatoraustralia-965d5.firebaseapp.com",
  projectId: "paycalculatoraustralia-965d5",
  storageBucket: "paycalculatoraustralia-965d5.firebasestorage.app",
  messagingSenderId: "1011941023587",
  appId: "1:1011941023587:web:46ae16afe07ff37997bd56",
  measurementId: "G-8WE507LD32",
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics only in the browser
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
