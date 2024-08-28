const board = document.querySelector(".board");
const scoreEl = document.querySelector(".score");
let score = 30;
let heartsLeft = 3;
let zombieRate = 1;
let zombieSpawnInterval = 500; 
let gameInterval;
let isGameRunning = false; 

function updateHearts() {
    const heart1 = document.getElementById('heart1');
    const heart2 = document.getElementById('heart2');
    const heart3 = document.getElementById('heart3');

    switch(heartsLeft) {
        case 3:
            heart3.classList.remove('full-heart');
            heart3.classList.add('empty-heart');
            break;
        case 2:
            heart2.classList.remove('full-heart');
            heart2.classList.add('empty-heart');
            break;
        case 1:
            heart1.classList.remove('full-heart');
            heart1.classList.add('empty-heart');
            break;
        default:

      }

    heartsLeft -= 1;
}

function resetGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    const zombies = document.querySelectorAll(".zombie");
    zombies.forEach(zombie => zombie.remove());

    heartsLeft = 3;

    const heart1 = document.getElementById('heart1');
    const heart2 = document.getElementById('heart2');
    const heart3 = document.getElementById('heart3');

    heart1.classList.remove('empty-heart');
    heart1.classList.add('full-heart');
    heart2.classList.remove('empty-heart');
    heart2.classList.add('full-heart');
    heart3.classList.remove('empty-heart');
    heart3.classList.add('full-heart');

    document.getElementById('startButton').style.display = 'block';
    clearInterval(gameInterval);

    score = 30;
    scoreEl.innerText = score.toString().padStart(5, "0");
}

function startGame() {
    document.getElementById('startButton').style.display = 'none';
    scoreEl.innerText = score.toString().padStart(5, "0");
    isGameRunning = true;

    gameInterval = setInterval(function() {
        const div = document.createElement("div");
        div.classList.add("zombie");
        scoreEl.innerText = score.toString().padStart(5, "0");

        const min = 10;
        const max = 220;
        const position = Math.floor(Math.random() * (max - min + 1) + min);
        div.style.bottom = position + "px";

        div.style.zIndex = max - position;

        const minSpeed = 2;
        const maxSpeed = 3.5;
        const time = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * zombieRate;
        div.style.animationDuration = `1s, ${time}s`;

        const minSize = 0.5;
        const maxSize = 3.5;
        const size = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);
        const scale = 1 + size / 10;
        div.style.transform = `scale(${scale})`;

        div.addEventListener("animationend", function() {
            this.remove();
            updateHearts();
            if (heartsLeft <= 0) {
                isGameRunning = false;
                displayGameOver();
                stopAllZombies();
                clearInterval(gameInterval);
            }
        });

        function stopAllZombies() {
            const zombies = document.querySelectorAll(".zombie");
            zombies.forEach(zombie => {
                zombie.classList.add('zombie-paused');
            });
        }

        div.addEventListener("mousedown", function(event) {
            if (isGameRunning && score > 0) {
                event.stopPropagation();
                this.remove();
                score += 10;
                scoreEl.innerText = score.toString().padStart(5, "0");
                updateZombieRate();
            }
        });

        board.appendChild(div);
    }, zombieSpawnInterval * zombieRate );

    board.addEventListener("mousedown", function(event) {
        const clickedElement = event.target;
        const startButton = document.getElementById('startButton');
        
        if (isGameRunning && score > 0 && clickedElement !== startButton) {
            score -= 3;
            score = Math.max(0, score); 
            scoreEl.innerText = score.toString().padStart(5, "0");
        }
    });
}

function displayGameOver() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreEl = document.getElementById('finalScore');

    finalScoreEl.innerText = score.toString().padStart(5, "0");
    gameOverScreen.style.display = 'block';
}

function updateZombieRate() {
    if (score >= 400)
        zombieRate = 0.65;
    else if (score >= 200) 
        zombieRate = 0.8;
    else
        zombieRate = 1;
}
