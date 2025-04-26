// components/CheckoutForm.js
"use client";

import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useStripePayment } from '../hooks/useStripePayment'; 

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, processPayment, isProcessing, errorMessage } = useStripePayment();
  
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      const secret = await createPaymentIntent();
      setClientSecret(secret);
    };

    fetchClientSecret();
  }, [createPaymentIntent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const isSuccess = await processPayment(clientSecret, stripe, elements);
    if (isSuccess) {
      alert('Payment Successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {errorMessage && <div className="error">{errorMessage}</div>}
      <button type="submit" disabled={isProcessing || !stripe}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;
