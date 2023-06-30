const loginFormHandler = async (event) => {
  // TODO: Add a comment describing the functionality of this statement
  event.preventDefault();

  // TODO: Add a comment describing the functionality of these expressions
  const title = document.querySelector('#title-task').value.trim();
  const body = document.querySelector('#body-task').value.trim();
  const due_date = new Date(document.querySelector('#datetime').value).toISOString().slice(0, 19).replace('T', ' ');
  const minutes = document.querySelector('#minutes');
  const points = document.querySelector('#points')
  const priority = document.querySelector('#priority');
  const complete_date = document.querySelector('#complete_date');

  // console.log(due_date);
  if (title && body) {
    // const due_date = '2023-06-27 12:00:00'
    alert(due_date);
    // TODO: Add a comment describing the functionality of this expression
    const response = await fetch('/api/tasks/create', {
      method: 'POST',
      body: JSON.stringify({ title, body, due_date, priority, minutes, points, complete_date }),
      headers: { 'Content-Type': 'application/json' },
    });
    alert(due_date);

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
