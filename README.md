# BlockBuster - Location-Based Event & Ticket Booking Platform

A full-stack web application for discovering and booking movies, events, restaurants, stores, and activities across multiple cities.

## 🚀 Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS v4
- Clerk Authentication
- Framer Motion, GSAP, Lenis
- React Router, Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Slug-based routing
- RESTful APIs

## 📦 Project Structure

```
BlockBuster/
├── client/          # React Frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
└── server/          # Express Backend
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   └── routes/
    └── package.json
```

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
```

**Client (.env):**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## 📊 API Endpoints

- `GET/POST /api/cities` - Cities management
- `GET/POST /api/venues` - Venues (with citySlug)
- `GET/POST /api/movies` - Movies
- `GET/POST /api/events` - Events
- `GET/POST /api/restaurants` - Restaurants
- `GET/POST /api/stores` - Stores
- `GET/POST /api/activities` - Activities

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
