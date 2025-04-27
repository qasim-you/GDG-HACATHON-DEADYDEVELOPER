"use client"

import { useState } from "react"
import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const specialties = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Psychiatry", "Other"]

export default function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    experience: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, specialty: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.specialty || !formData.experience) {
      setError("Please fill all required fields")
      return
    }

    try {
      setLoading(true)

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      // Save doctor data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: "doctor",
        specialty: formData.specialty,
        experience: formData.experience,
        verified: true, // For demo, set to true so doctor can access dashboard immediately
        createdAt: new Date().toISOString(),
      })

      // Redirect to doctor dashboard
      window.location.href = "/doctor/dashboard"
    } catch (error) {
      console.error("Registration error:", error)
      setError("Registration failed: " + (error.message || "Please try again"))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Doctor Registration</CardTitle>
          <CardDescription className="text-center">Join our platform as a healthcare professional</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Dr. John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="doctor@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={formData.specialty} onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="1"
                required
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register as Doctor"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-medium">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
