export const GH_CLIENT_ID = "cdd62f6610c1f7c513ea";
export const REDIRECT_URI = process.env.NODE_ENV === "production" ? "..." : "http://localhost:3000/callback";

export const GITHUB_OAUTH_URI = (state = "") =>
  `https://github.com/login/oauth/authorize?client_id=${GH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user&state=${state}`;
