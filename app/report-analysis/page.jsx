"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Maximum file size (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

// Supported file types
const SUPPORTED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export default function ReportAnalysis() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    // Validate file type
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a PDF, PNG, JPEG, DOC, or DOCX file.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 20MB limit.');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setAnalysis(result.analysis);
      } else {
        throw new Error(result.details || result.error || 'Failed to analyze report');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    setError(null); // Clear error when a new file is selected
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Medical Report Analysis</CardTitle>
          <CardDescription>Upload a medical report (PDF, PNG, JPEG, DOC, DOCX) for AI analysis</CardDescription>
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
                <div className="prose">
                  {analysis.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}