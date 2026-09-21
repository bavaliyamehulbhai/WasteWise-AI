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

const allowedStatuses = [
  "recyclable",
  "general-waste",
  "compost",
  "special-disposal",
  "reuse",
  "unknown",
];

const validateAIResult = (result) => {
  if (!result || typeof result !== "object") {
    throw new Error("Invalid AI response");
  }

  const requiredFields = ["wasteName", "category", "material", "confidence", "isWaste", "evidence"];

  for (const field of requiredFields) {
    if (result[field] === undefined || result[field] === null) {
      throw new Error(`AI response missing field: ${field}`);
    }
  }

  const confidence = Number(result.confidence);

  if (Number.isNaN(confidence) || confidence < 0 || confidence > 100) {
    throw new Error("Invalid AI confidence value");
  }

  if (!allowedCategories.includes(result.category)) {
    throw new Error(`Invalid waste category: ${result.category}`);
  }

  const wasteName = String(result.wasteName).trim();
  if (!wasteName) {
    throw new Error("Invalid waste name");
  }

  if (wasteName.length > 100) {
    throw new Error("Waste name is too long");
  }
  
  if (!Array.isArray(result.evidence)) {
    throw new Error("Evidence must be an array of strings");
  }

  return {
    wasteName,
    category: result.category,
    material: String(result.material).trim().slice(0, 100),
    confidence,
    isWaste: Boolean(result.isWaste),
    evidence: result.evidence.map(e => String(e).trim()).filter(e => e.length > 0),
    aiProvider: result.aiProvider,
    aiModel: result.aiModel,
    aiVersion: result.aiVersion
  };
};

export default validateAIResult;
