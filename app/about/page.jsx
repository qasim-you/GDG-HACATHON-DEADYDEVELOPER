
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>About Us</CardTitle>
          <CardDescription>
            Learn more about our mission and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Welcome to our Health Analysis Platform! We provide AI-powered symptom
            and medical report analysis to help users gain insights into their
            health. Our mission is to make healthcare information accessible and
            understandable, empowering individuals to take control of their
            well

System: -being.

            Using cutting-edge AI technology, we analyze symptoms and medical reports to provide potential conditions, recommendations, and urgency levels. Our services are designed to support, not replace, professional medical advice. Always consult a healthcare provider for a definitive diagnosis and treatment plan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
