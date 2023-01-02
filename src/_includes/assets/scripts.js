  // form submission & send button toggle
  let myForm = document.querySelector('#postcard form');
  let message = document.querySelector('#postcard form textarea');
  let submit = document.querySelector('#postcard form button');
  let sender = document.querySelector('#sender');
  let success = document.querySelector('#success');
  // let viewport = document.querySelector("meta[name=viewport]");
  
  // form - disable submit button if textarea empty
  function btnActivation(){
    if (!message.value.length || !sender.value.length) {
      submit.disabled = true;            
    } else {
      submit.disabled = false;
    }           
  }
  // form - ajax
  myForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(myForm);
    fetch(myForm.getAttribute('action'), {
      method: 'POST',
      headers: {
        'Accept': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams(formData).toString()
    })
    .then(res => {
      if (res) {
        document.querySelector('#prompt').classList.add('opacity-0')
        myForm.classList.add('hidden')
        success.classList.replace('hidden', 'grid')
        // viewport.setAttribute('content', 'width=device-width, initial-scale=1.0')
      }
    });
  });



  // dynamic sender input width
  function getTextWidth(el) {
    // uses a cached canvas if available
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    // get the full font style property
    var font = window.getComputedStyle(el, null).getPropertyValue('font');
    var text = el.value;
    // set the font attr for the canvas text
    context.font = font;
    var textMeasurement = context.measureText(text);
    return textMeasurement.width;
  }
  // listen for any input on the input field
  sender.addEventListener('input', function(e) {
    var width = Math.floor(getTextWidth(e.target));
    // add 30 px to pad the input.
    var widthInPx = (width + 30) + "px";
    e.target.style.width = widthInPx;
  }, false);


  // auto-height textarea https://codepen.io/vsync/pen/bGgQzL
  function getScrollHeight(elm){
    var savedValue = elm.value
    elm.value = ''
    elm._baseScrollHeight = elm.scrollHeight
    elm.value = savedValue
  }
  function onExpandableTextareaInput({ target:elm }){
    // make sure the input event originated from a textarea and it's desired to be auto-expandable
    if( !elm.classList.contains('autoExpand') || !elm.nodeName == 'TEXTAREA' ) return
    
    var minRows = elm.getAttribute('data-min-rows')|0, rows;
    !elm._baseScrollHeight && getScrollHeight(elm)

    elm.rows = minRows
    rows = Math.ceil((elm.scrollHeight - elm._baseScrollHeight) / 16)
    elm.rows = minRows + rows
  }
  // global delegated event listener
  document.addEventListener('input', onExpandableTextareaInput)