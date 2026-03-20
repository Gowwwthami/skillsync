export const errorHandler = (err, req, res, next) => {
  console.error(`❌ [${req.method}] ${req.path} →`, err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};