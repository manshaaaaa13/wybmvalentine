/* ─────────────────────────────────────────────
   valentine – script.js  (updated)
   ───────────────────────────────────────────── */

// ── Element refs ──────────────────────────────
const yesBtn          = document.getElementById('yesBtn');
const noBtn           = document.getElementById('noBtn');
const questionScreen  = document.getElementById('questionScreen');
const successScreen   = document.getElementById('successScreen');
const iSaidYesBtn     = document.getElementById('iSaidYesBtn');
const copiedMsg       = document.getElementById('copiedMsg');

const sendBtn         = document.getElementById('sendBtn');
const sendModal       = document.getElementById('sendModal');
const cancelModalBtn  = document.getElementById('cancelModalBtn');
const generateLinkBtn = document.getElementById('generateLinkBtn');
const copyLinkBtn     = document.getElementById('copyLinkBtn');
const linkOutput      = document.getElementById('linkOutput');
const generatedLinkEl = document.getElementById('generatedLink');
const linkCopiedMsg   = document.getElementById('linkCopiedMsg');
const creditBtn       = document.getElementById('creditBtn');
const creditPopup     = document.getElementById('creditPopup');

const letterBtn       = document.getElementById('letterBtn');
const letterModal     = document.getElementById('letterModal');
const closeLetterBtn  = document.getElementById('closeLetter');
const letterBody      = document.getElementById('letterBody');
const envFlap         = document.getElementById('envFlap');
const letterCard      = document.getElementById('letterCard');
const letterModalBg   = document.getElementById('letterModalBg');

// ── URL params ────────────────────────────────
const params        = new URLSearchParams(window.location.search);
const recipientName = params.get('to');
const senderMessage = params.get('msg');

// ── Personalise question ──────────────────────
if (recipientName) {
    document.getElementById('mainQuestion').textContent =
        `will you be my valentine, ${recipientName}?`;
}

// ── Fix 3: show "tell them" button only for recipients ──
if (recipientName) {
    iSaidYesBtn.classList.remove('hidden');
}

// ── Fix 2: sender vs recipient side ──────────
if (recipientName) {
    // Recipient: hide the send-to-someone button
    sendBtn.classList.add('hidden');

    // Show letter button only if a message was included
    if (senderMessage) {
        letterBtn.classList.remove('hidden');
        letterBody.textContent = senderMessage;
    }
}
// Sender: sendBtn already visible, letterBtn stays hidden

// ── No button dodge ───────────────────────────
let noScale  = 1;
let yesScale = 1;

function moveNoButton() {
    if (noBtn.parentNode !== document.body) {
        document.body.appendChild(noBtn);
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex   = '100';
    }
    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    noBtn.style.left = Math.floor(Math.random() * Math.max(0, window.innerWidth  - w - 20)) + 'px';
    noBtn.style.top  = Math.floor(Math.random() * Math.max(0, window.innerHeight - h - 20)) + 'px';
    noScale  = Math.max(0.3, noScale  * 0.8);
    yesScale = Math.min(1.6, yesScale + 0.15);
    noBtn.style.transform  = `scale(${noScale})`;
    yesBtn.style.transform = `scale(${yesScale})`;
}

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); }, { passive: false });

// ── Confetti ──────────────────────────────────
function fireConfetti() {
    const colors = ['#ca8a91', '#a6545d'];
    [[{y:0,x:0},315],[{y:0,x:1},225],[{y:1,x:0},45],[{y:1,x:1},135]].forEach(([origin, angle]) => {
        confetti({ particleCount: 150, spread: 90, origin, ticks: 400, gravity: 0.65, decay: 0.94, startVelocity: 35, angle, colors });
    });
}

// ── Yes button ────────────────────────────────
yesBtn.addEventListener('click', () => {
    questionScreen.classList.add('hidden');
    successScreen.classList.remove('hidden');
    noBtn.style.display = 'none';
    fireConfetti();
});

// ── "Tell them you said yes" ──────────────────
iSaidYesBtn.addEventListener('click', () => {
    const base   = window.location.origin + window.location.pathname.replace(/index\.html$/, '');
    const yesUrl = base + 'yes.html' + (recipientName ? `?to=${encodeURIComponent(recipientName)}` : '');
    navigator.clipboard.writeText(yesUrl).then(() => {
        copiedMsg.classList.remove('hidden');
    });
});

// ── Send modal ────────────────────────────────
function openSendModal() { sendModal.classList.remove('hidden'); }

function closeSendModal() {
    sendModal.classList.add('hidden');
    linkOutput.classList.add('hidden');
    document.getElementById('recipientInput').value = '';
    document.getElementById('messageInput').value   = '';
    linkCopiedMsg.classList.add('hidden');
    generatedLinkEl.textContent = '';
}

sendBtn.addEventListener('click', openSendModal);
cancelModalBtn.addEventListener('click', closeSendModal);
sendModal.addEventListener('click', (e) => { if (e.target === sendModal) closeSendModal(); });

generateLinkBtn.addEventListener('click', () => {
    const name    = document.getElementById('recipientInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();
    if (!name) { document.getElementById('recipientInput').focus(); return; }
    const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
    let link = `${base}?to=${encodeURIComponent(name)}`;
    if (message) link += `&msg=${encodeURIComponent(message)}`;
    generatedLinkEl.textContent = link;
    linkOutput.classList.remove('hidden');
    linkCopiedMsg.classList.add('hidden');
});

copyLinkBtn.addEventListener('click', () => {
    const link = generatedLinkEl.textContent;
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => { linkCopiedMsg.classList.remove('hidden'); });
});

// ── Credit popup ──────────────────────────────
creditBtn.addEventListener('click', () => { creditPopup.classList.toggle('hidden'); });

// ── Fix 2: Envelope / letter animation ───────
let letterIsOpen = false;

function openLetter() {
    if (letterIsOpen) return;
    letterIsOpen = true;
    letterModal.classList.remove('hidden');

    // Double rAF so the browser has painted the modal before we add classes
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            envFlap.classList.add('open');
            // Letter starts sliding up after flap is halfway through (~420ms)
            setTimeout(() => {
                letterCard.classList.add('slide-up');
            }, 420);
        });
    });
}

function closeLetter() {
    if (!letterIsOpen) return;
    // Slide letter back down first
    letterCard.classList.remove('slide-up');
    setTimeout(() => {
        // Then close flap
        envFlap.classList.remove('open');
        setTimeout(() => {
            letterModal.classList.add('hidden');
            letterIsOpen = false;
        }, 440);
    }, 320);
}

letterBtn.addEventListener('click', openLetter);
closeLetterBtn.addEventListener('click', closeLetter);
letterModalBg.addEventListener('click', closeLetter);

// ── Desmos pulsing heart ──────────────────────
const elt  = document.getElementById('calculator');
const calc = Desmos.GraphingCalculator(elt, {
    expressions:  false,
    settingsMenu: false,
    zoomButtons:  false,
    lockViewport: true,
    border:       false,
});

calc.setMathBounds({ left: -2.5, right: 2.5, bottom: -1.55, top: 2.5 });

let time = 0;
(function pulseHeart() {
    time += 0.02;
    const a = 35 + 5 * Math.sin(time);
    calc.setExpression({
        id:    'heart',
        latex: `y = x^{\\frac{2}{3}} + 0.9\\sin(${a.toFixed(3)}x)\\sqrt{3-x^{2}}`,
        color: '#a6545d',
    });
    requestAnimationFrame(pulseHeart);
})();