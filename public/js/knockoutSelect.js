const loginFormHandler = async (event) => {
  // TODO: Add a comment describing the functionality of this statement
  event.preventDefault();

  // TODO: Add a comment describing the functionality of these expressions
  const minutes = document.querySelector('#minutes').value.trim();
    let path = `/knockout/${minutes}`;
  window.location = path;
};

document
  .querySelector('.task-form')
  .addEventListener('submit', loginFormHandler);
