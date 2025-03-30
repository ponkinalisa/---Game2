// класс гладиатора
class Gladiator{
    constructor(){
        this.body = document.getElementById('gladiator');
        this.health = 100;
        this.boost = false;
        this.speed = 30;
        this.health_inter = setInterval(()=>{healthDisplay.innerHTML = `${this.health}%`}, 17);
        this.attack = false;
    }
    // Функция для перемещения гладиатора
    move(e){
        let key = e.key.toLowerCase();
        if (isPaused) return
        if (this.health<= 0) return
        if (key === 'w' || key === 'arrowup' || key === 'ц') {
            let gladiatorTop = parseInt(getComputedStyle(this.body).top);
            if (gladiatorTop > 0) {
                this.body.style.top = gladiatorTop - this.speed + 'px';
            }
        }
        if (key === 's' || key === 'arrowdown' || key === 'ы') {
            let gladiatorTop = parseInt(getComputedStyle(this.body).top);
            if (gladiatorTop < 350) {
                this.body.style.top = gladiatorTop + this.speed + 'px';
            }
        }
        if (key === 'e'){
            if (this.attack == false){
                this.attack = true;
            }
        }
    }
    end(){
        document.getElementById('final-res').innerHTML = 'Вы проиграли!';
        endGame();
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
        this.bullet = new Bullet(this, gladiator, 1);
    }
    end(){
        clearInterval(this.movement);
        endGame();
        document.getElementById('final-res').innerHTML = 'Вы выиграли!';
    }
}
class Bullet{
    constructor(self, enemy, direction){
        this.self = self;
        this.enemy = enemy;
        this.direction = direction;

        let bullets = document.getElementsByClassName('bullet');
        while (bullets.length > 3){
            bullets[0].remove();
        }
        this.body = document.createElement('div');
        this.body.classList.add('bullet');
        if (this.direction < 0){
            this.body.style.left= `${parseInt(getComputedStyle(self.body).left) + 40}px`;
        }
        this.body.style.top = `${parseInt(getComputedStyle(self.body).top) + 20}px`;
        this.angle = getRandomInt(60, 120);
        this.cos = Math.cos(this.angle * (Math.PI / 180));
        this.sin = Math.sin(this.angle * (Math.PI / 180))
        this.speed = getRandomInt(5, 15);
        this.collision = false;
        this.damage = 20;
        document.getElementById('arena').appendChild(this.body);
        this.animate_bullet();
    }
    animate_bullet(){
        let frame = 0;
        let right = parseInt(getComputedStyle(this.body).right);
        let top = parseInt(getComputedStyle(this.body).top);
        let framet = top;
        this.bulletInterval = setInterval(() => {
        if (parseInt(getComputedStyle(this.body).right) > parseInt(getComputedStyle(document.getElementById('arena')).width)) { // Убираем пулю через определенное количество кадров
            this.body.remove();
            clearInterval(this.bulletInterval);
        } else {
            if (!isPaused){
                if (this.direction > 0){
                    this.body.style.right = `${Math.floor((frame * this.speed) + right)}px`;
                }else{
                    this.body.style.left = `${Math.floor((frame * this.speed) + parseInt(getComputedStyle(this.body).left))}px`;
                }
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
        const personRect = this.enemy.body.getBoundingClientRect();
        const bulletRect = this.body.getBoundingClientRect();
    if (personRect.left <= bulletRect.right &&
        personRect.right >= bulletRect.left &&
        personRect.top <= bulletRect.bottom &&
        personRect.bottom >= bulletRect.top) { 
            if (this.collision == false){
                this.collision = true;
                /*let img1 = document.getElementsByClassName("boom")[0];
                img1.style.display = 'block';
                img1.style.top = `${personRect.top - 20}px`;
                let frame = 0;
                const imgInterval = setInterval(() => {
                    if (frame === 100) {
                        clearInterval(imgInterval);
                        img1.style.display = 'none';
                    } else {
                        img.style.transform = `scale(${frame * 0.01 + 0.5})`;
                        img.style.opacity = `${1 - frame * 0.01}`;
                        frame++;
                    }
                    }, 17); // Частота обновления ~60 FPS*/
                if (this.enemy.health >= this.damage){
                    this.enemy.health -= this.damage;
                }

                if (this.enemy.health <= 0){
                    clearInterval(this.bulletInterval);
                    this.self.end();
                    this.enemy.end();
                }
            }

            //анимация столкновениe
            
    }
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
const pauseOverlay = document.getElementById('pause-overlay');
const resultScreen = document.getElementById('result-screen');
const restartButton = document.getElementById('restart-btn');

var gladiator = new Gladiator();
var archer = new Archer();

const cycle_gladiator_attack = setInterval(() => {
    if (gladiator.attack == true){
        gladiator.attack = false;
        gladiator.bullet = new Bullet(gladiator, archer, -1);
        gladiator.bullet.speed = 2;
    }
}, 17);

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
    document.getElementById('final-health').innerText = `Здоровье: ${gladiator.health}%`;
}

// Функция рестарта игры
function restartGame() {
    location.reload();
}

// Прослушка событий
restartButton.addEventListener('click', restartGame);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        togglePause();
    }
    gladiator.move(e);
});


startGame();