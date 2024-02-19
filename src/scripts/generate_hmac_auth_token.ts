import humps from "humps";
import { AxiosRequestConfig } from "axios";

// Get API key and secret from environment
const VENDOR_API_KEY = process.env.API_KEY; // Replace with your actual API key
const VENDOR_API_SECRET_KEY = process.env.API_SECRET_KEY; // Replace with your actual API secret key

export async function generateToken(
  request: AxiosRequestConfig,
  apiKey?: string,
  apiSecretKey?: string
): Promise<string> {
// Get HTTP method
  const httpMethod = request.method ? request.method.toUpperCase() : "GET";

  const url = new URL(request.url as string);
  const searchParams = new URLSearchParams(url.search);
  searchParams.set("client_type", "web");
  url.search = searchParams.toString();
  const path = url.pathname + url.search;
  const currentTime = new Date().getTime().toString();
  let body, rawSignature;

  if (httpMethod === "GET") {
    rawSignature = `${currentTime}\r\n${httpMethod}\r\n${path}\r\n\r\n`;
  } else {
    body = request.data
      ? JSON.stringify(humps.decamelizeKeys(request.data))
      : "";
    rawSignature = `${currentTime}\r\n${httpMethod}\r\n${path}\r\n\r\n${body}`;
  }

  // Use default values for apiKey and apiSecretKey if not provided
  apiKey = apiKey || VENDOR_API_KEY;
  apiSecretKey = apiSecretKey || VENDOR_API_SECRET_KEY;

  if (!apiKey || !apiSecretKey) {
    throw new Error("API key and/or secret key not provided");
  }

  const CryptoJS = await import(
    /* webpackChunkName: "crypto-js" */ "crypto-js"
  );

  const signature = CryptoJS.HmacSHA256(rawSignature, apiSecretKey).toString();
  const token = `hmac ${apiKey}:${currentTime}:${signature}`;

  return token;
}
