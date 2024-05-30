document.addEventListener('DOMContentLoaded', function() {
  const userId = localStorage.getItem('userId');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const stripe = Stripe('pk_test_your_public_key'); // Remplace par ta clé publique Stripe

  if (isLoggedIn && userId) {
    fetchCartItems(userId);
  } else {
    displayCartItemsFromLocalStorage();
  }

  document.getElementById('checkoutButton').addEventListener('click', function() {
    if (isLoggedIn && userId) {
      createCheckoutSession();
    } else {
      alert('Vous devez être connecté pour passer à la caisse.');
    }
  });

  function fetchCartItems(userId) {
    $.ajax({
      url: `http://localhost:5000/api/cart/${userId}`,
      method: 'GET',
      success: function(cartItems) {
        console.log('Cart items fetched:', cartItems);
        displayCartItems(cartItems);
      },
      error: function(error) {
        console.error('Error fetching cart items:', error);
      }
    });
  }

  function displayCartItemsFromLocalStorage() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let displayItems = [];
    cart.forEach((item) => {
      $.ajax({
        url: `http://localhost:5000/api/product/${item.produit_id}`,
        method: 'GET',
        async: false,
        success: function(product) {
          displayItems.push({ ...product, quantite: item.quantite });
        },
        error: function(error) {
          console.error(`Error fetching product ${item.produit_id}:`, error);
        }
      });
    });

    displayCartItems(displayItems);
  }

  function displayCartItems(cartItems) {
    const cartItemsElement = document.getElementById('cartItems');
    cartItemsElement.innerHTML = '';

    cartItems.forEach(item => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      listItem.innerHTML = `
        <span>${item.nom} - ${item.description || 'Pas de description disponible'}</span>
        <span>${item.quantite} x ${item.prix}€</span>
        <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Supprimer</button>
      `;
      cartItemsElement.appendChild(listItem);
    });

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        if (isLoggedIn && userId) {
          console.log(`Trying to remove item with ID: ${itemId}`);
          removeItemFromServerCart(itemId, userId);
        } else {
          removeItemFromLocalStorage(itemId);
        }
      });
    });
  }

  function createCheckoutSession() {
    fetch('http://localhost:5000/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Important pour envoyer les cookies de session
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(session => {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(result => {
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
});
