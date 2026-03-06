// 1일차 모든 단어 데이터 통합 (총 19개)
const words = [
  { hanzi: '我', pinyin: 'wǒ', ko: '나' },
  { hanzi: '你', pinyin: 'nǐ', ko: '너' },
  { hanzi: '他', pinyin: 'tā', ko: '그' },
  { hanzi: '她', pinyin: 'tā', ko: '그녀' },
  { hanzi: '老师', pinyin: 'lǎoshī', ko: '선생님' },
  { hanzi: '您', pinyin: 'nín', ko: '당신(존칭)' },
  { hanzi: '大家', pinyin: 'dàjiā', ko: '여러분' },
  { hanzi: '听', pinyin: 'tīng', ko: '듣다' },
  { hanzi: '喝', pinyin: 'hē', ko: '마시다' },
  { hanzi: '吃', pinyin: 'chī', ko: '먹다' },
  { hanzi: '来', pinyin: 'lái', ko: '오다' },
  { hanzi: '聊', pinyin: 'liáo', ko: '이야기하다' },
  { hanzi: '学', pinyin: 'xué', ko: '배우다' },
  { hanzi: '买', pinyin: 'mǎi', ko: '사다' },
  { hanzi: '写', pinyin: 'xiě', ko: '쓰다' },
  { hanzi: '有', pinyin: 'yǒu', ko: '있다' },
  { hanzi: '看', pinyin: 'kàn', ko: '보다' },
  { hanzi: '是', pinyin: 'shì', ko: '~이다' },
  { hanzi: '去', pinyin: 'qù', ko: '가다' },
];

const TOTAL_QUESTIONS = 15;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let isClickable = true;
let currentOptions = [];
let correctOptionIndex = 0;

// DOM 요소
const elQuestionHanzi = document.getElementById('ko-question');
const elQuestionPinyin = document.getElementById('q-pinyin');
const elProgress = document.getElementById('progress');
const elScore = document.getElementById('score');
const elFeedback = document.getElementById('feedback-msg');
const btns = [
  document.getElementById('btn-0'),
  document.getElementById('btn-1'),
  document.getElementById('btn-2'),
  document.getElementById('btn-3'),
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

  isClickable = true;
  elFeedback.className = '';
  elFeedback.innerText = '';
  btns.forEach((btn) => {
    btn.classList.remove('correct', 'wrong');
  });

  // 1. 정답 단어 1개 무작위 선택
  let correctWord = words[Math.floor(Math.random() * words.length)];
  correctWord.isCorrect = true;

  // 2. 오답 단어 3개 생성 (중복 방지)
  let wrongOptions = [];
  let usedHanzi = new Set([correctWord.hanzi]);

  while (wrongOptions.length < 3) {
    let randWord = words[Math.floor(Math.random() * words.length)];

    if (!usedHanzi.has(randWord.hanzi)) {
      usedHanzi.add(randWord.hanzi);
      wrongOptions.push({
        hanzi: randWord.hanzi,
        pinyin: randWord.pinyin,
        ko: randWord.ko,
        isCorrect: false,
      });
    }
  }

  // 3. 정답 1개 + 오답 3개 섞기
  currentOptions = [correctWord, ...wrongOptions];
  currentOptions.sort(() => Math.random() - 0.5);
  correctOptionIndex = currentOptions.findIndex((opt) => opt.isCorrect);

  // 4. 화면 출력 (문제는 중국어, 버튼은 한국어 뜻)
  elQuestionHanzi.innerText = correctWord.hanzi;
  elQuestionPinyin.innerText = correctWord.pinyin;

  for (let i = 0; i < 4; i++) {
    document.getElementById(`ko-text-${i}`).innerText = currentOptions[i].ko;
  }

  currentQuestionIndex++;
  updateScoreBoard();
}

function selectAnswer(selectedIndex) {
  if (!isClickable) return;
  isClickable = false;

  const isCorrect = currentOptions[selectedIndex].isCorrect;

  if (isCorrect) {
    correctAnswersCount++;
    btns[selectedIndex].classList.add('correct');
    elFeedback.innerText = '딩동댕! 정답입니다 👏';
    elFeedback.className = 'feedback-correct';
  } else {
    btns[selectedIndex].classList.add('wrong');
    btns[correctOptionIndex].classList.add('correct');
    elFeedback.innerText = '아쉽네요! 초록색 버튼이 정답입니다.';
    elFeedback.className = 'feedback-wrong';
  }

  updateScoreBoard();

  // 1초 후 다음 문제로 (단어는 호흡이 짧으므로 대기 시간을 조금 줄였습니다)
  setTimeout(() => {
    loadNextQuestion();
  }, 1000);
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
