# WasteWise AI - Security Audit

## Authentication
- [x] Passwords must be hashed using `bcrypt` before storage.
- [x] JWT tokens must be signed with a secure `JWT_SECRET`.
- [x] JWTs should have an expiration time (e.g., `1d` or `7d`).
- [ ] JWTs should not be stored in `localStorage` in a production PWA if XSS is a high risk (consider `HttpOnly` cookies for Phase 25).

## Authorization & RBAC
- Frontend role protection (hiding buttons) is NOT security.
- All Admin and Reviewer routes must be protected by a robust backend middleware:
```javascript
router.get("/admin/users", protect, authorize("admin"), getUsers);
```

## API Hardening
- **Rate Limiting**: Prevent abuse (e.g., 1000 scans/min) by applying `express-rate-limit`.
- **CORS**: Restrict cross-origin resource sharing to the production frontend domain.
- **Helmet**: Add HTTP headers for basic security.
- **Input Validation**: Never trust client payloads. Validate types and lengths before touching the DB.
- **Ownership Checks**: A user should never be able to access or delete a scan belonging to another user.

## File Upload Security
- **MIME Validation**: Ensure `req.file` is actually `image/jpeg` or `image/png`.
- **Size Limits**: Reject files over 5MB before they hit Cloudinary.
- **Single File Limits**: Limit the multer upload to `.single('image')`.

## Secrets Management
Never commit `.env` files. Ensure the following are injected via the hosting provider's environment variables:
- `GROQ_API_KEY`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_API_SECRET`
