function handleError(err, req, res, next) {
  console.error(err);
  return res.status(500).json({ error: "Something went wrong on the server" });
}

function getErrorMessage(err) {
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "value";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (err?.errors) {
    const firstError = Object.values(err.errors)[0];
    return firstError?.message || "Validation failed";
  }

  return err?.message || "Unexpected error";
}
export default {
  handleError: handleError,
  getErrorMessage: getErrorMessage,
};
