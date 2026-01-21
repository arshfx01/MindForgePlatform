"use server"

export async function evaluateReasoning(analysis: string): Promise<{
  score: number
  feedbackMarkdown: string
  fallaciesArray: string[]
  xpAwarded: number
}> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock evaluation logic
  const length = analysis.length
  const hasKeyTerms = /(logical|fallacy|ethical|bias|reasoning|evidence|conclusion)/i.test(analysis)
  const hasQuestions = (analysis.match(/\?/g) || []).length
  const hasStructure = /(first|second|third|however|therefore|because|although)/i.test(analysis)

  // Calculate score (0-100)
  let score = 50 // Base score
  if (length > 200) score += 10
  if (length > 500) score += 10
  if (hasKeyTerms) score += 15
  if (hasQuestions > 0) score += 5
  if (hasStructure) score += 10
  score = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 20) - 10))

  // Generate feedback
  const strengths = [
    "Your analysis demonstrates clear logical structure.",
    "You've identified key variables effectively.",
    "Your reasoning shows good critical thinking skills.",
    "You've considered multiple perspectives.",
  ]

  const fallacies = score < 70 ? [
    "Ad hominem reasoning detected",
    "Potential false dichotomy",
    "Circular reasoning elements",
  ].slice(0, Math.floor(Math.random() * 2) + 1) : []

  const strategicPivot = score >= 80
    ? "Excellent work! Your analysis demonstrates sophisticated critical thinking. Consider exploring counter-arguments more deeply to strengthen your position further."
    : score >= 60
    ? "Good analysis with solid foundations. To improve, try identifying underlying assumptions and exploring alternative interpretations of the key variables."
    : "Your analysis shows promise. Focus on structuring your arguments more clearly and providing specific evidence for your claims. Consider the logical relationships between your points."

  const feedbackMarkdown = `Strengths:\n${strengths[Math.floor(Math.random() * strengths.length)]}\n\nLogical Fallacies:\n${fallacies.length > 0 ? fallacies.join(", ") : "None detected"}\n\nStrategic Pivot:\n${strategicPivot}`

  // Calculate XP (50-100 based on score)
  const xpAwarded = Math.floor(50 + (score / 100) * 50)

  return {
    score,
    feedbackMarkdown,
    fallaciesArray: fallacies,
    xpAwarded,
  }
}

