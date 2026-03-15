#!/usr/bin/env node
/**
 * Test Script: Personalization Proof
 *
 * Generates reports for 3 contrasting birth profiles and compares outputs
 * to verify that personalization is real (different texts for different charts)
 */

import { assembleReportData } from "./src/lib/reports/kundli-report-generator.ts";
import { generateReport } from "./src/lib/reports/generators/index.ts";
import fs from "fs";
import path from "path";

const OUTPUT_FILE = "/sessions/great-funny-brahmagupta/mnt/AstraAI/grahai/audit-package/sample-outputs/test-run-output.txt";

// Birth Profiles (3 contrasting profiles)
const profiles = {
  A: {
    name: "Profile A (Male, Mumbai, Known Time)",
    birthDetails: {
      date: "1990-01-15",
      time: "06:00:00",
      place: "Mumbai, India",
      latitude: 19.076,
      longitude: 72.8777,
      timezone: 5.5,  // IST
    },
  },
  B: {
    name: "Profile B (Female, London, Known Time)",
    birthDetails: {
      date: "1985-08-23",
      time: "23:30:00",
      place: "London, UK",
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 0,  // GMT/UTC
    },
  },
  C: {
    name: "Profile C (Male, Delhi, Unknown Time)",
    birthDetails: {
      date: "2000-12-01",
      time: "12:00:00",  // noon for unknown time
      place: "Delhi, India",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: 5.5,  // IST
    },
  },
};

const reportTypes = ["career-blueprint", "love-compat", "annual-forecast"];

// Main execution
async function main() {
  const output = [];
  const results = {};

  output.push("═══════════════════════════════════════════════════════════════");
  output.push("GrahAI Personalization Audit");
  output.push("Generated: " + new Date().toISOString());
  output.push("═══════════════════════════════════════════════════════════════\n");

  // Phase 1: Generate reports
  output.push("PHASE 1: REPORT GENERATION");
  output.push("─────────────────────────────────────────────────────────────\n");

  const reportData = {};

  for (const [profileKey, profileInfo] of Object.entries(profiles)) {
    output.push(`\n>>> Generating charts for ${profileInfo.name}`);
    output.push(`    Birth: ${profileInfo.birthDetails.date} ${profileInfo.birthDetails.time} ${profileInfo.birthDetails.place}`);

    try {
      const data = await assembleReportData(profileInfo.birthDetails, profileInfo.name);
      reportData[profileKey] = data;
      output.push(`    ✓ Chart assembled`);
      output.push(`    Ascendant: ${data.natalChart.ascendantSign.name}`);
      output.push(`    Moon Sign: ${data.natalChart.moonSign.name}`);
      output.push(`    Birth Nakshatra: ${data.nakshatraAnalysis.name}`);
    } catch (err) {
      output.push(`    ✗ ERROR: ${err.message}`);
      reportData[profileKey] = null;
    }
  }

  // Phase 2: Generate reports
  output.push("\n\nPHASE 2: REPORT GENERATION");
  output.push("─────────────────────────────────────────────────────────────\n");

  results.allReports = {};

  for (const [profileKey, profileInfo] of Object.entries(profiles)) {
    if (!reportData[profileKey]) {
      output.push(`\nSkipping reports for ${profileKey} (chart generation failed)`);
      continue;
    }

    results.allReports[profileKey] = {};

    for (const reportType of reportTypes) {
      output.push(`\n>>> ${profileKey}: Generating ${reportType}`);

      try {
        const report = generateReport(reportType, reportData[profileKey]);
        results.allReports[profileKey][reportType] = report;

        // Extract text samples (first 500 chars from each section)
        const samples = report.sections.map((section, idx) => ({
          sectionIndex: idx,
          title: section.title,
          preview: section.content.substring(0, 500),
        }));

        output.push(`    ✓ Report generated with ${report.sections.length} sections`);
        output.push(`    Summary length: ${report.summary.length} chars`);

        // Print first section preview
        if (report.sections.length > 0) {
          const s = report.sections[0];
          output.push(`    First section: "${s.title}"`);
          output.push(`    Preview: ${s.content.substring(0, 200)}...`);
        }
      } catch (err) {
        output.push(`    ✗ ERROR: ${err.message}`);
      }
    }
  }

  // Phase 3: Similarity Analysis
  output.push("\n\nPHASE 3: TEXT SIMILARITY ANALYSIS");
  output.push("─────────────────────────────────────────────────────────────\n");
  output.push("Comparing first 500 characters from each section across profiles...\n");

  function similarity(str1, str2) {
    if (!str1 || !str2) return 0;
    const s1 = str1.substring(0, 500);
    const s2 = str2.substring(0, 500);
    const len = Math.min(s1.length, s2.length);
    let matches = 0;
    for (let i = 0; i < len; i++) {
      if (s1[i] === s2[i]) matches++;
    }
    return ((matches / len) * 100).toFixed(2);
  }

  results.similarities = {};

  for (const reportType of reportTypes) {
    output.push(`\n=== ${reportType.toUpperCase()} ===\n`);
    results.similarities[reportType] = {};

    const profiles_arr = ["A", "B", "C"];
    for (let i = 0; i < profiles_arr.length; i++) {
      for (let j = i + 1; j < profiles_arr.length; j++) {
        const p1 = profiles_arr[i];
        const p2 = profiles_arr[j];

        if (!results.allReports[p1]?.[reportType] || !results.allReports[p2]?.[reportType]) {
          output.push(`Comparison ${p1} vs ${p2}: SKIPPED (missing data)\n`);
          continue;
        }

        const report1 = results.allReports[p1][reportType];
        const report2 = results.allReports[p2][reportType];

        let totalComparable = 0;
        let totalSimilarity = 0;
        const comparisonData = [];

        for (let s = 0; s < Math.min(report1.sections.length, report2.sections.length); s++) {
          const sim = similarity(report1.sections[s].content, report2.sections[s].content);
          totalSimilarity += parseFloat(sim);
          totalComparable++;
          comparisonData.push({
            section: s,
            title: report1.sections[s].title,
            similarity: sim,
          });
        }

        const avgSimilarity = totalComparable > 0 ? (totalSimilarity / totalComparable).toFixed(2) : "0";
        results.similarities[reportType][`${p1}_vs_${p2}`] = parseFloat(avgSimilarity);

        output.push(`Comparison ${p1} vs ${p2}:`);
        output.push(`  Average similarity: ${avgSimilarity}%`);
        output.push(`  Sections compared: ${totalComparable}`);
        for (const comp of comparisonData) {
          output.push(`    Section ${comp.section} ("${comp.title}"): ${comp.similarity}%`);
        }
        output.push("");
      }
    }
  }

  // Phase 4: Summary Statistics
  output.push("\n\nPHASE 4: SUMMARY & CONCLUSIONS");
  output.push("─────────────────────────────────────────────────────────────\n");

  let allSims = [];
  for (const reportType of reportTypes) {
    for (const pair of Object.values(results.similarities[reportType] || {})) {
      allSims.push(pair);
    }
  }

  if (allSims.length > 0) {
    const avgAll = (allSims.reduce((a, b) => a + b, 0) / allSims.length).toFixed(2);
    const maxAll = Math.max(...allSims).toFixed(2);
    const minAll = Math.min(...allSims).toFixed(2);

    output.push(`Total comparisons: ${allSims.length}`);
    output.push(`Average text similarity across all reports: ${avgAll}%`);
    output.push(`Highest similarity: ${maxAll}%`);
    output.push(`Lowest similarity: ${minAll}%`);

    if (parseFloat(avgAll) < 20) {
      output.push("\n✓ PERSONALIZATION VERIFIED: Reports show <20% text overlap");
      output.push("  Each profile generates highly customized content based on its unique chart.");
    } else if (parseFloat(avgAll) < 40) {
      output.push("\n⚠ PARTIAL PERSONALIZATION: Some template reuse detected");
      output.push("  Reports share ~" + avgAll + "% text, suggesting some templating.");
    } else {
      output.push("\n✗ LIMITED PERSONALIZATION: High text overlap detected");
      output.push("  Reports may rely heavily on templates rather than chart-specific analysis.");
    }
  } else {
    output.push("No report data available for comparison.");
  }

  // Sample output from each profile-report combination
  output.push("\n\nPHASE 5: SAMPLE EXCERPTS");
  output.push("─────────────────────────────────────────────────────────────\n");

  for (const [profileKey, profileInfo] of Object.entries(profiles)) {
    if (!results.allReports[profileKey]) continue;

    output.push(`\n>>> ${profileInfo.name}\n`);

    for (const reportType of reportTypes) {
      if (!results.allReports[profileKey][reportType]) continue;

      const report = results.allReports[profileKey][reportType];
      output.push(`    [${reportType}]`);
      output.push(`    Summary: ${report.summary.substring(0, 300)}...`);

      if (report.sections.length > 0) {
        output.push(`    First section: "${report.sections[0].title}"`);
        output.push(`    Content: ${report.sections[0].content.substring(0, 250)}...`);
      }
      output.push("");
    }
  }

  // Write output
  const fullOutput = output.join("\n");
  fs.writeFileSync(OUTPUT_FILE, fullOutput, "utf-8");

  console.log("✓ Test complete");
  console.log("Output saved to: " + OUTPUT_FILE);
  console.log("\nSummary:");
  console.log("  Profiles tested: 3");
  console.log("  Report types: " + reportTypes.join(", "));
  if (allSims.length > 0) {
    console.log(`  Average text similarity: ${(allSims.reduce((a, b) => a + b, 0) / allSims.length).toFixed(2)}%`);
  }
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
