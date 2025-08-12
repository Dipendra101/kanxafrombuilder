import twilio from "twilio";

interface SMSConfig {
  twilioClient: any | null;
  phoneNumber: string | null;
  isConfigured: boolean;
}

// Twilio configuration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Initialize SMS configuration
const initializeSMSConfig = (): SMSConfig => {
  const config: SMSConfig = {
    twilioClient: null,
    phoneNumber: null,
    isConfigured: false,
  };

  // Check if all required environment variables are present
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.log("⚠️  Twilio SMS not configured - missing environment variables");
    console.log("   Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER");
    console.log("   SMS will be simulated in development mode");
    return config;
  }

  // Validate phone number format
  if (!TWILIO_PHONE_NUMBER.match(/^\+[1-9]\d{1,14}$/)) {
    console.error("❌ Invalid Twilio phone number format. Must be in E.164 format (e.g., +1234567890)");
    return config;
  }

  try {
    // Initialize Twilio client
    config.twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    config.phoneNumber = TWILIO_PHONE_NUMBER;
    config.isConfigured = true;
    
    console.log("✅ Twilio SMS configured successfully");
    console.log(`   Phone Number: ${TWILIO_PHONE_NUMBER}`);
    
    return config;
  } catch (error: any) {
    console.error("❌ Failed to initialize Twilio client:", error.message);
    return config;
  }
};

// Export the initialized configuration
export const smsConfig = initializeSMSConfig();

// Helper function to send SMS
export const sendSMS = async (to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  if (!smsConfig.isConfigured || !smsConfig.twilioClient) {
    return {
      success: false,
      error: "SMS service not configured"
    };
  }

  try {
    const result = await smsConfig.twilioClient.messages.create({
      body: message,
      from: smsConfig.phoneNumber,
      to: to
    });

    return {
      success: true,
      messageId: result.sid
    };
  } catch (error: any) {
    console.error("SMS sending error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to validate phone number for SMS
export const isValidSMSNumber = (phoneNumber: string): boolean => {
  // Remove all non-digits and check basic format
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Must be between 10-15 digits (international format)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false;
  }
  
  // Should match E.164 format when formatted
  const e164Format = phoneNumber.match(/^\+[1-9]\d{1,14}$/);
  return !!e164Format;
};

export default smsConfig;
