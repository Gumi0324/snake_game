const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    backgroundColor: '#5DACD8',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let snake;
let food;
let cursors;
let score = 0;
let scoreText;
let direction = 'RIGHT';
const gridSize = 40;

function preload() {
    this.load.image('food', 'https://examples.phaser.io/assets/sprites/apple.png');
    this.load.image('body', 'https://examples.phaser.io/assets/sprites/block.png');
}

function create() {
    snake = this.physics.add.group();

    let initialX = config.width / 2;
    let initialY = config.height / 2;

    for (let i = 0; i < 4; i++) {
        snake.create(initialX - i * gridSize, initialY, 'body');
    }

    food = this.physics.add.image(getRandomCoord(config.width), getRandomCoord(config.height), 'food');

    this.physics.add.collider(snake, food, eatFood, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    this.time.addEvent({ delay: 100, callback: moveSnake, callbackScope: this, loop: true });
}

function update() {
    if (cursors.left.isDown && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (cursors.right.isDown && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (cursors.up.isDown && direction !== 'DOWN') {
        direction = 'UP';
    } else if (cursors.down.isDown && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function moveSnake() {
    let head = snake.getFirst(true);
    let newHead;

    switch (direction) {
        case 'LEFT':
            newHead = snake.create(head.x - gridSize, head.y, 'body');
            break;
        case 'RIGHT':
            newHead = snake.create(head.x + gridSize, head.y, 'body');
            break;
        case 'UP':
            newHead = snake.create(head.x, head.y - gridSize, 'body');
            break;
        case 'DOWN':
            newHead = snake.create(head.x, head.y + gridSize, 'body');
            break;
    }

    if (newHead) {
        newHead.setOrigin(0);
        let tail = snake.getLast(true);
        tail.destroy();
    }

    if (newHead.x < 0 || newHead.x >= config.width || newHead.y < 0 || newHead.y >= config.height) {
        this.scene.restart();
        score = 0;
        scoreText.setText('Score: ' + score);
    }

    snake.getChildren().forEach((segment, index) => {
        if (index > 0 && segment.x === newHead.x && segment.y === newHead.y) {
            this.scene.restart();
            score = 0;
            scoreText.setText('Score: ' + score);
        }
    });
}

function eatFood(snake, food) {
    food.setPosition(getRandomCoord(config.width), getRandomCoord(config.height));
    score += 10;
    scoreText.setText('Score: ' + score);

    let tail = snake.getLast(true);
    snake.create(tail.x, tail.y, 'body');
}

function getRandomCoord(size) {
    return Math.floor(Math.random() * (size / gridSize)) * gridSize;
}
