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
    console.log('Form submitted'); // Debug log
    const nom = document.getElementById('inputNom').value;
    const prenom = document.getElementById('inputPrenom').value;
    const mail = document.getElementById('inputEmailSignup').value;
    const mdp = document.getElementById('inputPasswordSignup').value;
  
    const data = { nom, prenom, mail, mdp };
    console.log('Data to send:', data); // Debug log
  
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('Error creating user');
    })
    .then(data => {
      console.log('Server response:', data); // Debug log
      alert('User created successfully');
      document.getElementById('showLogin').click();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to create user');
    });
  });
