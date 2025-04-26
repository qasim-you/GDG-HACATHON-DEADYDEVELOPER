// pages/payment.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/checkout';  // Assuming CheckoutForm is in components

// Load Stripe public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  return (
    <div>
      <h1>Complete Your Payment</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />  {/* Payment form component */}
      </Elements>
    </div>
  );
};

export default PaymentPage;
