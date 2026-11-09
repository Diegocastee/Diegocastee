//Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

//Global variables
let randomNumber;
let attempts = 0;
let remaining = 7;
let wins = 0;
let losses = 0;

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("RandomNumber : " + randomNumber);
    attempts = 0;
    remaining = 7;

    // Displays total wins and total losses
    document.querySelector("#wins").textContent = wins;
    document.querySelector("#losses").textContent = losses;

    // Displays attempts left
    document.querySelector("#tries").textContent = remaining;

    // Hiding the reset button
    document.querySelector("#resetBtn").style.display = "none";

    // Showing the guess button
    document.querySelector("#guessBtn").style.display = "inline";

    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus(); // adding focus to textbox
    playerGuess.value = ""; // clearing the textbox

    let feedback = document.querySelector("#feedback");
    feedback.textContent = ""; // clearing the feedback

    // clearing previous guesses
    document.querySelector("#guesses").textContent = "";
}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    let guess = document.querySelector("#playerGuess").value;
    console.log("Player guess: " + guess);
    if (guess < 1 || guess > 99) {
        feedback.textContent = "Enter a number between 1 and 99";
        feedback.style.color = "red";
        return;
    }
    attempts++;
    remaining--;
    console.log("Attempts: " + attempts);
    feedback.style.color = "blue";
    if (guess == randomNumber) { 
        feedback.textContent = "You guessed it! You won!";
        feedback.style.color = "darkgreen";
        wins++;
        gameOver();
    } else {
        document.querySelector("#guesses").textContent += guess + " ";
        document.querySelector("#tries").textContent = remaining;
        if (attempts == 7) {
            feedback.textContent = "Sorry, you lost! Correct number: " + randomNumber;
            feedback.style.color = "red";
            losses++;
            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Guess was high";
        } else {
            feedback.textContent = "Guess was low";
        }
    }
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");
    guessBtn.style.display = "none"; // Hides guess button
    resetBtn.style.display = "inline"; // displays reset button
    document.querySelector("#wins").textContent = wins;
    document.querySelector("#losses").textContent = losses;
}
// document.querySelector("button").style.color = "red";

