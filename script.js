const params        = new URLSearchParams(window.location.search);
const recipientName = params.get('to');
const senderMessage = params.get('msg');

// personalise the question if opened via a link
if (recipientName) {
    document.getElementById('question').textContent =
        `will you be my valentine, ${recipientName}?`;
    document.getElementById('iSaidYesBtn').classList.remove('hidden');
    document.getElementById('sendBtn').classList.add('hidden');

    if (senderMessage) {
        document.getElementById('letterBtn').classList.remove('hidden');
        document.getElementById('letterBody').textContent = senderMessage;
    }
}

// ── no button dodge ──────────────────────────

const noBtn  = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
let noScale  = 1;
let yesScale = 1;

function dodgeNoButton() {
    if (noBtn.parentNode !== document.body) {
        document.body.appendChild(noBtn);
        noBtn.style.cssText += 'position:fixed;z-index:100;';
    }
    const pad = 20;
    noBtn.style.left = Math.random() * Math.max(0, window.innerWidth  - noBtn.offsetWidth  - pad) + 'px';
    noBtn.style.top  = Math.random() * Math.max(0, window.innerHeight - noBtn.offsetHeight - pad) + 'px';
    noScale  = Math.max(0.3, noScale  * 0.8);
    yesScale = Math.min(1.6, yesScale + 0.15);
    noBtn.style.transform  = `scale(${noScale})`;
    yesBtn.style.transform = `scale(${yesScale})`;
}

noBtn.addEventListener('mouseover', dodgeNoButton);
noBtn.addEventListener('touchstart', e => { e.preventDefault(); dodgeNoButton(); }, { passive: false });

// ── confetti ─────────────────────────────────

function fireConfetti() {
    const colors = ['#ca8a91', '#a6545d'];
    [[{x:0, y:0}, 315], [{x:1, y:0}, 225], [{x:0, y:1}, 45], [{x:1, y:1}, 135]].forEach(([origin, angle]) => {
        confetti({ particleCount: 150, spread: 90, origin, ticks: 400, gravity: 0.65, decay: 0.94, startVelocity: 35, angle, colors });
    });
}

// ── yes ───────────────────────────────────────

yesBtn.addEventListener('click', () => {
    document.getElementById('questionScreen').classList.add('hidden');
    document.getElementById('successScreen').classList.remove('hidden');
    noBtn.style.display = 'none';
    fireConfetti();
});

document.getElementById('iSaidYesBtn').addEventListener('click', () => {
    const base = window.location.origin + window.location.pathname.replace(/index\.html$/, '');
    const url  = base + 'yes.html' + (recipientName ? `?to=${encodeURIComponent(recipientName)}` : '');
    navigator.clipboard.writeText(url).then(() => {
        document.getElementById('copiedMsg').classList.remove('hidden');
    });
});

// ── send modal ────────────────────────────────

const sendModal = document.getElementById('sendModal');

function openSend() { sendModal.classList.remove('hidden'); }

function closeSend() {
    sendModal.classList.add('hidden');
    document.getElementById('linkOutput').classList.add('hidden');
    document.getElementById('recipientInput').value = '';
    document.getElementById('messageInput').value   = '';
    document.getElementById('linkCopiedMsg').classList.add('hidden');
    document.getElementById('generatedLink').textContent = '';
}

document.getElementById('sendBtn').addEventListener('click', openSend);
document.getElementById('cancelModalBtn').addEventListener('click', closeSend);
sendModal.addEventListener('click', e => { if (e.target === sendModal) closeSend(); });

document.getElementById('generateLinkBtn').addEventListener('click', () => {
    const name = document.getElementById('recipientInput').value.trim();
    const msg  = document.getElementById('messageInput').value.trim();
    if (!name) { document.getElementById('recipientInput').focus(); return; }

    const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
    let link   = `${base}?to=${encodeURIComponent(name)}`;
    if (msg) link += `&msg=${encodeURIComponent(msg)}`;

    document.getElementById('generatedLink').textContent = link;
    document.getElementById('linkOutput').classList.remove('hidden');
    document.getElementById('linkCopiedMsg').classList.add('hidden');
});

document.getElementById('copyLinkBtn').addEventListener('click', () => {
    const link = document.getElementById('generatedLink').textContent;
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
        document.getElementById('linkCopiedMsg').classList.remove('hidden');
    });
});

// ── credits ───────────────────────────────────

document.getElementById('creditBtn').addEventListener('click', () => {
    document.getElementById('creditPopup').classList.toggle('hidden');
});

// ── envelope / letter ─────────────────────────

const letterModal = document.getElementById('letterModal');
const envFlap     = document.getElementById('envFlap');
const letterCard  = document.getElementById('letterCard');
const closeLetter = document.getElementById('closeLetter');
let   letterOpen  = false;

function openLetter() {
    if (letterOpen) return;
    letterOpen = true;
    letterModal.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => {
        envFlap.classList.add('open');
        setTimeout(() => {
            letterCard.classList.add('slide-up');
            closeLetter.classList.add('visible');
        }, 420);
    }));
}

function closeLetter_() {
    if (!letterOpen) return;
    closeLetter.classList.remove('visible');
    letterCard.classList.remove('slide-up');
    setTimeout(() => {
        envFlap.classList.remove('open');
        setTimeout(() => {
            letterModal.classList.add('hidden');
            letterOpen = false;
        }, 440);
    }, 500);
}

document.getElementById('letterBtn').addEventListener('click', openLetter);
closeLetter.addEventListener('click', closeLetter_);
document.getElementById('letterModalBg').addEventListener('click', closeLetter_);

if (senderMessage) setTimeout(openLetter, 800);

// ── desmos pulsing heart ──────────────────────

const calc = Desmos.GraphingCalculator(document.getElementById('calculator'), {
    expressions: false, settingsMenu: false, zoomButtons: false,
    lockViewport: true, border: false,
});
calc.setMathBounds({ left: -2.5, right: 2.5, bottom: -1.55, top: 2.5 });

let t = 0;
(function pulse() {
    t += 0.02;
    const a = 35 + 5 * Math.sin(t);
    calc.setExpression({
        id:    'heart',
        latex: `y = x^{\\frac{2}{3}} + 0.9\\sin(${a.toFixed(3)}x)\\sqrt{3-x^{2}}`,
        color: '#a6545d',
    });
    requestAnimationFrame(pulse);
})();