import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

let inMemoryTokens: AuthTokens = {
  accessToken: null,
  refreshToken: null,
};

let hasLoadedFromStorage = false;
let loadPromise: Promise<void> | null = null;

async function loadTokensFromStorage() {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);

  inMemoryTokens = {
    accessToken,
    refreshToken,
  };

  hasLoadedFromStorage = true;
}

async function ensureLoaded() {
  if (hasLoadedFromStorage) return;

  if (!loadPromise) {
    loadPromise = loadTokensFromStorage().finally(() => {
      loadPromise = null;
    });
  }

  await loadPromise;
}

export async function getAccessToken() {
  await ensureLoaded();
  return inMemoryTokens.accessToken;
}

export async function getRefreshToken() {
  await ensureLoaded();
  return inMemoryTokens.refreshToken;
}

export async function getAuthTokens(): Promise<AuthTokens> {
  await ensureLoaded();
  return { ...inMemoryTokens };
}

export async function setAccessToken(token: string) {
  inMemoryTokens.accessToken = token;
  hasLoadedFromStorage = true;
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function setRefreshToken(token: string) {
  inMemoryTokens.refreshToken = token;
  hasLoadedFromStorage = true;
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function setAuthTokens(accessToken: string, refreshToken: string) {
  inMemoryTokens = {
    accessToken,
    refreshToken,
  };
  hasLoadedFromStorage = true;

  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}

export async function clearAuthTokens() {
  inMemoryTokens = {
    accessToken: null,
    refreshToken: null,
  };
  hasLoadedFromStorage = true;

  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}
