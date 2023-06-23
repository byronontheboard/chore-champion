const loginFormHandler = async (event) => {
  // TODO: Add a comment describing the functionality of this statement
  event.preventDefault();

  // TODO: Add a comment describing the functionality of these expressions
  const name = document.querySelector('#name-create').value.trim();
  const email = document.querySelector('#email-create').value.trim();
  const password = document.querySelector('#password-create').value;

  if (name && email && password) {
    // TODO: Add a comment describing the functionality of this expression
    const response = await fetch('/api/users/create', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to log in');
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);
