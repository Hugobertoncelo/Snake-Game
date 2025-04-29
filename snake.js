'use strict';

let Snake = function () {
    let snake = this;

    snake.snake = [];
    snake.difficulty = 10;
    snake.gameArea = document.getElementsByClassName('game-area')[0];
    snake.startButton = document.getElementById('start-game');
    snake.stopButton = document.getElementById('stop-game');
    snake.scoreElement = document.getElementById('score');
    snake.rowLength = 50;
    snake.cellLength = 50;
    snake.direction = 'up';
    snake.directions = ['up', 'down', 'left', 'right'];
    snake.interval = null;
    snake.gameStarted = false;
    snake.score = 0;
    snake.bait = {
        x: null,
        y: null
    };

    if (!snake.gameArea || !snake.startButton || !snake.stopButton || !snake.scoreElement) {
        alert("Os elementos de identificação #game-area, #start-game, #stop-game e #score são obrigatórios!");
        return;
    }

    snake.startButton.addEventListener('click', function () {
        snake.startGame();
    }, false);
    snake.stopButton.addEventListener('click', function () {
        snake.stopGame();
    }, false);

    // Controle por teclado
    document.onkeydown = function (event) {
        if (snake.gameStarted) {
            switch (event.key) {
                case "ArrowUp":
                    if (snake.direction !== 'down') {
                        snake.direction = 'up';
                    }
                    break;
                case "ArrowDown":
                    if (snake.direction !== 'up') {
                        snake.direction = 'down';
                    }
                    break;
                case "ArrowLeft":
                    if (snake.direction !== 'right') {
                        snake.direction = 'left';
                    }
                    break;
                case "ArrowRight":
                    if (snake.direction !== 'left') {
                        snake.direction = 'right';
                    }
                    break;
            }
        }
    };

    // ✅ Controle por botões (mobile)
    document.getElementById('up').addEventListener('click', function () {
        if (snake.direction !== 'down') snake.direction = 'up';
    });

    document.getElementById('down').addEventListener('click', function () {
        if (snake.direction !== 'up') snake.direction = 'down';
    });

    document.getElementById('left').addEventListener('click', function () {
        if (snake.direction !== 'right') snake.direction = 'left';
    });

    document.getElementById('right').addEventListener('click', function () {
        if (snake.direction !== 'left') snake.direction = 'right';
    });
};

Snake.prototype.newSnake = function () {
    let snake = this;
    snake.snake = [];

    for (let i = 0; i < 8; i++) {
        snake.snake.push({
            x: Math.ceil(snake.rowLength / 2) + i,
            y: Math.ceil(snake.cellLength / 2)
        });
    }

    snake.direction = "up";
    snake.score = 0;

    snake.renderGameArea();
};

Snake.prototype.createGameArea = function (row, cell) {
    let snake = this;
    let rowElement, cellElement, rowi, celli;

    if (!snake.gameArea) {
        alert("O elemento #game-area id é obrigatório!");
        return;
    }

    snake.rowLength = row;
    snake.cellLength = cell;
    snake.gameArea.innerHTML = '';

    for (rowi = 1; rowi <= row; rowi++) {
        rowElement = document.createElement('div');
        rowElement.setAttribute('class', 'row');

        for (celli = 1; celli <= cell; celli++) {
            cellElement = document.createElement('div');
            cellElement.setAttribute('class', 'cell');
            cellElement.setAttribute('data-x', rowi);
            cellElement.setAttribute('data-y', celli);
            rowElement.append(cellElement);
        }

        snake.gameArea.append(rowElement);
    }

    snake.newSnake();
};

Snake.prototype.renderGameArea = function () {
    let snake = this;
    let cells = document.getElementsByClassName('cell');

    for (let cellIndex in cells) {
        let cell = cells[cellIndex];
        if (typeof cell === "object") {
            let cellX = cell.getAttribute('data-x');
            let cellY = cell.getAttribute('data-y');
            let isSnakeCell = snake.snake.some(s => s.x == cellX && s.y == cellY);

            cell.setAttribute('class', isSnakeCell ? 'cell black' : 'cell');
        }
    }
};

Snake.prototype.startGame = function () {
    let snake = this;
    snake.gameStarted = true;
    snake.interval = setInterval(function () {
        snake.move();
    }, 400 / snake.difficulty);
    snake.startButton.style.display = 'none';
    snake.stopButton.style.display = 'block';
    snake.createBait();
};

Snake.prototype.stopGame = function () {
    let snake = this;
    snake.gameStarted = false;
    clearInterval(snake.interval);
    snake.startButton.style.display = 'block';
    snake.stopButton.style.display = 'none';
    snake.newSnake();
};

Snake.prototype.endGame = function () {
    alert('Fim de jogo!! Sua pontuação é ' + this.score);
    this.stopGame();
};

Snake.prototype.move = function () {
    let snake = this;
    let first = snake.snake[0];
    let newCell = {};

    switch (snake.direction) {
        case 'up':
            newCell.x = (first.x - 1 < 1) ? snake.rowLength : first.x - 1;
            newCell.y = first.y;
            break;
        case 'down':
            newCell.x = (first.x + 1 > snake.rowLength) ? 1 : first.x + 1;
            newCell.y = first.y;
            break;
        case 'left':
            newCell.x = first.x;
            newCell.y = (first.y - 1 < 1) ? snake.cellLength : first.y - 1;
            break;
        case 'right':
            newCell.x = first.x;
            newCell.y = (first.y + 1 > snake.cellLength) ? 1 : first.y + 1;
            break;
    }

    // Colisão com o próprio corpo
    for (let cell of snake.snake) {
        if (cell.x == newCell.x && cell.y == newCell.y) {
            snake.endGame();
            return;
        }
    }

    if (newCell.x == snake.bait.x && newCell.y == snake.bait.y) {
        snake.createBait();
        snake.score += snake.difficulty * 10;
        snake.scoreElement.innerText = snake.score;
    } else {
        let last = snake.snake[snake.snake.length - 1];
        let old = document.querySelector(`[data-x="${last.x}"][data-y="${last.y}"]`);
        if (old) old.setAttribute('class', 'cell');
        snake.snake.pop();
    }

    let newHead = document.querySelector(`[data-x="${newCell.x}"][data-y="${newCell.y}"]`);
    if (newHead) newHead.setAttribute('class', 'cell black');
    snake.snake.unshift(newCell);
};

Snake.prototype.createBait = function () {
    let snake = this;
    let bait = snake.createRandomInt();
    snake.bait.x = bait.x;
    snake.bait.y = bait.y;

    let baitCell = document.querySelector(`[data-x="${bait.x}"][data-y="${bait.y}"]`);
    if (baitCell) baitCell.setAttribute('class', 'cell black');
};

Snake.prototype.createRandomInt = function () {
    let snake = this;
    let x = Math.floor(Math.random() * snake.rowLength) + 1;
    let y = Math.floor(Math.random() * snake.cellLength) + 1;

    for (let cell of snake.snake) {
        if (cell.x == x && cell.y == y) {
            return snake.createRandomInt();
        }
    }

    return { x, y };
};

Snake.prototype.setDifficulty = function (value) {
    if (!this.gameStarted && typeof value === "number") {
        this.difficulty = value;
    }
};

Snake.prototype.setGameArea = function (rowLength, cellLength) {
    if (!this.gameStarted &&
        typeof rowLength === "number" &&
        typeof cellLength === "number") {
        this.createGameArea(rowLength, cellLength);
    }
};
