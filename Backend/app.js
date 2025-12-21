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

// CORS
app.use(cors({
    origin: ["http://localhost:5173" ,"https://fzv1kqfv-5173.inc1.devtunnels.ms"],
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
app.use('/user', userRoutes);
app.use('/captain', captainRoute);
app.use('/maps' , maproutes)
app.use('/ride', rideroutes)
module.exports = app;
