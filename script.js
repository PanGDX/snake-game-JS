const blockSize = 20;
const number_Of_Col = 25;
const number_Of_Row = 25;

let board;
let context;

let maxFood = 10;

let angle = 0;
let speedX = 0;
let speedY = 0;
let snakeBody = [];
let snakeX = blockSize * (Math.floor(Math.random() * 10) + 5);
let snakeY = blockSize * (Math.floor(Math.random() * 10) + 5);

let gameOver = false;
const Food = new Set([]);
const validFoodPos = new Map();
for(let i =1;i<=number_Of_Row;i++){
    for(let f=1;f<=number_Of_Col;f++){
        validFoodPos.set(serializeCoords([i, f]), true);
    }
}


let running_Score = 0;
let high_Score = localStorage['highscore'] || 0;
console.log(high_Score);



let gameInterval;  // Declare at the top to avoid TDZ issues
const snakeHeadImg = new Image();
snakeHeadImg.src = 'snake.png';  // Make sure the path is correct



window.onload = () => {
    document.getElementById("high-score").textContent = `High Score: ${high_Score}`;
    reloadGame();
};

let playButton = document.getElementById("play");
playButton.onclick = () => {
    clearInterval(gameInterval);  // Clear previous interval before setting a new one
    reloadGame();
};

document.addEventListener("keydown", movement);

function reloadGame() {
    gameOver= false;
    speedX = 0;
    speedY = 0;
    angle =0;

    board = document.getElementById("board");
    board.height = blockSize * number_Of_Row;
    board.width = blockSize * number_Of_Col;
    context = board.getContext("2d");

    snakeX = blockSize * (Math.floor(Math.random() * 10) + 5);
    snakeY = blockSize * (Math.floor(Math.random() * 10) + 5);
    snakeBody = []; // Reset the snake body
    running_Score = 0;
    document.getElementById("current-score").textContent = `Current Score: ${running_Score}`;
    Food.clear(); // Clear existing food


    for (let i = 0; i < maxFood; i++) {
        placeFood();
    }

    if (!gameOver) {
        gameInterval = setInterval(frame, 100);  // Start interval
    }
}

function frame() {
    if (gameOver) {
        return;
    }

    context.fillStyle = "green";
    context.fillRect(0, 0, board.width, board.height);


    if (Food.has(`${snakeX},${snakeY}`)) {
        Food.delete(`${snakeX},${snakeY}`);
        validFoodPos.set(serializeCoords([snakeX, snakeY]), true);
        running_Score += 1;
        document.getElementById("current-score").textContent = `Current Score: ${running_Score}`;
        snakeBody.push([snakeX, snakeY]);
        placeFood();
    }

    context.fillStyle = "yellow";
    Food.forEach(pos => {
        let [x, y] = pos.split(',');
        context.fillRect(x, y, blockSize, blockSize);
    });




    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }


    if (speedX === 0 && speedY === -1) {
        angle = Math.PI; // Up
    } else if (speedX === -1 && speedY === 0) {
        angle = Math.PI / 2; // Left
    } else if (speedX === 0 && speedY === 1) {
        angle = 0; ; // Down
    } else if (speedX === 1 && speedY === 0){
        angle = -Math.PI / 2; //Right
    }

    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    context.save();
    context.translate(snakeX + blockSize / 2, snakeY + blockSize / 2);
    context.rotate(angle);
    context.drawImage(snakeHeadImg, -blockSize / 2, -blockSize / 2, blockSize, blockSize);
    context.restore();

    context.fillStyle = "#57b030";
    for (let part of snakeBody) {
        context.beginPath();
        context.arc(part[0] + blockSize / 2, part[1] + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
        context.fill();
    }

    checkCollisions();
}

function checkCollisions() {
    if (snakeX < 0 || snakeX >= number_Of_Col * blockSize || snakeY < 0 || snakeY >= number_Of_Row * blockSize) {
        game_Over_Sequence();
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            game_Over_Sequence();
        }
    }
}

function game_Over_Sequence() {
    gameOver = true;
    clearInterval(gameInterval); // Stop the game loop
    alert("Game Over!");
    if (high_Score < running_Score) {
        high_Score = running_Score;
        localStorage['highscore'] = high_Score;
        document.getElementById("high-score").textContent = `High Score: ${high_Score}`;
    }
    document.getElementById("current-score").textContent = `Current Score: 0`;
}

function placeFood() {
    while (true) {
        let randomX = Math.floor(Math.random() * number_Of_Col) * blockSize;
        let randomY = Math.floor(Math.random() * number_Of_Row) * blockSize;
        let randomPos = `${randomX},${randomY}`;
        if (!arrayContains(validFoodPos, [randomX, randomY]) && snakeX != randomX && snakeY != randomY) {
            validFoodPos.set(serializeCoords([randomX, randomY]), false);
            Food.add(randomPos);
            break;
        }
    }
}

function serializeCoords(coords) {
    return coords.join(',');
}
function arrayContains(map, subArr) {
    return map.has(serializeCoords(subArr));
}

function movement(key) {
    keyPressed = key.code;
    if (keyPressed == "KeyW" && speedY != 1) {
        speedY = -1;
        speedX = 0;
    } else if (keyPressed == "KeyS" && speedY != -1) {
        speedY = 1;
        speedX = 0;
    } else if (keyPressed == "KeyA" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    } else if (keyPressed == "KeyD" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }
}
