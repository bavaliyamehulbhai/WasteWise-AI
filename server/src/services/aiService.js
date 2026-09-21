import { classifyImageWithGroq } from "./aiProviders/groqProvider.js";
import { classifyImageWithGemini } from "./aiProviders/geminiProvider.js";
import validateAIResult from "../utils/validateAIResult.js";

/**
 * Main AI classification service.
 * Primary: Groq (vision model with 20s timeout)
 * Secondary: Gemini (if AI_PROVIDER=gemini)
 */
export const classifyWasteImage = async ({ imageBuffer, mimeType }) => {
  const provider = process.env.AI_PROVIDER || "groq";

  let parsedData;
  switch (provider) {
    case "groq":
      parsedData = await classifyImageWithGroq({ imageBuffer, mimeType });
      break;
    case "gemini":
      parsedData = await classifyImageWithGemini({ imageBuffer, mimeType });
      break;
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }

  return validateAIResult(parsedData);
};

export default classifyWasteImage;
