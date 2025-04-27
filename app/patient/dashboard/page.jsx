"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db, getAppointments, getMedicalHistory } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClipboardList, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import DoctorMap from "@/components/doctor-map"
import MedicalHistoryModal from "@/components/medical-history-modal"
import BookingModal from "@/components/booing-modal"


export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingOpen, setBookingOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you'd get the current user ID from auth
        const userId = "current-user-id"
        const userAppointments = await getAppointments(userId)
        const userMedicalHistory = await getMedicalHistory(userId)

        setAppointments(userAppointments)
        setMedicalRecords(userMedicalHistory)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleBookingComplete = async () => {
    // Refresh appointments after booking
    const userId = "current-user-id"
    const userAppointments = await getAppointments(userId)
    setAppointments(userAppointments)
    setBookingOpen(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()
            if (userData.role === "patient") {
              setUser({ uid: currentUser.uid, ...userData })
            } else {
              // Not a patient, redirect to login
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
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-3 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-600">MediConnect</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-6">Patient Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Appointments</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p>You have no upcoming appointments</p>
                
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Medical Records</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p>No medical records found</p>
                
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Find Doctors</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p>Find specialists in your area</p>
                {/* <Button className="mt-4">Search Doctors</Button> */}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/symptom-analysis" className="block">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="py-4">
                  <CardTitle className="flex items-center">
                    <ClipboardList className="mr-2" /> Symptom Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">Describe your symptoms for AI-powered analysis</CardContent>
              </Card>
            </Link>
            <Link href="/report-analysis" className="block">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="py-4">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2" /> Report Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">Upload medical reports for AI interpretation</CardContent>
              </Card>
            </Link>
          </div>

          <div className="mb-6">
            <DoctorMap />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Appointments Card */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <p>Loading appointments...</p>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <p className="font-medium">Dr. {appointment.doctorName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                        <p className="text-sm mt-2">{appointment.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p>You have no upcoming appointments</p>
                    <Button className="mt-4" onClick={() => setBookingOpen(true)}>
                      Book Appointment
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Medical Records Card */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Medical Records</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <p>Loading medical records...</p>
                ) : (
                  <>
                    <p>
                      {medicalRecords.length > 0
                        ? `${medicalRecords.length} records available`
                        : "No medical records found"}
                    </p>
                    <Button className="mt-4" onClick={() => setHistoryOpen(true)}>
                      View Medical History
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} onBookingComplete={handleBookingComplete} />
      <MedicalHistoryModal open={historyOpen} onOpenChange={setHistoryOpen} medicalRecords={medicalRecords} />
    </div>
  )
}
