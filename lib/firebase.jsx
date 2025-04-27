// Simple Firebase setup with proper initialization
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore"

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

// Add a new appointment
export async function addAppointment(appointmentData) {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appointmentData,
      createdAt: Timestamp.now(),
    })
    return { id: docRef.id, ...appointmentData }
  } catch (error) {
    console.error("Error adding appointment: ", error)
    throw error
  }
}

// Get appointments for a user
export async function getAppointments(userId) {
  try {
    const appointmentsRef = collection(db, "appointments")
    const q = query(
      appointmentsRef,
      where("userId", "==", userId),
      where("date", ">=", new Date().toISOString()),
      orderBy("date", "asc"),
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting appointments: ", error)
    throw error
  }
}

// Get medical history for a user
export async function getMedicalHistory(userId) {
  try {
    const medicalRecordsRef = collection(db, "medicalRecords")
    const q = query(medicalRecordsRef, where("userId", "==", userId), orderBy("date", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting medical records: ", error)
    throw error
  }
}

// Get all doctors
export async function getDoctors() {
  try {
    const doctorsRef = collection(db, "doctors")
    const querySnapshot = await getDocs(doctorsRef)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting doctors: ", error)
    throw error
  }
}

// Add a new doctor
export async function addDoctor(doctorData) {
  try {
    const docRef = await addDoc(collection(db, "doctors"), {
      ...doctorData,
      createdAt: Timestamp.now(),
    })
    return { id: docRef.id, ...doctorData }
  } catch (error) {
    console.error("Error adding doctor:", error)
    throw error
  }
}

export { auth, db, googleProvider }
