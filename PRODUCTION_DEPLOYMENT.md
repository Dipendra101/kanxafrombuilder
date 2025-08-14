# Production Deployment Guide

This guide covers deploying Kanxa Safari to production with proper security and configuration.

## Prerequisites

- Node.js 18+ 
- MongoDB Atlas account or production MongoDB instance
- Khalti merchant account (for live payments)
- eSewa merchant account (for live payments)
- Email service (Gmail with app password or SMTP service)
- Twilio account (for SMS functionality)

## Environment Configuration

### 1. Copy Environment Template
```bash
cp .env.example .env
```

### 2. Configure Production Environment Variables

#### Database
- Get MongoDB Atlas connection string from https://cloud.mongodb.com/
- Replace `MONGODB_URI` with your production database URL
- Ensure database name is `kanxasafari` or update accordingly

#### JWT Secret
- Generate a strong JWT secret (minimum 32 characters)
- Use a tool like: `openssl rand -base64 32`

#### Payment Gateways
**Khalti (Live Keys)**
- Login to https://khalti.com/
- Go to Settings > Keys
- Copy Live Secret Key and Live Public Key

**eSewa (Live Credentials)**
- Contact eSewa support for live merchant credentials
- Replace test credentials with live ones

#### Email Service
**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate app-specific password
3. Use the app password in `EMAIL_PASS`

**Alternative SMTP:**
- Use services like SendGrid, Mailgun, or AWS SES
- Update email configuration in `server/services/emailService.ts`

#### SMS Service (Twilio)
1. Sign up at https://console.twilio.com/
2. Get Account SID, Auth Token, and Phone Number
3. Add to environment variables

### 3. Security Configuration

#### Update Default Admin Credentials
1. Set secure admin email and password in environment
2. After first deployment, login and change password immediately
3. Consider creating additional admin users and removing default

#### Database Security
- Enable MongoDB authentication
- Use strong database passwords
- Restrict IP access to your server only
- Enable SSL/TLS connections

## Deployment Options

### Option 1: Netlify + MongoDB Atlas

This is the simplest deployment option for the current setup.

#### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/spa`
3. Set environment variables in Netlify dashboard
4. Enable Netlify Functions for API

#### Backend (Netlify Functions)
- The API is configured to run as Netlify Functions
- Functions are defined in `netlify/functions/`
- Environment variables are set in Netlify dashboard

#### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Create database user with read/write permissions
3. Get connection string and update `MONGODB_URI`
4. Whitelist Netlify's IP addresses or use 0.0.0.0/0 (less secure)

### Option 2: Full Server Deployment (VPS/Cloud)

For more control, deploy to a VPS or cloud provider.

#### Server Setup
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone repository
git clone https://github.com/your-username/kanxa-safari.git
cd kanxa-safari

# Install dependencies
npm install
cd server && npm install && cd ..

# Build application
npm run build
```

#### Configure PM2
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'kanxa-safari',
    script: './dist/server/node-build.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

#### Start Application
```bash
# Start in production mode
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/kanxa-safari/dist/spa;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment Setup

### 1. Database Seeding
```bash
# Seed the database with initial data
npm run seed
```

This creates:
- Admin user (admin@kanxasafari.com)
- Sample services (buses, cargo, materials, etc.)
- Service categories and types

### 2. Admin Configuration
1. Login with admin credentials
2. Change default password immediately
3. Add/modify services as needed
4. Configure payment settings
5. Test all functionality

### 3. Testing
1. Test user registration and login
2. Test booking flow
3. Test payment integration (use test mode first)
4. Test admin dashboard functionality
5. Test email notifications
6. Test SMS functionality

## Security Checklist

- [ ] Environment variables are properly set
- [ ] Default admin password is changed
- [ ] Database access is restricted
- [ ] HTTPS is enabled (use Cloudflare or Let's Encrypt)
- [ ] Payment gateways are in live mode
- [ ] Error logging is configured
- [ ] Backup strategy is in place
- [ ] Monitoring is set up

## Monitoring and Maintenance

### Application Logs
```bash
# View PM2 logs
pm2 logs kanxa-safari

# Monitor application
pm2 monit
```

### Database Monitoring
- Use MongoDB Atlas monitoring
- Set up alerts for connection issues
- Monitor disk usage and performance

### Error Tracking
Consider integrating error tracking services:
- Sentry
- LogRocket
- Bugsnag

## Backup Strategy

### Database Backup
```bash
# Manual backup
mongodump --uri="your-mongodb-uri" --out=/backup/folder

# Automated backup (add to cron)
0 2 * * * mongodump --uri="your-mongodb-uri" --out=/backup/$(date +\%Y\%m\%d)
```

### Code Backup
- Use Git for version control
- Keep production branch separate
- Tag releases

## Scaling Considerations

### Performance Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries

### Load Balancing
- Use multiple server instances
- Implement session clustering
- Use Redis for session storage

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check MongoDB URI format
- Verify network access
- Check database credentials

**Payment Gateway Errors**
- Verify API keys are correct
- Check if in live/test mode
- Verify callback URLs

**Email Not Sending**
- Check SMTP settings
- Verify app password for Gmail
- Check spam folder

**SMS Not Working**
- Verify Twilio credentials
- Check phone number format
- Verify Twilio balance

### Logs and Debugging
```bash
# Check application logs
pm2 logs kanxa-safari --lines 100

# Check system logs
sudo journalctl -u nginx -f

# Check MongoDB logs
sudo journalctl -u mongod -f
```

## Support

For deployment support:
- Check documentation: https://your-docs-url.com
- Create GitHub issue: https://github.com/your-repo/issues
- Contact support: support@kanxasafari.com
