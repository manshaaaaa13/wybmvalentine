// reads from both hash (#to=name) and query string (?to=name)
// hash is used because some static hosts strip query params on redirects
const hash   = new URLSearchParams(window.location.hash.slice(1));
const query  = new URLSearchParams(window.location.search);
const name   = hash.get('to') || query.get('to');

if (name) {
    document.getElementById('theoremLine').textContent = `${name} + you are meant to be.`;
    document.getElementById('proofLine').textContent   = `${name} said yes.`;
    document.title = `${name} said yes 🥹`;
}

window.addEventListener('load', () => {
    setTimeout(() => {
        const colors = ['#ca8a91', '#a6545d'];
        [[{x:0, y:0}, 315], [{x:1, y:0}, 225], [{x:0, y:1}, 45], [{x:1, y:1}, 135]].forEach(([origin, angle]) => {
            confetti({ particleCount: 150, spread: 90, origin, ticks: 400, gravity: 0.65, decay: 0.94, startVelocity: 35, angle, colors });
        });
    }, 600);
});

document.getElementById('creditBtn').addEventListener('click', () => {
    document.getElementById('creditPopup').classList.toggle('hidden');
});