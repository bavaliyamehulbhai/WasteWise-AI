# WasteWise AI 🌍

> **Understand your waste. Make better disposal decisions.**  
> *Developed for IBM Internship Program*

WasteWise AI is a progressive web application (PWA) that leverages vision-based Artificial Intelligence to classify waste images and provide immediate, actionable disposal guidance. 

Built as a full-stack MERN application, it focuses on promoting sustainable habits through gamification, reliable offline-first architecture, an administrative management OS, and robust AI validation.

---

## 🎯 1M1B – IBM SkillsBuild AI + Sustainability Alignment

This project is built for the **1M1B AI for Sustainability Virtual Internship** (in collaboration with **IBM SkillsBuild & AICTE**).

| Dimension | Project Mapping |
|---|---|
| **Project Category** | **Water & Waste** (AI-based waste segregation guide) |
| **Primary SDG** | **SDG 12: Responsible Consumption and Production** (Target 12.5: Substantially reduce waste generation through prevention, reduction, recycling, and reuse) |
| **Secondary SDGs** | **SDG 11: Sustainable Cities & Communities** & **SDG 13: Climate Action** |
| **Problem Statement** | *"How might we use AI to classify and guide municipal waste segregation at the source so that urban communities and campuses can become more sustainable?"* |
| **AI Workflows** | Multimodal Vision Classification, Prompt Engineering, Fallback Logic, Agentic Chatbot |
| **Target Audience** | Citizens, students, municipal waste collectors, and campus communities |

---

## 🚀 Key Features

- **Modern Landing Page:** A dedicated marketing and informational homepage with value propositions, 3-step workflow, and direct scanner access.
- **AI-Powered Image Scanning:** Upload or capture photo in real-time to classify waste category and material using high-speed Groq AI vision inference.
- **Actionable Disposal Guidance:** Step-by-step preparation and disposal advice tailored to material types (Recycle, Compost, General Waste, Special Disposal, E-Waste).
- **Interactive AI Eco-Assistant:** Integrated floating AI chat widget providing instant answers to sustainability and recycling queries.
- **Gamification & Impact Tracking:** Earn XP for every scan, level up, unlock achievement badges, view the sustainability leaderboard, and celebrate with celebratory micro-animations.
- **Analytics & Carbon Metrics:** 30-day waste category trends, diverted landfill weight estimations, and personal carbon offset metrics.
- **Offline-First PWA:** Installable on mobile and desktop. Caches the app shell with Workbox and queues pending scans in IndexedDB when offline, auto-syncing when internet returns.
- **WasteWise Admin OS:** Comprehensive administrative console (`/admin`) for managing disposal rules, external knowledge sources, system health diagnostics, and user feedback.
- **Enterprise-Grade Security:** Input sanitization, CORS restrictions, Helmet HTTP security headers, Express rate-limiting, and complete account deletion with Cloudinary asset cleanup.

---

## 🏗 Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Vanilla CSS & Tailwind CSS v4 (Custom Light & Dark Mode)
- **Icons:** Lucide React
- **Routing:** React Router DOM v7
- **PWA / Offline:** Workbox (Vite PWA Plugin) & IndexedDB (`idb`)
- **HTTP Client:** Axios (with Bearer token interceptor)

### Backend
- **Runtime & Server:** Node.js & Express.js (ES Modules)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **AI Classification Engine:** Groq SDK (`qwen/qwen3.8-27b`)
- **Image Storage & CDN:** Cloudinary SDK v2
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt password hashing
- **Security:** Helmet, Express Rate Limit, Request Logger

---

## 🧠 AI Pipeline & Responsible AI

1. **Image Preprocessing:** Images are uploaded via camera or file picker and validated for MIME type and file size (< 5MB).
2. **Inference:** The backend passes the image data to Groq's high-speed inference engine.
3. **Strict Validation:** AI responses are strictly validated against allowed categories (`Plastic`, `Paper`, `Glass`, `Metal`, `Organic`, `E-Waste`, `General Waste`). Deviances or hallucinations are automatically caught and filtered.
4. **Safety Fallback:** If confidence is low or unidentifiable, the system assigns a safe fallback, prompting user clarification without giving dangerous disposal advice.

For deeper architecture details, see:
- [AI Architecture Documentation](./docs/AI.md)
- [Responsible AI Guidelines](./docs/RESPONSIBLE_AI.md)

---

## 🔑 Demo & Testing Credentials

For quick evaluation and testing, you can use the pre-configured demo account or seed sample data:

| Role | Email | Password | Access |
|---|---|---|---|
| **Demo User** | `demo@wastewise.app` | `demo123` | Full User App, Scans, Gamification |
| **Admin** | `admin@wastewise.app` | *(Configured by Admin)* | Admin Dashboard (`/admin`) |

To seed sample scans, badges, and demo data into your MongoDB database:
```bash
cd server
npm run seed
```

---

## 🛠 Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas database connection URL
- Groq API Key
- Cloudinary Account (Cloud Name, API Key, API Secret)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/WasteWise-AI.git
cd WasteWise-AI
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (refer to `.env.example`):
```env
PORT=5000

# MongoDB Configuration
MONGODB_URI=your_mongodb_uri

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Provider
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
GROQ_VISION_MODEL=qwen/qwen3.8-27b

# Client URL (Optional)
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Visit **`http://localhost:5173`** to view the application.

---

## 📚 Project Documentation

Detailed architecture specifications and guides are located in the `/docs` directory:

- [System Architecture & Data Flow](./docs/ARCHITECTURE.md)
- [REST API Endpoints Specification](./docs/API.md)
- [Database Models & Schema](./docs/DATABASE.md)
- [AI Engine & Model Specs](./docs/AI.md)
- [Responsible AI Guidelines](./docs/RESPONSIBLE_AI.md)
- [Security & Rate Limiting](./docs/SECURITY.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Project Status](./docs/PROJECT_STATUS.md)

---

## 📄 License

This project was developed for the IBM Internship Program and is licensed under the MIT License.
