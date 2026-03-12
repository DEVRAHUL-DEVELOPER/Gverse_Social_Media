// backend/helpers/cryptoHelper.js
import crypto from "crypto";

const secretKey = process.env.SECRET_KEY || "mySuperSecretKey123";

// Encrypt text
export const encryptMessage = (text) => {
  if (!text) return "";
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(secretKey).digest(),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt text
export const decryptMessage = (encryptedText) => {
  if (!encryptedText) return "";
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(secretKey).digest(),
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
