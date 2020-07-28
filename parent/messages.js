const origin = 'https://ll-player.netlify.app';
const initStep = 3;

const panel = document.getElementById('msg-panel');
const msgBox = document.getElementById('message');
const sendButton = document.getElementById('send-button');
const player = initChild(`${origin}?step=${initStep}`);

let currentStep = 1;

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

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  sendMessage(msgBox.value);
  msgBox.value = '';
});

function initChild(src) {
  iframe = document.createElement('iframe');
  iframe.setAttribute('src', src);
  iframe.setAttribute('id', 'player');
  // document.body.appendChild(iframe);
  document.getElementById('child-doc').appendChild(iframe);
  return iframe;
}

function sendMessage(msg) {
  currentStep++;
  player.contentWindow.postMessage({ step: currentStep, message: msg }, origin);
  panel.innerHTML += `<p class="sent">${currentStep}: ${msg}</p>`;
}
