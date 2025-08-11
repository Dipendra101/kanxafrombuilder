# Kanxa Safari - Transportation & Construction Services Platform

A comprehensive web application providing transportation, construction, and garage services connecting Lamjung to major cities across Nepal.

## 🚀 Features

### Frontend Features
- **Transportation Services**: Bus booking, cargo services, and custom tours
- **Construction Materials**: Browse and order building materials and machinery
- **Garage & Workshop**: Vehicle maintenance and repair services
- **User Authentication**: Secure login/signup with JWT tokens
- **Real-time Notifications**: Chat and system notifications
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Built with shadcn/ui components

### Backend Features
- **RESTful API**: Express.js with MongoDB
- **Authentication**: JWT-based user authentication
- **Database Models**: User, Booking, and Service models
- **Secure Password**: bcrypt password hashing
- **CORS Support**: Cross-origin resource sharing enabled

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Query** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** installed and running on localhost:27017
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd kanxa-safari
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Set Up MongoDB Database

Make sure MongoDB is running on localhost:27017. The application will automatically create a database called `kanxasafari`.

### 4. Seed the Database (Optional)
```bash
cd server
npm run seed
cd ..
```

### 5. Start the Development Servers

#### Start Backend Server (Terminal 1)
```bash
cd server
npm run dev
```
The backend will run on http://localhost:5000

#### Start Frontend Server (Terminal 2)
```bash
npm run dev
```
The frontend will run on http://localhost:5173

## 📁 Project Structure

```
kanxa-safari/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   └── ...
├── server/                # Backend Node.js application
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB models
│   ├── routes/            # API route handlers
│   ├── scripts/           # Database seeding scripts
│   └── server.js          # Main server file
└── ...
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/forgot-password` - Password reset

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Services
- `GET /api/services` - Get all services
- `GET /api/services/buses` - Get bus services
- `GET /api/services/cargo` - Get cargo services
- `GET /api/services/construction` - Get construction items
- `GET /api/services/garage` - Get garage services

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id` - Update booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/payment` - Update payment status

## 🌐 Environment Variables

Create a `.env` file in the `server` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kanxasafari
JWT_SECRET=your_jwt_secret_key_here
```

## 💾 Database Schema

### User Model
- Personal information (name, email, phone)
- Authentication (password hash)
- Profile data (address, preferences)
- Role-based access (user/admin)

### Service Model
- Service type (bus, cargo, construction, garage)
- Service-specific details
- Pricing information
- Availability status

### Booking Model
- User reference
- Service details
- Payment information
- Booking status tracking

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
cd server
npm run test
```

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
```bash
cd server
npm start
```

## 📱 Features Overview

### Transportation Services
- **Bus Booking**: Real-time seat availability and booking
- **Cargo Services**: Heavy, medium, and light truck services
- **Custom Tours**: Personalized transportation solutions

### Construction Services
- **Building Materials**: Cement, steel, blocks, etc.
- **Heavy Machinery**: JCB, mixers, tractors for rental
- **Supplier Network**: Reliable construction suppliers

### Garage & Workshop
- **Vehicle Maintenance**: Cars, trucks, tractors, buses
- **Repair Services**: Professional mechanical services
- **Genuine Parts**: Quality spare parts and accessories

### User Features
- **Profile Management**: Update personal information
- **Booking History**: Track all service bookings
- **Real-time Notifications**: Stay updated on services
- **Secure Payments**: Multiple payment options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact Information

- **Email**: kanxasafari1@gmail.com
- **Phone**: 9856056782, 9856045678
- **Location**: Lamjung, Nepal

## 📄 License

This project is proprietary and confidential. All rights reserved by Kanxa Safari.

---

**Built with ❤️ for the people of Nepal, connecting communities through reliable transportation and construction services.**
