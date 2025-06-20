var express = require('express');
var router = express.Router();
const db = require('../models/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all dogs and their owner's usernames */
router.get('/api/dogs', async (req, res, next) => {
  // Try catch for 
  try {
    const [rows] = await db.query('SELECT name,size,username FROM Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
  // // Connect to the database
  // req.pool.getConnection(function(err, connection) {
  //   if (err) {
  //     res.sendStatus(500);
  //     return;
  //   }
  //   var query = "SELECT name,size,username FROM Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id";
  //   connection.query(query, function(err, rows, fields) {
  //     connection.release(); // release connection
  //     if (err) {
  //       res.sendStatus(500);
  //       return;
  //     }
  //     res.json(rows); // send response
  //   });
  // });
});

/* GET all open walk requests with dog name, requested time, location, and owner's username */
router.get('/api/walkrequests/open', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT request_id,name,requested_time,duration_minutes,location,username FROM ((Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id) INNER JOIN WalkRequests ON Dogs.dog_id = WalkRequests.dog_id) WHERE WalkRequests.status = 'open'";
    connection.query(query, function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

/* GET summary of walkers with their average rating and number of walks completed */
router.get('/api/walkers/summary', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT request_id,name,requested_time,duration_minutes,location,username FROM ((Users INNER JOIN Dogs ON Users.user_id = Dogs.owner_id) INNER JOIN WalkRequests ON Dogs.dog_id = WalkRequests.dog_id) WHERE WalkRequests.status = 'open'";
    connection.query(query, function(err, rows, fields) {
      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

module.exports = router;
