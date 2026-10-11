// Wraps async route handlers so rejections reach the error middleware
// instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Last stop: JSON error responses instead of HTML stack traces.
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Something went wrong while scoring." });
}
