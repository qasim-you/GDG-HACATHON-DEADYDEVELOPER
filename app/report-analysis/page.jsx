"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ReportAnalysis() {
  const [file, setFile] = useState<(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    setAnalysis(null)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()
      if (response.ok) {
        setAnalysis(result.analysis)
      } else {
        throw new Error(result.error || 'Failed to analyze report')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null
    setFile(file)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Medical Report Analysis</CardTitle>
          <CardDescription>Upload a medical report (PDF, PNG, DOCX, etc.) for AI analysis</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Label htmlFor="report-upload">Upload Medical Report</Label>
            <Input
              id="report-upload"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileChange}
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button type="submit" className="w-full" disabled={isLoading || !file}>
              {isLoading ? 'Analyzing...' : 'Analyze Report'}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {analysis && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3 className="font-semibold mb-2">Analysis Result:</h3>
                <p>{analysis}</p>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}