# BlockBuster - Location-Based Event & Ticket Booking Platform

A full-stack web application for discovering and booking movies, events, restaurants, stores, and activities across multiple cities.

## 🚀 Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS v3
- Clerk Authentication
- Framer Motion, GSAP, Lenis
- React Router, Axios, Lucide React, Swiper
- Razorpay Integration

**Back-End:**
- Node.js + Express
- MongoDB + Mongoose
- Slug-based routing & resolution
- RESTful APIs
- Nodemailer (Email Service - Gmail)
- Twilio (WhatsApp Service)
- Razorpay Node SDK

## 📦 Project Structure

```
BlockBuster/
├── client/          # React Frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── server/          # Express Backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    ├── index.js
    └── package.json
```

## ✨ Key Features

- **Multi-City Discovery**: Browse movies, events, and dining by city.
- **Secure Authentication**: Robust user management with Clerk.
- **Premium User Experience**:
  - **Lazy Loading**: High-performance image loading.
  - **Global Error Handling**: Smart fallbacks for missing images.
  - **Ticket-Style Emails**: Beautiful booking confirmations sent via Nodemailer (Gmail).
  - **WhatsApp Notifications**: Real-time booking alerts via Twilio.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.

## 🏃 Local Development

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## 🌐 Environment Variables

**Server (.env):**
```
PORT=5000
MONGO_URI=your_mongodb_uri
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
ADMIN_API_KEY=your_secret_admin_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+1...
CLIENT_URL=http://localhost:5173
```

**Client (.env):**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

## 📊 API Endpoints

- `GET/POST /api/cities` - Cities management
- `GET/POST /api/venues` - Venues (with city query)
- `GET/POST /api/movies` - Movies
- `GET/POST /api/events` - Events
- `GET/POST /api/restaurants` - Restaurants
- `GET/POST /api/stores` - Stores
- `GET/POST /api/activities` - Activities
- `GET/POST /api/bookings` - Booking management & Payment verification
- `GET /api/screenings/:movieSlug/:citySlug` - Movie screening details

All POST endpoints support bulk insertion and slug resolution.

## 🚢 Deployment

This project is designed to be deployed as two separate services on Render:

**Backend Service:**
- Build Command: `cd server && npm install`
- Start Command: `cd server && npm start`
- Root Directory: `/`

**Frontend Service:**
- Build Command: `cd client && npm install && npm run build`
- Start Command: (Static site, uses built files)
- Root Directory: `/`

## 📝 License

MIT
