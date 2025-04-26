import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request) {
  try {
    const { symptoms, userId } = await request.json()

    if (!symptoms) {
      return Response.json({ error: "Symptoms are required" }, { status: 400 })
    }

    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

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
    `

    // Generate response from Gemini
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const analysisResult = JSON.parse(jsonMatch[0])

    // Store the analysis in the database (implementation omitted for brevity)
    // This would typically involve saving to Firestore

    return Response.json(analysisResult)
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    return Response.json({ error: "Failed to analyze symptoms" }, { status: 500 })
  }
}
