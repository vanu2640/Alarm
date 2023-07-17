// Get the required DOM elements
const alarmHours = document.getElementById('alarmHours');
const alarmMinutes = document.getElementById('alarmMinutes');
const alarmSeconds = document.getElementById('alarmSeconds');
const alarmPeriod = document.getElementById('alarmPeriod');
const validationMessage = document.getElementById('validationMessage');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const alarmsUL = document.getElementById('alarmsUL');

 // Variable to store the interval ID
let alarmIntervalId;

// Array to store the alarms
let alarms = []; 

// Get the required DOM element
const clock = document.getElementById('clock');

// Update the clock every second
setInterval(updateClock, 1000);

// Update the clock function
function updateClock() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
  
    // Format the time to display as 12-hour format
    const formattedHours = formatTimeComponent(hours);
    const formattedMinutes = formatTimeComponent(minutes);
    const formattedSeconds = formatTimeComponent(seconds);
  
    // Determine the period (AM or PM)
    const period = hours >= 12 ? 'PM' : 'AM';
  
    // Convert the hours to 12-hour format
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  
    // Display the time and period on the clock face
    clock.textContent = `${displayHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  }

// Function to format time components (hours, minutes, seconds)
function formatTimeComponent(time) {
  return time.toString().padStart(2, '0');
}


// Event listener for the "Set Alarm" button
setAlarmBtn.addEventListener('click', function() {
  const hours = alarmHours.value;
  const minutes = alarmMinutes.value;
  const seconds = alarmSeconds.value;
  const period = alarmPeriod.value;

  // Validate the selected time
  if (hours === '0-23' || minutes === '0-59' || seconds === '0-59' ) {
    validationMessage.textContent = 'Please enter a valid time.';
    return;
  }

  // Calculate the time remaining until the alarm goes off
  const currentTime = new Date();
  const alarm = new Date();
  alarm.setHours(hours);
  alarm.setMinutes(minutes);
  alarm.setSeconds(seconds);

// Adjust alarm time if it's in PM
if (period === 'PM') {
    if (hours !== '12') {
      alarm.setHours(alarm.getHours() + 12);
    }
  }

  // Check if the alarm time has already passed
  if (alarm <= currentTime) {
    validationMessage.textContent = 'Please select a future time.';
    return;
  }

  // Calculate the time remaining until the alarm goes off
  const timeRemaining = alarm - currentTime;

  // Start the alarm
  alarmIntervalId = setTimeout(function() {
    alert('Wake up!');
    removeAlarm(alarm);
    clearInterval(alarmIntervalId);
    validationMessage.textContent = 'You are getting late';
  }, timeRemaining);

  // Create alarm object and add it to the alarms list
  const alarmObj = {
    time: `${hours}:${minutes}:${seconds} ${period}`,
    intervalId: alarmIntervalId
  };
  alarms.push(alarmObj);

  // Clear the alarm input values
  validationMessage.textContent = 'Successful';

  // Update the alarms list
  updateAlarmsList();
});

// Function to remove an alarm from the alarms list
function removeAlarm(alarmObj) {
  clearTimeout(alarmObj.intervalId);
  alarms = alarms.filter(function (alarm) {
    return alarm !== alarmObj;
  });

  // Update the alarms list
  updateAlarmsList();
}

// Function to update the alarms list
function updateAlarmsList() {
  // Clear the alarms list
  alarmsUL.innerHTML = '';

  // Create and append the list items for each alarm
  alarms.forEach(function (alarmObj) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = alarmObj.time;

    // Create and append the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function () {
      removeAlarm(alarmObj);
    });

    li.appendChild(deleteBtn);
    alarmsUL.appendChild(li);
  });
}