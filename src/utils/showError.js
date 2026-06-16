let errorHandler = null;

export function registerErrorHandler(handler) {
  errorHandler = handler;
}

export default function showError(message) {
  const text = String(message);
  if (errorHandler) {
    errorHandler(text);
  }
  console.error(text);
}
