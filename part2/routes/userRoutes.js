const express = require('express');
const router = express.Router();
const db = require('../models/db');

let colorName = ["red", "yellow", "green", "blue"];

// Set color index (AJAX version, uses same array as original but with different index variable)
let colorIndexAJAX = 0;

/* GET webpage with variously changing colored texts depending on the number of visits (AJAX version) */
router.get('/color.txt', function(req, res, next) {
  // Send webpage with h1 name and color as variable
  res.send(colorName[colorIndexAJAX]);
  // Increment color index if its not 3 and reset to 0 if so
  if (colorIndexAJAX !== 3) {
    colorIndexAJAX++;
  } else {
    colorIndexAJAX = 0;
  }
});

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE email = ? AND password_hash = ?
    `, [email, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST username and password to server and check if matches anything in the database
router.post('/users/login', async (req, res) => {
  try {
    // Get the user
    let user = req.body;
    const [rows] = await db.query('SELECT username, password FROM Users WHERE username = ?', [user.user]);
    console.log(rows);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
