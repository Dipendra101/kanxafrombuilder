# Kanxa Safari - Complete Platform

A comprehensive transportation, construction, and garage services platform built with React, TypeScript, and Node.js.

## 🚀 Features

### User Side
- **Transportation Services**
  - Bus booking system
  - Cargo transportation
  - Tour packages
  - Live route tracking
  - Seat selection

- **Construction Services**
  - Material ordering (cement, steel, blocks, etc.)
  - Machinery rental
  - Inventory management
  - Supplier management

- **Garage Services**
  - Vehicle maintenance
  - Repair services
  - Service scheduling
  - Parts inventory

- **User Management**
  - User registration and authentication
  - Profile management
  - Booking history
  - Payment management

- **Communication**
  - Real-time chat support
  - Notification system
  - Email updates

### Admin Side
- **Dashboard**
  - Real-time statistics
  - Revenue analytics
  - System monitoring
  - Quick actions

- **User Management**
  - User accounts management
  - Verification system
  - Activity tracking
  - User analytics

- **Service Management**
  - Transportation route management
  - Construction inventory
  - Garage service management
  - Order processing

- **Analytics & Reports**
  - Business analytics
  - Revenue reports
  - User behavior analysis
  - Performance metrics

- **System Settings**
  - Configuration management
  - Security settings
  - Payment gateway setup
  - Backup management

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for components
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for forms
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Zod** for validation
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Payment Integration
- **Khalti** payment gateway
- **eSewa** payment gateway
- **Cash** and **Credit** options

## 📁 Project Structure

```
kanxafrombuilder/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   └── ...            # User pages
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   └── lib/               # Utility functions
├── server/                # Backend Node.js application
│   ├── routes/            # API route handlers
│   └── index.ts           # Server entry point
├── shared/                # Shared types and utilities
└── netlify/               # Netlify deployment configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kanxafrombuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   
   # Payment Gateway Keys
   KHALTI_PUBLIC_KEY=your-khalti-public-key
   ESEWA_MERCHANT_CODE=your-esewa-merchant-code
   
   # Base URL
   BASE_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Admin Panel: http://localhost:3000/admin/login

## 🔐 Authentication

### User Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Session management
- Password reset functionality

### Admin Authentication
- Secure admin login
- Role-based access control
- Session management

### Demo Credentials
- **User**: Any email/password combination (demo mode)
- **Admin**: 
  - Username: `admin`
  - Password: `admin`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user

### Transportation
- `GET /api/transportation/routes` - Get all routes
- `POST /api/transportation/book` - Book transportation
- `GET /api/transportation/bookings` - Get user bookings
- `POST /api/transportation/bookings/:id/cancel` - Cancel booking

### Construction
- `GET /api/construction/materials` - Get materials
- `GET /api/construction/machinery` - Get machinery
- `POST /api/construction/order` - Place order
- `POST /api/construction/machinery/rent` - Rent machinery

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password
- `GET /api/user/activity` - Get user activity

### Bookings
- `GET /api/booking` - Get user bookings
- `POST /api/booking` - Create booking
- `PUT /api/booking/:id` - Update booking
- `POST /api/booking/:id/cancel` - Cancel booking

### Payments
- `POST /api/payment/initiate` - Initiate payment
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/history` - Payment history
- `POST /api/payment/:id/refund` - Process refund

### Chat
- `GET /api/chat/conversations` - Get conversations
- `POST /api/chat/conversations` - Create conversation
- `GET /api/chat/conversations/:id/messages` - Get messages
- `POST /api/chat/conversations/:id/messages` - Send message

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI and Tailwind CSS:

- **Layout Components**: Header, Footer, Sidebar, Navigation
- **Form Components**: Input, Select, Checkbox, Radio, DatePicker
- **Data Display**: Table, Card, Badge, Progress, Avatar
- **Feedback**: Toast, Alert, Dialog, Modal
- **Navigation**: Breadcrumb, Pagination, Tabs
- **Interactive**: Button, Dropdown, Menu, Tooltip

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run typecheck` - Type checking

### Code Style
- Prettier for code formatting
- ESLint for code linting
- TypeScript for type safety

## 🚀 Deployment

### Netlify Deployment
The application is configured for Netlify deployment with:
- Serverless functions for API endpoints
- Static site generation for the frontend
- Environment variable management

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
KHALTI_PUBLIC_KEY=your-production-khalti-key
ESEWA_MERCHANT_CODE=your-production-esewa-code
BASE_URL=https://your-domain.com
```

## 📊 Features Overview

### Transportation Module
- ✅ Route management
- ✅ Booking system
- ✅ Seat selection
- ✅ Payment integration
- ✅ Live tracking
- ✅ Cargo services

### Construction Module
- ✅ Material catalog
- ✅ Inventory management
- ✅ Order processing
- ✅ Machinery rental
- ✅ Supplier management

### Garage Module
- ✅ Service booking
- ✅ Repair tracking
- ✅ Parts inventory
- ✅ Technician management

### User Management
- ✅ Registration/Login
- ✅ Profile management
- ✅ Booking history
- ✅ Payment history
- ✅ Preferences

### Admin Panel
- ✅ Dashboard analytics
- ✅ User management
- ✅ Service management
- ✅ Order processing
- ✅ System settings

### Communication
- ✅ Real-time chat
- ✅ Notifications
- ✅ Email updates
- ✅ Support system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced payment methods
- [ ] Real-time notifications
- [ ] AI-powered recommendations
- [ ] Advanced reporting
- [ ] Integration with external services

---

**Kanxa Safari** - Your complete transportation, construction, and garage services platform.
