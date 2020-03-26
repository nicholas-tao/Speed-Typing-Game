/*
To Do:
1. Calculate WPM --> fix the calculation (the time it took to type needs to be fixed)
2. Reset/Stop timer after correctly typed quote
3. Look for alternate API to get quotes/text for typing
4. Store scores in a DB or a json lol idk how
*/


const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const wpmElement = document.getElementById('wpm')

quoteInputElement.addEventListener ('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')
   
    let correct = true
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false;
        }
    })

    if (correct)  { 
        var timeElpased = timer.innerText
        wpmElement.innerHTML = "Typing Speed: &nbsp;" +calcWPM(arrayQuote.length, timeElpased) + "&nbsp;WPM"
    }
})

//create a function to stop the time function stopTime( ) { /* check if seconds, minutes and hours are not equal to 0 */ if ( seconds !== 0 || minutes !== 0 || hours !== 0 ) { /* display the full time before reseting the stop watch */ var fulltime = document .getElementById( "fulltime" ); //display the full time fulltime.style.display = "block"; var time = gethours + mins + secs; fulltime.innerHTML = 'Fulltime: ' + time; // reset the stop watch seconds = 0; minutes = 0; hours = 0; secs = '0' + seconds; mins = '0' + minutes + ': '; gethours = '0' + hours + ': '; /* display the stopwatch after it's been stopped */ var x = document.getElementById ("timer"); var stopTime = gethours + mins + secs; x.innerHTML = stopTime; /* display all stop watch control buttons */ var showStart = document.getElementById ('start'); showStart.style.display = "inline-block"; var showStop = document.getElementById ("stop"); showStop.style.display = "inline-block"; /* clear the stop watch using the setTimeout( ) return value 'clearTime' as ID */ clearTimeout( clearTime ); } // if () } // stopTime() /* you need to call the stopTime( ) function to terminate the stop watch */ window.addEventListener( 'load', function ( ) { var stop = document.getElementById ("stop"); stop.addEventListener( 'click', stopTime ); }); // stopwatch.js end 


function getRandomQuote () {
    return fetch (RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content)
}

async function renderNewQuote () {
    const quote = await getRandomQuote()
    quoteDisplayElement.innerHTML = ''
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value = null
    startTimer()
    wpmElement.innerHTML = "Typing Speed: &nbsp;&nbsp;&nbsp;&nbsp; WPM"
}

let startTime
function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date()
    setInterval(() => {
        timer.innerText = getTimerTime()
    }, 1000)
}


function getTimerTime () {
    return Math.floor((new Date() - startTime) / 1000)
}

function calcWPM (arrayQuoteLength, timeElapsed) {
    return Math.floor(arrayQuoteLength/6/timeElapsed*60)
}

document.getElementById("newQuote").addEventListener("click", renderNewQuote);

// init quote
renderNewQuote()