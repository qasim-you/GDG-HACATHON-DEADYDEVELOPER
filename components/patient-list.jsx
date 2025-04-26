"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Calendar, FileText } from "lucide-react"

export default function PatientList({ doctorId }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock patients data for demonstration
  const mockPatients = [
    {
      id: "1",
      name: "John Doe",
      age: 45,
      gender: "Male",
      lastVisit: "2025-04-15",
      condition: "Hypertension",
      upcomingAppointment: "2025-05-10",
    },
    {
      id: "2",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      lastVisit: "2025-04-20",
      condition: "Diabetes Type 2",
      upcomingAppointment: "2025-05-15",
    },
    {
      id: "3",
      name: "Robert Johnson",
      age: 58,
      gender: "Male",
      lastVisit: "2025-04-10",
      condition: "Arthritis",
      upcomingAppointment: null,
    },
    {
      id: "4",
      name: "Emily Davis",
      age: 27,
      gender: "Female",
      lastVisit: "2025-04-22",
      condition: "Asthma",
      upcomingAppointment: "2025-05-02",
    },
    {
      id: "5",
      name: "Michael Brown",
      age: 41,
      gender: "Male",
      lastVisit: "2025-04-18",
      condition: "Anxiety",
      upcomingAppointment: "2025-05-05",
    },
  ]

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search patients by name or condition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {filteredPatients.length > 0 ? (
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-emerald-100 text-emerald-800">
                      {getInitials(patient.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{patient.name}</h4>
                        <p className="text-sm text-gray-500">
                          {patient.age} years, {patient.gender}
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        {patient.condition}
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Last visit: {patient.lastVisit}</span>
                    </div>

                    {patient.upcomingAppointment && (
                      <div className="mt-1 flex items-center text-sm text-emerald-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Upcoming: {patient.upcomingAppointment}</span>
                      </div>
                    )}

                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline" className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Medical Records
                      </Button>
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No patients found matching your search</div>
      )}
    </div>
  )
}
