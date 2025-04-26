"use client";

import { useState } from 'react';

export function useStripePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Simulate creating a payment intent (you should call your backend here)
  const createPaymentIntent = async () => {
    try {
      // Here you should ideally POST to your backend API to get clientSecret
      // I'm faking it for now
      console.log('Creating payment intent...');
      // simulate an API response
      const fakeClientSecret = "sk_test_1234567890abcdef"; // replace with real clientSecret
      return fakeClientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setErrorMessage('Failed to initialize payment.');
      return null;
    }
  };

  // Processing the payment
  const processPayment = async (clientSecret, stripe, elements) => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const cardElement = elements.getElement('card');
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        return false;
      }

      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        return true;
      } else {
        setErrorMessage('Payment failed.');
        return false;
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrorMessage('An unexpected error occurred.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createPaymentIntent,
    processPayment,
    isProcessing,
    errorMessage,
  };
}
