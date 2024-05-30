require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
  methods: 'GET,POST,DELETE,PUT',
  credentials: true // Important pour permettre l'envoi des cookies
}));

// Configuration du middleware de session
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Utiliser true si vous utilisez HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 jour de durée de vie
  }
}));

// Middleware pour vérifier l'authentification
function checkAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  next();
}

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

  // Générer une clé secrète
  const cle_secrete = crypto.randomBytes(16).toString('hex');
  console.log('Generated secret key:', cle_secrete);

  // Chiffrer le mot de passe
  bcrypt.hash(mdp, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.stack);
      res.status(500).json({ message: 'Error hashing password' });
      return;
    }

    const sql = 'INSERT INTO users (nom, prenom, mail, mdp, cle_secrete) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nom, prenom, mail, hashedPassword, cle_secrete], (err, results) => {
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
  console.log('Adding to cart:', { user_id, produit_id, quantite });
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

// Route pour créer une session de paiement
app.post('/api/create-checkout-session', checkAuth, async (req, res) => {
  const userId = req.session.userId;

  console.log('Session:', req.session); // Log l'état de la session
  console.log('Authenticated user ID:', userId);

  // Récupérer les éléments du panier pour cet utilisateur
  const sql = `
    SELECT p.nom, p.prix, c.quantite
    FROM panier c
    JOIN produit p ON c.produit_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], async (err, results) => {
    if (err) {
      console.error('Error fetching cart items:', err.stack);
      return res.status(500).send('Error fetching cart items');
    }

    // Créer les éléments de ligne pour la session de paiement Stripe
    const line_items = results.map(item => ({
      price_data: {
        currency: 'usd', // Change la devise si nécessaire
        product_data: {
          name: item.nom,
        },
        unit_amount: item.prix * 100, // Le montant doit être en cents
      },
      quantity: item.quantite,
    }));

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: 'http://localhost:8080/success.html', // URL de redirection après succès du paiement
        cancel_url: 'http://localhost:8080/cancel.html', // URL de redirection après annulation du paiement
      });

      res.json({ id: session.id });
    } catch (err) {
      console.error('Error creating Stripe checkout session:', err);
      res.status(500).send('Error creating Stripe checkout session');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
