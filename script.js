const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');

function moveButton() {
    if (noBtn.parentNode !== document.body) {
        document.body.appendChild(noBtn);
    }

    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    const maxWidth = Math.max(0, window.innerWidth - btnWidth - 20);
    const maxHeight = Math.max(0, window.innerHeight - btnHeight - 20);

    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = "100";
}

noBtn.addEventListener('mouseover', moveButton);

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
});

yesBtn.addEventListener('click', () => {
    questionScreen.style.display = 'none';
    successScreen.style.display = 'block';
        noBtn.style.display = 'none';
    
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.45, x: 0.1 },
        ticks: 400,
        gravity: 0.65,
        decay: 0.94,
        startVelocity: 20,
        colors: ['#FF4F8B', '#5E081E']
    });
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.45, x: 0.9 },
        ticks: 400,
        gravity: 0.65,
        decay: 0.94,
        startVelocity: 20,
        colors: ['#FF4F8B', '#5E081E']
    });
});