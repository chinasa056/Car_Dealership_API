# Car Dealership Backend API

This is a RESTful API backend for a car dealership platform built with Node.js, Express, TypeScript, and MongoDB. The platform supports JWT authentication, role-based access (customer & manager), and structured error handling.

## Features

- User authentication with JWT
- Role-based authorization (Customer & Manager)
- CRUD operations for customers, managers, categories, and more
- Modular code structure with clear separation of concerns
- Centralized error handling with custom error classes
- MongoDB integration using Mongoose
- Secure password hashing with bcrypt
- Fully typed with TypeScript interfaces and enums

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt
-joi 

## Getting Started

### Prerequisites

- Node.js >= 16.x
- MongoDB (local or cloud)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/car-dealership-api.git
cd car-dealership-api
npm install

PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/car_dealership

# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
