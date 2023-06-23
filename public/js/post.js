const loginFormHandler = async (event) => {
  // TODO: Add a comment describing the functionality of this statement
  event.preventDefault();

  // TODO: Add a comment describing the functionality of these expressions
  const title = document.querySelector('#title-post').value.trim();
  const body = document.querySelector('#body-post').value.trim();

  if (title && body) {
    // TODO: Add a comment describing the functionality of this expression
    const response = await fetch('/api/posts/create', {
      method: 'POST',
      body: JSON.stringify({ title, body }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('Successfully posted!');
      document.location.replace('/');
    } else {
      alert('Failed to log in');
    }
  }
};

document
  .querySelector('.post-form')
  .addEventListener('submit', loginFormHandler);
