// pages/payment.js
'use client';


import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/checkout'; 
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
  <img src="/favicon.ico" alt="MediConnect Logo" className="h-10 w-10" />
  <h1 className="text-2xl font-bold text-customBlue">MediConnect</h1>
</div>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="font-medium hover:text-emerald-600">Home</Link>
          <Link href="/doctors" className="font-medium hover:text-emerald-600">Find Doctors</Link>
          <Link href="/about" className="font-medium hover:text-emerald-600">About</Link>
          <Link href="/contact" className="font-medium hover:text-emerald-600">Contact</Link>
        </nav>
        <div className="flex space-x-3">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>

   

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">MediConnect</h3>
              <p className="text-gray-600">Connecting patients with the best healthcare professionals.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-emerald-600">Home</Link></li>
                <li><Link href="/doctors" className="text-gray-600 hover:text-emerald-600">Find Doctors</Link></li>
                <li><Link href="/symptom-analyzer" className="text-gray-600 hover:text-emerald-600">Symptom Analyzer</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Doctors</h3>
              <ul className="space-y-2">
                <li><Link href="/doctor/register" className="text-gray-600 hover:text-emerald-600">Register as Doctor</Link></li>
                <li><Link href="/doctor/login" className="text-gray-600 hover:text-emerald-600">Doctor Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-600">
                Email: info@mediconnect.com <br />
                Phone: +1 (123) 456-7890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} MediConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPage;
