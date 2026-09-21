export const allowedCategories = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Organic",
  "E-Waste",
  "General Waste",
  "Other",
];

export const wasteClassificationSchemaV2 = {
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
    evidence: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "wasteName",
    "category",
    "material",
    "confidence",
    "isWaste",
    "evidence",
  ],
  additionalProperties: false,
};

export const WASTE_CLASSIFICATION_PROMPT_V2 = `You are the waste classification engine for WasteWise AI. Analyze the provided image and identify the primary waste item. You must classify the item into exactly one of these categories:
${allowedCategories.join(", ")}

Rules:
1. Identify the most likely specific waste item.
2. Use the controlled category list exactly.
3. Identify the material when visually inferable (e.g., PET, HDPE, Aluminum, Cardboard).
4. Do not invent hidden material information.
5. If the image is unclear or does not contain waste, use "Other" and set isWaste to false.
6. Return an estimated confidence from 0 to 100.
7. Confidence represents model confidence, not verified real-world accuracy.
8. Do not provide environmental impact claims.
9. Do not decide location-specific recycling rules.
10. Provide 1 to 3 short, observable reasons in the "evidence" array explaining why you chose this classification (e.g., "Bottle-shaped object", "Transparent plastic appearance"). Do NOT pretend this is internal model reasoning; just describe what is visible.
11. You must return your response in JSON format exactly matching this schema:
${JSON.stringify(wasteClassificationSchemaV2, null, 2)}
`;
