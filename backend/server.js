require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

const dbUrl = process.env.JAWSDB_URL;
const url = new URL(dbUrl);
const dbConfig = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.substring(1), // Remove the leading slash
  connectionLimit: 50
};

// Create a MySQL connection pool using the extracted connection details
const db = mysql.createPool(dbConfig);

// Check the connection
db.getConnection(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.json());

// API routes
app.post('/appendClicks', (req, res) => {
  const dataArray = req.body.dataArray;
  const insertQuery = 'INSERT INTO 2024clicks (judge, link, second, score) VALUES ?';
  db.query(insertQuery, [dataArray], (insertErr, result) => {
    if (insertErr) {
      console.error('Error inserting data into "2024clicks" table:', insertErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Data received and inserted successfully!' });
    }
  });
});

app.get('/getClicks/:link', (req, res) => {
  const linkValue = req.params.link;
  const selectQuery = 'SELECT * FROM 2024clicks WHERE link = ?';
  db.query(selectQuery, [linkValue], (selectErr, result) => {
    if (selectErr) {
      console.error('Error retrieving data from "2024clicks" table:', selectErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

app.get('/getClicks_NYYL/:link', (req, res) => {
  const linkValue = req.params.link;
  const selectQuery = 'SELECT * FROM 2024nyyl WHERE link = ?';
  db.query(selectQuery, [linkValue], (selectErr, result) => {
    if (selectErr) {
      console.error('Error retrieving data from "2024nyyl" table:', selectErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

app.get('/getJudges', (req, res) => {
  const selectQuery = 'SELECT judge, COUNT(DISTINCT link) AS count FROM 2024clicks GROUP BY judge ORDER BY count DESC';
  db.query(selectQuery, (selectErr, result) => {
    if (selectErr) {
      console.error('Error retrieving data from "2024clicks" table:', selectErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

app.get('/getJudges_NYYL', (req, res) => {
  const selectQuery = 'SELECT judge, COUNT(DISTINCT link) AS count FROM 2024nyyl GROUP BY judge ORDER BY count DESC';
  db.query(selectQuery, (selectErr, result) => {
    if (selectErr) {
      console.error('Error retrieving data from "2024nyyl" table:', selectErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

app.get('/getLinks', (req, res) => {
  const selectQuery = 'SELECT link, COUNT(DISTINCT judge) AS count FROM 2024clicks GROUP BY link ORDER BY count DESC';
  db.query(selectQuery, (selectErr, result) => {
    if (selectErr) {
      console.error('Error retrieving data from "2024nyyl" table:', selectErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

app.get('/api/getVideoTitles', async (req, res) => {
  const videoIds = req.query.videoIds.split(',');
  const apiKey = process.env.YOUTUBE_API_KEY;
  const videoIdsString = videoIds.join(',');
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIdsString}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    const videos = data.items;
    const titles = videos.map(video => ({ title: video.snippet.title, link: video.id }));
    res.json(titles);
  } catch (error) {
    console.error('Error fetching video titles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getLinks_NYYL', (req, res) => {
  const selectQuery = 'SELECT link, COUNT(DISTINCT judge) AS count FROM 2024nyyl GROUP BY link ORDER BY count DESC';
  db.query(selectQuery, (selectErr, result) => {
    if (selectErr) {
      console.error('Error retrieving data from "2024nyyl" table:', selectErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
    }
  });
});

// Serve React Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Handle MySQL connection pool closure on exit
function handleExit(signal) {
  console.log(`Received ${signal}. Closing MySQL connection pool...`);
  db.end(err => {
    if (err) {
      console.error('Error closing MySQL connection pool:', err);
    } else {
      console.log('MySQL connection pool closed.');
    }
    process.exit(err ? 1 : 0);
  });
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
