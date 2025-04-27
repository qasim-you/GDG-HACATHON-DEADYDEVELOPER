"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Clock, LogOut } from "lucide-react"

export default function PendingVerification() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))

          if (userDoc.exists() && userDoc.data().role === "doctor") {
            setUser({ uid: currentUser.uid, ...userDoc.data() })
          } else {
            // Not a doctor, redirect to login
            await auth.signOut()
            router.push("/login")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        // Not logged in, redirect to login
        router.push("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verification Pending</CardTitle>
          <CardDescription className="text-center">
            Your doctor account is awaiting verification by our administrators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">
              Thank you for registering, Dr. {user.name}. Our team needs to verify your credentials before you can
              access the doctor dashboard. This usually takes 1-2 business days.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <ClipboardCheck className="h-5 w-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">What happens next?</h3>
                <p className="text-sm text-gray-600">
                  Our team will review your credentials and verify your medical license. You'll receive an email
                  notification once your account is approved.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <ClipboardCheck className="h-5 w-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Need help?</h3>
                <p className="text-sm text-gray-600">
                  If you have any questions or need to update your information, please contact our support team at
                  support@mediconnect.com
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
