const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');

// --- Read URL params ---
const params = new URLSearchParams(window.location.search);
const recipientName = params.get('to');

if (recipientName) {
    document.getElementById('mainQuestion').textContent =
        `will you be my valentine, ${recipientName}?`;
}

// --- No button logic ---
function moveButton() {
    if (noBtn.parentNode !== document.body) {
        document.body.appendChild(noBtn);
    }
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    const maxWidth = Math.max(0, window.innerWidth - btnWidth - 20);
    const maxHeight = Math.max(0, window.innerHeight - btnHeight - 20);
    noBtn.style.position = 'fixed';
    noBtn.style.left = Math.floor(Math.random() * maxWidth) + 'px';
    noBtn.style.top = Math.floor(Math.random() * maxHeight) + 'px';
    noBtn.style.zIndex = "100";
    shrinkButton();
}

let noScale = 1;
let yesScale = 1;

function shrinkButton() {
    noScale *= 0.8;
    noBtn.style.transform = `scale(${noScale})`;
    if (yesScale < 1.55) {
        yesScale += 0.15;
        yesBtn.style.transform = `scale(${yesScale})`;
    }
}

noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveButton(); });

// --- Yes button ---
function fireConfetti() {
    const colors = ['#ca8a91', '#a6545d'];
    [[{y:0,x:0},315],[{y:0,x:1},225],[{y:1,x:0},45],[{y:1,x:1},135]].forEach(([origin, angle]) => {
        confetti({ particleCount: 150, spread: 90, origin, ticks: 400, gravity: 0.65, decay: 0.94, startVelocity: 35, angle, colors });
    });
}

yesBtn.addEventListener('click', () => {
    questionScreen.style.display = 'none';
    successScreen.style.display = 'block';
    noBtn.style.display = 'none';
    fireConfetti();
});

// --- "Tell them you said yes" button ---
const iSaidYesBtn = document.getElementById('iSaidYesBtn');
const copiedMsg = document.getElementById('copiedMsg');

iSaidYesBtn.addEventListener('click', () => {
    // Build the yes.html link with the recipient's name so sender knows who it is
    const base = window.location.origin + window.location.pathname.replace('index.html', '');
    const name = recipientName || '';
    const yesUrl = `${base}yes.html${name ? '?to=' + encodeURIComponent(name) : ''}`;

    navigator.clipboard.writeText(yesUrl).then(() => {
        copiedMsg.classList.remove('hidden');
    });
});

// --- Send modal ---
const sendBtn = document.getElementById('sendBtn');
const sendModal = document.getElementById('sendModal');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const generateLinkBtn = document.getElementById('generateLinkBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const linkOutput = document.getElementById('linkOutput');
const generatedLinkEl = document.getElementById('generatedLink');
const linkCopiedMsg = document.getElementById('linkCopiedMsg');

sendBtn.addEventListener('click', () => sendModal.classList.remove('hidden'));
cancelModalBtn.addEventListener('click', () => {
    sendModal.classList.add('hidden');
    linkOutput.classList.add('hidden');
    document.getElementById('recipientInput').value = '';
    linkCopiedMsg.classList.add('hidden');
});

generateLinkBtn.addEventListener('click', () => {
    const name = document.getElementById('recipientInput').value.trim();
    if (!name) return;
    const base = window.location.origin + window.location.pathname.replace('index.html', '');
    const link = `${base}index.html?to=${encodeURIComponent(name)}`;
    generatedLinkEl.textContent = link;
    linkOutput.classList.remove('hidden');
});

copyLinkBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedLinkEl.textContent).then(() => {
        linkCopiedMsg.classList.remove('hidden');
    });
});

// --- Desmos Heart ---
const elt = document.getElementById('calculator');
const calc = Desmos.GraphingCalculator(elt, {
    expressions: false,
    settingsMenu: false,
    zoomButtons: false,
    lockViewport: true
});

calc.setMathBounds({ left: -2.5, right: 2.5, bottom: -1.55, top: 2.5 });

let time = 0;

function pulseHeart() {
    time += 0.02;
    let a = 35 + 5 * Math.sin(time);
    calc.setExpression({
        id: 'heart-equation',
        latex: `y = x^{\\frac{2}{3}} + 0.9\\sin(${a}x)\\sqrt{3-x^{2}}`,
        color: '#a6545d'
    });
    requestAnimationFrame(pulseHeart);
}

pulseHeart();