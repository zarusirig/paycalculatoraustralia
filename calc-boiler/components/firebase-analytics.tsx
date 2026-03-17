"use client";

import { useEffect } from "react";
import { app } from "@/lib/firebase";
import { getAnalytics, isSupported } from "firebase/analytics";

export default function FirebaseAnalytics() {
  useEffect(() => {
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    });
  }, []);

  return null;
}
