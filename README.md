# Kanxa Safari - Complete Business Management System

A comprehensive web application for managing transportation, construction, and garage services. Built with React, TypeScript, Node.js, Express, and MongoDB.

## 🚀 Features

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure authentication with JWT tokens
- **Admin Panel**: Separate admin interface with role-based access
- **Profile Management**: User profile editing and management
- **Password Reset**: Forgot password functionality

### 🚌 Transportation Services
- **Bus Services**: Route management and booking system
- **Cargo Services**: Freight and logistics management
- **Tour Packages**: Custom tour booking system
- **Real-time Tracking**: Service status updates

### 🏗️ Construction Services
- **Building Materials**: Inventory management for construction materials
- **Machinery Rental**: JCB, mixers, tractors, and equipment rental
- **Order Management**: Complete order lifecycle management
- **Supplier Management**: Vendor and supplier tracking

### 🔧 Garage & Workshop
- **Service Booking**: Vehicle maintenance and repair scheduling
- **Service History**: Complete service records
- **Parts Inventory**: Spare parts management
- **Technician Management**: Staff and skill tracking

### 💳 Payment & Billing
- **Multiple Payment Methods**: Khalti, eSewa, cash, bank transfer
- **Invoice Generation**: Automated billing system
- **Payment Tracking**: Real-time payment status
- **Financial Reports**: Revenue and transaction analytics

### 📊 Admin Dashboard
- **Analytics Dashboard**: Real-time business metrics
- **User Management**: Customer and staff management
- **Order Management**: Complete order oversight
- **System Settings**: Configuration and preferences

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for state management
- **Axios** for API communication

### Backend
- **Node.js** with TypeScript
- **Express.js** for API framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Zod** for validation
- **Helmet** for security

### Development Tools
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality
- **Vitest** for testing
- **Concurrently** for running multiple processes

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd kanxa-safari
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/kanxa_safari_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# API Configuration
API_BASE_URL=http://localhost:3001/api

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Run the Application

#### Development Mode (Frontend + Backend)
```bash
npm run dev:full
```

#### Frontend Only
```bash
npm run dev
```

#### Backend Only
```bash
npm run dev:server
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/ping

## 👤 Default Credentials

### Admin Access
- **Username**: admin
- **Password**: admin
- **URL**: http://localhost:5173/admin/login

### Demo User
- **Email**: admin@gmail.com
- **Password**: admin123456
- **URL**: http://localhost:5173/login

## 📁 Project Structure

```
kanxa-safari/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── lib/               # Utility functions
├── server/                # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and utilities
└── public/                # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Transportation
- `GET /api/transportation/buses` - Get bus services
- `POST /api/transportation/buses` - Create bus service
- `GET /api/transportation/cargo` - Get cargo services
- `POST /api/transportation/cargo` - Create cargo service
- `GET /api/transportation/tours` - Get tour packages
- `POST /api/transportation/tours` - Create tour package

### Construction
- `GET /api/construction/materials` - Get materials
- `POST /api/construction/materials` - Create material
- `GET /api/construction/machinery` - Get machinery
- `POST /api/construction/machinery` - Create machinery

### Bookings & Orders
- `GET /api/booking` - Get bookings
- `POST /api/booking` - Create booking
- `PUT /api/booking/:id` - Update booking
- `DELETE /api/booking/:id` - Delete booking

### Payments
- `GET /api/payment` - Get payments
- `POST /api/payment` - Create payment
- `PUT /api/payment/:id/process` - Process payment

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build:client
```

### Backend Deployment
```bash
npm run build:server
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates & Maintenance

- Regular security updates
- Performance optimizations
- Feature enhancements
- Bug fixes and improvements

---

**Built with ❤️ for Kanxa Safari**
