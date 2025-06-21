const express = require('express');
const path = require('path');
require('dotenv').config();
var session = require('express-session'); // Express session

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Express session setup
app.use(session({
  secret: 'a string of your choice',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
