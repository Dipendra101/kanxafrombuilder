# SMS Integration Setup Guide

This guide will help you configure real SMS sending functionality for Kanxa Safari using Twilio.

## 🚀 Quick Setup

### 1. Create Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. Complete phone verification

### 2. Get Your Credentials
Once logged in to Twilio Console:

1. **Account SID** - Copy from main dashboard
2. **Auth Token** - Click "View" next to Auth Token on dashboard  
3. **Phone Number** - Get a trial number:
   - Go to Phone Numbers → Manage → Buy a number
   - For trial: Select any available number
   - For production: Purchase a number with SMS capabilities

### 3. Configure Environment Variables
Update your `server/.env` file:

```bash
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

### 4. Restart Server
```bash
cd server
npm run dev
```

## 🧪 Testing SMS

### Option 1: SMS Test Page
Visit: `http://localhost:5173/sms-test`

This page provides:
- Setup instructions
- SMS sending test interface
- Configuration status
- Generated codes (when Twilio not configured)

### Option 2: Login Flow Test
1. Go to login page
2. Click "SMS Login"
3. Enter Nepali phone number (+977-98X-XXX-XXXX)
4. Check for SMS on your phone

## 📱 Phone Number Requirements

### Supported Formats
- **Input**: `984-942-3853` 
- **Processed**: `+977984942383`
- **Validation**: Must start with `98` (Nepali mobile)

### International Format
The system automatically converts to E.164 format:
- Input: `984942383`
- Output: `+977984942383`

## 🔧 Technical Details

### SMS Flow
1. User enters phone number
2. System validates format
3. Generates 6-digit code
4. Sends via Twilio (or logs to console)
5. Stores code for 10 minutes
6. User enters code for verification

### Fallback Behavior
When Twilio is not configured:
- ✅ SMS codes are generated
- ✅ Validation works normally  
- ✅ Codes logged to server console
- ✅ Codes returned in development mode
- ❌ No actual SMS sent

### Production Considerations

#### Security
- Never commit real credentials to git
- Use environment variables
- Rotate Auth Tokens regularly
- Monitor usage in Twilio Console

#### Cost Management
- Trial account: $15.50 credit
- SMS cost: ~$0.0075 per message
- Set up usage alerts in Twilio

#### Phone Number Verification
For production, consider:
- Verify phone numbers to reduce fraud
- Implement rate limiting per phone number
- Add CAPTCHA for high-volume endpoints

## 🛠️ Development vs Production

### Development Mode
```bash
# Not configured - simulation mode
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

**Behavior:**
- Codes logged to console
- Codes returned in API response
- No real SMS sent
- Faster testing

### Production Mode
```bash
# Configured - real SMS mode
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your_real_auth_token
TWILIO_PHONE_NUMBER=+15551234567
```

**Behavior:**
- Real SMS sent via Twilio
- Codes not logged/returned
- Production-ready security

## 🔍 Troubleshooting

### Common Issues

#### 1. "SMS service not configured"
- Check environment variables are set
- Restart server after adding variables
- Verify variable names match exactly

#### 2. "Invalid phone number format"
- Ensure number starts with +977-98
- Check E.164 format: +977984942383
- Verify 10 digits after country code

#### 3. Twilio API Errors
- Verify Account SID and Auth Token
- Check phone number is SMS-enabled
- Ensure sufficient account balance
- Check Twilio service status

#### 4. "Request failed with status 401"
- Auth Token is incorrect
- Account SID doesn't match
- Credentials may be revoked

### Debug Steps
1. Check server console for SMS configuration logs
2. Verify environment variables: `console.log(process.env.TWILIO_ACCOUNT_SID)`
3. Test with SMS test page: `/sms-test`
4. Check Twilio Console logs for delivery status

## 📊 Monitoring

### Server Logs
```bash
# Success
✅ Twilio SMS configured successfully
✅ SMS sent successfully to +977984942383. Message ID: SM1234567890

# Failure  
❌ Failed to send SMS: [21211] Invalid 'To' Phone Number
⚠️ Twilio SMS not configured - missing environment variables
```

### Twilio Console
- Monitor message delivery status
- Track usage and costs
- View error logs and details
- Set up alerts for failures

## 🚀 Next Steps

1. **Configure Twilio** with your credentials
2. **Test thoroughly** with real phone numbers  
3. **Monitor usage** to avoid unexpected costs
4. **Set up alerts** for failures or high usage
5. **Consider webhooks** for delivery status updates

---

## 📞 Support

For issues:
- Check [Twilio Documentation](https://www.twilio.com/docs/sms)
- Visit SMS test page: `/sms-test`
- Check server console logs
- Review this documentation

**Happy texting! 📱**
