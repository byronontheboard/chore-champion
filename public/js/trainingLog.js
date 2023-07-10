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
        
        return response
      } else {
        console.log('Complete vs. Incomplete data failed.');
      }
    }

const minutesChartFunction = async () => {

    const monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const today = new Date();
    const thisMonth = today.getMonth();

    

    let labels = [];
    let data = [];
    monthNames.forEach( async (month,index) => {
        labels.push(monthNames[(index-thisMonth) % 12]);
        // The last day of the month
            let endMonth = new Date();
            endMonth.setMonth(index-thisMonth+1);
            console.log(dateOnly2url(endMonth))
            endMonth.setDate(0);
            console.log(dateOnly2url(endMonth))
        const statsResponse = await fetch(`/api/stats/me/date/${dateOnly2url(endMonth)}`, {
            method: 'GET',
           
            headers: { 'Content-Type': 'application/json' },
        });

    
        if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            data.push(statsData.total_minutes);
        } else {
            console.log(`Monthly Minutes data failed for ${labels[index]}.`)
        }
    });
    // Make the chart
    var minutes = document.getElementById('minutes').getContext('2d');
    var minutesChart = new Chart(minutes, {
        type: 'line',
        data: {
            labels ,
            datasets: [{
                data,
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
    
} 

window.onload = () => {
    completedVsNotCompleteFunction();
    minutesChartFunction();
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

var pointsYear = document.getElementById('points-year').getContext('2d');
var pointsYearChart = new Chart(pointsYear, {
    type: 'line',
    data: {
        labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            data: [10456, 12659, 10675, 11352, 9575, 11023, 9002, 10214, 12012, 13234, 12021, 11105],
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