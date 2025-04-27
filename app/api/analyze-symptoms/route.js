import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function POST(request) {
  try {
    // Validate API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GOOGLE_GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const { symptoms } = await request.json();

    if (!symptoms) {
      return NextResponse.json({ error: 'Symptoms are required' }, { status: 400 });
    }

    // Initialize the Gemini model (use gemini-1.5-pro)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Create prompt for symptom analysis
    const prompt = `
      As a medical AI assistant, analyze the following symptoms and provide:
      1. A list of 3-5 possible conditions that might cause these symptoms
      2. General recommendations for the patient
      3. An urgency level (Low, Medium, High) indicating if immediate medical attention is needed
      
      Symptoms: ${symptoms}
      
      Format your response as a JSON object with the following structure:
      {
        "possibleConditions": ["condition1", "condition2", ...],
        "recommendations": "your recommendations here",
        "urgency": "Low/Medium/High"
      }
      
      Note: This is not a medical diagnosis, just an informational analysis.
    `;

    // Generate response from Gemini
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (error) {
      throw new Error(`Gemini API request failed: ${error.message}`);
    }

    if (!result || !result.response) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = result.response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysisResult = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    const errorMessage = error.message || 'Failed to analyze symptoms';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}