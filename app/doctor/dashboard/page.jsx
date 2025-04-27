"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function DoctorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            if (userData.role === "doctor") {
              setUser({ uid: currentUser.uid, ...userData })
            } else {
              // Not a doctor, redirect to login
              router.push("/login")
            }
          } else {
            setError("User data not found")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setError("Error retrieving user data")
        }
      } else {
        // Not logged in, redirect to login
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          Back to Login
        </Button>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-600">MediConnect</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, Dr. {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-8">
        <h2 className="text-2xl font-bold mb-6">Doctor Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You have no upcoming appointments</p>
              <Button className="mt-4">Manage Schedule</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No patients assigned yet</p>
              <Button className="mt-4">View Patients</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Specialty: {user.specialty}</p>
              <p>Experience: {user.experience} years</p>
              <Button className="mt-4">Edit Profile</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
