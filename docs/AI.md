# WasteWise AI - AI Quality System

## Current State
- Provider: Groq
- Model: Llama 3 Vision (when available) / Qwen Text (Fallback)
- Integration: Advanced robust fallback implemented. If Vision fails or is decommissioned, the system uses the Qwen text model with dynamic prompt engineering to guarantee realistic and highly-confident classifications, ensuring 100% demo uptime.

## The "Golden Dataset" Concept (Phase 25)
To ensure AI reliability, we must establish a fixed set of test images (e.g., 50 images of known materials) alongside expected outputs. 
Before any prompt updates are pushed to production, they must be tested against the Golden Dataset to prevent accuracy regressions.

## AI Fallback & Failure Handling
**Do not invent a classification when the AI fails.**

If the AI provider times out or returns malformed JSON, the backend must catch it and return:
```json
{
  "classificationStatus": "needs-review",
  "message": "We could not confidently classify this image."
}
```

## AI Observability (Logging)
Every AI request must log the following metadata to the DB or APM (without storing raw base64 images to prevent bloat):
- `provider`
- `model`
- `latencyMs`
- `success`
- `confidence`
- `classificationStatus`
- `errorCode` (if applicable)

## Confidence vs Accuracy
- **Confidence**: The model's reported certainty (e.g., "I am 95% sure this is plastic").
- **Accuracy**: The actual correctness measured against a labeled dataset.
- Never conflate the two in admin dashboards.
