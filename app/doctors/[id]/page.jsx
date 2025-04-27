"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Award,
  GraduationCap,
  Languages,
  DollarSign,
  Building,
  Phone,
  Mail,
} from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Initialize Mapbox with your access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export default function DoctorProfile() {
  const params = useParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [map, setMap] = useState(null)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        // In a real app, fetch from Firestore
        // const docRef = doc(db, "users", params.id);
        // const docSnap = await getDoc(docRef);

        // if (docSnap.exists()) {
        //   setDoctor({ id: docSnap.id, ...docSnap.data() });
        // } else {
        //   router.push("/doctors");
        // }

        // For demo, use mock data
     

        setDoctor(doctor)
      } catch (error) {
        console.error("Error fetching doctor:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [params.id, router])

  // Initialize map when doctor data is loaded
  useEffect(() => {
    if (!doctor || !doctor.location || map) return

    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: "doctor-location-map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [doctor.location.longitude, doctor.location.latitude],
        zoom: 14,
      })

      newMap.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Create custom marker element
      const markerElement = document.createElement("div")
      markerElement.className = "doctor-marker"
      markerElement.style.width = "30px"
      markerElement.style.height = "30px"
      markerElement.style.borderRadius = "50%"
      markerElement.style.backgroundColor = "#10b981"
      markerElement.style.border = "3px solid white"
      markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"

      // Add marker to map
      new mapboxgl.Marker(markerElement)
        .setLngLat([doctor.location.longitude, doctor.location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 10px;">
              <h3 style="font-weight: bold; margin-bottom: 5px;">${doctor.name}</h3>
              <p style="color: #10b981; margin-bottom: 5px;">${doctor.specialty}</p>
              <p style="font-size: 12px; color: #666;">${doctor.address}</p>
            </div>
          `),
        )
        .addTo(newMap)

      setMap(newMap)
    }

    // Initialize map after a short delay to ensure the container is rendered
    const timer = setTimeout(initializeMap, 100)
    return () => clearTimeout(timer)
  }, [doctor, map])

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

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
          <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/doctors")}>Back to Doctors</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        &larr; Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Doctor Info */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-emerald-50 p-6 flex flex-col items-center justify-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={doctor.profileImage || "/placeholder.svg"} alt={doctor.name} />
                    <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-800">
                      {getInitials(doctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold text-center">{doctor.name}</h1>
                  <p className="text-emerald-600 text-center text-lg">{doctor.specialty}</p>

                  <div className="flex items-center mt-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">{doctor.rating} (32 reviews)</span>
                  </div>
                </div>

                <div className="md:w-2/3 p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {doctor.experience} Years Experience
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <MapPin className="h-3 w-3 mr-1" /> {doctor.city}
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <Languages className="h-3 w-3 mr-1" /> {doctor.languages}
                    </Badge>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">About</h2>
                    <p className="text-gray-700">{doctor.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-medium flex items-center text-gray-700 mb-2">
                        <GraduationCap className="h-4 w-4 mr-2 text-emerald-600" /> Education
                      </h3>
                      <p className="text-gray-600">{doctor.education}</p>
                    </div>

                    <div>
                      <h3 className="font-medium flex items-center text-gray-700 mb-2">
                        <Building className="h-4 w-4 mr-2 text-emerald-600" /> Hospital Affiliations
                      </h3>
                      <p className="text-gray-600">{doctor.hospitalAffiliations}</p>
                    </div>

                    {doctor.awards && (
                      <div>
                        <h3 className="font-medium flex items-center text-gray-700 mb-2">
                          <Award className="h-4 w-4 mr-2 text-emerald-600" /> Awards & Recognitions
                        </h3>
                        <p className="text-gray-600">{doctor.awards}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium flex items-center text-gray-700 mb-2">
                        <DollarSign className="h-4 w-4 mr-2 text-emerald-600" /> Consultation Fee
                      </h3>
                      <p className="text-gray-600">${doctor.consultationFee}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Calendar className="h-4 w-4 mr-2" /> Book Appointment
                    </Button>
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      <Phone className="h-4 w-4 mr-2" /> {doctor.phone}
                    </Button>
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      <Mail className="h-4 w-4 mr-2" /> Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="availability" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="availability" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Appointment Slots</CardTitle>
                  <CardDescription>Select a day and time to book your appointment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {doctor.availability.map((day) => (
                      <Card key={day.day} className="overflow-hidden">
                        <CardHeader className="p-4 bg-emerald-50">
                          <CardTitle className="text-center text-emerald-700">{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            {day.slots.map((slot) => (
                              <Button key={slot} variant="outline" className="w-full justify-start" onClick={() => {}}>
                                <Clock className="h-4 w-4 mr-2" /> {slot}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Reviews</CardTitle>
                  <CardDescription>See what other patients are saying</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {doctor.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{review.patient}</h3>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>{doctor.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div id="doctor-location-map" className="h-[400px] rounded-md"></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Book an Appointment</CardTitle>
              <CardDescription>Select a date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <Button key={day} variant="outline" className="w-full">
                      {day}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Available Times</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"].map((time) => (
                      <Button key={time} variant="outline" size="sm" className="w-full">
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Book Appointment</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">{doctor.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">{doctor.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">{doctor.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
