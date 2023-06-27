const loginFormHandler = async (event) => {
  // TODO: Add a comment describing the functionality of this statement
  event.preventDefault();

  // TODO: Add a comment describing the functionality of these expressions
  const title = document.querySelector('#title-task').value.trim();
  const body = document.querySelector('#body-task').value.trim();

  if (title && body) {
    // TODO: Add a comment describing the functionality of this expression
    const response = await fetch('/api/tasks/create', {
      method: 'POST',
      body: JSON.stringify({ title, body }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('Successfully tasked!');
      document.location.replace('/');
    } else {
      alert('Failed to log in');
    }
  }
};

document
  .querySelector('.task-form')
  .addEventListener('submit', loginFormHandler);
