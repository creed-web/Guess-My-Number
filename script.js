'use strict';

import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let secretnumber = Math.trunc(Math.random() * 20) + 1;
let score = 3;  // Changed from 20 to 3 chances
let highscore = 0;
let hintsRemaining = 2;
let currentUser = null;

// Update initial score display to show 3
document.querySelector('.score').textContent = '3';

// Add these functions at the top of your file
function showLosePopup(number) {
    document.querySelector('.popup-number').textContent = number;
    document.querySelector('#losePopup').style.display = 'block';
    document.querySelector('main').classList.add('blur');
    document.querySelector('header').classList.add('blur');
}

function showWinPopup(number) {
    document.querySelector('.popup-number').textContent = number;
    document.querySelector('#winPopup').style.display = 'block';
    document.querySelector('main').classList.add('blur');
    document.querySelector('header').classList.add('blur');
}

function closePopup() {
    document.querySelector('#losePopup').style.display = 'none';
    document.querySelector('#winPopup').style.display = 'none';
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
    hintsRemaining = 2;
    document.querySelector('.hint-btn').disabled = false;
    document.querySelector('.hint-btn').style.opacity = '1';
    document.querySelector('.hint-btn').textContent = 'Get Mathematical Hint (2 remaining)';
    document.querySelector('.hint-text').textContent = '';
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
        showWinPopup(secretnumber);

        if(score > highscore){
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
            updateHighScore(highscore);
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

// Add difficulty settings
const difficulties = {
    easy: { maxNumber: 20, chances: 5 },
    medium: { maxNumber: 50, chances: 4 },
    hard: { maxNumber: 100, chances: 3 }
};

let currentDifficulty = 'medium';

function setDifficulty(level) {
    currentDifficulty = level;
    score = difficulties[level].chances;
    secretnumber = Math.trunc(Math.random() * difficulties[level].maxNumber) + 1;
    document.querySelector('.score').textContent = score;
    document.querySelector('.between').textContent = `(Between 1 and ${difficulties[level].maxNumber})`;
}

// Add high score tracking
const highScores = {
    easy: JSON.parse(localStorage.getItem('highScoresEasy')) || [],
    medium: JSON.parse(localStorage.getItem('highScoresMedium')) || [],
    hard: JSON.parse(localStorage.getItem('highScoresHard')) || []
};

function saveHighScore(score, difficulty) {
    highScores[difficulty].push({
        score: score,
        date: new Date().toLocaleDateString()
    });
    highScores[difficulty].sort((a, b) => b.score - a.score);
    highScores[difficulty] = highScores[difficulty].slice(0, 5); // Keep top 5
    localStorage.setItem(`highScores${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`, 
        JSON.stringify(highScores[difficulty]));
}

const mathHints = {
    1: ["What is sin 30°?", "What is cos 60°?"],
    2: ["What is sin 60° × 4?", "What is cos 60° + 1?"],
    3: ["What is tan 60°?", "What is sin 60° × 2?"],
    4: ["What is sec 60°?", "What is 2 × 2?"],
    5: ["What is cosec 30°?", "What is sin 30° × 10?"],
    6: ["What is sec 0° × 6?", "What is 2 × 3?"],
    7: ["What is cosec 45° × 5?", "What is √49?"],
    8: ["What is 2³?", "What is cos 60° × 16?"],
    9: ["What is sin 90° × 9?", "What is 3²?"],
    10: ["What is cos 0° × 10?", "What is 2 × 5?"],
    11: ["What is sin 90° × 11?", "What is cos 0° × 11?"],
    12: ["What is 2 × 6?", "What is 3 × 4?"],
    13: ["What is sin 90° × 13?", "What is cos 0° × 13?"],
    14: ["What is 2 × 7?", "What is sin 90° × 14?"],
    15: ["What is 3 × 5?", "What is sin 30° × 30?"],
    16: ["What is 2⁴?", "What is 4 × 4?"],
    17: ["What is sin 90° × 17?", "What is cos 0° × 17?"],
    18: ["What is 2 × 9?", "What is 3 × 6?"],
    19: ["What is sin 90° × 19?", "What is cos 0° × 19?"],
    20: ["What is 2 × 10?", "What is 4 × 5?"]
};

function getHint() {
    if (hintsRemaining > 0) {
        const hintArray = mathHints[secretnumber];
        const hintText = hintArray[2 - hintsRemaining]; // Use different hint each time
        document.querySelector('.hint-text').textContent = hintText;
        hintsRemaining--;
        document.querySelector('.hint-btn').textContent = 
            `Get Mathematical Hint (${hintsRemaining} remaining)`;
        
        if (hintsRemaining === 0) {
            document.querySelector('.hint-btn').disabled = true;
            document.querySelector('.hint-btn').style.opacity = '0.5';
        }
    }
}

const sounds = {
    win: new Audio('win.mp3'),
    lose: new Audio('lose.mp3'),
    click: new Audio('click.mp3'),
    hint: new Audio('hint.mp3')
};

function playSound(soundName) {
    sounds[soundName].currentTime = 0;
    sounds[soundName].play();
}

const stats = {
    gamesPlayed: 0,
    totalGuesses: 0,
    wins: 0,
    losses: 0,
    averageGuesses: 0
};

function updateStats(won) {
    stats.gamesPlayed++;
    stats.totalGuesses += difficulties[currentDifficulty].chances - score;
    if (won) stats.wins++;
    else stats.losses++;
    stats.averageGuesses = stats.totalGuesses / stats.gamesPlayed;
    
    localStorage.setItem('gameStats', JSON.stringify(stats));
    updateStatsDisplay();
}



// Add after other event listeners
document.querySelector('.hint-btn').addEventListener('click', getHint);

function toggleAuth(type) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginBtn = document.querySelector('.auth-toggle:nth-child(1)');
    const signupBtn = document.querySelector('.auth-toggle:nth-child(2)');

    if (type === 'login') {
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
        loginBtn.classList.remove('active');
        signupBtn.classList.add('active');
    }
}

// Add event listeners for the toggle buttons
document.addEventListener('DOMContentLoaded', function() {
    const loginToggleBtn = document.querySelector('.auth-toggle:nth-child(1)');
    const signupToggleBtn = document.querySelector('.auth-toggle:nth-child(2)');

    loginToggleBtn.addEventListener('click', () => toggleAuth('login'));
    signupToggleBtn.addEventListener('click', () => toggleAuth('signup'));
});

// Signup functionality
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const username = this.querySelector('input[type="text"]').value.trim();
    const email = this.querySelector('input[type="email"]').value.trim();
    const password = this.querySelector('input[type="password"]').value;
    const confirmPassword = this.querySelectorAll('input[type="password"]')[1].value;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        alert('Password should be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        console.log('Creating user account...'); // Debug log
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User account created:', user.uid); // Debug log

        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date().toISOString(),
            highScore: 0,
            gamesPlayed: 0
        });
        console.log('User data stored in Firestore'); // Debug log

        alert('Account created successfully!');
        
        // Log in the user
        login({ 
            username, 
            email, 
            uid: user.uid,
            highScore: 0
        });

        // Clear the form
        this.reset();
        
        // Hide signup/login container
        document.getElementById('authContainer').style.display = 'none';
        
    } catch (error) {
        console.error('Signup error:', error); // Debug log
        if (error.code === 'auth/email-already-in-use') {
            alert('This email is already registered. Please login instead.');
        } else if (error.code === 'auth/weak-password') {
            alert('Password should be at least 6 characters long.');
        } else if (error.code === 'auth/invalid-email') {
            alert('Please enter a valid email address.');
        } else {
            alert('Error during signup: ' + error.message);
        }
    }
});

// Login function
function login(user) {
    currentUser = user;
    document.getElementById('authContainer').style.display = 'none';
    
    const userProfile = document.getElementById('userProfile');
    userProfile.style.display = 'flex';
    userProfile.querySelector('.username').textContent = user.username;
    
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Update login form handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            login({ 
                username: userData.username, 
                email: userData.email, 
                uid: user.uid,
                highScore: userData.highScore
            });
            alert('Logged in successfully!');
        }
    } catch (error) {
        if (error.code === 'auth/invalid-credential') {
            alert('Invalid email or password. Please try again.');
        } else if (error.code === 'auth/user-not-found') {
            alert('No account found with this email. Please sign up first.');
        } else if (error.code === 'auth/wrong-password') {
            alert('Incorrect password. Please try again.');
        } else {
            alert('Error during login: ' + error.message);
        }
    }
});

// Add the logout function
async function logout() {
    try {
        await signOut(auth);
        currentUser = null;
        
        // Clear local storage
        localStorage.removeItem('currentUser');
        
        // Hide user profile
        document.getElementById('userProfile').style.display = 'none';
        
        // Show auth container
        document.getElementById('authContainer').style.display = 'flex';
        
        // Reset game state
        score = 3;
        secretnumber = Math.trunc(Math.random() * 20) + 1;
        document.querySelector('.score').textContent = score;
        document.querySelector('.message').textContent = 'Start guessing...';
        document.querySelector('.number').textContent = '?';
        document.querySelector('.guess').value = '';
        document.querySelector('body').style.backgroundColor = '#222';
        document.querySelector('.number').style.width = '15rem';
        
        // Reset hints
        hintsRemaining = 2;
        document.querySelector('.hint-btn').disabled = false;
        document.querySelector('.hint-btn').style.opacity = '1';
        document.querySelector('.hint-btn').textContent = 'Get Mathematical Hint (2 remaining)';
        document.querySelector('.hint-text').textContent = '';

        alert('Logged out successfully!');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout: ' + error.message);
    }
}

// Add event listener for logout button
document.querySelector('.logout-btn').addEventListener('click', logout);

// Update highscore handling
async function updateHighScore(newScore) {
    if (!currentUser?.uid) return;

    try {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (newScore > userData.highScore) {
                await setDoc(userRef, { 
                    ...userData,
                    highScore: newScore 
                });
            }
        }
    } catch (error) {
        console.error('Error updating high score:', error);
    }
}

// Check for existing login on page load
window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        login(JSON.parse(savedUser));
    }
});
