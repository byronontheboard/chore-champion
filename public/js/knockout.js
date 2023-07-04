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
  
const setButtonProgress = (buttonProgress, text, percent) => {
    buttonProgress.style.width = `${percent}%`;
    let percentToFixed = percent.toFixed(2);
    if (percent > 100) {
        percent = 100;
        text.innerHTML = `${percentToFixed}% - You did it!`;
    } else if (percent > 87.5) {
        text.innerHTML = `${percentToFixed}% - Final stretch!`;
    } else if (percent > 75) {
        text.innerHTML = `${percentToFixed}% - Almost!`;
    } else if (percent > 50) {
        text.innerHTML = `${percentToFixed}% - Half way there!`;
    } else if (percent > 30) {
        text.innerHTML = `${percentToFixed}% - Making progress!`;
    } else if (percent > 20) {
        text.innerHTML = `${percentToFixed}% - Great start!`;
    } else {
        text.innerHTML = `${percentToFixed}% - You can do it!`;
    }
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
var startButtons = document.querySelectorAll(`.start-timer`);
var stopButtons = document.querySelectorAll(`.stop-button`);
var pauseButtons = document.querySelectorAll(`.pause-button`);

for (let i = 0; i < startButtons.length; i++) {
  createEventListener(startButtons[i], stopButtons[i], pauseButtons[i]);
}

function createEventListener(startButton, stopButton, pauseButton) {
  startButton.addEventListener(`click`, (event) => {
    event.preventDefault();
    let startTime = Date.now();
    let id = startButton.dataset.id;
    let minutes = startButton.dataset.minutes;
    let seconds = minutes * 60;
    let clickedStartProgress = document.querySelector(`#start-progress-${id}`);
    let clickedStartText = document.querySelector(`#start-timer-text-${id}`);
    let increment = 20;
    let thisInterval = setInterval(() => {
      let millisecondsElapsed = calculateTimeDifference(startTime, Date.now()).milliseconds;
      let completedPercentage = (millisecondsElapsed / (seconds * 1000)) * 100;
      setButtonProgress(clickedStartProgress, clickedStartText, completedPercentage);

      if (completedPercentage <= 0 || completedPercentage > 100) {
        timers[thisInterval] = null;
        clearInterval(thisInterval);
        setButtonProgress(clickedStartProgress, clickedStartText, 100);
        clickedStartText.innerHTML = `You did it! Click Complete!`;
      }
    }, increment);
    timers.push(thisInterval);
  });

//   stopButton.addEventListener(`click`, (event) => {
//     event.preventDefault();
//     console.log(`Stop!`);
//   });

//   pauseButton.addEventListener(`click`, (event) => {
//     event.preventDefault();
//     console.log(`Pause!`);
//   });
}
// var timers = [];
// var intervalToggles = [];

// var startButtons = document.querySelectorAll(`.start-timer`);
// var stopButtons = document.querySelectorAll(`.stop-button`);
// var pauseButtons = document.querySelectorAll(`.pause-button`);
// for (let i = 0; i < startButtons.length; i++) {
//     startButtons[i].addEventListener(`click`, async (event) => {
//         console.log(event.target)
//         event.preventDefault();
//         let increment = 20;
//         intervalToggles.push(true);
//         let startTime = Date.now();
//         let id = startButtons[i].dataset.id;
//         let minutes = startButtons[i].dataset.minutes;
//         let seconds = minutes * 60;
//         let clickedStartButton = document.querySelector(`#start-progress-${id}`);
//         let clickedStartText = document.querySelector(`#start-timer-text-${id}`);
//         let clickedStartProgress = document.querySelector(`#start-progress-${id}`);

//         let thisInterval = setInterval(() => {
//             let millisecondsElapsed = calculateTimeDifference(startTime, Date.now()).milliseconds;
//             let completedPercentage = ((millisecondsElapsed/(seconds*1000)))*100;
//             setButtonProgress(clickedStartProgress, clickedStartText, completedPercentage);

//             if (completedPercentage <= 0 || completedPercentage > 100) {
//                 intervalToggles[i] = false;
//                 clearInterval(timers[i]);
//                 setButtonProgress(clickedStartProgress, clickedStartText, 100);
//                 clickedStartText.innerHTML = `You did it! Click Complete!`;

//             }
//         }, increment);
//         timers.push(thisInterval);
//     });
// }