(() => {
  // src/_includes/assets/scripts.js
  var message = document.getElementById("message");
  var sender = document.getElementById("sender");
  var submit = document.getElementById("submit");
  function submitActivation() {
    console.log("button typed");
    if (!message.value.length || !sender.value.length) {
      submit.disabled = true;
    } else {
      submit.disabled = false;
    }
  }
  message.addEventListener("keyup", submitActivation);
  sender.addEventListener("keyup", submitActivation);
  function getTextWidth(el) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    var font = window.getComputedStyle(el, null).getPropertyValue("font");
    var text = el.value;
    context.font = font;
    var textMeasurement = context.measureText(text);
    return textMeasurement.width;
  }
  sender.addEventListener("input", function(e) {
    var width = Math.floor(getTextWidth(e.target));
    var widthInPx = width + 30 + "px";
    e.target.style.width = widthInPx;
  }, false);
  function getScrollHeight(elm) {
    var savedValue = elm.value;
    elm.value = "";
    elm._baseScrollHeight = elm.scrollHeight;
    elm.value = savedValue;
  }
  function onExpandableTextareaInput({ target: elm }) {
    if (!elm.classList.contains("autoExpand") || !elm.nodeName == "TEXTAREA")
      return;
    var minRows = elm.getAttribute("data-min-rows") | 0, rows;
    !elm._baseScrollHeight && getScrollHeight(elm);
    elm.rows = minRows;
    rows = Math.ceil((elm.scrollHeight - elm._baseScrollHeight) / 16);
    elm.rows = minRows + rows;
  }
  document.addEventListener("input", onExpandableTextareaInput);
  var myForm = document.querySelector("#postcard form");
  var success = document.getElementById("success");
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(myForm);
    fetch(myForm.getAttribute("action"), {
      method: "POST",
      headers: {
        "Accept": "application/x-www-form-urlencoded;charset=UTF-8",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: new URLSearchParams(formData).toString()
    }).then((res) => {
      if (res) {
        document.querySelector("#prompt").classList.add("opacity-0");
        myForm.classList.add("hidden");
        success.classList.replace("hidden", "grid");
      }
    });
  });
})();
