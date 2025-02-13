import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
	onSnapshot,
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Firebase 초기화
const firebaseConfig = {
	apiKey: 'AIzaSyBumMEQkqGB3bQbnzGN4q1XghrWQTkJpOA',
	authDomain: 'yes-or-no-83b4d.firebaseapp.com',
	projectId: 'yes-or-no-83b4d',
	storageBucket: 'yes-or-no-83b4d.firebasestorage.app',
	messagingSenderId: '161352961851',
	appId: '1:161352961851:web:a260c33da1e6fe0972b11e',
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let votes = { agree: 0, disagree: 0 };
let totalVotes = 0;
let userVote = null; // 사용자의 투표 저장
let overlay = document.getElementById('overlay');

// 페이지 로드 시 투표 결과 가져오기
window.onload = function () {
	fetchVoteResults();
};

function fetchVoteResults() {
	const docRef = doc(db, 'votes', 'results'); // 문서 참조 생성

	// 실시간 리스너 추가
	onSnapshot(
		docRef,
		(docSnap) => {
			if (docSnap.exists()) {
				votes = docSnap.data();
				totalVotes = votes.agree + votes.disagree;
				updateVoteCount();
			} else {
				console.log('No such document!');
			}
		},
		(error) => {
			console.error('Error in onSnapshot: ', error);
		}
	);
}

// vote 함수를 전역으로 노출
window.vote = function (type) {
	// 중복 투표 방지 로직
	if (userVote) {
		alert('이미 투표하셨습니다.');
		return;
	}

	userVote = type; // 사용자의 투표 저장
	votes[type]++;
	totalVotes++;

	// Firestore에 투표 결과 업데이트
	updateVoteOnFirestore();
};

async function updateVoteOnFirestore() {
	const docRef = doc(db, 'votes', 'results'); // 문서 참조 생성
	try {
		await setDoc(docRef, votes); // Firestore에 투표 결과 업데이트
		updateVoteCount();
	} catch (error) {
		console.error('Error updating vote on Firestore: ', error);
	}
}

function updateVoteCount() {
	const countElement = document.getElementById('count');
	const resultCountElement = document.getElementById('result-count');

	// DOM 업데이트 최적화
	if (countElement.innerText !== totalVotes.toString()) {
		countElement.innerText = totalVotes; // 총 투표 수 업데이트
	}
	if (
		resultCountElement.innerText !==
		`👍 ${votes.agree}명 vs 👎 ${votes.disagree}명`
	) {
		resultCountElement.innerText = `👍 ${votes.agree}명 vs 👎 ${votes.disagree}명`; // 결과 업데이트
	}
}

// showResult 함수를 전역으로 노출
window.showResult = function () {
	let message = '';
	if (votes.agree > votes.disagree) {
		message = '찬성입니다!';
	} else if (votes.agree < votes.disagree) {
		message = '반대입니다!';
	} else {
		message = '재투표합니다!';
	}
	document.getElementById('result-message').innerText = message;
	createConfetti();

	// 결과를 보여줄 때도 투표 수 업데이트
	updateVoteCount();

	setTimeout(() => {
		overlay.classList.add('show');
	}, 10);
};

// closeOverlay 함수를 전역으로 노출
window.closeOverlay = function () {
	overlay.classList.remove('show');
};

function createConfetti() {
	for (let i = 0; i < 30; i++) {
		const confetti = document.createElement('div');
		confetti.className = 'confetti';
		document.body.appendChild(confetti);

		const colors = ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'];
		confetti.style.background =
			colors[Math.floor(Math.random() * colors.length)];
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
