document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
    if (isLoggedIn && userId) {
      fetchCartItems(userId);
    } else {
      displayCartItemsFromLocalStorage();
    }
  
    document.getElementById('checkoutButton').addEventListener('click', function() {
      if (isLoggedIn && userId) {
        window.location.href = '../pages/checkout.html';
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
  
    function removeItemFromServerCart(itemId, userId) {
      console.log(`Removing item from server cart: ${itemId}`);
      $.ajax({
        url: `http://localhost:5000/api/cart/${itemId}`,
        method: 'DELETE',
        success: function() {
          console.log(`Item ${itemId} removed successfully`);
          fetchCartItems(userId); // Refresh the cart after removing the item
        },
        error: function(error) {
          console.error('Error removing item from cart:', error);
        }
      });
    }
  
    function removeItemFromLocalStorage(itemId) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.produit_id != itemId);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItemsFromLocalStorage();
    }
  });
  