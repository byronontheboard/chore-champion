
const generateUsername = async (event) => {
  const username = document.querySelector('#username');
  let generatedUsername = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    generatedUsername += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  $('#username').val(generatedUsername); 
  // Clear the password field
}

const generatePassword = async (event) => {
  const password = document.querySelector('#password');
  let generatedPassword = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  $('#password').val(generatedPassword);
}

$('.create-form').on('submit', async function(event) {
    // TODO: Add a comment describing the functionality of this statement
    event.preventDefault();

    // TODO: Add a comment describing the functionality of these expressions
    const username = $('#username').val().trim();
    const password = $('#password').val();
    
    if (username && password) {
      // TODO: Add a comment describing the functionality of this expression
      const response = await fetch('/api/users/create', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        alert("Account created! Make sure you save your password!");
        const response = await fetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { 'Content-Type': 'application/json' },
        });
    
        if (response.ok) {
          document.location.replace('/');
        } else {
          alert('Failed to log in');
        }
      } else {
        console.log(response);
        alert('Failed to log in');
      }
    }
});

generateUsername();
generatePassword();