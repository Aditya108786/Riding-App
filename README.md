# Uberclone

Full-stack Uber-like ride booking application with:
- `Backend`: Node.js + Express + MongoDB + Redis + Socket.IO
- `Frontend/my-app`: React + Vite + Tailwind

## Project Structure

```text
Uberclone/
  Backend/
  Frontend/my-app/
  docker-compose.yml
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB (local or cloud URI)
- Redis (local or cloud URI)
- OpenRouteService API key

## Environment Variables

### Backend (`Backend/.env`)

```env
PORT=5000
DB_CONNECT=mongodb://127.0.0.1:27017/uberclone
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://127.0.0.1:6379
CLIENT_URL=http://localhost:5173
API_KEY=your_openrouteservice_api_key
```

### Frontend (`Frontend/my-app/.env`)

```env
VITE_BASE_URL=http://localhost:5000
VITE_ORS_API_KEY=your_openrouteservice_api_key
```

## Run Locally

### 1) Start backend

```bash
cd Backend
npm install
node server.js
```

### 2) Start frontend

```bash
cd Frontend/my-app
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and backend at `http://localhost:5000`.

## Docker (Optional)

```bash
docker compose up --build
```

## Main API Route Groups

- `/user`
  - `POST /register`
  - `POST /login`
  - `POST /reset_password`
  - `GET /profile`
  - `POST /logout`
  - `GET /auth`
- `/captain`
  - `POST /register`
  - `POST /login`
  - `POST /reset_password`
  - `GET /profile`
  - `GET /logout`
  - `GET /auth`
- `/maps`
  - `GET /coordinates`
  - `POST /distancetime`
  - `POST /getsuggestions`
  - `POST /getfulladdress`
- `/ride`
  - `POST /createride`
  - `POST /getfare`
  - `POST /confirmride`
  - `POST /startride`
  - `POST /endride`

## Notes

- Authentication uses JWT with cookies/headers depending on route.
- Real-time ride updates are handled with Socket.IO.
- Keep `.env` files out of version control.
