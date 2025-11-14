# WorkBagel - Consultation Booking Platform

A full-stack consultation booking platform built with Next.js, Express.js, and PostgreSQL. This application allows clients to book appointments with service providers across various categories.

## 🚀 Features

- **User Authentication** - Secure authentication using Better Auth with session management
- **Role-Based Access** - Separate interfaces for Clients and Providers
- **Slot Management** - Providers can create and manage availability slots
- **Booking System** - Clients can browse providers and book available slots
- **Real-time Updates** - Live slot availability and booking status
- **Dark Mode** - Full dark mode support across the application
- **API Documentation** - Interactive Swagger/OpenAPI documentation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [pnpm](https://pnpm.io/) (for frontend)
- [PostgreSQL](https://www.postgresql.org/) database / [NeonDB](https://neon.com/) connection string
  > Get a Neon DB connection string by creating a service and get the connection string and add to `.env` file.

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Adityasinghvats/kubyassingment.git
cd kubyassingment
```

### 2. Backend Setup

#### Navigate to Backend Directory

```bash
cd be
```

#### Install Dependencies

```bash
npm install
```

#### Environment Configuration

Create a `.env` file in the `be` directory using the `.env.sample` as template:

```bash
cp .env.sample .env
```

Edit `.env` and configure the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"

# Server
PORT=3030
NODE_ENV=development

# Frontend
FRONTEND_ORIGIN=http://localhost:3000

# API
API_BASE_URL=http://localhost:3030

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3030
```

#### Database Setup

Run Prisma migrations to set up your database schema:

```bash
# Generate Prisma Client
npx prisma generate
# Deploy Migrations
npx prisma migrate deploy
```

#### Start Backend Server

```bash
npm run dev
```

The backend server will start at `http://localhost:3030`

#### 📚 API Documentation

Once the server is running, access the interactive API documentation at:

```
http://localhost:3030/api-docs
```

### 3. Frontend Setup

Open a **new terminal** window/tab.

#### Navigate to Frontend Directory

```bash
cd fe
```

#### Install Dependencies

```bash
pnpm install
```

#### Environment Configuration

Create a `.env` file in the `fe` directory:

```bash
cp .env.sample .env
```

#### Start Frontend Server

```bash
pnpm dev
```

The frontend will start at `http://localhost:3000`

## 📁 Project Structure

```
kubyassingment/
├── be/                          # Backend (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── user.controller.ts
│   │   │   ├── slot.controller.ts
│   │   │   └── booking.controller.ts
│   │   ├── routes/            # API routes
│   │   │   ├── user.router.ts
│   │   │   ├── slot.router.ts
│   │   │   └── booking.router.ts
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── authMiddleware.ts
│   │   │   └── errorMiddleware.ts
│   │   ├── utils/            # Utility functions
│   │   │   ├── auth.ts       # Better Auth config
│   │   │   ├── swagger.ts    # API documentation
│   │   │   └── logger.ts     # Winston logger
│   │   ├── generated/        # Prisma client
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── .env.sample
│   └── package.json
│
└── fe/                        # Frontend (Next.js)
    ├── app/                   # Next.js app directory
    │   ├── (auth)/           # Auth routes group
    │   │   ├── login/
    │   │   └── register/
    │   ├── bookings/         # Bookings pages
    │   ├── providers/        # Providers pages
    │   ├── profile/          # User profile
    │   ├── slots/            # Slot management
    │   ├── unauthorized/     # 403 page
    │   ├── [...slug]/        # 404 catch-all
    │   ├── layout.tsx        # Root layout
    │   ├── page.tsx          # Home page
    │   └── providers.tsx     # Client-side providers
    ├── components/           # React components
    │   ├── navbar.tsx
    │   ├── footer.tsx
    │   ├── theme-toggle.tsx
    │   ├── theme-provider.tsx
    │   └── booking-modal.tsx
    ├── hooks/               # Custom React hooks
    │   └── use-auth.ts
    ├── services/           # API service layer
    │   ├── userService.ts
    │   ├── slotService.ts
    │   └── bookingService.ts
    ├── interfaces/        # TypeScript interfaces
    ├── store/            # Zustand state management
    ├── proxy.ts         # Middleware for route protection
    ├── .env.sample
    └── package.json
```

## 🗄️ Database Schema (ER Diagram)

```mermaid
erDiagram
    User ||--o{ Slot : creates
    User ||--o{ Booking : makes
    User ||--o{ Booking : receives
    User ||--o{ Session : has
    User ||--o{ Account : has
    Slot ||--o{ Booking : contains

    User {
        string id PK
        string email UK
        string name
        Role role
        decimal hourlyRate
        string description
        CATEGORY category
        boolean emailVerified
        string image
        datetime createdAt
        datetime updatedAt
    }

    Slot {
        string id PK
        string providerId FK
        datetime startTime
        datetime endTime
        int duration
        SLOTSTATUS status
        datetime createdAt
        datetime updatedAt
    }

    Booking {
        string id PK
        string slotId FK
        string clientId FK
        string providerId FK
        decimal finalCost
        string description
        BOOKINGSTATUS status
        datetime createdAt
        datetime updatedAt
    }

    Session {
        string id PK
        string userId FK
        datetime expiresAt
        string token UK
        string ipAddress
        string userAgent
        datetime createdAt
        datetime updatedAt
    }

    Account {
        string id PK
        string userId FK
        string accountId
        string providerId
        string accessToken
        string refreshToken
        string password
        datetime createdAt
        datetime updatedAt
    }
```

## ER Image Using Eraser

<img width="1610" height="2790" alt="image" src="https://github.com/user-attachments/assets/78c37c5f-668f-4f96-b818-d7cda8452ccb" />

## 🎯 User Roles

### Client

- Browse service providers by category
- View provider profiles and availability
- Book consultation slots
- Manage bookings
- Update profile

### Provider

- Create and manage availability slots
- Set hourly rates
- View incoming booking requests
- Accept/reject bookings
- Update profile and service details

## 📝 API Endpoints

### Authentication

- `POST /api/auth/sign-in/email` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/get-session` - Get current session

### Users

- `POST /api/v1/users/register` - Register user
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update user profile
- `GET /api/v1/users/providers` - List all providers

### Slots

- `POST /api/v1/slots` - Create new slot (Provider only)
- `GET /api/v1/slots/:providerId` - Get all available slots
- `GET /api/v1/slots/my-slots` - Get provider's slots (Provider only)
- `DELETE /api/v1/slots/:id` - Delete slot (Provider only)

### Bookings

- `POST /api/v1/bookings` - Create booking (Client only)
- `GET /api/v1/bookings/me` - Get all bookings
- `POST /api/v1/bookings/:id/complete` - Complete Booking
- `POST /api/v1/bookings/:id/cancel` - Cancel Booking

## 🔐 Environment Variables

### Backend (.env)

```env
DATABASE_URL=          # PostgreSQL connection string
PORT=                  # Server port (default: 3030)
NODE_ENV=              # development | production
FRONTEND_ORIGIN=       # Frontend URL for CORS
API_BASE_URL=          # Backend base URL
BETTER_AUTH_SECRET=    # Secret for auth encryption
BETTER_AUTH_URL=       # Auth service URL
```

### Frontend (.env)

```env
NEXT_PUBLIC_BACKEND_URL=  # Backend API URL
```

## 👤 Using the app

- Start creating `Providers` and `Consumers` using `/register`
- Login using `Provider` credentials and start creating slots by using `Add slot` in profile using `/slots/add`
- Login using `Client` credentials and explore `/providers` and then start booking slots and get detailed information about time slots and price
- Manage bookings using `/boookings` and cancel your bookings at your convenience
- `Providers` can manage their slots at `/slots`.

## 🧪 Testing

Access the interactive API documentation to test all endpoints:

```
http://localhost:3030/api-docs
```

## 🚀 Deployment

### Backend

1. Set up PostgreSQL database
2. Configure production environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm start`

### Frontend

1. Configure production environment variables
2. Build: `pnpm build`
3. Start: `pnpm start`

## 🛡️ Security Features

- **Session-based authentication** with Better Auth
- **Role-based access control** (RBAC)
- **Protected routes** using middleware
- **CORS configuration** for secure cross-origin requests
- **Environment variable** validation
- **SQL injection prevention** via Prisma ORM

## 🎨 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth
- **API Docs**: Swagger/OpenAPI
- **Logging**: Winston + Morgan

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: TansStack Query
- **UI Components**: shadcn/ui
- **Date Picker**: MUI DateTimePicker
- **Theme**: next-themes

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Aditya Singh Vats

## 🐛 Issues

If you encounter any issues, please create an issue on the [GitHub repository](https://github.com/Adityasinghvats/kubyassingment/issues).

## 📧 Contact

For questions or support, please contact the repository owner.

---

**Happy Coding! 🚀**
