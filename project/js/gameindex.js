document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const playerNameInput = document.getElementById('player-name');
    const welcomeScreen = document.getElementById('welcome-screen');

    // Проверка введенного имени
    playerNameInput.addEventListener('input', () => {
        if (playerNameInput.value.trim() !== '') {
            startButton.style.filter = 'grayscale(0)';
            startButton.disabled = false;  // Активируем кнопку, если имя введено
        } else {
            startButton.style.filter = 'grayscale(1)';
            startButton.disabled = true;  // Деактивируем кнопку, если имя не введено
        }
    });

    // При нажатии на кнопку, скрываем экран приветствия и показываем начало игры
    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value;

        localStorage.setItem('username', playerName);

        // Скрываем экран приветствия
        welcomeScreen.style.display = 'none';

        // Здесь можно добавить логику игры, например, показать игровое поле
        window.open('project/html/arena.html', '_self')
    });
});
