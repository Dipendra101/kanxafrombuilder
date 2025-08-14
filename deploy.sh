#!/bin/bash

# Production Deployment Script for Kanxa Safari
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting Kanxa Safari Production Deployment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
check_env_var() {
    if [ -z "${!1}" ]; then
        echo "❌ Error: $1 environment variable is not set!"
        exit 1
    fi
}

echo "🔍 Checking environment variables..."
check_env_var "MONGODB_URI"
check_env_var "JWT_SECRET"
check_env_var "NODE_ENV"

# Check if NODE_ENV is set to production
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to 'production'"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm ci --only=production && cd ..

# Build the application
echo "🔨 Building application..."
npm run build

# Run database seeding
echo "🌱 Seeding database..."
cd server && npm run seed && cd ..

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed! dist directory not found."
    exit 1
fi

# Create backup of current deployment (if exists)
if [ -d "/var/www/kanxa-safari" ]; then
    echo "💾 Creating backup of current deployment..."
    sudo cp -r /var/www/kanxa-safari "/var/www/kanxa-safari-backup-$(date +%Y%m%d_%H%M%S)"
fi

# Deploy files
echo "📁 Deploying files..."
sudo mkdir -p /var/www/kanxa-safari
sudo cp -r dist/* /var/www/kanxa-safari/
sudo cp package.json /var/www/kanxa-safari/
sudo cp .env /var/www/kanxa-safari/

# Set correct permissions
echo "🔒 Setting permissions..."
sudo chown -R www-data:www-data /var/www/kanxa-safari
sudo chmod -R 755 /var/www/kanxa-safari

# Restart services
echo "🔄 Restarting services..."

# If using PM2
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting PM2 services..."
    pm2 reload ecosystem.config.js --env production
    pm2 save
else
    echo "⚠️  PM2 not found. Please manually restart your application server."
fi

# If using systemd service
if systemctl is-active --quiet kanxa-safari; then
    echo "🔄 Restarting systemd service..."
    sudo systemctl restart kanxa-safari
fi

# If using nginx
if systemctl is-active --quiet nginx; then
    echo "🔄 Restarting nginx..."
    sudo systemctl reload nginx
fi

# Health check
echo "🏥 Performing health check..."
sleep 5

# Check if health endpoint responds
if command -v curl &> /dev/null; then
    HEALTH_URL="${BASE_URL:-http://localhost:3000}/api/health"
    if curl -f -s "$HEALTH_URL" > /dev/null; then
        echo "✅ Health check passed!"
        echo "🎉 Deployment completed successfully!"
        echo ""
        echo "🌐 Application URL: ${BASE_URL:-http://localhost:3000}"
        echo "📊 Health Check: $HEALTH_URL"
        echo ""
        echo "📋 Post-deployment checklist:"
        echo "  - [ ] Test user registration and login"
        echo "  - [ ] Test booking flow"
        echo "  - [ ] Test payment integration"
        echo "  - [ ] Test admin dashboard"
        echo "  - [ ] Verify email notifications"
        echo "  - [ ] Check application logs"
        echo ""
        echo "📝 Monitor logs with:"
        echo "  pm2 logs kanxa-safari"
        echo "  sudo journalctl -u kanxa-safari -f"
    else
        echo "❌ Health check failed!"
        echo "Please check application logs and ensure the service is running."
        exit 1
    fi
else
    echo "⚠️  curl not found. Please manually verify the application is running."
fi

echo "🎯 Deployment complete!"
