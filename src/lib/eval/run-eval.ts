#!/usr/bin/env node
/**
 * CLI script to run eval tests and generate report
 * Usage: npx tsx src/lib/eval/run-eval.ts [--api-endpoint http://localhost:3000/api/chat]
 */

import * as fs from "fs"
import * as path from "path"
import { allTestCases, getTestCasesByCategory } from "./test-cases"
import { runEvalTests, groupResultsByCategory } from "./runner"

const args = process.argv.slice(2)
let apiEndpoint = "http://localhost:3000/api/chat"

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--api-endpoint" && args[i + 1]) {
    apiEndpoint = args[i + 1]
    i++
  }
}

async function main() {
  console.log("🧪 GrahAI Astrology Eval Test Suite\n")
  console.log(`API Endpoint: ${apiEndpoint}\n`)
  console.log("Running 160 test cases across 8 categories...")
  console.log("This may take a few minutes.\n")

  const startTime = Date.now()

  try {
    // Run all tests
    const results = await runEvalTests(allTestCases, apiEndpoint)

    // Group by category
    const categoryResults = groupResultsByCategory(results)

    // Print summary table
    console.log("=" + "=".repeat(79))
    console.log("EVAL RESULTS SUMMARY")
    console.log("=" + "=".repeat(79))
    console.log()
    console.log(
      `${"Category".padEnd(20)} | ${"Avg Score".padEnd(10)} | ${"Pass Rate".padEnd(10)} | ${"Weakest Case".padEnd(20)}`
    )
    console.log("-" + "-".repeat(79))

    let anyFailed = false
    for (const catResult of categoryResults) {
      const avgScoreStr = catResult.avgScore.toFixed(1).padEnd(10)
      const passRateStr = `${catResult.passRate.toFixed(0)}%`.padEnd(10)
      const weakestStr = catResult.weakestCase
        ? `${catResult.weakestCase.testId} (${catResult.weakestCase.score.toFixed(1)})`
        : "N/A"

      const statusIcon = catResult.avgScore >= 70 ? "✓" : "✗"

      console.log(
        `${statusIcon} ${catResult.category.padEnd(18)} | ${avgScoreStr} | ${passRateStr} | ${weakestStr.padEnd(20)}`
      )

      if (catResult.avgScore < 70) {
        anyFailed = true
      }
    }

    console.log()
    console.log("=" + "=".repeat(79))

    // Overall stats
    const totalScore = results.reduce((sum, r) => sum + r.overallScore, 0) / results.length
    const passCount = results.filter((r) => r.overallScore >= 70).length
    const passRate = (passCount / results.length) * 100

    console.log(`Overall Average Score: ${totalScore.toFixed(1)}/100`)
    console.log(`Overall Pass Rate: ${passRate.toFixed(0)}% (${passCount}/${results.length} tests)`)
    console.log(`Total Time: ${((Date.now() - startTime) / 1000).toFixed(1)}s`)
    console.log()

    // Save full results to JSON
    const reportPath = path.join(process.cwd(), "eval-results.json")
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          apiEndpoint,
          summary: {
            totalTests: results.length,
            overallAvgScore: totalScore,
            overallPassRate: passRate,
            passCount,
            failCount: results.length - passCount,
            elapsedMs: Date.now() - startTime,
          },
          categories: categoryResults.map((cat) => ({
            category: cat.category,
            testCount: cat.results.length,
            avgScore: cat.avgScore,
            passRate: cat.passRate,
            weakestCase: cat.weakestCase,
          })),
          details: results.map((r) => ({
            testId: r.testCase.id,
            category: r.testCase.category,
            question: r.testCase.question,
            scores: {
              trait: r.traitScore.toFixed(1),
              forbidden: r.forbiddenScore.toFixed(1),
              length: r.lengthScore.toFixed(1),
              overall: r.overallScore.toFixed(1),
            },
            response: r.response.substring(0, 500), // First 500 chars
            errors: r.errors,
          })),
        },
        null,
        2
      )
    )

    console.log(`📊 Full results saved to: ${reportPath}`)
    console.log()

    // Exit with code 1 if any category failed
    if (anyFailed) {
      console.log("⚠️  Some categories scored below 70%. Please review results.")
      process.exit(1)
    } else {
      console.log("✅ All categories passed!")
      process.exit(0)
    }
  } catch (err) {
    console.error("❌ Error running eval tests:")
    console.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
}

main()
