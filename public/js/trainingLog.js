// Function to simulate an asynchronous operation
function fetchData() {
    return new Promise(resolve => {
      // Simulate a delay of 2 seconds
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

/**
 * changes a date object into a format that can go in a URL
 * @param {Date} date - date to transform
 * @returns {String}
 */
const date2url = (date) => encodeURIComponent(date.toISOString())

/**
 * changes a date object into a format that can go in a URL, but without the time
 * @param {Date} date - date to transform
 * @returns {String}
 */
const dateOnly2url = (date) => date.toISOString().slice(0,10);

const completedVsNotCompleteFunction = async (event) => {
   
      const completeResponse = await fetch('/api/tasks/completeCount', {
        method: 'GET',
       
        headers: { 'Content-Type': 'application/json' },
      });
      const incompleteResponse = await fetch('/api/tasks/incompleteCount', {
        method: 'GET',
       
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(completeResponse);
      console.log(incompleteResponse);
  
      if (completeResponse.ok && incompleteResponse.ok ) {
        var completeCount = await completeResponse.json();
        var incompleteCount = await incompleteResponse.json();
        var completedVsNotCompleted = document.getElementById('completed-vs-not-completed').getContext('2d');
        var completedVsNotCompletedChart = await new Chart(completedVsNotCompleted, {
        type: 'doughnut',
        data: {
            labels: ['Not Completed', 'Completed'],
            datasets: [{
                data: [incompleteCount, completeCount],
                backgroundColor: [
                    'red',
                    'green'
                ],
                borderColor: [
                    'darkred',
                    'darkgreen'
                ],
                borderWidth: 1
            }]
        },
        options: {
            
        }
        });
        
      } else {
        console.log('Complete vs. Incomplete data failed.');
      }
    }


const monthlyChartFunction = async () => {

    const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const today = new Date();
    const thisMonth = today.getMonth();

    let labels = monthNames;
    let dataMinutes = [];
    let dataPoints = [];
    await Promise.all(monthNames.map( async (month,index) => {

        if (index <= thisMonth+1) {
            //labels[index] = monthNames[(index+thisMonth) % 12];
            // The last day of the month
                let endMonth = new Date();
                //endMonth.setMonth(index-thisMonth+1);
                endMonth.setMonth(index);
                endMonth.setDate(0);
            const statsResponse = await fetch(`/api/stats/me/date/${dateOnly2url(endMonth)}`, {
                method: 'GET',
            
                headers: { 'Content-Type': 'application/json' },
            });

        
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                dataMinutes[index]=(statsData.total_minutes);
                dataPoints[index]=(statsData.total_points);
            } else {
                console.log(`Monthly Minutes data failed for ${labels[index]}.`)
            }
        }
    }));

    document.querySelector('#minutes-heading h3').textContent = dataMinutes[thisMonth]-dataMinutes[0];
    document.querySelector('#total-points').textContent = dataPoints[thisMonth];
    // Make the chart
    var minutes = document.getElementById('minutes').getContext('2d');
    var minutesChart = new Chart(minutes, {
        type: 'line',
        data: {
            labels ,
            datasets: [{
                data: dataMinutes,
                backgroundColor: [
                    'black'
                ],
                borderColor: [
                    'black'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            },
            elements: {
                line: {
                    tension : 0.4  // smooth lines
                },
            }
        }
    });

    var pointsYear = document.getElementById('points-year').getContext('2d');
var pointsYearChart = new Chart(pointsYear, {
    type: 'line',
    data: {
        labels,
        datasets: [{
            data: dataPoints,
            backgroundColor: [
                'black'
            ],
            borderColor: [
                'black'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            },
        },
        elements: {
            line: {
                tension : 0.4  // smooth lines
            },
        },  
    }
});
    
} 

/**
 * Show or hide loading box
 * @param {HTMLDivElement} el - the loading div element
 * @param {String} oper - either "show" or "hide"
 */
function showHide(el, oper) {
    try {
        console.log('start',oper,el.classList
        )
        switch (oper) {
            case "show": 
            el.classList.remove('d-none')
            el.classList.add('d-flex')
            console.log('hid', el.classList,el);
            break;
            case "hide": 
            el.classList.add('d-none')
            el.classList.remove('d-flex');
            console.log('showed',el.classList, el)
            break;
        }
    } catch {
        return;
    }
    console.log('end',oper,el.classList
        )
}

window.onload = async () => {
     document.querySelectorAll(".loading").forEach((el) => {showHide(el,"show")});
    //await fetchData();
    await completedVsNotCompleteFunction();
    showHide(document.querySelector("#completed-vs-not-completed-heading .loading"), "hide")
    await monthlyChartFunction();
    [
        document.querySelector("#points-year-heading .loading"),
        document.querySelector("#minutes-heading .loading")
    ].forEach((el) => { showHide(el, "hide")})
}


var priority = document.getElementById('priority').getContext('2d');
var priorityChart = new Chart(priority, {
    type: 'doughnut',
    data: {
        labels: ['1', '2', '3', 'Other'],
        datasets: [{
            data: [5, 5, 5, 15],
            backgroundColor: [
                'gold',
                'silver',
                '#CD7F32',
                'white'
            ],
            borderColor: [
                'black',
                'black',
                'black',
                'black'
            ],
            borderWidth: 1
        }]
    },
    options: {
       
    }
});





var pointsWeekly = document.getElementById('points-weekly').getContext('2d');
var pointsWeeklyChart = new Chart(pointsWeekly, {
 type: 'line',
    data: {
        labels: ['Past Average', '3 Weeks Ago', '2 Weeks Ago', '1 Week Ago', 'This Week'],
        datasets: [{
            data: [12133, 11222, 5900, 8565, 1509],
            backgroundColor: [
                'white',
                'yellow',
                'gold',
                'goldenrod',
                'red'
            ],
            borderColor: [
                'black',
                'black',
                'black',
                'black'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            },
        },
        elements: {
            line: {
                tension : 0.4  // smooth lines
            },
        },
    }
});

var pointsDaily = document.getElementById('points-daily').getContext('2d');
var pointsDailyChart = new Chart(pointsDaily, {
    type: 'line',
    data: {
        labels: [ 'Past Average', '3 Days Ago', '2 Days Ago', '1 Days Ago', 'Today'],
        datasets: [{
            data: [2131, 2113, 2244, 2123, 1901],
            backgroundColor: [
                'white',
                'yellow',
                'gold',
                'goldenrod',
                'red'
            ],
            borderColor: [
                'black'
            ],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            },
        },
        elements: {
            line: {
                tension : 0.4  // smooth lines
            },
        },
    }
});

