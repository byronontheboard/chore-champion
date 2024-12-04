// Function to change the selected icon
function changeIcon(iconFilename) {
  const iconInput = document.getElementById('icon');
  const iconHeaderInput = document.getElementById('icon-text');
      iconInput.value = iconFilename;
      iconHeaderInput.value = iconFilename;
  }
  const updateFormHandler = async (event) => {
    // TODO: Add a comment describing the functionality of this statement
    event.preventDefault();
  
    // TODO: Add a comment describing the functionality of these expressions
    const username = document.querySelector('#username').value.trim();
    const icon = document.querySelector('#icon').value.trim();
    // const password = document.querySelector('#password-create').value;
  
    if (username && icon) {
      // TODO: Add a comment describing the functionality of this expression
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ username, icon }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        const iconHeaderInput = document.getElementById('icon-text');
        console.log(iconHeaderInput);
        iconHeaderInput.innerHTML = icon;
        alert("Profile updated!");
        // document.location.replace('/profile');
      } else {
        
        alert('Failed to update profile.');
    }
  }
};
  


document
.querySelector('.profile-form')
.addEventListener('submit', updateFormHandler);

    
  