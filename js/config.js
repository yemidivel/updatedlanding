/**
 * SellSync Configuration
 *
 * After deploying the backend to Vercel, replace the empty string
 * below with your backend URL, e.g. "https://sellsync-api.vercel.app"
 */

const IS_LOCAL = ["localhost", "127.0.0.1", "0.0.0.0"].includes(
  window.location.hostname,
);

const CONFIG = {
  /**
   * Real backend URL. When USE_MOCK is true the login/signup pages talk to
   * the local Express server instead (finalLanding/server.js on :3001).
   * Locally this points at the real Express/Prisma backend on :5000.
   * Production defaults to the existing api.sellsync.store deployment;
   * change it here if the backend moves.
   */
  API_BASE_URL: IS_LOCAL
    ? "http://localhost:5000"
    : "https://api.sellsync.store",

  /**
   * Where a successful login sends the user. Locally this is the Vite dev
   * server; in production it is the main SellSync app domain.
   */
  APP_URL: IS_LOCAL ? "http://localhost:5173" : "https://app.sellsync.store",

  /**
   * Mock mode: use the same-origin mock auth API + signed session cookie so
   * the whole flow can be tested on a local machine. Set to false to hit the
   * real API_BASE_URL (credentials then travel via the cookie as well).
   * Locally this is false — we authenticate against the real backend (which
   * auto-verifies accounts in development).
   */
  USE_MOCK: false,

  /**
   * Prefix for the auth API. When USE_MOCK is true the server already serves
   * /api/auth/* on the same origin, so this is left empty.
   */
  MOCK_API_BASE: "",
};
