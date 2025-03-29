// класс гладиатора
class Gladiator{
    constructor(){
        this.body = document.getElementById('gladiator');
        this.health = 100;
        this.boost = false;
        this.speed = 7;
    }
    // Функция для перемещения гладиатора
    move(e){
        let key = e.key.toLowerCase();
        if (isPaused) return
        if (key === 'w' || key === 'arrowup' || key === 'ц') {
            let gladiatorTop = parseInt(getComputedStyle(this.body).top);
            if (gladiatorTop > 0) this.body.style.top = gladiatorTop - this.speed + 'px';
        }
        if (key === 's' || key === 'arrowdown' || key === 'ы') {
            let gladiatorTop = parseInt(getComputedStyle(this.body).top);
            if (gladiatorTop < 350) this.body.style.top = gladiatorTop + this.speed + 'px';
        }
    }
}
// класс гладиатора
class Archer{
    constructor(){
        this.body = document.getElementById('archer');
        this.health = 100;
        this.movement = setInterval(this.move.bind(this), 3000);
    }
    // Функция для перемещения лучника
    move(){
        this.body.style.top = `${getRandomInt(10, 340)}px`;
        this.bullet = new Bullet(this);
    }
}
class Bullet{
    constructor(archer){
        let bullets = document.getElementsByClassName('bullet');
        while (bullets.length){
            bullets[0].remove();
        }
        let bullet = document.createElement('div');
        bullet.classList.add('bullet');
        document.getElementById('arena').appendChild(bullet);
        this.body = document.getElementsByClassName('bullet')[0];
        console.log(parseInt(getComputedStyle(archer.body).top));
        this.body.style.top = `${parseInt(getComputedStyle(archer.body).top) + 20}px`;
        this.angle = getRandomInt(60, 120);
        this.cos = Math.cos(this.angle * (Math.PI / 180));
        this.sin = Math.sin(this.angle * (Math.PI / 180))
        this.speed = getRandomInt(7, 20);
        this.animate_bullet();
    }
    animate_bullet(){
        let frame = 0;
        let right = parseInt(getComputedStyle(this.body).right);
        let top = parseInt(getComputedStyle(this.body).top);
        let framet = top;
        const bulletInterval = setInterval(() => {
        if (parseInt(getComputedStyle(this.body).right) > parseInt(getComputedStyle(document.getElementById('arena')).width)) { // Убираем пулю через определенное количество кадров
            clearInterval(bulletInterval);
            this.body.remove();
        } else {
            if (!isPaused){
                this.body.style.right = `${Math.floor((frame * this.speed) + right)}px`;
                /*
                this.body.style.right = `${Math.floor(this.sin * (frame * this.speed) + right)}px`;
                
                if (parseInt(getComputedStyle(this.body).top) > 350 || parseInt(getComputedStyle(this.body).top) < 0){
                    if (this.cos < 0){
                        this.cos = Math.abs(this.cos);
                    }else{
                        this.cos = 1 + this.cos;
                    }
                    if (framet < 10){
                        framet = 0;
                    }else{
                        framet = 400;
                    }

                } 
                this.body.style.top = `${Math.floor(this.cos * (framet) + framet)}px`;*/
                this.checkCollision();
                frame++;
                framet += this.speed;
            }
        }}, 17); // Частота обновления ~60 FPS
    }
    checkCollision(){
        console.log(this.body.style.top);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


// Инициализация переменных
let playerName = '';
let playerHealth = 100;
let gameInterval;
let isPaused = false;
let isGameOver = false;
let timeElapsed = 0;
let arrowSpeed = 5; // Скорость стрел

// Элементы интерфейса
const gameScreen = document.getElementById('game-screen');
const playerNameInput = document.getElementById('player-name');
const playerNameDisplay = document.getElementById('player-name-text');
const timerDisplay = document.getElementById('timer');
const healthDisplay = document.getElementById('health');
const gladiator = new Gladiator();
const archer = new Archer();
const pauseOverlay = document.getElementById('pause-overlay');
const resultScreen = document.getElementById('result-screen');
const restartButton = document.getElementById('restart-btn');

// Функция запуска игры
function startGame() {
    playerName = localStorage.getItem('username');
    playerNameDisplay.innerText = playerName;
    gameScreen.style.display = 'block';
    startTimer();
}

// Таймер игры
function startTimer() {
    gameInterval = setInterval(() => {
        timeElapsed++;
        let minutes = Math.floor(timeElapsed / 60);
        let seconds = timeElapsed % 60;
        timerDisplay.innerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

// Функция паузы
function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
        pauseOverlay.style.display = 'block';
    } else {
        startTimer();
        pauseOverlay.style.display = 'none';
    }
}

// Функция завершения игры
function endGame() {
    clearInterval(gameInterval);
    resultScreen.style.display = 'block';
    document.getElementById('final-time').innerText = `Время игры: ${timerDisplay.innerText}`;
    document.getElementById('final-health').innerText = `Здоровье: ${playerHealth}%`;
}

// Функция рестарта игры
function restartGame() {
    playerHealth = 100;
    timeElapsed = 0;
    timerDisplay.innerText = '00:00';
    healthDisplay.innerText = `${playerHealth}%`;
    resultScreen.style.display = 'none';
    startGame();
}

// Прослушка событий
restartButton.addEventListener('click', restartGame);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        togglePause();
    }
});

// Функция для перемещения гладиатора
document.addEventListener('keydown', (e) => {gladiator.move(e)});

startGame();