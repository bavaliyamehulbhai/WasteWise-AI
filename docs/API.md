# WasteWise AI - API Contract Standardization

## Success Response Pattern
All successful API responses MUST follow this structure:

```json
{
  "success": true,
  "data": {
    // any payload data
  },
  "message": "Resource retrieved successfully"
}
```

## Error Response Pattern
All failed API responses MUST follow this structure and utilize standardized error codes to allow the frontend to easily branch logic.

```json
{
  "success": false,
  "message": "Human readable error message",
  "code": "ERROR_CODE"
}
```

### Standard Error Codes
- `AUTH_REQUIRED`: Missing or invalid JWT.
- `AUTH_INVALID`: JWT signature mismatch or tampered token.
- `RESOURCE_NOT_FOUND`: The requested ID does not exist in DB.
- `VALIDATION_ERROR`: Missing fields, invalid types (caught by validators).
- `RATE_LIMITED`: Too many requests.
- `AI_PROVIDER_ERROR`: Groq API timeout or 500 error.
- `AI_INVALID_RESPONSE`: Groq returned malformed JSON or hallucinated categories.
- `UPLOAD_INVALID`: MIME type or signature mismatch.
- `UPLOAD_TOO_LARGE`: File size exceeds limits.
- `DATABASE_ERROR`: Mongoose connection drop or save failure.
- `INTERNAL_ERROR`: Unhandled exceptions.

## Current API Routes
### Auth (`/api/auth`)
- `POST /register`: Create new user.
- `POST /login`: Authenticate and return JWT.

### AI & Scans (`/api/ai` & `/api/scans`)
- `POST /api/ai/classify`: Upload image, get AI classification, calculate XP.
- `GET /api/scans`: Get paginated history for current user.
- `DELETE /api/scans/:id`: Remove scan.

### Dashboard & Analytics (`/api/dashboard` & `/api/analytics`)
- `GET /api/dashboard`: High-level metrics for dashboard cards.
- `GET /api/dashboard/trends`: Timeseries data for chart.
- `GET /api/analytics`: Deep dive environmental metrics.

### Users (`/api/users`)
- `GET /api/users/profile`: Current user details and XP progress.
- `PUT /api/users/profile`: Update details.
