"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const PremiumPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async (plan) => {
    try {
      setIsProcessing(true)

      if (!user) {
        toast({
          title: "Login required",
          description: "Please login to subscribe to premium",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      // Determine amount based on plan
      const amount = plan === "standard" ? 9.99 : 19.99

      // Create Stripe checkout session
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          userId: user.uid,
          planType: plan,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment session")
      }

      const data = await response.json()

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Premium Subscription</h1>
      <p className="mb-5">Unlock exclusive features and content with a premium subscription.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-2">Standard Plan</h2>
          <p className="mb-3">Access to basic premium features.</p>
          <p className="font-bold">$9.99/month</p>
          <button
            onClick={() => handlePayment("standard")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 disabled:bg-gray-500"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Subscribe with Stripe"
            )}
          </button>
        </div>

        <div className="border rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-2">Premium Plan</h2>
          <p className="mb-3">Full access to all premium features and content.</p>
          <p className="font-bold">$19.99/month</p>
          <button
            onClick={() => handlePayment("premium")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 disabled:bg-gray-500"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Subscribe with Stripe"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PremiumPage
