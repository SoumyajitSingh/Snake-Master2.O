//Game Constants & Variables
let inputDir = {x: 0, y: 0};
const foodSound = new Audio('./Assets/food.mp3');
const gameOverSound = new Audio('./Assets/gameover.mp3');
const moveSound = new Audio('./Assets/move.mp3');
const musicSound = new Audio('./Assets/music.mp3');

let score = 0;
let speed = 5;

function setDifficulty(value){
    if (value === "Easy") {
        speed = 5;
    } else if (value === "Medium") {
        speed = 10;
    } else if (value === "Hard") {
        speed = 15;
    }
}
//start and pause game
let isGameRunning = false;
let isGamePaused = false;
document.getElementById("startButton").addEventListener("click", () => {
    if (!isGameRunning) {
        isGameRunning = true;
        isGamePaused = false;
        window.requestAnimationFrame(main);
    }
});

document.getElementById("pauseButton").addEventListener("click", () => {
    if (isGameRunning) {
        isGamePaused = true;
    }
});

document.getElementById("resumeButton").addEventListener("click", () => {
    if (isGameRunning && isGamePaused) {
        isGamePaused = false;
        window.requestAnimationFrame(main);
    }
});

document.getElementById("restartButton").addEventListener("click", () => {
    score = 0;
    scoreBox.innerHTML = "Score: " + score;
    lastPaintTime = 0;
     p = 2;
     q = 16;
     snakearry = [
    { x: Math.floor(p + (q - p + 1) * Math.random()),
     y: Math.floor(p + (q - p + 1) * Math.random())}
    ]
    food = {x: 6, y: 7};
    inputDir = { x: 0, y: 0 };
    isGameRunning = true;
    isGamePaused = false;
    speed = 5;
    window.requestAnimationFrame(main);
});






let lastPaintTime = 0;
let p = 2;
let q = 16;
let snakearry = [
    { x: Math.floor(p + (q - p + 1) * Math.random()),
     y: Math.floor(p + (q - p + 1) * Math.random())}
]
food = {x: 6, y: 7};

//music Sound
musicSound.play().catch(() => {});
const gameSound = document.getElementById('gSound');
gameSound.addEventListener('click', () => {
    if (musicSound.paused) {
        musicSound.play();
        gameSound.textContent = 'Pause Sound';
    } else {
        musicSound.pause();
        gameSound.textContent = 'Play Sound';
    }
});

//sidebar
const sidebarButton = document.getElementById('Bars');
const sidebar = document.getElementById('menu');
sidebarButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
//menu
function toggleOptions() {
      var options = document.getElementById('optionsMenu');
      if (options.style.display === 'none' || options.style.display === '') {
        options.style.display = 'block';
      } else {
        options.style.display = 'none';
      }
    }
  function hi(){
    var hi = document.getElementById('highScoreBox');
    if (hi.style.display === 'none' || hi.style.display === '') {
      hi.style.display = 'block';
    } else {
      hi.style.display = 'none';
    }
  }

//Game speed or fps
function main(ctime) {
    if (!isGameRunning || isGamePaused) return;
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}
function isCollide(snakearry) {
    //if snake collides with itself
    for(let i = 1; i < snakearry.length; i++) {
        if(snakearry[i].x === snakearry[0].x && snakearry[i].y === snakearry[0].y) {
            return true;
        }
    }
    //if snake collides with wall
    if (snakearry[0].x >= 18 || snakearry[0].x <= 0 || snakearry[0].y >= 18 || snakearry[0].y <= 0) {
        return true;
    }
}
function gameEngine(){
    //part 1: Updating the snake array and food
    if (isCollide(snakearry)) {
        gameOverSound.play();
        let test = false;
        if(gameSound.textContent === 'Pause Sound') {
            musicSound.pause();
            test = true;
        }
        inputDir = {x: 0, y: 0};
        alert("Game Over");
        if (test) {
            musicSound.play();
        }
        snakearry = [{x: 10, y: 6}];
        score = 0;
    }
    //if the snake has eaten the food, increment the score and regenerate the food
    if(snakearry[0].x === food.x && snakearry[0].y === food.y) {
        foodSound.play();
        snakearry.unshift({x: snakearry[0].x + inputDir.x, y: snakearry[0].y + inputDir.y});
        score += 1;
        scoreBox.innerHTML = "Score: " + score;
        if (score > hiscore) {
            let hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            highScoreBox.innerHTML = "High Score: " + hiscoreval;
        }
        let a = 2;
        let b = 16;
        food = {
            x: Math.floor(a + (b - a + 1) * Math.random()),
            y: Math.floor(a + (b - a + 1) * Math.random())
        }
    }
    //move the snake
    for(let i = snakearry.length - 2; i >= 0; i--) {
        snakearry[i + 1] = {...snakearry[i]};
    }
    snakearry[0].x += inputDir.x;
    snakearry[0].y += inputDir.y;
    //part 2:Render the snake and food
    const board = document.querySelector('.board'); 
    board.innerHTML = "";
    //part 2: Display the snake
    snakearry.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    //part 3: Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}
//main logic of the game
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
}
else {
    highScoreBox.innerHTML = "High Score: " + hiscore;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = {x: 0, y: 1}; //start the game
    moveSound.play();
    switch (e.key){
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
})