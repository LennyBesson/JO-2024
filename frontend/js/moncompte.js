document.addEventListener('DOMContentLoaded', function() {
    const mail = 'user@example.com'; // Remplacez par l'email de l'utilisateur connecté
  
    // Obtenir les informations de l'utilisateur
    fetch(`http://localhost:5000/api/user/${mail}`)
      .then(response => response.json())
      .then(user => {
        document.getElementById('inputNom').value = user.nom;
        document.getElementById('inputPrenom').value = user.prenom;
        document.getElementById('inputEmail').value = user.mail;
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      });
  
    // Mettre à jour les informations de l'utilisateur
    document.querySelector('.account-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const nom = document.getElementById('inputNom').value;
      const prenom = document.getElementById('inputPrenom').value;
      const mdp = document.getElementById('inputPassword').value;
  
      const data = { nom, prenom, mdp };
  
      fetch(`http://localhost:5000/api/user/${mail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Error updating user');
      })
      .then(data => {
        alert('User updated successfully');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update user');
      });
    });
  });
  