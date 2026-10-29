const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const tile = 20;
const tiles = canvas.width / tile;

let snake;
let apple;
let direction;
let nextDirection;
let score;
let running = false;
let gameOver = false;
let timer;

function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = "right";
    nextDirection = "right";
    score = 0;
    gameOver = false;
    running = true;

    scoreText.textContent = score;
    statusText.textContent = "Sedang bermain!";
    startBtn.textContent = "Mulai Ulang";

    placeApple();
    clearInterval(timer);
    draw();
    timer = setInterval(update, 120);
}

function placeApple() {
    do {
        apple = {
            x: Math.floor(Math.random() * tiles),
            y: Math.floor(Math.random() * tiles)
        };
    } while (
        snake.some(part =>
            part.x === apple.x && part.y === apple.y
        )
    );
}

function draw() {
    ctx.fillStyle = "#a8d98d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Menggambar pola kotak
    ctx.strokeStyle = "#9bce80";
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= tiles; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tile, 0);
        ctx.lineTo(i * tile, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * tile);
        ctx.lineTo(canvas.width, i * tile);
        ctx.stroke();
    }

    // Menggambar apel
    ctx.font = "19px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        "🍎",
        apple.x * tile + tile / 2,
        apple.y * tile + tile / 2
    );

    // Menggambar ular
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#14532d" : "#22a447";
        ctx.fillRect(
            part.x * tile + 1,
            part.y * tile + 1,
            tile - 2,
            tile - 2
        );

        if (index === 0) {
            ctx.fillStyle = "white";
            ctx.fillRect(
                part.x * tile + 12,
                part.y * tile + 4,
                4, 4
            );
            ctx.fillRect(
                part.x * tile + 12,
                part.y * tile + 12,
                4, 4
            );
        }
    });

    if (gameOver) {
        ctx.fillStyle = "#0009";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.fillText("GAME OVER", 200, 185);

        ctx.font = "18px Arial";
        ctx.fillText("Skor: " + score, 200, 220);
    }
}

function update() {
    direction = nextDirection;

    const head = { ...snake[0] };

    if (direction === "up") head.y--;
    if (direction === "down") head.y++;
    if (direction === "left") head.x--;
    if (direction === "right") head.x++;

    // Memeriksa tabrakan dengan dinding
    if (
        head.x < 0 || head.x >= tiles ||
        head.y < 0 || head.y >= tiles
    ) {
        endGame();
        return;
    }

    const eating = head.x === apple.x && head.y === apple.y;

    // Ekor dapat ditinggalkan jika tidak sedang makan apel
    const body = eating ? snake : snake.slice(0, -1);

    // Memeriksa tabrakan dengan tubuh sendiri
    if (body.some(part => part.x === head.x && part.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (eating) {
        score += 10;
        scoreText.textContent = score;
        placeApple();
    } else {
        snake.pop();
    }

    draw();
}

function endGame() {
    clearInterval(timer);
    running = false;
    gameOver = true;
    statusText.textContent = "Permainan selesai!";
    startBtn.textContent = "Main Lagi";
    draw();
}

function changeDirection(newDirection) {
    if (!running) return;

    const opposites = {
        up: "down",
        down: "up",
        left: "right",
        right: "left"
    };

    if (newDirection !== opposites[direction]) {
        nextDirection = newDirection;
    }
}

document.addEventListener("keydown", event => {
    const keys = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right"
    };

    if (keys[event.key]) {
        event.preventDefault();
        changeDirection(keys[event.key]);
    }
});

document.querySelectorAll("[data-dir]").forEach(button => {
    button.addEventListener("click", () => {
        changeDirection(button.dataset.dir);
    });
});

startBtn.addEventListener("click", resetGame);

// Tampilan awal sebelum game dimulai
snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];
apple = { x: 15, y: 10 };
direction = "right";
nextDirection = "right";
score = 0;
draw();