const updateFormHandler = async (event) => {
    // TODO: Add a comment describing the functionality of this statement
    event.preventDefault();
  
    // TODO: Add a comment describing the functionality of these expressions
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const icon = document.querySelector('#icon').value.trim();
    // const password = document.querySelector('#password-create').value;
  
    if (name && email && icon) {
      // TODO: Add a comment describing the functionality of this expression
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, email, icon }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        const iconHeaderInput = document.getElementById('icon-text');
        console.log(iconHeaderInput);
        iconHeaderInput.innerHTML = icon;
        var toastElList = [].slice.call(document.querySelectorAll('.toast'))
        var toastList = toastElList.map(function(toastEl) {
            return new bootstrap.Toast(toastEl)
        });
        toastList.forEach(toast => toast.show())
        }
        // document.location.replace('/profile');
      } else {
        alert('Failed to update profile.');
    }
};
  
// Function to change the selected icon
function changeIcon(iconFilename) {
const iconInput = document.getElementById('icon');
const iconHeaderInput = document.getElementById('icon-text');
    iconInput.value = iconFilename;
    iconHeaderInput.value = iconFilename;
}

document
.querySelector('.profile-form')
.addEventListener('submit', updateFormHandler);

    
  