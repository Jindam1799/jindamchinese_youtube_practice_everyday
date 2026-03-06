const subjects = [
  { hanzi: '我', pinyin: 'wǒ', ko: '나는' },
  { hanzi: '你', pinyin: 'nǐ', ko: '너는' },
  { hanzi: '他', pinyin: 'tā', ko: '그는' },
  { hanzi: '她', pinyin: 'tā', ko: '그녀는' },
  { hanzi: '老师', pinyin: 'lǎoshī', ko: '선생님은' },
  { hanzi: '大家', pinyin: 'dàjiā', ko: '여러분은' },
];

const verbs = [
  { hanzi: '听', pinyin: 'tīng', ko: '듣는다' },
  { hanzi: '喝', pinyin: 'hē', ko: '마신다' },
  { hanzi: '吃', pinyin: 'chī', ko: '먹는다' },
  { hanzi: '来', pinyin: 'lái', ko: '온다' },
  { hanzi: '买', pinyin: 'mǎi', ko: '산다' },
  { hanzi: '看', pinyin: 'kàn', ko: '본다' },
  { hanzi: '去', pinyin: 'qù', ko: '간다' },
];

const TOTAL_QUESTIONS = 15;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let isClickable = true; // 중복 클릭 방지용
let currentOptions = []; // 현재 화면에 표시된 2개의 선택지 데이터
let correctOptionIndex = 0; // 정답이 0번 버튼인지 1번 버튼인지 저장

// DOM 요소
const elKoQuestion = document.getElementById('ko-question');
const elProgress = document.getElementById('progress');
const elScore = document.getElementById('score');
const elFeedback = document.getElementById('feedback-msg');
const btns = [
  document.getElementById('btn-0'),
  document.getElementById('btn-1'),
];

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-board').style.display = 'block';
  currentQuestionIndex = 0;
  correctAnswersCount = 0;
  updateScoreBoard();
  loadNextQuestion();
}

function loadNextQuestion() {
  if (currentQuestionIndex >= TOTAL_QUESTIONS) {
    endGame();
    return;
  }

  // 상태 초기화
  isClickable = true;
  elFeedback.className = '';
  elFeedback.innerText = '';
  btns.forEach((btn) => {
    btn.classList.remove('correct', 'wrong');
  });

  // 1. 정답 만들기
  let correctSub = subjects[Math.floor(Math.random() * subjects.length)];
  let correctVerb = verbs[Math.floor(Math.random() * verbs.length)];
  let questionText = `${correctSub.ko} ${correctVerb.ko}`; // 예: 나는 마신다

  let correctData = {
    hanzi: `${correctSub.hanzi}${correctVerb.hanzi}`,
    pinyin: `${correctSub.pinyin} ${correctVerb.pinyin}`,
    isCorrect: true,
  };

  // 2. 오답(매력적인 함정) 만들기: 주어는 같게 하고 동사만 다르게 설정
  let wrongVerb;
  do {
    wrongVerb = verbs[Math.floor(Math.random() * verbs.length)];
  } while (wrongVerb.hanzi === correctVerb.hanzi); // 정답 동사와 겹치지 않게

  let wrongData = {
    hanzi: `${correctSub.hanzi}${wrongVerb.hanzi}`,
    pinyin: `${correctSub.pinyin} ${wrongVerb.pinyin}`,
    isCorrect: false,
  };

  // 3. 버튼 위치 무작위 섞기 (50% 확률)
  if (Math.random() > 0.5) {
    currentOptions = [correctData, wrongData];
    correctOptionIndex = 0;
  } else {
    currentOptions = [wrongData, correctData];
    correctOptionIndex = 1;
  }

  // 4. 화면에 데이터 뿌리기
  elKoQuestion.innerText = questionText;

  for (let i = 0; i < 2; i++) {
    document.getElementById(`cn-text-${i}`).innerText = currentOptions[i].hanzi;
    document.getElementById(`pinyin-text-${i}`).innerText =
      currentOptions[i].pinyin;
  }

  currentQuestionIndex++;
  updateScoreBoard();
}

function selectAnswer(selectedIndex) {
  if (!isClickable) return; // 이미 선택했다면 무시
  isClickable = false;

  const isCorrect = currentOptions[selectedIndex].isCorrect;

  if (isCorrect) {
    // 정답인 경우
    correctAnswersCount++;
    btns[selectedIndex].classList.add('correct');
    elFeedback.innerText = '딩동댕! 정답입니다 👏';
    elFeedback.className = 'feedback-correct';
  } else {
    // 오답인 경우
    btns[selectedIndex].classList.add('wrong');
    btns[correctOptionIndex].classList.add('correct'); // 정답이 뭔지 초록색으로 알려줌
    elFeedback.innerText = '아쉽네요! 초록색 버튼이 정답입니다.';
    elFeedback.className = 'feedback-wrong';
  }

  updateScoreBoard();

  // 1.5초 후 다음 문제로
  setTimeout(() => {
    loadNextQuestion();
  }, 1500);
}

function updateScoreBoard() {
  elProgress.innerText = `진행도: ${currentQuestionIndex} / ${TOTAL_QUESTIONS}`;
  elScore.innerText = `정답: ${correctAnswersCount}`;
}

function endGame() {
  document.getElementById('game-board').style.display = 'none';
  document.getElementById('result-screen').style.display = 'block';
  document.getElementById('final-score').innerText =
    `총 ${TOTAL_QUESTIONS}문제 중 ${correctAnswersCount}문제 정답을 맞췄습니다!`;
}
