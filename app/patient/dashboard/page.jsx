"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PatientNavbar from "@/components/patient-navbar"
import SymptomAnalyzer from "@/components/symptom-analyzer"
import AppointmentList from "@/components/appointment-list"
import DoctorList from "@/components/doctor-list"

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))

          if (userDoc.exists() && userDoc.data().role === "patient") {
            setUser({ uid: currentUser.uid, ...userDoc.data() })
          } else {
            // Not a patient, redirect to login
            await auth.signOut()
            router.push("/login")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        // Not logged in, redirect to login
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientNavbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">3</div>
              <p className="text-sm text-gray-500">Next: Dr. Smith, Tomorrow 10:00 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Medical Reports</CardTitle>
              <CardDescription>Your recent medical reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">5</div>
              <p className="text-sm text-gray-500">Last updated: 3 days ago</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Premium Status</CardTitle>
              <CardDescription>Your subscription status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-amber-600">Free Plan</div>
              <Button variant="outline" size="sm" className="mt-2">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="appointments">My Appointments</TabsTrigger>
            <TabsTrigger value="doctors">Find Doctors</TabsTrigger>
            <TabsTrigger value="symptom-analyzer">Symptom Analyzer</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
                <CardDescription>Manage your upcoming and past appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentList userId={user.uid} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card>
              <CardHeader>
                <CardTitle>Find Doctors</CardTitle>
                <CardDescription>Browse and connect with specialized doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <DoctorList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptom-analyzer">
            <Card>
              <CardHeader>
                <CardTitle>Symptom Analyzer</CardTitle>
                <CardDescription>Describe your symptoms to get AI-powered insights</CardDescription>
              </CardHeader>
              <CardContent>
                <SymptomAnalyzer userId={user.uid} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
