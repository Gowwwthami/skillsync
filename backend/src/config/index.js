import dotenv from "dotenv";
dotenv.config();

export const config = {
  port:         process.env.PORT             || 5000,
  mongoUri:     process.env.MONGODB_URI,
  jwtSecret:    process.env.JWT_SECRET,
  jwtExpiry:    process.env.JWT_EXPIRES_IN   || "7d",
  githubToken:  process.env.GITHUB_TOKEN,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  nodeEnv:      process.env.NODE_ENV         || "development",
  corsOrigin:   process.env.CORS_ORIGIN      || "http://localhost:5173",
  appName:      process.env.APP_NAME         || "SkillSync",
};

export function validateConfig() {
  const required = ["mongoUri", "jwtSecret"];
  const missing = required.filter(k => !config[k]);
  if (missing.length) {
    console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
    console.error("   Check your backend/.env file");
    process.exit(1);
  }
}