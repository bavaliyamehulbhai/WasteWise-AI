import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from backend
dotenv.config({ path: path.join(__dirname, "../server/.env") });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const allowedCategories = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Organic",
  "E-Waste",
  "General Waste",
  "Other",
];

const wasteClassificationSchema = {
  type: "object",
  properties: {
    wasteName: { type: "string" },
    category: {
      type: "string",
      enum: allowedCategories,
    },
    material: { type: "string" },
    confidence: { type: "number" },
    isWaste: { type: "boolean" },
  },
  required: ["wasteName", "category", "material", "confidence", "isWaste"],
  additionalProperties: false,
};

const systemPrompt = `You are the waste classification engine for WasteWise AI. Analyze the provided image and identify the primary waste item. You must classify the item into exactly one of these categories:
${allowedCategories.join(", ")}

Rules:
1. Identify the most likely specific waste item.
2. Use the controlled category list exactly.
3. Identify the material when visually inferable.
4. Do not invent hidden material information.
5. If the image is unclear or does not contain waste, use "Other".
6. Return an estimated confidence from 0 to 100.
7. Confidence represents model confidence, not verified real-world accuracy.
8. Do not provide environmental impact claims.
9. Do not decide location-specific recycling rules.
10. You must return your response in JSON format exactly matching this schema:
${JSON.stringify(wasteClassificationSchema, null, 2)}`;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const runBenchmark = async () => {
  const labelsPath = path.join(__dirname, "labels.csv");
  const imagesDir = path.join(__dirname, "images");

  if (!fs.existsSync(labelsPath) || !fs.existsSync(imagesDir)) {
    console.error("Please create the evaluation/images directory and populate labels.csv");
    process.exit(1);
  }

  const rawLabels = fs.readFileSync(labelsPath, "utf-8");
  const lines = rawLabels.split("\n").filter(line => line.trim() && !line.startsWith("#") && !line.startsWith("filename"));
  
  if (lines.length === 0) {
    console.error("No valid entries found in labels.csv");
    process.exit(1);
  }

  const results = [];
  const confusionMatrix = {};
  
  allowedCategories.forEach(actual => {
    confusionMatrix[actual] = {};
    allowedCategories.forEach(pred => {
      confusionMatrix[actual][pred] = 0;
    });
  });

  let correctPredictions = 0;

  console.log(`Starting benchmark for ${lines.length} images...`);

  for (const line of lines) {
    const [filename, groundTruth] = line.split(",").map(s => s.trim());
    
    if (!filename || !groundTruth) continue;
    
    const imagePath = path.join(imagesDir, filename);
    if (!fs.existsSync(imagePath)) {
      console.warn(`[WARN] Image not found: ${imagePath}`);
      continue;
    }

    try {
      const ext = path.extname(filename).toLowerCase();
      let mimeType = "image/jpeg";
      if (ext === ".png") mimeType = "image/png";
      if (ext === ".webp") mimeType = "image/webp";

      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString("base64");
      const imageDataUrl = `data:${mimeType};base64,${base64Image}`;

      console.log(`Evaluating: ${filename} (Truth: ${groundTruth})`);

      const response = await groq.chat.completions.create({
        model: process.env.GROQ_VISION_MODEL || "qwen/qwen3.8-27b",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Classify this waste image." },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
      });

      const responseContent = response.choices[0]?.message?.content;
      const parsed = JSON.parse(responseContent);

      const predictedCategory = parsed.category;
      const confidence = parsed.confidence;
      
      const isCorrect = predictedCategory === groundTruth;
      if (isCorrect) correctPredictions++;
      
      if (confusionMatrix[groundTruth] && confusionMatrix[groundTruth][predictedCategory] !== undefined) {
        confusionMatrix[groundTruth][predictedCategory]++;
      }

      results.push({
        filename,
        groundTruth,
        predicted: predictedCategory,
        confidence,
        correct: isCorrect,
      });

      // Avoid rate limits
      await delay(2000);

    } catch (error) {
      console.error(`Error processing ${filename}:`, error.message);
    }
  }

  const accuracy = (correctPredictions / results.length) * 100;
  
  let report = `# WasteWise AI Evaluation Report

**Total Evaluated:** ${results.length}
**Accuracy:** ${accuracy.toFixed(2)}%

## Confusion Matrix

| Actual \\ Predicted | ${allowedCategories.join(" | ")} |
|---|${allowedCategories.map(() => "---").join("|")}|
`;

  allowedCategories.forEach(actual => {
    const row = allowedCategories.map(pred => confusionMatrix[actual][pred] || 0);
    report += `| **${actual}** | ${row.join(" | ")} |\n`;
  });

  report += `\n## Details\n\n| Filename | Ground Truth | Predicted | Confidence | Correct |\n|---|---|---|---|---|\n`;
  
  results.forEach(r => {
    report += `| ${r.filename} | ${r.groundTruth} | ${r.predicted} | ${r.confidence}% | ${r.correct ? "✅" : "❌"} |\n`;
  });

  fs.writeFileSync(path.join(__dirname, "report.md"), report);
  console.log("Evaluation complete. Report generated at evaluation/report.md");
};

runBenchmark();
