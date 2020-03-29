/*
To Do:
1. disable copy and paste into quoteInput (do this at end bc need to do testing)
2. Display 8 best scores instead of 8 most recent scores
3. Add Screenshot to README.md
*/

const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const timeRow = document.getElementById("timeRow");
const speedRow = document.getElementById("speedRow");

var completed = false;
var numTimesPlayed = 0;

quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");

  var correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) {
    numTimesPlayed++;
    var wpm = calcWPM(
      arrayQuote.length,
      timerElement.innerHTML,
      numTimesPlayed
    );
    wpmElement.innerHTML = "Speed: &nbsp;" + wpm + "&nbsp;WPM";
    completed = true;
    var currTime = new Date().toLocaleTimeString();
    addToTable(currTime, wpm);
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content);
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = "";
  quote.split("").forEach(character => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
  completed = false;
  wpmElement.innerHTML = "Speed: &nbsp;&nbsp;&nbsp;&nbsp; WPM";
}

var interval;
var startTime;
function startTimer() {
  timerElement.innerText = 0;
  startTime = Date.now();
  interval = setInterval(function() {
    if (completed) return; //stop timer if user finished typing quote
    var elapsedTime = Date.now() - startTime;
    document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(
      2
    );
  }, 100);
}

function calcWPM(arrayQuoteLength, timeElapsed) {
  return Math.floor((arrayQuoteLength / 6 / timeElapsed) * 60); //average word has 6 characters, timeElapsed*60 = time elapsed in minutes
}

function addToTable(currTime, wpm, numTimesPlayed) {
  if (this.numTimesPlayed > 8) {
    timeRow.deleteCell(1);
    speedRow.deleteCell(1);
  }

  var x = timeRow.insertCell(numTimesPlayed);
  x.innerHTML = currTime;

  var y = speedRow.insertCell(numTimesPlayed);
  y.innerHTML = wpm;
}

function checkToStartTimer() {
  if (quoteInputElement.value == "") {
    startTimer();
  }
}

document.getElementById("newQuote").addEventListener("click", renderNewQuote);

renderNewQuote();

/*
// To prevent user from copy and pasting into the text field
(function() {
  var onload = window.onload;

  window.onload = function() {
    if (typeof onload == "function") {
      onload.apply(this, arguments);
    }

    var fields = [];
    var textareas = document.getElementsByTagName("textarea");

    for (var i = 0; i < textareas.length; i++) {
      fields.push(textareas[i]);
    }

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];

      if (
        typeof field.onpaste != "function" &&
        !!field.getAttribute("onpaste")
      ) {
        field.onpaste = eval(
          "(function () { " + field.getAttribute("onpaste") + " })"
        );
      }

      if (typeof field.onpaste == "function") {
        var oninput = field.oninput;

        field.oninput = function() {
          if (typeof oninput == "function") {
            oninput.apply(this, arguments);
          }

          if (typeof this.previousValue == "undefined") {
            this.previousValue = this.value;
          }

          var pasted =
            Math.abs(this.previousValue.length - this.value.length) > 1 &&
            this.value != "";

          if (pasted && !this.onpaste.apply(this, arguments)) {
            this.value = this.previousValue;
          }

          this.previousValue = this.value;
        };

        if (field.addEventListener) {
          field.addEventListener("input", field.oninput, false);
        } else if (field.attachEvent) {
          field.attachEvent("oninput", field.oninput);
        }
      }
    }
  };
})();

*/
