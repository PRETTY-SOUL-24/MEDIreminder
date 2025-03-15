let medications = JSON.parse(localStorage.getItem('medications')) || [];

// Render medications
function renderMedications() {
  const medicationList = document.getElementById('medicationList');
  medicationList.innerHTML = '';
  medications.forEach((medication, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${medication.name} (${medication.dosage}) at ${medication.time}</span>
      <button onclick="deleteMedication(${index})">Delete</button>
    `;
    medicationList.appendChild(li);
  });
}

// Add medication
function addMedication() {
  const name = document.getElementById('name').value;
  const dosage = document.getElementById('dosage').value;
  const time = document.getElementById('time').value;

  if (name && dosage && time) {
    const medication = { name, dosage, time };
    medications.push(medication);
    localStorage.setItem('medications', JSON.stringify(medications));
    renderMedications();
    scheduleReminder(medication);
    document.getElementById('name').value = '';
    document.getElementById('dosage').value = '';
  }
}

// Delete medication
function deleteMedication(index) {
  medications.splice(index, 1);
  localStorage.setItem('medications', JSON.stringify(medications));
  renderMedications();
}

// Schedule reminder with notifications
function scheduleReminder(medication) {
  const now = new Date();
  const [hours, minutes] = medication.time.split(':');
  const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  const timeout = reminderTime - now;
  if (timeout > 0) {
    setTimeout(() => {
      remindUser(medication);
    }, timeout);
  } else {
    console.warn('Reminder time is in the past. Please set a future time.');
  }
}

// Remind the user with notifications
function remindUser(medication) {
  // Play custom voice notification (if available)
  const customVoice = localStorage.getItem('customVoiceNotification');
  if (customVoice) {
    const audio = new Audio(customVoice);
    audio.play();
  } else {
    // Fallback to default tone
    const defaultTone = new Audio('default-notification.mp3');
    defaultTone.play();
  }

  // Show a browser notification
  if (Notification.permission === 'granted') {
    showNotification(medication);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showNotification(medication);
      } else {
        console.warn('Notification permission denied.');
      }
    });
  } else {
    console.warn('Notification permission denied.');
  }

  // Ask for confirmation after a short delay
  setTimeout(() => {
    const confirmed = confirm(`Did you take ${medication.name} (${medication.dosage})?`);
    if (!confirmed) {
      setTimeout(() => remindUser(medication), 10 * 60 * 1000); // Follow-up after 10 minutes
    }
  }, 1000); // Delay the confirm dialog by 1 second
}

// Show a browser notification
function showNotification(medication) {
  const notification = new Notification('Medication Reminder', {
    body: `It's time to take ${medication.name} (${medication.dosage})!`,
    icon: 'icon.png', // Optional: Add an icon for the notification
  });

  // Handle notification click
  notification.onclick = () => {
    console.log('Notification clicked');
    window.focus(); // Bring the app to the foreground
  };
}

// Request notification permission on page load
if (Notification.permission !== 'granted') {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.warn('Notification permission denied.');
    }
  });
}

// Initial render
renderMedications();