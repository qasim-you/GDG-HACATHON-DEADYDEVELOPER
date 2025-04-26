"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock } from "lucide-react"

export default function AppointmentList({ userId }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(collection(db, "appointments"), where("patientId", "==", userId), orderBy("date", "desc"))

        const querySnapshot = await getDocs(q)
        const appointmentList = []

        querySnapshot.forEach((doc) => {
          appointmentList.push({ id: doc.id, ...doc.data() })
        })

        setAppointments(appointmentList)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchAppointments()
    }
  }, [userId])

  // Mock data for demonstration
  const mockAppointments = [
    {
      id: "1",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2025-05-10",
      time: "10:00 AM",
      status: "upcoming",
    },
    {
      id: "2",
      doctorName: "Dr. Michael Chen",
      specialty: "Dermatology",
      date: "2025-05-15",
      time: "2:30 PM",
      status: "upcoming",
    },
    {
      id: "3",
      doctorName: "Dr. Emily Rodriguez",
      specialty: "Neurology",
      date: "2025-04-20",
      time: "11:15 AM",
      status: "completed",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  // Use mock data for demonstration
  const displayAppointments = mockAppointments

  return (
    <div>
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {displayAppointments.filter((a) => a.status === "upcoming").length > 0 ? (
            <div className="space-y-4">
              {displayAppointments
                .filter((a) => a.status === "upcoming")
                .map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{appointment.date}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                      <div>{getStatusBadge(appointment.status)}</div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="destructive">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming appointments</p>
              <Button className="mt-4">Book an Appointment</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {displayAppointments.filter((a) => a.status === "completed").length > 0 ? (
            <div className="space-y-4">
              {displayAppointments
                .filter((a) => a.status === "completed")
                .map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                        <p className="text-gray-600">{appointment.specialty}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{appointment.date}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                      <div>{getStatusBadge(appointment.status)}</div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">Book Again</Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No past appointments</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
