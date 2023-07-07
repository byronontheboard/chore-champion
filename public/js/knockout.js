// Adapted from ChatGPT prompt for function that calculates time since initialization.

// Function to calculate the time difference
function calculateTimeDifference(initializationTimestamp, currentTimestamp) {
    // Calculate the time difference in milliseconds
    const timeDifference = currentTimestamp - initializationTimestamp;
  
    // Convert the time difference to a more readable format
    const milliseconds = Math.floor(timeDifference);
    const seconds = Math.floor(timeDifference / 1000) % 60;
    const minutes = Math.floor(timeDifference / 1000 / 60) % 60;
    const hours = Math.floor(timeDifference / 1000 / 60 / 60) % 24;
    const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
  
    // Return the time difference as an object
    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }
  

const pauseProgressButton = (intervalToClear) =>{
    console.log(intervalToClear);
    if(intervalToClear !== undefined) {
        clearInterval(intervalToClear);
    }
}

const clearIntervalOnTimer = (interval) => {
    interval.clearInterval(interval);
}

var timers = [];
var timerToggle = [];
var startButtons = document.querySelectorAll(`.start-timer`);

for (let i = 0; i < startButtons.length; i++) {
  timerToggle[i] = false;
  createEventListener(startButtons[i], i);
}

const setButtonProgress = (clickedStartButton, clickedStartProgress, text, percent, iteration) => {
  clickedStartProgress.style.width = `${percent}%`;
  let percentToFixed = percent.toFixed(2);
  
  /* Change the look of the button. */
  if (percent > 66) {
    clickedStartButton.classList.replace('btn-warning', 'btn-success');
  } else if (percent > 33) {
    clickedStartButton.classList.replace('btn-light', 'btn-warning');
  } else if (percent >= 0) {
    clickedStartButton.classList.replace('btn-success', 'btn-light');
  }

  /* Change the text. */
  if (percent >= 100) {
      percent = 100;
      text.innerHTML = `${percentToFixed}% - You did it! Click complete!`;
  } else if (percent > 87.5) {
      text.innerHTML = `${percentToFixed}% - Final stretch!`;
  } else if (percent > 66) {
      text.innerHTML = `${percentToFixed}% - Almost!`;
  } else if (percent > 50) {
      text.innerHTML = `${percentToFixed}% - Half way there!`;
  } else if (percent > 33) {
      text.innerHTML = `${percentToFixed}% - Making progress!`;
  } else if (percent > 20) {
      text.innerHTML = `${percentToFixed}% - Great start!`;
  } else {
      text.innerHTML = `${percentToFixed}% - You can do it!`;
  }

  if (percent >= 100) {
    clearInterval(timers[iteration]);
    setButtonProgress(clickedStartButton, clickedStartProgress, clickedStartText, 100, iteration);
  }
}

function createEventListener(startButton, iteration) {
  startButton.addEventListener(`click`, (event) => {
    event.preventDefault();
    let startTime = Date.now();
    let id = startButton.dataset.id;
    // if (timerToggle[])
    let minutes = startButton.dataset.minutes;
    let seconds = minutes * 60;
    let clickedStartButton = document.querySelector(`#start-${id}`);
    let clickedStartProgress = document.querySelector(`#start-progress-${id}`);
    let clickedStartText = document.querySelector(`#start-timer-text-${id}`);
    let increment = 100;
    if (timerToggle[iteration] === false) {
      timerToggle[iteration] = true;
      timers[iteration] =   setInterval(() => {
        let millisecondsElapsed = calculateTimeDifference(startTime, Date.now()).milliseconds;
        let completedPercentage = (millisecondsElapsed / (seconds * 1000)) * 100;
    
        setButtonProgress(clickedStartButton, clickedStartProgress, clickedStartText, completedPercentage, iteration);
      }, increment);
    } else {
      clearInterval(timers[iteration]);
      timerToggle[iteration] = false;
    }
    console.log(timers);
    console.log(timerToggle[iteration]);
  })
};