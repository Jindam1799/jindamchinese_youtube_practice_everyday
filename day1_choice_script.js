const subjects = [
  { hanzi: '我', pinyin: 'wǒ', ko: '나는' },
  { hanzi: '你', pinyin: 'nǐ', ko: '너는' },
  { hanzi: '他', pinyin: 'tā', ko: '그는' },
  { hanzi: '她', pinyin: 'tā', ko: '그녀는' },
  { hanzi: '老师', pinyin: 'lǎoshī', ko: '선생님은' },
  { hanzi: '您', pinyin: 'nín', ko: '당신은' },
  { hanzi: '大家', pinyin: 'dàjiā', ko: '여러분은' },
];

const verbs = [
  { hanzi: '听', pinyin: 'tīng', ko: '듣는다' },
  { hanzi: '喝', pinyin: 'hē', ko: '마신다' },
  { hanzi: '吃', pinyin: 'chī', ko: '먹는다' },
  { hanzi: '来', pinyin: 'lái', ko: '온다' },
  { hanzi: '聊', pinyin: 'liáo', ko: '이야기한다' },
  { hanzi: '学', pinyin: 'xué', ko: '배운다' },
  { hanzi: '买', pinyin: 'mǎi', ko: '산다' },
  { hanzi: '写', pinyin: 'xiě', ko: '쓴다' },
  { hanzi: '有', pinyin: 'yǒu', ko: '있다 / 가지고 있다' },
  { hanzi: '看', pinyin: 'kàn', ko: '본다' },
  { hanzi: '是', pinyin: 'shì', ko: '~이다 / ~입니다' },
  { hanzi: '去', pinyin: 'qù', ko: '간다' },
];

const TOTAL_QUESTIONS = 20;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let isClickable = true;
let currentOptions = [];
let correctOptionIndex = 0;

// DOM 요소 (버튼 4개로 확장)
const elKoQuestion = document.getElementById('ko-question');
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

  // 1. 정답 데이터 생성
  let correctSub = subjects[Math.floor(Math.random() * subjects.length)];
  let correctVerb = verbs[Math.floor(Math.random() * verbs.length)];
  let questionText = `${correctSub.ko} ${correctVerb.ko}`;

  let correctStr = `${correctSub.hanzi}${correctVerb.hanzi}`;
  let correctData = {
    hanzi: correctStr,
    pinyin: `${correctSub.pinyin} ${correctVerb.pinyin}`,
    isCorrect: true,
  };

  // 2. 오답 3개 생성 (정답과 겹치지 않는 완전 무작위 조합)
  let wrongOptions = [];
  let usedStrings = new Set([correctStr]); // 중복 방지용 Set

  while (wrongOptions.length < 3) {
    let randSub = subjects[Math.floor(Math.random() * subjects.length)];
    let randVerb = verbs[Math.floor(Math.random() * verbs.length)];
    let randStr = `${randSub.hanzi}${randVerb.hanzi}`;

    // 이미 나온 문장이 아니라면 오답 목록에 추가
    if (!usedStrings.has(randStr)) {
      usedStrings.add(randStr);
      wrongOptions.push({
        hanzi: randStr,
        pinyin: `${randSub.pinyin} ${randVerb.pinyin}`,
        isCorrect: false,
      });
    }
  }

  // 3. 정답 1개 + 오답 3개 합치기
  currentOptions = [correctData, ...wrongOptions];

  // 배열 무작위로 섞기 (Shuffle)
  currentOptions.sort(() => Math.random() - 0.5);

  // 섞인 배열에서 정답 버튼이 몇 번인지 찾아두기
  correctOptionIndex = currentOptions.findIndex((opt) => opt.isCorrect);

  // 4. 화면에 텍스트 반영
  elKoQuestion.innerText = questionText;
  for (let i = 0; i < 4; i++) {
    document.getElementById(`cn-text-${i}`).innerText = currentOptions[i].hanzi;
    document.getElementById(`pinyin-text-${i}`).innerText =
      currentOptions[i].pinyin;
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
