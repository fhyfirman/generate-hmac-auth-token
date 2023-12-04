require("dotenv").config();
const CryptoJS = require("crypto-js");

// Get HTTP method
const httpMethod = process.env.HTTP_METHOD; // Replace with your actual HTTP method

// Get API key and secret from environment
const apiKey = process.env.API_KEY; // Replace with your actual API key
const apiSecretKey = process.env.API_SECRET_KEY; // Replace with your actual API secret key

// Generate time and get the full path from URL
const currentTime = new Date().getTime().toString();

// Replace with your actual resource path
const path = process.env.URL_PATH;
let body, rawSignature;

// Check and generate raw signature
if (httpMethod === "GET") {
  rawSignature = `${currentTime}\r\n${httpMethod}\r\n${path}\r\n\r\n`;
} else {
  // Replace 'your_request_body' with the actual request body string
  body = "your_request_body";
  rawSignature = `${currentTime}\r\n${httpMethod}\r\n${path}\r\n\r\n${body}`;
}

// Generate signature
const signature = CryptoJS.HmacSHA256(rawSignature, apiSecretKey).toString();

// Generate token
const token = `hmac ${apiKey}:${currentTime}:${signature}`;

// Log or use the generated token as needed
console.log("Generated Token:", token);
