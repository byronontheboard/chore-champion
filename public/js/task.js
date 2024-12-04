async function getRandomTask() {
  try {
    // Use fetch to get the JSON file
    const response = await fetch('./taskJSON.json');
    
    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Parse the JSON data
    const taskJSON = await response.json();
    
    // Log the JSON data
    console.log('taskJSON:', taskJSON);

    // Use taskJSON here, return it if you need to use it elsewhere
    const randomTask = taskJSON[Math.floor(Math.random() * taskJSON.length)].task;
    return randomTask;
  } catch (error) {
    // Handle any errors that occurred during fetch or JSON parsing
    console.error('Error loading JSON:', error);
  }
}
/**
   * The task form itself
   * @type {HTMLFormElement}
   */

document.querySelector('#clear').addEventListener('click', () => {
  document.querySelector(".task-form").reset();
});

try {
  document.getElementById('random').addEventListener('click', async () => {
    let randomTask = await getRandomTask();
    
    // Populate form fields or use data in the application
    document.querySelector("#title-task").value = randomTask.title;
    document.querySelector("#body-task").value = randomTask.body;
    document.querySelector("#priority").value = randomTask.priority;
    // new Date for now + minutes
    let date = new Date();
    date.setMinutes(date.getMinutes() + randomTask.minutes);
    
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    console.log(date)
    let futureDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    document.querySelector("#due_date").value = futureDate;
    document.querySelector("#minutes").value = randomTask.minutes;
    document.querySelector("#points").value = randomTask.points;
    });
  } catch {
    console.log('No random button found');
  }
const form = document.querySelector('.task-form');

const taskFormHandler = async (event) => {
  // preventDefault keeps the form from clearing after submitting
  event.preventDefault();
/** 
   * Either "add" or "update".  From a hidden HTMLInputElement which passes along whether the page is creating a new task or updating an existing one
   * @type {String}
  */
  const type = document.getElementById('type').value;

// Checks that required fields are filled in, and highlights the not valid fields.
// document.querySelector('.task-form').classList.add('was-validated'); 

/** 
 * Task title from input
 * @type {String}
*/
const title = document.querySelector('#title-task').value.trim();
const body = document.querySelector('#body-task').value.trim();
var due_date;
if (document.querySelector('#due_date')) {
  due_date = document.querySelector('#due_date').value;
} else {
  due_date = undefined;
}
console.log(due_date); 
var complete_date;
if (document.querySelector('#complete_date')) {
  complete_date = document.querySelector('#complete_date').value;
} else {
  complete_date = undefined;
}

var complete_date;
if (type === 'update') {
  if (!document.querySelector('#complete_date').value) {
    complete_date = undefined;
  } else {
    complete_date = document.querySelector('#complete_date').value;
  }
}

const minutes = document.querySelector('#minutes').value;
const points = document.querySelector('#points').value;
const priority = document.querySelector('#priority').value || undefined;

  
// console.log(due_date);

  if (title && body && priority && minutes && points) {
     try {
    console.log(form.lastChild.classList.contains('error-message'));
    console.log(form.lastChild)
     
    // Remove error message if it exists
    if (form.lastChild.classList.contains('error-message')) {
      console.log('removed error message');
      form.lastChild.remove();
    }
  }
     catch{
      
     }
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
        let text;
        if (confirm("Clear the task?") == true) {
          document.querySelector(".task-form").reset();
        } else {
          
        }
      } else {
        alert('Task failed to create.');
      }
    } else if (type === 'update') {
      const id = +document.getElementById('id').value;
      let due_date = document.getElementById('due_date').value;
      if (due_date == "") {
        due_date = undefined;
      }

      let complete_date = document.getElementById('complete_date').value;
      if (complete_date == "") {
        complete_date = undefined;
      }
      const response = await fetch('/api/tasks/' + id, {
        method: 'PUT',
        body: JSON.stringify({ 
          title,
          body, 
          priority,
          due_date,
          minutes, 
          points,
          complete_date
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
    
  } else {

    // Show error message if it doesn't already exist
    invalidated();
  }
};



/**
 * Adds options to the priority select element
*/
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
      optionEl.value = "";
      optionEl.selected = true;
      optionEl.disabled = true;
    }
    if (x==priority) {
      // if the option refers to the current priority value, remove "selected" status from the first option, and give it to the current option.
      optionEl.selected=true;
    }
    priorityEl.appendChild(optionEl);
  }

  // Modify date values
  // ***** This is now accomplished by "formatTime" helper function *******
  // Somehow they're coming through in the .toLocaleString() format instead of ISO, even though it console.logs the ISO string on the server.
  // This also ensures that a blank date isn't interpreted as 1970.
  // const dueDateEl = document.querySelector('#due_date');
  // let dueDate = dueDateEl.getAttribute('data-value');

  // if (dueDate) {
  //   dueDate = new Date(dueDate);
  //   if (dueDate.valueOf()) {
  //     console.log(dueDate)
  //     dueDateEl.value = dueDate.toISOString().slice(0,16);
  //     console.log(dueDate)
  //   }
  // }
  // if (type == 'update') {
  //   const completeDateEl = document.querySelector('#complete_date');
  //   let completeDate = completeDateEl.getAttribute('data-value');
  //   if (completeDate) {
  //     completeDate = new Date(completeDate);
  //     if (+completeDate.valueOf()) {
  //       completeDateEl.value = completeDate.toISOString().slice(0,16);
  //     }
  //   }
    
  // }
}

/**
 * Adds error messages if form is incomplete
 */
function invalidated() {

    setCustomValidity(document.querySelector('#title-task'));
    setCustomValidity(document.querySelector('#body-task'));

    form.classList.add('was-validated');
    
    // Show error message if it doesn't already exist
    if (!form.lastElementChild.classList.contains('error-message')) {
      const message = document.createElement('div');
      message.textContent = 'Please fill in required fields';
      message.classList.add('error-message');
      form.appendChild(message);
    }
}

/**
 * Changes the valid/invalid check, so that the input is invalid if the value only contains whitespace.
 * @param {HTMLInputElement} element 
 */
function setCustomValidity(element) {
  if (element.value.trim() === '') {
    element.setCustomValidity('Invalid text');
  } else {
    element.setCustomValidity('');
  }
  element.addEventListener('input', function() {
    if (element.value.trim() === '') {
      element.setCustomValidity('Invalid text');
    } else {
      element.setCustomValidity('');
    }
  });
}

// Adds options to the priority select element
populateForm();

// prevent default browser behavior for an invalid form being submitted
// 
document.querySelectorAll('.task-form input,select').forEach((el) => {
  el.addEventListener('invalid', (event) => {
    event.preventDefault();
    console.log(el,'invalid')
    invalidated();
  })
});

form.addEventListener('submit', taskFormHandler);
