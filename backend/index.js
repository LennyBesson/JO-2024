require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

// Configuration de CORS pour autoriser plusieurs origines
const allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,POST'
}));

// Configuration de la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'JO2024'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Route pour obtenir tous les utilisateurs
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.stack);
      res.status(500).send('Error fetching users');
      return;
    }
    console.log('Users fetched successfully:', results);
    res.json(results);
  });
});

// Route pour créer un nouvel utilisateur
app.post('/api/register', (req, res) => {
  const { nom, prenom, mail, mdp } = req.body;
  console.log('Received data:', { nom, prenom, mail, mdp }); // Debug log

  // Chiffrer le mot de passe
  bcrypt.hash(mdp, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.stack);
      res.status(500).send('Error hashing password');
      return;
    }

    const sql = 'INSERT INTO users (nom, prenom, mail, mdp) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, prenom, mail, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err.stack);
        res.status(500).send('Error inserting user');
        return;
      }
      console.log('User created successfully');
      res.status(201).send('User created');
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
