"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function PaymentSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id")

        if (!sessionId) {
          setError("Invalid session ID")
          setVerifying(false)
          return
        }

        const response = await fetch(`/api/payment?session_id=${sessionId}`)
        const data = await response.json()

        if (data.success) {
          setSuccess(true)
        } else {
          setError(data.error || "Payment verification failed")
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setError("Failed to verify payment")
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Payment Status</CardTitle>
          <CardDescription className="text-center">Verifying your premium subscription</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {verifying ? (
            <>
              <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600">Verifying your payment...</p>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-16 w-16 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 text-center">
                Your premium subscription has been activated. You now have access to all premium features.
              </p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Verification Failed</h3>
              <p className="text-gray-600 text-center">{error || "There was an issue verifying your payment."}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push(success ? "/patient/dashboard" : "/premium")}
            className={success ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            {success ? "Go to Dashboard" : "Try Again"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
