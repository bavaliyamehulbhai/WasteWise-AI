const allowedCategories = [
  "Plastic", "Paper", "Glass", "Metal",
  "Organic", "E-Waste", "General Waste", "Other",
];

const AI_VERSION = "wastewise-gemini-rest-v2";
// Try v1 first (AQ. keys work better here), fallback to v1beta
const GEMINI_ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1/models",
  "https://generativelanguage.googleapis.com/v1beta/models",
];

/**
 * Classify waste image using Gemini Vision via direct REST API.
 * Uses REST API instead of SDK for compatibility with newer AQ. key formats.
 */
export const classifyImageWithGemini = async ({ imageBuffer, mimeType }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const base64Image = imageBuffer.toString("base64");

  const prompt = `You are the waste classification engine for WasteWise AI. Analyze this image and identify the primary waste item.

Respond with ONLY a valid JSON object (no markdown, no code fences):
{
  "wasteName": "specific name (e.g. 'Plastic Water Bottle')",
  "category": "MUST be exactly one of: ${allowedCategories.join(", ")}",
  "material": "material type",
  "confidence": <integer 0-100>,
  "isWaste": <true or false>,
  "evidence": ["up to 3 short reasons"]
}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 300,
    },
  };

  let response;
  let lastError;

  for (const baseUrl of GEMINI_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      response = await fetch(
        `${baseUrl}/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      // If 401 on this endpoint, try next one
      if (response.status === 401 || response.status === 403) {
        const errText = await response.text().catch(() => "");
        lastError = `Gemini ${baseUrl.includes("v1beta") ? "v1beta" : "v1"} ${response.status}: ${errText.slice(0, 100)}`;
        console.warn(`[Gemini] ${lastError} — trying next endpoint...`);
        continue;
      }

      // Any other error (400, 500, etc.) — throw immediately
      if (!response.ok) {
        const errText = await response.text().catch(() => "unknown error");
        throw new Error(`Gemini REST ${response.status}: ${errText.slice(0, 200)}`);
      }

      // Success
      break;
    } catch (fetchErr) {
      clearTimeout(timeout);
      if (fetchErr.name === "AbortError") {
        throw new Error("Gemini REST API timed out after 20 seconds");
      }
      if (fetchErr.message.startsWith("Gemini REST")) throw fetchErr;
      lastError = "Gemini fetch failed: " + fetchErr.message;
    }
  }

  if (!response || !response.ok) {
    throw new Error(lastError || "All Gemini endpoints failed");
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    throw new Error("Gemini returned empty content");
  }

  // Strip markdown if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  let parsedData;
  try {
    parsedData = JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Gemini returned non-JSON: " + text.slice(0, 100));
  }

  parsedData.aiProvider = "gemini";
  parsedData.aiModel = modelName;
  parsedData.aiVersion = AI_VERSION;

  console.log(`[AI] Gemini classified: ${parsedData.wasteName} (${parsedData.category}) - ${parsedData.confidence}% confidence`);
  return parsedData;
};
