const express = require('express');
const router = express.Router();
const db = require('../models/db');

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

// GET current user info
router.get('/me', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  // Get the user's dogs from database
  const [rows] = await db.query('SELECT name FROM Dogs WHERE owner_id = ?', [req.body.user]);
  console.log(rows);
  res.json(rows.user);
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
    // Get the user from database
    const [rows] = await db.query('SELECT user_id, username, email, password_hash, role FROM Users WHERE username = ?', [req.body.user]);
    // Check if password entered and in database match
    if (rows[0].password_hash === req.body.pass) {
      // Set elements in session to data from database
      req.session.id = rows[0].user_id;
      req.session.user = rows[0].username;
      req.session.email = rows[0].email;
      req.session.pass = rows[0].password_hash;
      req.session.role = rows[0].role;
      // Send role back to check which page to go to in login()
      res.json(rows[0].role);
    } else { // If not throw error
      throw new Error('Error');
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST log out request and destroy session
router.post('/users/logout', async (req, res) => {
  try {
    // Destroy session
    req.session.destroy();
    // Delete cookie
    res.clearCookie("SessionCookie", { path: "/" });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
