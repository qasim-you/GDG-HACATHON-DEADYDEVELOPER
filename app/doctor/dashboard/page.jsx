"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import MedicalHistoryModal from "@/components/medical-history-modal"
import { getAppointments, getMedicalHistory } from "@/lib/firebase"
import Link from "next/link"
import BookingModal from "@/components/booing-modal"
import AddDoctorModal from "@/components/add-doctor-modal"

export default function DoctorDashboard() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="container mx-auto py-10 mx-3">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        {/* <Link href="#">
          <Button variant="outline">Manage Doctors</Button>
        </Link> */}
      
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
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
          <CardHeader>
            <CardTitle className="text-lg">Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
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

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} onBookingComplete={handleBookingComplete} />

      <MedicalHistoryModal open={historyOpen} onOpenChange={setHistoryOpen} medicalRecords={medicalRecords} />
    </div>
  )
}
