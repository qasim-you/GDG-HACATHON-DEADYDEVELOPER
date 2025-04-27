"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"

// Create context
const AuthContext = createContext({
  user: null,
  userRole: null,
  isLoading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  googleSignIn: async () => {},
  clearError: () => {},
})

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Clear error
  const clearError = () => setError(null)

  // Sign up with email and password
  const signUp = async (email, password, userData) => {
    try {
      setIsLoading(true)
      clearError()

      if (!auth) {
        throw new Error("Firebase auth is not initialized")
      }

      // Set persistence to LOCAL to keep the user logged in
      await setPersistence(auth, browserLocalPersistence)

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Save additional user data to Firestore
      if (db) {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          ...userData,
          email,
          createdAt: new Date().toISOString(),
        })
      }

      // Redirect based on role
      if (userData.role === "doctor") {
        window.location.href = "/doctor/pending-verification"
      } else {
        window.location.href = "/patient/dashboard"
      }

      return userCredential.user
    } catch (error) {
      console.error("Sign up error:", error)
      setError(formatAuthError(error))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign in with email and password
  const signIn = async (email, password, expectedRole = null) => {
    try {
      setIsLoading(true)
      clearError()

      if (!auth) {
        throw new Error("Firebase auth is not initialized")
      }

      // Set persistence to LOCAL to keep the user logged in
      await setPersistence(auth, browserLocalPersistence)

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Check role if expected role is provided
      if (expectedRole && db) {
        try {
          const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()

            if (userData.role !== expectedRole) {
              await firebaseSignOut(auth)
              setError(`This account is not registered as a ${expectedRole}. Please use the correct login.`)
              return null
            }

            // Redirect based on role
            if (userData.role === "doctor") {
              if (userData.verified) {
                window.location.href = "/doctor/dashboard"
              } else {
                window.location.href = "/doctor/pending-verification"
              }
            } else {
              window.location.href = "/patient/dashboard"
            }

            return userCredential.user
          } else {
            setError("User data not found")
            await firebaseSignOut(auth)
            return null
          }
        } catch (firestoreError) {
          console.error("Firestore error:", firestoreError)
          setError("Error retrieving user data. Please try again.")
          return null
        }
      }

      return userCredential.user
    } catch (error) {
      console.error("Sign in error:", error)
      setError(formatAuthError(error))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Sign in with Google
  const googleSignIn = async () => {
    try {
      setIsLoading(true)
      clearError()

      if (!auth || !googleProvider || !db) {
        throw new Error("Firebase is not fully initialized")
      }

      // Set persistence to LOCAL to keep the user logged in
      await setPersistence(auth, browserLocalPersistence)

      const result = await signInWithPopup(auth, googleProvider)

      // Check if user exists
      const userDoc = await getDoc(doc(db, "users", result.user.uid))

      if (userDoc.exists()) {
        const userData = userDoc.data()

        // Redirect based on role
        if (userData.role === "doctor") {
          if (userData.verified) {
            window.location.href = "/doctor/dashboard"
          } else {
            window.location.href = "/doctor/pending-verification"
          }
        } else {
          window.location.href = "/patient/dashboard"
        }
      } else {
        // Create new user document for first-time Google sign-ins (default to patient)
        await setDoc(doc(db, "users", result.user.uid), {
          name: result.user.displayName || "User",
          email: result.user.email,
          role: "patient",
          createdAt: new Date().toISOString(),
        })

        window.location.href = "/patient/dashboard"
      }

      return result.user
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError(formatAuthError(error))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true)
      if (auth) {
        await firebaseSignOut(auth)
      }
      setUser(null)
      setUserRole(null)
      window.location.href = "/login"
    } catch (error) {
      console.error("Sign out error:", error)
      setError(formatAuthError(error))
    } finally {
      setIsLoading(false)
    }
  }

  // Format auth error messages
  const formatAuthError = (error) => {
    const errorCode = error.code || ""

    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please use a different email or try logging in."
      case "auth/invalid-email":
        return "Invalid email address. Please check your email and try again."
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support."
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password. Please try again."
      case "auth/too-many-requests":
        return "Too many unsuccessful login attempts. Please try again later."
      case "auth/weak-password":
        return "Password is too weak. Please use a stronger password."
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed before completing the sign-in."
      case "auth/operation-not-allowed":
        return "This sign-in method is not enabled. Please contact the administrator."
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection and try again."
      default:
        return error.message || "An error occurred. Please try again."
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe = () => {}

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        try {
          if (currentUser) {
            setUser(currentUser)

            // Get user role from Firestore
            if (db) {
              try {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid))

                if (userDoc.exists()) {
                  const userData = userDoc.data()
                  setUserRole(userData.role)
                } else {
                  console.warn("User document does not exist for authenticated user")
                  setUserRole(null)
                }
              } catch (firestoreError) {
                console.error("Error fetching user role:", firestoreError)
                setUserRole(null)
              }
            }
          } else {
            setUser(null)
            setUserRole(null)
          }
        } finally {
          setIsLoading(false)
        }
      })
    } else {
      setIsLoading(false)
    }

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    userRole,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    googleSignIn,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
