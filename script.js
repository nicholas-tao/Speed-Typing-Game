/*
To Do:
1. Look for alternate API to get quotes/text for typing
2. Store scores in a DB or a json and then display past scores in table (time, speed in WPM)
3. title/navbar?
4. disable copy and paste into quoteInput
*/


const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const wpmElement = document.getElementById('wpm')

var completed = false

quoteInputElement.addEventListener ('input', () => {
    
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')
   
    var correct = true
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
       
        wpmElement.innerHTML = "Typing Speed: &nbsp;" +calcWPM(arrayQuote.length, timerElement.innerHTML) + "&nbsp;WPM"
        completed = true
    }
})

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
    completed = false
    wpmElement.innerHTML = "Typing Speed: &nbsp;&nbsp;&nbsp;&nbsp; WPM"
}

var interval
var startTime
function startTimer() {
    timerElement.innerText = 0;
    startTime = Date.now()
    interval = setInterval(function() {
        if (completed) return //stop timer if user finished typing quote       
        var elapsedTime = Date.now() - startTime;
        document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(2);
    }, 100);    
}


function calcWPM (arrayQuoteLength, timeElapsed) {
    return Math.floor(arrayQuoteLength/6/timeElapsed*60) //average word has 6 characters, timeElapsed*60 = time elapsed in minutes
}

document.getElementById("newQuote").addEventListener("click", renderNewQuote);

renderNewQuote()