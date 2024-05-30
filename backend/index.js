require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
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
  methods: 'GET,POST,DELETE,PUT', // Ajoute les méthodes ici
  credentials: true // Autoriser les cookies de session
}));

// Configuration du middleware de session
app.use(session({
  secret: 'yourSecretKey', // Remplacez par une clé secrète unique
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Mettez à true si vous utilisez HTTPS
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
  console.log('Received data:', { nom, prenom, mail, mdp });

  // Chiffrer le mot de passe
  bcrypt.hash(mdp, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.stack);
      res.status(500).json({ message: 'Error hashing password' });
      return;
    }

    const sql = 'INSERT INTO users (nom, prenom, mail, mdp) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, prenom, mail, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err.stack);
        res.status(500).json({ message: 'Error inserting user' });
        return;
      }
      console.log('User created successfully');

      // Créer la session pour l'utilisateur
      req.session.userId = results.insertId;
      req.session.prenom = prenom;
      console.log('Session created:', req.session);

      res.status(201).json({ message: 'User created', userId: results.insertId, prenom });
    });
  });
});

// Route pour connecter un utilisateur
app.post('/api/login', (req, res) => {
  const { mail, mdp } = req.body;
  console.log('Login attempt:', { mail, mdp });

  const sql = 'SELECT * FROM users WHERE mail = ?';
  db.query(sql, [mail], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err.stack);
      res.status(500).json({ message: 'Error fetching user' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const user = results[0];
    bcrypt.compare(mdp, user.mdp, (err, match) => {
      if (err) {
        console.error('Error comparing passwords:', err.stack);
        res.status(500).json({ message: 'Error comparing passwords' });
        return;
      }

      if (!match) {
        res.status(401).json({ message: 'Invalid password' });
        return;
      }

      // Créer la session pour l'utilisateur
      req.session.userId = user.id;
      req.session.prenom = user.prenom;
      console.log('Session created:', req.session);

      res.status(200).json({ message: 'Login successful', userId: user.id, prenom: user.prenom });
    });
  });
});

// Route pour obtenir tous les produits
app.get('/api/products', (req, res) => {
  const sql = 'SELECT * FROM produit';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err.stack);
      res.status(500).send('Error fetching products');
      return;
    }
    res.json(results);
  });
});

// Route pour obtenir un produit par ID
app.get('/api/product/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM produit WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching product:', err.stack);
      res.status(500).send('Error fetching product');
      return;
    }
    res.json(result[0]);
  });
});

// Route pour ajouter un produit au panier
app.post('/api/cart', (req, res) => {
  const { user_id, produit_id, quantite } = req.body;
  const sql = `
    INSERT INTO panier (user_id, produit_id, quantite) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantite = quantite + VALUES(quantite)
  `;
  db.query(sql, [user_id, produit_id, quantite], (err, results) => {
    if (err) {
      console.error('Error adding to cart:', err.stack);
      res.status(500).send('Error adding to cart');
      return;
    }
    res.status(201).send('Item added to cart');
  });
});

// Route pour obtenir les éléments du panier d'un utilisateur
app.get('/api/cart/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const sql = `
    SELECT c.id, p.nom, p.description, p.prix, c.quantite
    FROM panier c
    JOIN produit p ON c.produit_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching cart items:', err.stack);
      res.status(500).send('Error fetching cart items');
      return;
    }
    res.json(results);
  });
});

// Route pour supprimer un élément du panier
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM panier WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting cart item:', err.stack);
      res.status(500).send('Error deleting cart item');
      return;
    }
    res.status(200).send('Item removed from cart');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
