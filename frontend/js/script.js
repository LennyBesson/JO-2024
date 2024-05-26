$(document).ready(function() {
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
  });