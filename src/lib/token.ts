// src/lib/token.ts
const TOKEN_KEY = "token";

export function getToken(): string | null {
  const t = localStorage.getItem(TOKEN_KEY);
  if (!t || t === "undefined" || t === "null" || t.trim() === "") return null;
  return t;
}

export function setToken(token: string | undefined | null) {
  if (typeof token === "string" && token.trim() !== "") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
