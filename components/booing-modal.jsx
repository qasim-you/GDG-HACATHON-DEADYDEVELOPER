"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { addAppointment, getDoctors } from "@/lib/firebase"

const formSchema = z.object({
  doctorId: z.string({
    required_error: "Please select a doctor",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  reason: z.string().min(5, {
    message: "Reason must be at least 5 characters",
  }),
})

export default function BookingModal({ open, onOpenChange, onBookingComplete }) {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)

  // Set default doctors directly in the component
  useEffect(() => {
    if (open) {
      // Default doctors that will always be available
      const defaultDoctors = [
        {
          id: "default-1",
          name: "John Smith",
          specialty: "General Medicine",
        },
        {
          id: "default-2",
          name: "Sarah Johnson",
          specialty: "Cardiology",
        },
        {
          id: "default-3",
          name: "Michael Chen",
          specialty: "Pediatrics",
        },
        {
          id: "default-4",
          name: "Emily Rodriguez",
          specialty: "Dermatology",
        },
        {
          id: "default-5",
          name: "David Wilson",
          specialty: "Orthopedics",
        },
      ]

      // Set the default doctors immediately
      setDoctors(defaultDoctors)

      // Also try to fetch any additional doctors from Firebase
      const fetchDoctors = async () => {
        try {
          const doctorsList = await getDoctors()

          // If we have doctors in Firebase, add them to our default list
          if (doctorsList && doctorsList.length > 0) {
            // Combine default doctors with doctors from Firebase, avoiding duplicates
            const combinedDoctors = [...defaultDoctors]

            doctorsList.forEach((doctor) => {
              // Only add if not already in our default list (checking by name)
              if (!combinedDoctors.some((d) => d.name === doctor.name)) {
                combinedDoctors.push(doctor)
              }
            })

            setDoctors(combinedDoctors)
          }
        } catch (error) {
          console.error("Error fetching doctors:", error)
          // Even if there's an error, we still have our default doctors
        }
      }

      fetchDoctors()
    }
  }, [open])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  })

  async function onSubmit(values) {
    setLoading(true)
    try {
      // Find the selected doctor to get their name
      const selectedDoctor = doctors.find((doc) => doc.id === values.doctorId)

      // In a real app, you'd get the current user ID from auth
      const userId = "current-user-id"

      await addAppointment({
        userId,
        doctorId: values.doctorId,
        doctorName: selectedDoctor?.name || "Unknown",
        date: values.date.toISOString(),
        time: values.time,
        reason: values.reason,
        status: "scheduled",
        createdAt: new Date().toISOString(),
      })

      onBookingComplete()
    } catch (error) {
      console.error("Error booking appointment:", error)
    } finally {
      setLoading(false)
    }
  }

  // Available time slots
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>Fill out the form below to schedule your appointment with a doctor.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your symptoms or reason for the appointment"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
