import { InferenceClient } from "@huggingface/inference";

let hfClient = null;

const getClient = () => {
  if (!hfClient) {
    hfClient = new InferenceClient(process.env.HF_TOKEN);
  }
  return hfClient;
};

/**
 * Step 1: Use HuggingFace BLIP to get a text description of the image.
 * Uses the @huggingface/inference SDK.
 */
export const describeImageWithHF = async ({ imageBuffer, mimeType }) => {
  const model = process.env.HF_VISION_MODEL || "Salesforce/blip-image-captioning-base";

  const client = getClient();

  const blob = new Blob([imageBuffer], { type: mimeType });

  const result = await client.imageToText({
    data: blob,
    model,
  });

  const caption = result?.generated_text?.trim();

  if (!caption) {
    throw new Error("HuggingFace returned empty image description");
  }

  console.log(`[AI] HF image caption: "${caption}"`);
  return caption;
};
