"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"

export default function PaymentCancel() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Payment Cancelled</CardTitle>
          <CardDescription className="text-center">Your payment process was cancelled</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <XCircle className="h-16 w-16 text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Cancelled</h3>
          <p className="text-gray-600 text-center">
            Your payment process was cancelled. No charges have been made to your account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Return Home
          </Button>
          <Button onClick={() => router.push("/premium")} className="bg-emerald-600 hover:bg-emerald-700">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
