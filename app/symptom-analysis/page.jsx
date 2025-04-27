"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SymptomAnalysis() {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState();

  const handleSubmit = async (E) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) throw new Error("Failed to analyze symptoms");

      const result = await response.json();
      setAnalysisResult(result.analysis);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while analyzing symptoms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Symptom Analysis</CardTitle>
          <CardDescription>
            Describe your symptoms in detail for AI analysis.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <Textarea
              placeholder="Describe your symptoms here..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={10}
              className="w-full"
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Analyzing..." : "Analyze Symptoms"}
            </Button>
          </CardFooter>
        </form>

        {error && (
          <CardContent className="mt-4">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        )}

        {analysisResult && (
          <CardContent className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
            <div className="space-y-2 border-2 border-gray-300 rounded-md p-4">
              {analysisResult
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line !== "" && line !== "*")
                .map((line, index) => (
                  <p key={index} className="text-lg">
                    {line.startsWith("*") ? line : `* ${line}`}
                  </p>
                ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
