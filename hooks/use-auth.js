// hooks/useStripePayment.js
import { useState } from 'react';

export const useStripePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const createPaymentIntent = async () => {
    try {
      const res = await fetch('/api/create-payment-intent', { method: 'POST' });
      const data = await res.json();
      return data.clientSecret;
    } catch (error) {
      setErrorMessage('Failed to create payment intent');
      throw error;
    }
  };

  const processPayment = async (clientSecret, stripe, elements) => {
    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement('card'),
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return false;
    }

    if (paymentIntent.status === 'succeeded') {
      setIsProcessing(false);
      return true;
    }
    return false;
  };

  return {
    isProcessing,
    errorMessage,
    createPaymentIntent,
    processPayment,
  };
};
