// ======================================================
// Create constants
// ======================================================
const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
let words = [];
let wordIndex = 0;
let startTime = Date.now();
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const title = document.getElementById('title');
// ======================================================
// Event Listener to start the game
// ======================================================
document.getElementById('start').addEventListener('click', () => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;
    //console.log(words);

    //UI Updates
    const spanWords = words.map(function(word) { return `<span>${word} </span>` });
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerHTML = '';

    //Setup the textbox
    typedValueElement.disabled = false;
    typedValueElement.value = '';
    typedValueElement.focus();
    //Start the timer
    startTime = new Date().getTime();
    //console.log(startTime);
});

// ======================================================
// Event Listener to typing
// ======================================================

typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        // If end of sentence
        const elapsedTime = new Date().getTime() - startTime;
        if (localStorage.getItem('record')) {
            // console.log("record");
            recordActual = JSON.parse(localStorage.getItem('record'));
            if (elapsedTime < recordActual) {
                recordActual = elapsedTime;
                localStorage.setItem('record', recordActual);
                title.innerHTML = `NEW RECORD : ${recordActual/1000} seconds`;
            } else {
                title.innerHTML = `RECORD : ${recordActual/1000} seconds not beaten`;
            }
        } else {
            localStorage.setItem('record', elapsedTime);
            recordActual = JSON.parse(localStorage.getItem('record'));
            title.innerHTML = `NEW RECORD : ${recordActual/1000} seconds`;
            // console.log(localStorage.getItem('record'));
            // console.log(JSON.parse(localStorage.getItem('record')) / 1000);
        }

        // Congrats modal Message
        const message = `CONGRATULATIONS!! You finished in ${elapsedTime/1000} seconds.`;
        const isVisible = 'is-visible';
        document.getElementById('modalMessage').classList.add(isVisible);
        messageElement.innerText = message;
        document.querySelector("[data-close]").addEventListener('click', () => {
            document.getElementById('modalMessage').classList.remove(isVisible);
        });

        typedValueElement.disabled = true;
        typedValueElement.value = '';
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        //Finish Word
        typedValueElement.value = '';
        wordIndex++;
        // reset class for all elements
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
});