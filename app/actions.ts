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
    "You explained your points very clearly.",
    "You spotted the main issues in this situation.",
    "Good job thinking about different sides of the story.",
    "Your logic is easy to follow and makes sense.",
  ]

  const fallacies = score < 70 ? [
    "Some parts of your thinking might be a bit one-sided.",
    "You might be assuming something without proof.",
    "Try not to repeat the same point in different words.",
  ].slice(0, Math.floor(Math.random() * 2) + 1) : []

  const strategicPivot = score >= 80
    ? "Great job! You're thinking deeply. Next time, try to see if there's an even better solution."
    : score >= 60
      ? "Good start! Try to explain 'why' you think that a bit more."
      : "Keep practicing! Try breaking the problem into smaller pieces next time."

  const feedbackMarkdown = `Strengths:\n${strengths[Math.floor(Math.random() * strengths.length)]}\n\nThinking Errors:\n${fallacies.length > 0 ? fallacies.join(", ") : "None detected"}\n\nTip for Next Time:\n${strategicPivot}`


  // Calculate XP (50-100 based on score)
  const xpAwarded = Math.floor(50 + (score / 100) * 50)

  return {
    score,
    feedbackMarkdown,
    fallaciesArray: fallacies,
    xpAwarded,
  }
}

