export const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};

export const errorHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(error);
  import("fs").then(fs => {
    fs.appendFileSync("global_error.log", new Date().toISOString() + "\n" + (error.stack || error.message) + "\n\n");
  }).catch(e => console.error("Could not write log", e));

  let statusCode =
    res.statusCode >= 400
      ? res.statusCode
      : 500;
      
  let errorCode = error.code || "INTERNAL_ERROR";
  let errorMessage = error.message || "Internal server error";

  // Handle Multer specific errors (e.g. File too large)
  if (error.name === "MulterError") {
    statusCode = 400;
    errorCode = "UPLOAD_INVALID";
    if (error.code === "LIMIT_FILE_SIZE") {
      errorCode = "UPLOAD_TOO_LARGE";
      errorMessage = "File size exceeds the 10MB limit";
    }
  }

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && statusCode === 500
        ? "Something went wrong"
        : errorMessage,
    code: errorCode
  });
};
