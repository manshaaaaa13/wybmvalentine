yesBtn.addEventListener('click', () => {
    questionScreen.style.display = 'none';
    successScreen.style.display = 'block';

    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#e91e63', '#000000'],
        });
        
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#e91e63', '#000000'],
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
});