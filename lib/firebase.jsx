// Simple Firebase setup with proper initialization
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
}

// Initialize Firebase
let app
let auth
let db
let googleProvider

// Only initialize Firebase on the client side
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()

    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export { auth, db, googleProvider }
