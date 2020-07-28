const allowedOrigins = [
  { clientId: 1111, origin: 'https://ll-embedding.netlify.app' },
  { clientId: 2222, origin: 'https://tonygb.com' },
  { clientId: 3333, origin: 'https://polimeralia.com' },
  { clientId: 3000, origin: 'http://localhost:3000' },
];

const panel = document.getElementById('msg-panel');
const msgBox = document.getElementById('message');
const sendButton = document.getElementById('send-button');
const buttons = document.querySelectorAll('.player-button');
const qs = new URLSearchParams(document.location.search);

const clientId = qs.get('h');

if (!clientId) {
  throw 'You can not embed this player';
}

console.log('[CHILD] window.origin', window.origin);
console.log('[CHILD] document.origin', document.origin);
console.log('[CHILD] document.referrer', document.referrer);

const origin = allowedOrigins.filter((item) => item.clientId === clientId)[0];

if (origin !== document.referrer) {
  throw 'You are not allowed to embed this player';
}

let pingActive;
let currentStep = 0;

window.addEventListener('message', (e) => {
  console.log('[CHILD] Accepted origin:', origin);
  console.log('[CHILD] Message origin:', e.origin);
  console.log('[CHILD] Message source:', e.source);
  console.log('[CHILD] Message data:', e.data);
  console.log('[CHILD]', e);
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
