import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                                Spotify URLs                                */
/* -------------------------------------------------------------------------- */

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE_URL = "https://api.spotify.com/v1";

/* --------------------------------- envars --------------------------------- */
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_CALLBACK_URI || "http://localhost:5173/callback";
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "";

/* ---------------------------------- scopes --------------------------------- */
const SCOPES = ["user-read-private", "user-read-email"];

/**
 * Generates the spotify auth url from envars
 * @returns the full url to redirect to the spotify login
 */
export const getSpotifyAuthUrl = (): string => {
  const url = `${AUTH_URL}response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${SCOPES.join("%20")}`;
  return url;
};

/**
 * Fetches access token using auth code
 * @param code the auth code from spotify after login
 * @returns access token
 */
export const fetchAccessToken = async (code: string): Promise<string> => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  try {
    const response = await axios.post(TOKEN_URL, body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching token", error);
    throw new Error("Failed to fetch token");
  }
};

/**
 * 
 * @param accessToken the access token provided by spotify
 * @returns 
 */
export const fetchUserProfile = async (accessToken: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile", error);
    throw new Error("Failed to fetch user profile");
  }
};
