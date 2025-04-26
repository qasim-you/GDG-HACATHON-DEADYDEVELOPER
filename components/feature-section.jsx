import { Stethoscope, Brain, FileText, Calendar, CreditCard, Shield } from "lucide-react"

const features = [
  {
    icon: <Stethoscope className="h-10 w-10 text-emerald-600" />,
    title: "Find Specialists",
    description: "Connect with specialized doctors based on your needs.",
  },
  {
    icon: <Brain className="h-10 w-10 text-emerald-600" />,
    title: "Symptom Analysis",
    description: "AI-powered symptom analyzer to understand your condition.",
  },
  {
    icon: <FileText className="h-10 w-10 text-emerald-600" />,
    title: "Report Analysis",
    description: "Premium feature to analyze and understand your medical reports.",
  },
  {
    icon: <Calendar className="h-10 w-10 text-emerald-600" />,
    title: "Book Appointments",
    description: "Schedule appointments with doctors at your convenience.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-emerald-600" />,
    title: "Secure Payments",
    description: "Pay for premium services securely through Razorpay.",
  },
  {
    icon: <Shield className="h-10 w-10 text-emerald-600" />,
    title: "Data Privacy",
    description: "Your medical data is secure and private with us.",
  },
]

export default function FeatureSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed to provide you with the best medical experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
