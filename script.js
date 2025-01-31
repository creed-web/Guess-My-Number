'use strict';

let secretnumber = Math.trunc(Math.random() * 20) + 1; // Changed to "let"
let score = 3;  // Changed from 20 to 3 chances
let highscore = 0;

// Update initial score display to show 3
document.querySelector('.score').textContent = '3';

// Add these functions at the top of your file
function showLosePopup(number) {
    document.querySelector('.popup-number').textContent = number;
    document.querySelector('#losePopup').style.display = 'block';
    document.querySelector('main').classList.add('blur');
    document.querySelector('header').classList.add('blur');
}

function closePopup() {
    document.querySelector('#losePopup').style.display = 'none';
    document.querySelector('main').classList.remove('blur');
    document.querySelector('header').classList.remove('blur');
    // Reset the game
    score = 3;
    secretnumber = Math.trunc(Math.random() * 20) + 1;
    document.querySelector('.guess').value = '';
    document.querySelector('.number').textContent = '?';
    document.querySelector('.message').textContent = 'Start guessing...';
    document.querySelector('.score').textContent = score;
    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').style.width = '15rem';
}

document.querySelector('.btn.check').addEventListener('click', function () {
    const guess = Number(document.querySelector('.guess').value);
    console.log(guess, typeof guess);

    if (!guess) {
        document.querySelector('.message').textContent = 'Please enter a Number!!';
    } else if (guess === secretnumber) {
        document.querySelector('.message').textContent = 'Congratulations you Won!!🍾🎉';
        document.querySelector('.number').textContent = secretnumber;
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '45rem';

        if(score > highscore){
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
        }
    } else if (guess > 20) {
        document.querySelector('.message').textContent = 'Your Number Was Greater Than 20!!😟😔';
    } else if (guess > secretnumber) {
        if (score > 1) {
            document.querySelector('.message').textContent = 'Guess a less or low Number!!📉';
            score--;
            document.querySelector('.score').textContent = score;
        } else {
            document.querySelector('.message').textContent = 'Game Over! The number was ' + secretnumber + ' 💥';
            document.querySelector('.score').textContent = 0;
            document.querySelector('body').style.backgroundColor = '#ff0000';
            showLosePopup(secretnumber);
        }
    } else if (guess < secretnumber) {
        if (score > 1) {
            document.querySelector('.message').textContent = 'Guess a greater or high Number!!📈';
            score--;
            document.querySelector('.score').textContent = score;
        } else {
            document.querySelector('.message').textContent = 'Game Over! The number was ' + secretnumber + ' 💥';
            document.querySelector('.score').textContent = 0;
            document.querySelector('body').style.backgroundColor = '#ff0000';
            showLosePopup(secretnumber);
        }
    }
});

// Update the "Again" button to also close the popup
document.querySelector('.again').addEventListener('click', closePopup);

//The Project has ended Good work Varun.....!!!