// Configuration file for Kanxa Safari application
export const config = {
  // Server Configuration
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'kanxa-safari-development-secret-key-2024',

  // Payment Gateway Keys (Demo)
  KHALTI_PUBLIC_KEY: process.env.KHALTI_PUBLIC_KEY || 'test_public_key_123456',
  ESEWA_MERCHANT_CODE: process.env.ESEWA_MERCHANT_CODE || 'test_merchant_123456',

  // Base URL
  BASE_URL: process.env.BASE_URL || 'http://localhost:8080',

  // Ping Message
  PING_MESSAGE: process.env.PING_MESSAGE || 'Kanxa Safari API is running!',
};
