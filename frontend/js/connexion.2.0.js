$(document).ready(function() {
  console.log('connexion.2.0.js loaded');

  // Gestion des formulaires d'inscription et de connexion
  document.getElementById('showSignup').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Show signup form');
    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');

    loginContainer.style.transition = 'opacity 0.5s';
    signupContainer.style.transition = 'opacity 0.5s';

    loginContainer.style.opacity = '0';
    setTimeout(() => {
        loginContainer.style.visibility = 'hidden';
        signupContainer.style.visibility = 'visible';
        signupContainer.style.opacity = '1';
        console.log('Signup form is now visible');
    }, 500);
  });

  document.getElementById('showLogin').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Show login form');
    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');

    signupContainer.style.transition = 'opacity 0.5s';
    loginContainer.style.transition = 'opacity 0.5s';

    signupContainer.style.opacity = '0';
    setTimeout(() => {
        signupContainer.style.visibility = 'hidden';
        loginContainer.style.visibility = 'visible';
        loginContainer.style.opacity = '1';
        console.log('Login form is now visible');
    }, 500);
  });

  // Ajouter un utilisateur avec AJAX
  document.querySelector('.signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted - unique identifier');
    const nom = document.getElementById('inputNom').value;
    const prenom = document.getElementById('inputPrenom').value;
    const mail = document.getElementById('inputEmailSignup').value;
    const mdp = document.getElementById('inputPasswordSignup').value;

    // Validation du formulaire
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    if (!nom || !prenom || !mail || !mdp) {
      alert('Tous les champs sont requis');
      return;
    }

    if (!validateEmail(mail)) {
      alert('Adresse email invalide');
      return;
    }

    const data = { nom, prenom, mail, mdp };
    console.log('Data to send:', data);

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Server response:', data);
      console.log('User created successfully - unique identifier');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPrenom', prenom);

      console.log('localStorage isLoggedIn:', localStorage.getItem('isLoggedIn'));
      console.log('localStorage userPrenom:', localStorage.getItem('userPrenom'));

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1000);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to create user');
    });
  });

  // Gérer la soumission du formulaire de connexion
  document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Login form submitted');
    const mail = document.getElementById('inputEmail').value;
    const mdp = document.getElementById('inputPassword').value;
    const errorElement = document.getElementById('loginError');

    const data = { mail, mdp };
    console.log('Data to send for login:', data);

    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(user => {
      console.log('Server response:', user);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPrenom', user.prenom);
      localStorage.setItem('userId', user.userId);

      console.log('localStorage isLoggedIn:', localStorage.getItem('isLoggedIn'));
      console.log('localStorage userPrenom:', localStorage.getItem('userPrenom'));
      console.log('localStorage userId:', localStorage.getItem('userId'));

      // Transférer les articles du panier du localStorage vers la base de données
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length > 0) {
        cart.forEach(item => {
          fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.userId, produit_id: item.produit_id, quantite: item.quantite }),
            credentials: 'include'
          })
          .then(response => {
            if (response.ok) {
              console.log('Cart item transferred to server');
            } else {
              console.error('Error transferring cart item to server');
            }
          });
        });
        localStorage.removeItem('cart');
      }

      window.location.href = "../index.html";
    })
    .catch(error => {
      console.error('Error:', error);
      errorElement.style.display = 'block';
    });
});


  // Gérer l'affichage des formulaires d'inscription et de connexion
  document.getElementById('showSignup').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Show signup form');
    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');

    loginContainer.style.transition = 'opacity 0.5s';
    signupContainer.style.transition = 'opacity 0.5s';

    loginContainer.style.opacity = '0';
    setTimeout(() => {
        loginContainer.style.visibility = 'hidden';
        signupContainer.style.visibility = 'visible';
        signupContainer.style.opacity = '1';
        console.log('Signup form is now visible');
    }, 500);
  });

  document.getElementById('showLogin').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Show login form');
    const loginContainer = document.querySelector('.login-container');
    const signupContainer = document.querySelector('.signup-container');

    signupContainer.style.transition = 'opacity 0.5s';
    loginContainer.style.transition = 'opacity 0.5s';

    signupContainer.style.opacity = '0';
    setTimeout(() => {
        signupContainer.style.visibility = 'hidden';
        loginContainer.style.visibility = 'visible';
        loginContainer.style.opacity = '1';
        console.log('Login form is now visible');
    }, 500);
  });

});
