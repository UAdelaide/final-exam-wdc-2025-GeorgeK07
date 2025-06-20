var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
  try {
    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      database: 'DogWalkService'
    });

    // Insert data if table is empty
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM WalkRatings');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments) VALUES
        (1, 2, 3, 3, 'My dog is tired after the walk.'),
        (2, 4, 3, 1, 'My dog is very aggressive, what did you do?'),
        (3, 2, 5, 5, 'My dog is very happy.'),
        (4, 4, 1, 4, 'My dog likes you.'),
        (5, 2, 1, 2, 'My dog gets sad when people walk too fast, slow down.')
      `);
    }
  } catch (err) {
    console.error('Error setting up database. Ensure MySQL is running: service mysql start', err);
  }
})();

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
