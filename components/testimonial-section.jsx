import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    content:
      "MediConnect helped me find the right specialist for my condition. The symptom analyzer was incredibly accurate!",
    avatar: "SJ",
  },
  {
    name: "Dr. Michael Chen",
    role: "Cardiologist",
    content:
      "As a doctor, this platform has helped me connect with patients who truly need my expertise. The interface is intuitive and professional.",
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Patient",
    content:
      "The premium report analysis feature saved me so much stress. It explained my lab results in simple terms that I could understand.",
    avatar: "ER",
  },
]

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What People Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from our patients and doctors about their experience with MediConnect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarFallback className="bg-emerald-100 text-emerald-800">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
