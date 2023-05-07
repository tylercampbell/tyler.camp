const myForm = document.querySelector('#postcard form');
const message = document.getElementById('message');
const sender = document.getElementById('sender');
const submit = document.getElementById('submit');
const success = document.getElementById('success');
const canvas = document.createElement('canvas');

// enable submit button if both message and sender have input
function submitActivation() {
  submit.disabled = (message.value.trim() === '' || sender.value.trim() === '');
}

// get width of text input
function getTextWidth(el) {
  const context = canvas.getContext('2d');
  const font = window.getComputedStyle(el, null).getPropertyValue('font');
  const text = el.value;
  context.font = font;
  const textMeasurement = context.measureText(text);
  return textMeasurement.width;
}

// set sender input width dynamically
function onSenderInput(e) {
  const width = Math.floor(getTextWidth(e.target)) + 30; // add 30px to pad the input
  e.target.style.width = `${width}px`;
}

// get base scroll height of textarea
function getScrollHeight(elm) {
  const savedValue = elm.value;
  elm.value = '';
  const scrollHeight = elm.scrollHeight;
  elm.value = savedValue;
  elm._baseScrollHeight = scrollHeight;
  return scrollHeight;
}

// set message textarea height dynamically
function onTextareaInput(e) {
  const elm = e.target;
  if (elm.classList.contains('autoExpand') && elm.nodeName === 'TEXTAREA') {
    const rows = parseInt(elm.getAttribute('data-min-rows'), 10);
    elm.rows = rows;
    const baseScrollHeight = elm._baseScrollHeight || getScrollHeight(elm);
    const currentScrollHeight = elm.scrollHeight;
    elm.rows = currentScrollHeight < baseScrollHeight ? rows : rows + Math.ceil((currentScrollHeight - baseScrollHeight) / 16);
  }
}

// add event listeners
myForm.addEventListener('input', (e) => {
  if (e.target === message || e.target === sender) {
    submitActivation();
    if (e.target === sender) {
      onSenderInput(e);
    } else {
      onTextareaInput(e);
    }
  }
});

// handle form submission
myForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const { action } = myForm;
  const headers = {
    'Accept': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  };
  const body = new URLSearchParams(formData).toString();
  fetch(action, { method: 'POST', headers, body })
    .then(res => {
      if (res) {
        document.querySelector('#prompt').classList.add('opacity-0');
        myForm.classList.add('hidden');
        success.classList.replace('hidden', 'grid');
      }
    });
});
