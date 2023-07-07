// const minutesHandler = async (event) => {
//   // TODO: Add a comment describing the functionality of this statement
//   event.preventDefault();

//   // TODO: Add a comment describing the functionality of these expressions
//   const minutes = document.querySelector('#minutes').value.trim();
//     let path = `/knockout/${minutes}`;
//   window.location = path;
// };

// document
//   .querySelector('.task-form')
//   .addEventListener('submit', minutesHandler);

const orHandler = async (event) => {
  // TODO: Add a comment describing the functionality of this statement
  event.preventDefault();

  // TODO: Add a comment describing the functionality of these expressions
  const days = +document.querySelector('#days').value.trim();
  const hours = +document.querySelector('#hours').value.trim();
  const minutes = +document.querySelector('#or-minutes').value.trim();
  
  // Assuming 8 hour days.
  const total_minutes = (days * 480) + (hours * 60) + minutes;

  let path = `/knockout/${total_minutes}`;
  window.location = path;
};

document
  .querySelector('.or-form')
  .addEventListener('submit', orHandler);
