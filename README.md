# KodBank

A modern digital banking application with secure JWT authentication and a beautiful, human-friendly UI.

## Features

- User registration with ₹1,00,000 welcome balance
- Secure JWT authentication with HTTP-only cookies
- Protected dashboard with balance checking
- Email verification and password reset (console logs in development)
- Modern, responsive UI that doesn't look AI-generated

## Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Hook Form + Zod  
**Backend:** Express.js, TypeScript, Prisma ORM, JWT, bcrypt  
**Database:** MySQL 8.0

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL
npx prisma generate
npx prisma db push
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Environment Setup

**Backend `.env`:**
```env
DATABASE_URL="mysql://user:password@host:port/database"
JWT_SECRET="your-secret-key-minimum-32-characters"
FRONTEND_URL="http://localhost:3000"
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Endpoints

**Auth:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email

**User (Protected):**
- `GET /api/user/balance` - Get account balance
- `GET /api/user/profile` - Get user info

## Database Schema

**KodUser:** uid, username, email, password, balance (default 100000), phone, role (default "customer"), email verification fields, password reset fields

**UserToken:** tid, token, uid (FK), expiry

## Security

- JWT tokens with HS256 signature
- Password hashing with bcrypt
- HTTP-only cookies
- Rate limiting
- CORS protection
- Input validation

## Deployment on Render

### Quick Deploy

1. Fork or push this repo to GitHub
2. Create a [Render account](https://render.com)
3. Use the "Blueprint" option and select this repo
4. Render will automatically detect `render.yaml` and create both services

### Manual Deployment

**Backend:**
1. New Web Service → Connect your repo
2. Build Command: `cd backend && npm install && npm run build`
3. Start Command: `cd backend && npm start`
4. Add environment variables:
   - `DATABASE_URL` - Your MySQL connection string
   - `JWT_SECRET` - Generate a secure random string
   - `FRONTEND_URL` - Your frontend URL
   - `NODE_ENV=production`

**Frontend:**
1. New Web Service → Connect your repo
2. Build Command: `cd frontend && npm install && npm run build`
3. Start Command: `cd frontend && npm start`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend URL

### Database Setup

Use a MySQL provider like:
- [Aiven](https://aiven.io)
- [PlanetScale](https://planetscale.com)
- [Railway](https://railway.app)

After deployment, run:
```bash
npx prisma db push
```

## License

MIT

---

Made with ❤️ and way too much coffee
