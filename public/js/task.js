const taskFormHandler = async (event) => {
  // TODO: Add a comment describing the functionality of this statement
  event.preventDefault();
  const type = document.getElementById('type').value;
  // TODO: Add a comment describing the functionality of these expressions
  const title = document.querySelector('#title-task').value.trim();
  const body = document.querySelector('#body-task').value.trim();
  var due_date;
  if (document.querySelector('#due_date')) {
    due_date = document.querySelector('#due_date').value;

    
  } else {
    due_date = undefined;
  }
  console.log("due date", due_date);
  const minutes = document.querySelector('#minutes').value;
  const points = document.querySelector('#points').value
  const priority = document.querySelector('#priority').value;
 

  // console.log(due_date);
  if (title && body && priority && minutes && points) {
    // const due_date = '2023-06-27 12:00:00'
    // TODO: Add a comment describing the functionality of this expression
    console.log(type);
    if (type === 'add') {
      const response = await fetch('/api/tasks/', {
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
        window.location.replace('/knockout/all')
      } else {
        alert('Task failed to create.');
      }
    } else if (type === 'update') {
      const id = +document.getElementById('id').value;
      const response = await fetch('/api/tasks/' + id, {
        method: 'PUT',
        body: JSON.stringify({ 
          title,
          body, 
          priority,
          due_date,
          complete_date,
          minutes, 
          points
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response);
      if (response.ok) {
        var toastElList = [].slice.call(document.querySelectorAll('.toast'))
        var toastList = toastElList.map(function(toastEl) {
            return new bootstrap.Toast(toastEl)
        });
        toastList.forEach(toast => toast.show())
      } else {
        alert('Task failed to update.');
      }
    }
    
  }
};

document
  .querySelector('.task-form')
  .addEventListener('submit', taskFormHandler);
