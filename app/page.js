// pages/index.js
'use client';

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MediConnect - Healthcare Made Simple",
  description: "Connect with trusted healthcare professionals and manage your health journey with ease.",
}

export default function RootLayout{
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
