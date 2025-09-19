// src/lib/token.ts
const TOKEN_KEY = "token";
const USER_KEY = "user";

// TOKEN

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

// USER

type User = { id?: number; username: string };

export function getUser(): User | null {
  const user = localStorage.getItem(USER_KEY);
  if (!user || user === "undefined" || user === "null" || user.trim() === "")
    return null;
  return JSON.parse(user);
}

export function setUser(user: User | undefined | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
