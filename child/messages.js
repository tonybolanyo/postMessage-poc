const origin = 'https://ll-embedding.netlify.app';

const panel = document.getElementById('msg-panel');
const msgBox = document.getElementById('message');
const sendButton = document.getElementById('send-button');
const buttons = document.querySelectorAll('.player-button');

let pingActive;
let currentStep = 0;

window.addEventListener('message', (e) => {
  console.log('Accepted origin:', origin);
  console.log('Message origin:', e.origin);
  console.log('Message source:', e.source);
  console.log('Message data:', e.data);
  if (e.origin !== origin || !e.data) {
    return;
  }
  currentStep = e.data.step;
  panel.innerHTML += `<p class="received">${currentStep}: ${e.data.message}</p>`;
});

buttons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const msg = e.currentTarget.getAttribute('message');
    const id = e.currentTarget.getAttribute('id');
    if (id === 'btn-play') {
      pingActive = setInterval(pingTracking, 2000);
    }
    if ((id === 'btn-stop' || id === 'btn-pause') && pingActive) {
      clearInterval(pingActive);
    }

    sendMessage(msg);
  });
});

let qs = new URLSearchParams(document.location.search);
currentStep = parseInt(qs.get('step')) || 1;
sendMessage('player loaded');

function pingTracking() {
  sendMessage('ping');
}

function sendMessage(msg) {
  currentStep++;
  window.parent.postMessage({ step: currentStep, message: msg }, origin);
  panel.innerHTML += `<p class="sent">${currentStep}: ${msg}</p>`;
}
