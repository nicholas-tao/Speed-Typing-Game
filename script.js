/*
To Do:
2. Remove timer element
3. Start timer when they start typing
3. Look for alternate API to get quotes/text for typing
4. Store scores in a DB or a json lol idk how
*/


const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const wpmElement = document.getElementById('wpm')

let completed = false

quoteInputElement.addEventListener ('input', () => {
    /*
    if (quoteInputElement.value.length > 0) {
        startTimer()
    }
    */
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
        wpmElement.innerHTML = "Typing Speed: &nbsp;" +calcWPM(arrayQuote.length, getElapsedTime()) + "&nbsp;WPM"
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
    startTimer()
    wpmElement.innerHTML = "Typing Speed: &nbsp;&nbsp;&nbsp;&nbsp; WPM"
}

let startTime
function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date()
    setInterval(() => {
        if (completed) return
        timer.innerText = getTimerTime()
    }, 1000)

}

function getTimerTime () {
    return Math.floor((new Date() - startTime) / 1000)
}

function getElapsedTime () {
    return (new Date() - startTime) / 1000
}

function calcWPM (arrayQuoteLength, timeElapsed) {
    return Math.floor(arrayQuoteLength/6/timeElapsed*60) //average word has 6 characters, timeElapsed*60 = time elapsed in minutes
}

document.getElementById("newQuote").addEventListener("click", renderNewQuote);

renderNewQuote()