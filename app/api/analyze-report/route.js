import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request) {
  try {
    const { reportText, reportType, userId } = await request.json()

    if (!reportText || !reportType) {
      return Response.json({ error: "Report text and type are required" }, { status: 400 })
    }

    // Check if user has premium subscription
    // This would typically involve checking the user's subscription status in the database
    const isPremium = false // Placeholder - would be fetched from database

    if (!isPremium) {
      return Response.json({ error: "Premium subscription required for report analysis" }, { status: 403 })
    }

    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create prompt for report analysis
    const prompt = `
      As a medical AI assistant, analyze the following ${reportType} report and provide:
      1. A summary of key findings in simple language
      2. Explanation of medical terms used in the report
      3. Potential implications of the findings
      4. Suggested follow-up questions for the patient to ask their doctor
      
      Report: ${reportText}
      
      Format your response as a JSON object with the following structure:
      {
        "summary": "summary of findings",
        "explanations": {"term1": "explanation1", "term2": "explanation2", ...},
        "implications": ["implication1", "implication2", ...],
        "followUpQuestions": ["question1", "question2", ...]
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

    return Response.json(analysisResult)
  } catch (error) {
    console.error("Error analyzing report:", error)
    return Response.json({ error: "Failed to analyze report" }, { status: 500 })
  }
}
