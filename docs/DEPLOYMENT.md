# WasteWise AI - Production Deployment Strategy

## Architecture Mapping
- **Frontend**: Vercel or Netlify (React + Vite PWA)
- **Backend API**: Render or Railway (Node.js + Express)
- **Database**: MongoDB Atlas (Cloud Database)
- **Image Storage**: Cloudinary
- **AI Provider**: Groq Cloud

## Environment Configuration
Production environments must utilize an isolated configuration, distinct from development.
Never use the production MongoDB URI while developing locally.

Example Production Env (`.env.production`):
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://wastewise.example.com

MONGODB_URI=...
JWT_SECRET=...

GROQ_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## CI/CD Pipeline (GitHub Actions)
A workflow should be established in `.github/workflows/main.yml` that performs:
1. `npm install`
2. Run Linters.
3. Run automated tests (Unit & Integration).
4. Build the Vite frontend.
5. If tests or build fail, the deployment is blocked.

## Database Backups
Ensure MongoDB Atlas automated daily backups are enabled before official launch. A backup is only valid if a restore has been tested.
