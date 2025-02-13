let votes = { agree: 0, disagree: 0 };
let totalVotes = 0;
let userVotes = new Set();
let overlay = document.getElementById('overlay');

function vote(type) {
    if (userVotes.size > 0) {
        alert('이미 투표하셨습니다.');
        return;
    }

    userVotes.add(type);
    votes[type]++;
    totalVotes++;
    document.getElementById('count').innerText = totalVotes;
}

function showResult() {
    let message = '';
    if (votes.agree > votes.disagree) {
        message = '찬성입니다!';
    } else if (votes.agree < votes.disagree) {
        message = '반대입니다!';
    } else {
        message = '재투표합니다!';
    }
    document.getElementById('result-message').innerText = message;
    document.getElementById('result-count').innerText = `👍 ${votes.agree}명 vs 👎 ${votes.disagree}명`;
    createConfetti();

    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
}

function closeOverlay() {
    overlay.classList.remove('show');
}

function createConfetti() {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        document.body.appendChild(confetti);

        const colors = ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = '50%';
        confetti.style.top = '50%';

        const rotation = Math.random() * 720 - 360;
        const angle = (i / 30) * 360 + (Math.random() * 30 - 15);
        const distance = 100 + Math.random() * 50;
        const translateX = Math.cos((angle * Math.PI) / 180) * distance;
        const translateY = Math.sin((angle * Math.PI) / 180) * distance;

        const keyframeName = `confetti${Date.now()}${i}`;
        const keyframes = `
                    @keyframes ${keyframeName} {
                        0% {
                            transform: translate(0, 0) rotateZ(0);
                            opacity: 1;
                        }
                        100% {
                            transform: translate(${translateX}px, ${translateY}px) rotateZ(${rotation}deg);
                            opacity: 0;
                        }
                    }
                `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        const duration = Math.random() * 1 + 0.5;
        confetti.style.animation = `${keyframeName} ${duration}s ease-out forwards`;

        setTimeout(() => {
            confetti.remove();
            styleSheet.remove();
        }, duration * 1000);
    }
}
