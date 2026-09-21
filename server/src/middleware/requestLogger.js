import crypto from "crypto";

const requestLogger = (req, res, next) => {
  // Generate a unique Request ID
  const requestId = crypto.randomUUID();
  req.id = requestId;
  res.setHeader("X-Request-ID", requestId);

  // Record start time
  const start = Date.now();

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    
    // Skip logging for simple preflight requests to avoid clutter
    if (req.method === "OPTIONS") return;
    
    console.log(
      `[${timestamp}] [ReqID: ${requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

export default requestLogger;
