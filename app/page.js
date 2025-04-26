import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import TestimonialSection from "@/components/testimonial-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-emerald-600"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <h1 className="text-2xl font-bold text-emerald-600">MediConnect</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="font-medium hover:text-emerald-600">
            Home
          </Link>
          <Link href="/doctors" className="font-medium hover:text-emerald-600">
            Find Doctors
          </Link>
          <Link href="/about" className="font-medium hover:text-emerald-600">
            About
          </Link>
          <Link href="/contact" className="font-medium hover:text-emerald-600">
            Contact
          </Link>
        </nav>
        <div className="flex space-x-3">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>

      <main>
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
      </main>

      <footer className="bg-gray-100 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">MediConnect</h3>
              <p className="text-gray-600">Connecting patients with the best healthcare professionals.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-emerald-600">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="text-gray-600 hover:text-emerald-600">
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/symptom-analyzer" className="text-gray-600 hover:text-emerald-600">
                    Symptom Analyzer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Doctors</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/doctor/register" className="text-gray-600 hover:text-emerald-600">
                    Register as Doctor
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/login" className="text-gray-600 hover:text-emerald-600">
                    Doctor Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-600">
                Email: info@mediconnect.com
                <br />
                Phone: +1 (123) 456-7890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} MediConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
