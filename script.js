let mediaRecorder;
let audioChunks = [];

// Start recording
document.getElementById('recordButton').addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstart = () => {
      document.getElementById('recordingStatus').textContent = 'Recording...';
      document.getElementById('recordButton').disabled = true;
      document.getElementById('stopButton').disabled = false;
    };

    mediaRecorder.onerror = (event) => {
      console.error('Recording error:', event.error);
      document.getElementById('recordingStatus').textContent = 'Error: Recording failed.';
    };
  } catch (error) {
    console.error('Error accessing microphone:', error);
    document.getElementById('recordingStatus').textContent = 'Error: Microphone access denied.';
  }
});

// Stop recording
document.getElementById('stopButton').addEventListener('click', () => {
  mediaRecorder.stop();

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const recordedAudio = document.getElementById('recordedAudio');
    recordedAudio.src = audioUrl;

    // Save the recorded audio to localStorage
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      localStorage.setItem('customVoiceNotification', reader.result);
      document.getElementById('recordingStatus').textContent = 'Recording saved!';
    };

    // Clean up
    audioChunks = [];
    document.getElementById('recordButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
  };
});

// Complete sign-up
function completeSignUp() {
  const username = document.getElementById('username').value;
  if (username) {
    localStorage.setItem('username', username);
    alert('Sign-up complete! You can now use the app.');
    window.location.href = 'reminder.html'; // Redirect to the reminder page
  } else {
    alert('Please enter a username.');
  }
}