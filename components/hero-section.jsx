import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your Health, Our Priority</h1>
            <p className="text-xl text-gray-700 mb-8">
              Connect with specialized doctors, analyze your symptoms, and get the care you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Register as Patient
                </Button>
              </Link>
              <Link href="/doctor/register">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Join as Doctor
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
          <Image 
  src="/doctor.jpg"  // <-- yahan src"../" galat hai, sahi hai src="../"
  alt="Healthcare professionals"
  className="rounded-lg shadow-xl"
  width={500}
  height={400}
/>

            {/* <img
              src="/placeholder.svg?height=400&width=500"
              alt="Healthcare professionals"
              className="rounded-lg shadow-xl"
              width={500}
              height={400}
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
