"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { auth, db, storage } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const specialties = [
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

export default function DoctorRegister() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    experience: "",
    city: "",
    cnic: "",
    phone: "",
    bio: "",
    education: "",
    licenseNumber: "",
    profileImage: null,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "profileImage" && files.length > 0) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all required fields")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.specialty || !formData.experience || !formData.city || !formData.cnic || !formData.phone) {
      setError("Please fill all required fields")
      return false
    }
    return true
  }

  const nextStep = () => {
    setError("")
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const prevStep = () => {
    setError("")
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.bio || !formData.education || !formData.licenseNumber) {
      setError("Please fill all required fields")
      return
    }

    try {
      setLoading(true)

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      let profileImageUrl = ""

      // Upload profile image if provided
      if (formData.profileImage) {
        const imageRef = ref(storage, `doctor-profiles/${userCredential.user.uid}`)
        await uploadBytes(imageRef, formData.profileImage)
        profileImageUrl = await getDownloadURL(imageRef)
      }

      // Save doctor data
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: "doctor",
        specialty: formData.specialty,
        experience: formData.experience,
        city: formData.city,
        cnic: formData.cnic,
        phone: formData.phone,
        bio: formData.bio,
        education: formData.education,
        licenseNumber: formData.licenseNumber,
        profileImage: profileImageUrl,
        verified: false, // Doctors need verification by admin
        createdAt: new Date().toISOString(),
      })

      router.push("/doctor/pending-verification")
    } catch (error) {
      console.error("Registration error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Doctor Registration</CardTitle>
          <CardDescription className="text-center">Join our platform as a healthcare professional</CardDescription>
          <div className="flex justify-center mt-4">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
            {step === 1 && (
              <div className="space-y-4">
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
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select
                    name="specialty"
                    value={formData.specialty}
                    onValueChange={(value) => handleSelectChange("specialty", value)}
                    required
                  >
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
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC / National ID</Label>
                  <Input
                    id="cnic"
                    name="cnic"
                    placeholder="XXXXX-XXXXXXX-X"
                    required
                    value={formData.cnic}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (123) 456-7890"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about your professional background and expertise"
                    rows={4}
                    required
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education & Qualifications</Label>
                  <Textarea
                    id="education"
                    name="education"
                    placeholder="List your degrees, certifications, and qualifications"
                    rows={3}
                    required
                    value={formData.education}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Medical License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image</Label>
                  <Input id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleChange} />
                </div>
                <div className="pt-4 flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Complete Registration"}
                  </Button>
                </div>
              </div>
            )}
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
