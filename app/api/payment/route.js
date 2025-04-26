import Stripe from "stripe"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { amount, userId, planType } = await request.json()

    if (!amount || !userId || !planType) {
      return Response.json({ error: "Amount, userId, and planType are required" }, { status: 400 })
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `MediConnect ${planType} Plan`,
              description: `${planType} subscription for MediConnect healthcare platform`,
            },
            unit_amount: amount * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      metadata: {
        userId,
        planType,
      },
    })

    // Store session details in the database (implementation omitted for brevity)

    return Response.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("Payment error:", error)
    return Response.json({ error: "Failed to create payment session" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return Response.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the session to verify payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Update user's subscription status in the database
      // (implementation omitted for brevity)

      return Response.json({
        success: true,
        session,
      })
    } else {
      return Response.json({ error: "Payment not completed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return Response.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
