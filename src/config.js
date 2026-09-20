// The API URL is public, so it is fine to keep it in the frontend.
// You can override it with VITE_API_URL in a .env.local file.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://kcoze2d537.execute-api.ap-southeast-2.amazonaws.com/analyze";

// Longest message we allow the user to send.
export const MAX_MESSAGE_LENGTH = 5000;

// How long we wait for the backend before giving up (in milliseconds).
export const REQUEST_TIMEOUT_MS = 45000;
