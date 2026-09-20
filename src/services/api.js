import { API_URL, REQUEST_TIMEOUT_MS } from "../config";
import { normalizeResult } from "./normalizeResult";

// A small error type so the UI can show a helpful message for each failure.
// kind: "network" | "timeout" | "server" | "parse" | "cancelled"
export class ApiError extends Error {
  constructor(message, kind) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
  }
}

/**
 * Sends a message to the ScamTrace backend and returns a normalized result.
 * The backend URL and response format live in config.js and normalizeResult.js,
 * so this file rarely needs to change.
 */
export async function analyzeMessage(message, { signal } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("timeout"), REQUEST_TIMEOUT_MS);

  // Let the caller cancel the request (for the "Cancel" button).
  if (signal) {
    signal.addEventListener("abort", () => controller.abort("cancelled"), { once: true });
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });
  } catch {
    if (controller.signal.aborted) {
      if (controller.signal.reason === "timeout") {
        throw new ApiError("The analysis took too long to finish.", "timeout");
      }
      throw new ApiError("Analysis cancelled.", "cancelled");
    }
    throw new ApiError("We couldn't reach the ScamTrace server.", "network");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new ApiError(
      `The server replied with an error (status ${response.status}).`,
      "server"
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError("The server sent a reply we couldn't read.", "parse");
  }

  return normalizeResult(data);
}
