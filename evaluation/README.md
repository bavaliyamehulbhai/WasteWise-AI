# AI Evaluation Dataset

This directory contains the tools and ground-truth data required to benchmark the WasteWise AI classification engine.

## Usage

1. Create an `images/` directory inside `evaluation/`.
2. Add your test images (e.g., `bottle01.jpg`, `can01.jpg`) into the `images/` folder.
3. Update `labels.csv` with the exact filename and the correct ground truth category (e.g., Plastic, Metal, Paper, Organic, Glass, E-Waste, General Waste, Other).
4. Run `node benchmark.js` to execute the evaluation against the Groq vision model.
5. Review the generated `report-template.md` (which will be populated by the script).
