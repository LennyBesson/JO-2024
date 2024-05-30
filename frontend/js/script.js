$(document).ready(function() {
  console.log("le script se charge 3");

  // Charger les utilisateurs
  $.ajax({
    url: 'http://localhost:5000/api/users',
    method: 'GET',
    success: function(users) {
      console.log('Users fetched:', users); // Ajout d'un log pour vérifier la réponse
      let usersHtml = '<ul class="list-group">';
      users.forEach(user => {
        usersHtml += `<li class="list-group-item">${user.nom} ${user.prenom} (${user.mail})</li>`;
      });
      usersHtml += '</ul>';
      $('#users').html(usersHtml);
    },
    error: function(error) {
      console.error('Error fetching users:', error); // Ajout d'un log pour vérifier les erreurs
    }
  });

  // Vérifier l'état de connexion de l'utilisateur et modifier la navbar en conséquence
  console.log('DOM fully loaded and parsed'); // Vérifier si le script est exécuté
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const prenom = localStorage.getItem('userPrenom');
  const statutElement = document.getElementById('statut');
  const decoElement = document.getElementById('deco');
  const userId = localStorage.getItem('userId');

  console.log('isLoggedIn:', isLoggedIn); // Debug log pour vérifier l'état de connexion
  console.log('prenom:', prenom); // Debug log pour vérifier le prénom
  console.log('userId:', userId); // Debug log pour vérifier l'ID utilisateur

  // Définir les fonctions nécessaires avant de les appeler
  const syncCartWithServer = (userId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(item => {
      $.ajax({
        url: 'http://localhost:5000/api/cart',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ user_id: userId, produit_id: item.produit_id, quantite: item.quantite }),
        success: function() {
          console.log('Produit synchronisé avec le serveur');
        },
        error: function(error) {
          console.error('Error syncing cart with server:', error);
        }
      });
    });
    localStorage.removeItem('cart'); // Clear local cart after syncing
  };

  const addToCartOnServer = (userId, produitId) => {
    $.ajax({
      url: 'http://localhost:5000/api/cart',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ user_id: userId, produit_id: produitId, quantite: 1 }),
      success: function() {
        alert('Produit ajouté au panier');
      },
      error: function(error) {
        console.error('Error adding to cart:', error);
        alert('Erreur lors de l\'ajout au panier');
      }
    });
  };

  const addToCartLocally = (produitId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.produit_id === produitId);
    if (productIndex > -1) {
      cart[productIndex].quantite += 1;
    } else {
      cart.push({ produit_id: produitId, quantite: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier');
  };

  if (isLoggedIn === 'true') {
    statutElement.textContent = `Mon compte`;
    statutElement.href = "../pages/moncompte.html"; // Mettre à jour l'attribut href pour rediriger vers moncompte.html
    decoElement.style.display = 'block';
    decoElement.addEventListener('click', function() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userPrenom');
      localStorage.removeItem('userId'); // Clear the user ID on logout
      window.location.href = "../index.html"; // Rediriger vers la page d'accueil après la déconnexion
    });
    syncCartWithServer(userId); // Synchroniser le panier avec le serveur
  } else {
    statutElement.textContent = 'Connexion';
    statutElement.href = "../pages/connexion.html"; // Mettre à jour l'attribut href pour rediriger vers la page de connexion
    decoElement.style.display = 'none';
  }

  // Gestionnaire d'événements pour les boutons "Je réserve"
  $(document).on('click', '.add-to-cart', function() {
    const produitId = $(this).data('id');
    if (isLoggedIn === 'true') {
      addToCartOnServer(userId, produitId);
    } else {
      addToCartLocally(produitId);
    }
  });
});
