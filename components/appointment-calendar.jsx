"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Star } from "lucide-react"

const specialties = [
  "All Specialties",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Obstetrics",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Urology",
]

export default function DoctorList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [specialty, setSpecialty] = useState("All Specialties")
  const [city, setCity] = useState("")

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "doctor"), where("verified", "==", true))

        const querySnapshot = await getDocs(q)
        const doctorList = []

        querySnapshot.forEach((doc) => {
          doctorList.push({ id: doc.id, ...doc.data() })
        })

        setDoctors(doctorList)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // Mock data for demonstration
  const mockDoctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      city: "New York",
      experience: "15",
      rating: 4.8,
      profileImage: "",
      availableSlots: 5,
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Dermatology",
      city: "Los Angeles",
      experience: "10",
      rating: 4.6,
      profileImage: "",
      availableSlots: 3,
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialty: "Neurology",
      city: "Chicago",
      experience: "12",
      rating: 4.9,
      profileImage: "",
      availableSlots: 0,
    },
    {
      id: "4",
      name: "Dr. James Wilson",
      specialty: "Pediatrics",
      city: "Boston",
      experience: "8",
      rating: 4.7,
      profileImage: "",
      availableSlots: 7,
    },
    {
      id: "5",
      name: "Dr. Sophia Lee",
      specialty: "Psychiatry",
      city: "San Francisco",
      experience: "14",
      rating: 4.5,
      profileImage: "",
      availableSlots: 4,
    },
  ]

  // Use mock data for demonstration
  const displayDoctors = mockDoctors

  const filteredDoctors = displayDoctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = specialty === "All Specialties" || doctor.specialty === specialty
    const matchesCity = !city || doctor.city.toLowerCase().includes(city.toLowerCase())

    return matchesSearch && matchesSpecialty && matchesCity
  })

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input
            placeholder="Filter by city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 bg-emerald-50 p-6 flex justify-center items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={doctor.profileImage || "/placeholder.svg"} alt={doctor.name} />
                      <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-800">
                        {getInitials(doctor.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-emerald-600">{doctor.specialty}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{doctor.city}</span>
                    </div>

                    <div className="mt-2 text-sm">
                      <span className="text-gray-700">{doctor.experience} years experience</span>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        {doctor.availableSlots > 0 ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            {doctor.availableSlots} slots available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-500 border-red-200">
                            No slots available
                          </Badge>
                        )}
                      </div>
                      <Button
                        disabled={doctor.availableSlots === 0}
                        variant={doctor.availableSlots === 0 ? "outline" : "default"}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No doctors found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
