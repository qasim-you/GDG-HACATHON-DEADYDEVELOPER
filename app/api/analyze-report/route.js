import {  NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const formData = await req.formData();
    const file = formData.get('file') ;

    // Validate the uploaded file
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
    }

    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    // Get the file MIME type
    const mimeType = file.type;
    console.log('File MIME type:', mimeType);

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    if (!model) {
      throw new Error('Failed to initialize Gemini model');
    }

    // Prepare the content for analysis
    const prompt = "Analyze this medical report and provide a summary of the key findings, diagnoses, and recommendations.";
    const imagePart = {
      inlineData: {
        data: Buffer.from(fileBytes).toString('base64'),
        mimeType,
      },
    };

    console.log('Sending request to Gemini API...');

    // Generate content
    const result = await model.generateContent([prompt, imagePart]);

    if (!result || !result.response) {
      console.error('Invalid response from Gemini API:', result);
      return NextResponse.json({ error: 'Invalid API response' }, { status: 500 });
    }

    console.log('Received response from Gemini API');

    const analysis = await result.response.text();

    return NextResponse.json({ analysis });
  }catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
      ? error 
      : JSON.stringify(error);
  
    console.error('Error processing file:', errorMessage);
    
    return NextResponse.json(
      { error: 'Error processing file', details: errorMessage },
      { status: 500 }
    );
  }
  



}