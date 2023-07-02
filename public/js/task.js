const loginFormHandler = async (event) => {
  // TODO: Add a comment describing the functionality of this statement
  event.preventDefault();

  // TODO: Add a comment describing the functionality of these expressions
  const title = document.querySelector('#title-task').value.trim();
  const body = document.querySelector('#body-task').value.trim();
  var due_date;
  if (document.querySelector('#due_date') === '') {
    due_date = new Date(document.querySelector('#due_date').value);
  } else {
    due_date = null;
  }
  console.log("due date", due_date);
  const minutes = document.querySelector('#minutes').value;
  const points = document.querySelector('#points').value
  const priority = document.querySelector('#priority').value;
 

  // console.log(due_date);
  if (title && body) {
    // const due_date = '2023-06-27 12:00:00'
    // TODO: Add a comment describing the functionality of this expression
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ 
        title,
        body, 
        priority,
        due_date,
        minutes, 
        points
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('Successfully tasked!');
      document.location.replace('/');
    } else {
      alert('Task failed to create.');
    }
  }
};

document
  .querySelector('.task-form')
  .addEventListener('submit', loginFormHandler);
