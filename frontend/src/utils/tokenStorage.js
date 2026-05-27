const ACCESS_TOKEN_KEY = "secure_cloud_access_token";

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(token) {
  localStorage.getItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(token) {
  localStorage.removeItem(ACCESS_TOKEN_KEY, token);
}
