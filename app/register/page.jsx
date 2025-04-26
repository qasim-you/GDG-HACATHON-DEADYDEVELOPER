'use client';

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: "patient",
        createdAt: new Date().toISOString(),
      })

      router.push("/patient/dashboard")
    } catch (error) {
      console.error("Registration error:", error)

      // Handle specific Firebase errors with user-friendly messages
      if (error.code === "auth/operation-not-allowed") {
        setError("Email/password sign-up is not enabled. Please contact the administrator.")
      } else if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email or try logging in.")
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.")
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address. Please check your email and try again.")
      } else {
        setError(error.message || "An error occurred during registration. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError("")

      const result = await signInWithPopup(auth, googleProvider)

      // Check if user already exists
      const userRef = doc(db, "users", result.user.uid)

      await setDoc(
        userRef,
        {
          name: result.user.displayName,
          email: result.user.email,
          role: "patient",
          createdAt: new Date().toISOString(),
        },
        { merge: true },
      )

      router.push("/patient/dashboard")
    } catch (error) {
      console.error("Google sign-in error:", error)

      // Handle specific Firebase errors for Google sign-in
      if (error.code === "auth/operation-not-allowed") {
        setError("Google sign-in is not enabled. Please contact the administrator.")
      } else if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completing the sign-in.")
      } else {
        setError(error.message || "An error occurred during Google sign-in. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="MediConnect Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-sky-700">MediConnect</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-sky-900 transition-colors hover:text-sky-700">
              Home
            </Link>
            <Link href="/doctors" className="text-sm font-medium text-gray-600 transition-colors hover:text-sky-700">
              Find Doctors
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 transition-colors hover:text-sky-700">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 transition-colors hover:text-sky-700">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-sky-700 hover:bg-sky-800">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Healthcare professionals"
            fill
            className="object-cover brightness-[0.85]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/80 to-sky-700/60" />
        </div>

        <div className="container relative">
          <div className="max-w-2xl space-y-6 text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Healthcare Made <span className="text-sky-300">Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100">
              Connect with trusted healthcare professionals and manage your health journey with ease. Personalized care
              at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-sky-900 hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link href="/doctors">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Find Doctors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-sky-700">2,500+</p>
              <p className="text-sm text-gray-600">Verified Doctors</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-sky-700">15,000+</p>
              <p className="text-sm text-gray-600">Satisfied Patients</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-sky-700">98%</p>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-sky-700">24/7</p>
              <p className="text-sm text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform offers a range of features designed to make healthcare accessible, convenient, and
              personalized to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-sky-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Find Specialists</h3>
              <p className="text-gray-600">
                Search and connect with specialized healthcare professionals based on your specific needs, location, and
                availability.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-sky-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Easy Scheduling</h3>
              <p className="text-gray-600">
                Book appointments instantly with our intuitive scheduling system. Receive reminders and manage your
                healthcare calendar effortlessly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                <Video className="h-6 w-6 text-sky-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Virtual Consultations</h3>
              <p className="text-gray-600">
                Connect with healthcare professionals from the comfort of your home through secure video consultations
                and follow-ups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How MediConnect Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Getting the healthcare you need is simple and straightforward with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and create your health profile with your medical history and preferences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Your Doctor</h3>
              <p className="text-gray-600">
                Search for specialists based on your needs, read reviews, and check availability
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sky-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Book & Connect</h3>
              <p className="text-gray-600">
                Schedule appointments and connect through in-person visits or virtual consultations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that works best for you and your healthcare needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-300">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">$19</span>
                  <span className="ml-1 text-xl text-gray-500">/month</span>
                </div>
                <p className="mt-5 text-gray-500">Perfect for individuals seeking essential healthcare access.</p>
              </div>

              <div className="border-t border-gray-200 px-8 py-6">
                <ul className="space-y-4">
                  {[
                    "Access to all doctors",
                    "Basic health tracking",
                    "Email support",
                    "Up to 2 consultations/month",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-sky-700 shrink-0 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 px-8 py-6">
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full">
                    Choose Basic
                  </Button>
                </Link>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="bg-white rounded-xl shadow-md border-2 border-sky-700 overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-sky-700 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">Standard</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">$39</span>
                  <span className="ml-1 text-xl text-gray-500">/month</span>
                </div>
                <p className="mt-5 text-gray-500">Ideal for families and individuals with regular healthcare needs.</p>
              </div>

              <div className="border-t border-gray-200 px-8 py-6">
                <ul className="space-y-4">
                  {[
                    "Access to all doctors",
                    "Advanced health tracking",
                    "Priority support",
                    "Up to 5 consultations/month",
                    "Family member accounts",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-sky-700 shrink-0 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 px-8 py-6">
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-sky-700 hover:bg-sky-800">Choose Standard</Button>
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-300">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">$59</span>
                  <span className="ml-1 text-xl text-gray-500">/month</span>
                </div>
                <p className="mt-5 text-gray-500">Comprehensive coverage for those who prioritize healthcare.</p>
              </div>

              <div className="border-t border-gray-200 px-8 py-6">
                <ul className="space-y-4">
                  {[
                    "Access to all doctors",
                    "Comprehensive health tracking",
                    "24/7 priority support",
                    "Unlimited consultations",
                    "Family member accounts",
                    "Exclusive health resources",
                    "Wellness programs",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-sky-700 shrink-0 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 px-8 py-6">
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full">
                    Choose Premium
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600">
              Hear from patients who have transformed their healthcare experience with MediConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="User"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "MediConnect has completely changed how I manage my healthcare. Finding specialists and booking
                appointments is now effortless."
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="User"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Family Plan User</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a busy parent, the virtual consultations have been a game-changer. My family gets quality care
                without the hassle of travel and waiting rooms."
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="User"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Dr. Emily Rodriguez</h4>
                  <p className="text-sm text-gray-500">Healthcare Provider</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The platform allows me to connect with patients efficiently and provide better continuity of care. The
                scheduling system is intuitive and reliable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sky-700">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to transform your healthcare experience?
            </h2>
            <p className="text-xl text-sky-100 mb-8">
              Join thousands of satisfied users who have made healthcare simple and accessible.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-sky-900 hover:bg-gray-100">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-sky-800">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="MediConnect Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="text-xl font-bold text-white">MediConnect</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting patients with trusted healthcare professionals, making healthcare accessible and
                personalized.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="text-gray-400 hover:text-white transition">
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Doctors</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/doctor/register" className="text-gray-400 hover:text-white transition">
                    Join as Doctor
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/login" className="text-gray-400 hover:text-white transition">
                    Doctor Login
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/resources" className="text-gray-400 hover:text-white transition">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <span className="mr-2">📧</span>
                  <span>info@mediconnect.com</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📱</span>
                  <span>+1 (123) 456-7890</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🏢</span>
                  <span>123 Healthcare Ave, Medical District, CA 90210</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} MediConnect. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
                <Link href="/accessibility" className="text-sm text-gray-400 hover:text-white transition">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}