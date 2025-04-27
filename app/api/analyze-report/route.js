import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Supported MIME types
const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Maximum file size (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

export async function POST(req) {
  try {
    // Validate API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not set');
    }

    const formData = await req.formData();
    const file = formData.get('file');

    // Validate the uploaded file
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 20MB limit' }, { status: 400 });
    }

    // Validate MIME type
    const mimeType = file.type;
    if (!SUPPORTED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Supported types: PNG, JPEG, PDF, DOC, DOCX' },
        { status: 400 }
      );
    }

    // Read the file as an ArrayBuffer
    let fileBytes;
    try {
      const arrayBuffer = await file.arrayBuffer();
      fileBytes = new Uint8Array(arrayBuffer);
    } catch (error) {
      throw new Error('Failed to read file');
    }

    // Initialize the Gemini model (use gemini-1.5-pro for multimodal support)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    if (!model) {
      throw new Error('Failed to initialize Gemini model');
    }

    // Prepare the content for analysis
    const prompt = `
      Analyze this medical report and provide a summary of the key findings, diagnoses, and recommendations.
      Format the response as markdown with clear sections for:
      - Key Findings
      - Diagnoses
      - Recommendations
    `;
    const imagePart = {
      inlineData: {
        data: Buffer.from(fileBytes).toString('base64'),
        mimeType,
      },
    };

    console.log('Sending request to Gemini API...');

    // Generate content
    let result;
    try {
      result = await model.generateContent([prompt, imagePart]);
    } catch (error) {
      throw new Error(`Gemini API request failed: ${error.message}`);
    }

    if (!result || !result.response) {
      console.error('Invalid response from Gemini API:', result);
      return NextResponse.json({ error: 'Invalid API response' }, { status: 500 });
    }

    console.log('Received response from Gemini API');

    const analysis = await result.response.text();

    return NextResponse.json({ analysis });
  } catch (error) {
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