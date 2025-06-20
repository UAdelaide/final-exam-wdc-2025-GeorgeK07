var express = require('express');
var router = express.Router();
const db = require('../models/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all dogs and their owner's usernames */
router.get('/api/dogs', async(req, res, next) => {
  // Try catch for getting dog info
  try {
    const [rows] = await db.query("SELECT name AS 'dog_name',size,username AS 'owner_username' FROM Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dogs" });
  }
});

/* GET all open walk requests with dog name, requested time, location, and owner's username */
router.get('/api/walkrequests/open', async(req, res, next) => {
  // Try catch for getting dog info
  try {
    const [rows] = await db.query("SELECT request_id,name AS 'dog_name',requested_time,duration_minutes,location,username AS 'owner_username' FROM ((Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id) INNER JOIN WalkRequests ON Dogs.dog_id = WalkRequests.dog_id) WHERE WalkRequests.status = 'open'");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dogs" });
  }
});

/* GET summary of walkers with their average rating and number of walks completed */
router.get('/api/walkers/summary', async(req, res, next) => {
  // Try catch for getting dog info
  try {
    const [rows] = await db.query("SELECT username AS 'walker_username',COUNT(walker_id) AS 'total_ratings',SUM(rating) AS 'average_rating',COUNT(walker_id) AS 'completed_walks' FROM WalkRatings INNER JOIN Users ON Users.user_id = WalkRatings.walker_id GROUP BY walker_id");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dogs" });
  }
});

module.exports = router;
