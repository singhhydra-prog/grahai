/**
 * Eval test runner for GrahAI astrology app
 * Calls /api/chat endpoint and scores responses
 */

import type { EvalTestCase } from "./test-cases"

export interface TestResult {
  testCase: EvalTestCase
  response: string
  traitScore: number // % of expectedTraits mentioned
  forbiddenScore: number // % of forbiddenTraits absent (100 = good)
  lengthScore: number // 1 if >= minLength, 0 otherwise
  overallScore: number // weighted average
  errors?: string[]
}

export interface CategoryResults {
  category: string
  results: TestResult[]
  avgScore: number
  passRate: number // % of tests >= 70%
  weakestCase?: {
    testId: string
    score: number
  }
}

/**
 * Simple fuzzy match to check if text contains a trait
 * Case-insensitive, handles variations like "10th house" vs "tenth house"
 */
function fuzzyMatch(text: string, trait: string): boolean {
  const normalized = text.toLowerCase()
  const trait_lower = trait.toLowerCase()

  // Exact match
  if (normalized.includes(trait_lower)) return true

  // Word-by-word match (for traits like "10th house" or "specific timing")
  const words = trait_lower.split(/\s+/)
  if (words.length > 1) {
    return words.every((word) => normalized.includes(word))
  }

  // Number-word conversion: "10" -> "tenth", "10th" -> "tenth"
  const numberWords: { [key: string]: string[] } = {
    "1": ["1st", "first"],
    "2": ["2nd", "second"],
    "3": ["3rd", "third"],
    "4": ["4th", "fourth"],
    "5": ["5th", "fifth"],
    "6": ["6th", "sixth"],
    "7": ["7th", "seventh"],
    "8": ["8th", "eighth"],
    "9": ["9th", "ninth"],
    "10": ["10th", "tenth"],
    "11": ["11th", "eleventh"],
    "12": ["12th", "twelfth"],
  }

  // Check if trait is a number reference
  for (const [num, variants] of Object.entries(numberWords)) {
    if (variants.some((v) => trait_lower.includes(v))) {
      return variants.some((v) => normalized.includes(v))
    }
  }

  return false
}

/**
 * Score a single test case response
 */
export function scoreResponse(testCase: EvalTestCase, response: string): Omit<TestResult, "testCase" | "response"> {
  const errors: string[] = []

  // Trait score: % of expectedTraits mentioned
  let traitMatches = 0
  for (const trait of testCase.expectedTraits) {
    if (fuzzyMatch(response, trait)) {
      traitMatches++
    }
  }
  const traitScore = testCase.expectedTraits.length > 0 ? (traitMatches / testCase.expectedTraits.length) * 100 : 100

  // Forbidden score: % of forbiddenTraits absent (100 = all absent = good)
  let forbiddenPresent = 0
  for (const forbidden of testCase.forbiddenTraits) {
    if (fuzzyMatch(response, forbidden)) {
      forbiddenPresent++
    }
  }
  const forbiddenScore =
    testCase.forbiddenTraits.length > 0 ? ((testCase.forbiddenTraits.length - forbiddenPresent) / testCase.forbiddenTraits.length) * 100 : 100

  // Length score
  const lengthScore = response.length >= testCase.minLength ? 100 : 0

  // Weighted overall score
  const overallScore = traitScore * 0.5 + forbiddenScore * 0.3 + lengthScore * 0.2

  return {
    traitScore,
    forbiddenScore,
    lengthScore,
    overallScore,
    errors,
  }
}

/**
 * Collect SSE stream response from /api/chat
 */
async function collectSSEResponse(
  endpoint: string,
  question: string,
  birthData?: { date: string; time: string; place: string }
): Promise<string> {
  const body = {
    message: question,
    birthData,
    user_id: "eval-test-user",
    vertical: "astrology",
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`API returned ${response.status}: ${response.statusText}`)
  }

  // Read SSE stream
  let fullText = ""
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("No response body")
  }

  const decoder = new TextDecoder()
  let buffer = ""

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Process complete SSE messages
    const lines = buffer.split("\n")
    buffer = lines.pop() || "" // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const jsonStr = line.slice(6) // Remove "data: "
          const event = JSON.parse(jsonStr)

          if (event.text) {
            fullText += event.text
          }
        } catch {
          // Ignore JSON parse errors
        }
      }
    }
  }

  return fullText
}

/**
 * Run all test cases and return results
 */
export async function runEvalTests(
  testCases: EvalTestCase[],
  apiEndpoint: string = "http://localhost:3000/api/chat"
): Promise<TestResult[]> {
  const results: TestResult[] = []

  for (const testCase of testCases) {
    try {
      // Call API
      const response = await collectSSEResponse(apiEndpoint, testCase.question, testCase.birthData)

      // Score response
      const scores = scoreResponse(testCase, response)

      results.push({
        testCase,
        response,
        ...scores,
      })
    } catch (err) {
      // Handle API errors
      const errorMsg = err instanceof Error ? err.message : String(err)
      results.push({
        testCase,
        response: "",
        traitScore: 0,
        forbiddenScore: 0,
        lengthScore: 0,
        overallScore: 0,
        errors: [errorMsg],
      })
    }
  }

  return results
}

/**
 * Group results by category and compute aggregate stats
 */
export function groupResultsByCategory(results: TestResult[]): CategoryResults[] {
  const byCategory: { [key: string]: TestResult[] } = {}

  for (const result of results) {
    const cat = result.testCase.category
    if (!byCategory[cat]) {
      byCategory[cat] = []
    }
    byCategory[cat].push(result)
  }

  const categoryResults: CategoryResults[] = []

  for (const [category, categoryTests] of Object.entries(byCategory)) {
    const avgScore = categoryTests.reduce((sum, r) => sum + r.overallScore, 0) / categoryTests.length
    const passRate = (categoryTests.filter((r) => r.overallScore >= 70).length / categoryTests.length) * 100

    let weakestCase: { testId: string; score: number } | undefined
    for (const result of categoryTests) {
      if (!weakestCase || result.overallScore < weakestCase.score) {
        weakestCase = {
          testId: result.testCase.id,
          score: result.overallScore,
        }
      }
    }

    categoryResults.push({
      category,
      results: categoryTests,
      avgScore,
      passRate,
      weakestCase,
    })
  }

  return categoryResults.sort((a, b) => a.category.localeCompare(b.category))
}
