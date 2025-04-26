"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DoctorNavbar from "@/components/doctor-navbar"
import AppointmentCalendar from "@/components/appointment-calendar"
import PatientList from "@/components/patient-list"

export default function DoctorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))

          if (userDoc.exists() && userDoc.data().role === "doctor") {
            setUser({ uid: currentUser.uid, ...userDoc.data() })
          } else {
            // Not a doctor, redirect to login
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
      <DoctorNavbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Appointments</CardTitle>
              <CardDescription>Your scheduled appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">5</div>
              <p className="text-sm text-gray-500">Next: John Doe, 10:00 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Patients</CardTitle>
              <CardDescription>Number of patients under your care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">42</div>
              <p className="text-sm text-gray-500">3 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Verification Status</CardTitle>
              <CardDescription>Your account verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-green-600">Verified</div>
              <p className="text-sm text-gray-500">Approved on {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">My Patients</TabsTrigger>
            <TabsTrigger value="availability">Manage Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Calendar</CardTitle>
                <CardDescription>Manage your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentCalendar doctorId={user.uid} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
                <CardDescription>View and manage your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientList doctorId={user.uid} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Manage Availability</CardTitle>
                <CardDescription>Set your working hours and available slots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Configure your working days, hours, and appointment duration to automatically generate available
                    slots for patients to book.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Working Days</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                          <Button key={day} variant="outline" className="flex-1">
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Working Hours</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Start Time</p>
                          <Button variant="outline" className="w-full">
                            9:00 AM
                          </Button>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">End Time</p>
                          <Button variant="outline" className="w-full">
                            5:00 PM
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full md:w-auto">Save Availability</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
