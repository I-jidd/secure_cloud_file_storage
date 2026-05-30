const ACCESS_TOKEN_KEY = "secure_cloud_access_token";

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
