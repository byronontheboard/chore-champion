const taskFormHandler = async (event) => {
  // preventDefault keeps the form from clearing after submitting
  event.preventDefault();
  /** 
   * Either "add" or "update".  From a hidden HTMLInputElement which passes along whether the page is creating a new task or updating an existing one
   * @type {String}
  */
 const type = document.getElementById('type').value;
    /** 
   * Task title from input
   * @type {String}
  */
  const title = document.querySelector('#title-task').value.trim();
  const body = document.querySelector('#body-task').value.trim();
  var due_date;
  if (!document.querySelector('#due_date').value) {
    due_date = null;
  } else {
    due_date = new Date(document.querySelector('#due_date').value);
  }
  console.log("due date", due_date);

  var complete_date;
  if (type === 'update') {
    if (!document.querySelector('#complete_date').value) {
      complete_date = null;
    } else {
      complete_date = new Date(document.querySelector('#complete_date').value);
    }
}
  
  const minutes = document.querySelector('#minutes').value;
  const points = document.querySelector('#points').value

  const priority = document.querySelector('#priority').value

  // console.log(due_date);
  if (title && body && priority && minutes && points) {
    // const due_date = '2023-06-27 12:00:00'
    // TODO: Add a comment describing the functionality of this expression
    console.log(type);
    if (type === 'add') {
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




const populateForm = () => {
  /** 
   * Either "add" or "update".  From a hidden HTMLInputElement which passes along whether the page is creating a new task or updating an existing one
   * @type {String}
  */
 const type = document.getElementById('type').value;

  /** @type {HTMLSelectElement} */
  const priorityEl = document.querySelector('#priority');
  const priority = priorityEl.getAttribute('data-value');

  for (let x=0; x<6; x++) {
    /** @type {HTMLOptionElement} */
    const optionEl = document.createElement('option');
    optionEl.style = "text-align: center;"
    if (x!==0) {
      optionEl.value = x;
      optionEl.text = x;
    } else if (type == 'add' || !priority) {
      optionEl.selected = true;
    }
    if (x==priority) {
      // if the option refers to the current priority value, remove "selected" status from the first option, and give it to the current option.
      optionEl.selected=true;
    }
    priorityEl.appendChild(optionEl);
  }

  // Modify date values
  // Somehow they're coming through in the .toLocaleString() format instead of ISO, even though it console.logs the ISO string on the server.
  // This also ensures that a blank date isn't interpreted as 1970.
  const dueDateEl = document.querySelector('#due_date');
  let dueDate = dueDateEl.getAttribute('data-value');

  if (dueDate) {
    dueDate = new Date(dueDate);
    if (dueDate.valueOf()) {
      console.log(dueDate)
      dueDateEl.value = dueDate.toISOString().slice(0,16);
      console.log(dueDate)
    }
  }
  if (type == 'update') {
    const completeDateEl = document.querySelector('#complete_date');
    let completeDate = completeDateEl.getAttribute('data-value');
    if (completeDate) {
      completeDate = new Date(completeDate);
      if (+completeDate.valueOf()) {
        completeDateEl.value = completeDate.toISOString().slice(0,16);
      }
    }
    
  }
}

populateForm();

document
  .querySelector('.task-form')
  .addEventListener('submit', taskFormHandler);
