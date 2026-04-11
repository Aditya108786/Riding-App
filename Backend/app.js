const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const userRoutes = require('./routes/user.route');
const captainRoute = require('./routes/captain.routes');
const maproutes = require('./routes/maps.route')
const rideroutes = require('./routes/ride.route')
const app = express();
const serviceScope = (process.env.SERVICE_SCOPE || 'all').toLowerCase();

const shouldMount = (...scopes) => {
    if (serviceScope === 'all') return true;
    return scopes.includes(serviceScope);
};

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Cookie parser
app.use(cookieParser());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Routes
app.get('/', (req, res) => res.send("Hello Aditya"));
if (shouldMount('user')) {
    app.use('/user', userRoutes);
}
if (shouldMount('captain')) {
    app.use('/captain', captainRoute);
}
if (shouldMount('rides')) {
    app.use('/maps', maproutes);
    app.use('/ride', rideroutes);
}

module.exports = app;
