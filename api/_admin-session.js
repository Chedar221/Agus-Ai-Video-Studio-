import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "chedar_admin_session";

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function readCookie(header = "") {
  for (const part of String(header).split(";")) {
    const index = part.indexOf("=");
    if (index < 0 || part.slice(0, index).trim() !== COOKIE_NAME) continue;
    try { return decodeURIComponent(part.slice(index + 1).trim()); }
    catch { return null; }
  }
  return null;
}

export function isAdminRequest(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const configuredEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!secret || !configuredEmail) return false;

  const value = readCookie(req.headers?.cookie);
  if (!value) return false;
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return false;

  const payload = value.slice(0, separator);
  const suppliedSignature = value.slice(separator + 1);
  const expectedSignature = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(expectedSignature, suppliedSignature)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof session.email === "string"
      && session.email.toLowerCase() === configuredEmail
      && Number.isFinite(session.exp)
      && session.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}
