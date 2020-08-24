const startBtn = document.getElementById('start');
const topContent = document.getElementById('topContent');
const centerContent = document.getElementById('centerContent');
const downContent = document.getElementById('downContent');
const header = document.getElementById('header');
const content = document.getElementById('content');
let questionData;
let questionNumber = 1;
const corrects = [];
const correctAnswers = [];
const questionAnswers = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: []
}

Array.prototype.shuffle = function() {
  let i = this.length;
  while (i) {
    let j = Math.floor(Math.random() * i);
    --i;
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
}

class CreatButtons {

 createAnswersBtn = number => {
    for (let i = 0; i < questionAnswers[number].length; i++) {
      const answerBtn = document.createElement('button');
      answerBtn.type = 'button';
      answerBtn.name = 'answerBtn';
      answerBtn.innerHTML = questionAnswers[number][i];
      answerBtn.onclick = clickBtn;
      downContent.appendChild(answerBtn);
    }
  }

 changeAnswersBtn = number => {
    while (downContent.firstChild) {
      downContent.removeChild(downContent.firstChild);
    }
    this.createAnswersBtn(number);
  }

 createReloadBtn = () => {
    while (downContent.firstChild) {
      downContent.removeChild(downContent.firstChild);
    }
    const reloadBtn = document.createElement('button');
    reloadBtn.type = 'button';
    reloadBtn.name = 'reloadBtn';
    reloadBtn.innerText = 'ホームに戻る';
    reloadBtn.onclick = () => {
      document.location.reload()
    };
    downContent.appendChild(reloadBtn);
  }

}

class CreateContents {

  createCategory = () => {
    const category = questionData.results[0].category;
    const genre = document.createElement('h3');
    const genreContent = document.createTextNode('[ジャンル] ' + category);
    genre.appendChild(genreContent);
    topContent.appendChild(genre);
  }

  createLevel = () => {
    const difficulty = questionData.results[0].difficulty;
    const level = document.createElement('h3');
    const levelContent = document.createTextNode('[難易度] ' + difficulty);
    level.appendChild(levelContent);
    topContent.appendChild(level);
  }

  createQuestion = (number) => {
    centerContent.removeChild(centerContent.firstElementChild);
    const questionContent = document.createElement('p');
    questionContent.innerHTML = questionData.results[number].question;
    centerContent.appendChild(questionContent);
  }

}

const buttons = new CreatButtons();
const contents = new CreateContents();

startBtn.addEventListener('click', () => {
  waitingPage();
  startBtn.remove();
  asynchronousFunc()
    .then(fetchCorrectAnswers)
    .then(fetchAnswers)
    .then(changeQuestionPage);
});

const asynchronousFunc = () => {
  return new Promise((resolve, reject) => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then(response => response.json())
      .then(data => {
        questionData = data;
        resolve();
      })
  });
}

const fetchCorrectAnswers = () => {
  for (let i = 0; i < 10; i++) {
    const correctAnswer = questionData.results[i].correct_answer;
    correctAnswers.push(correctAnswer);
  }
}

const fetchAnswers = () => {
  for (let i = 0; i < 10; i++) {
    const correctAnswer = questionData.results[i].correct_answer;
    const inCorrectAnswer = questionData.results[i].incorrect_answers;
    inCorrectAnswer.forEach(item => {
      questionAnswers[i].push(item);
    });
    questionAnswers[i].push(correctAnswer);
    questionAnswers[i].shuffle();
  }
}

const waitingPage = () => {
  header.innerText = '取得中';
  content.innerText = '少々お待ちください';
}

const changeQuestionPage = () => {
  header.innerText = '問題1';
  contents.createCategory();
  contents.createLevel();
  contents.createQuestion(questionNumber - 1);
  buttons.createAnswersBtn(questionNumber - 1);

}

const clickBtn = event => {
  const clickedAnswer = event.target.textContent;
  if (questionNumber === 10) {
    header.innerText = 'あなたの正答数は' + corrects.length + 'です！！';
    topContent.children[1].remove();
    topContent.children[1].remove();
    centerContent.firstElementChild.innerText = '再度チャレンジしたい場合は以下をクリック！！';
    buttons.createReloadBtn();
  } else {
    ++questionNumber;
    header.innerText = '問題' + questionNumber;
    topContent.children[1].innerText = '[ジャンル] ' + questionData.results[questionNumber - 1].category;
    topContent.children[2].innerText = '[難易度] ' + questionData.results[questionNumber - 1].difficulty;
    contents.createQuestion(questionNumber - 1);
    buttons.changeAnswersBtn(questionNumber - 1);
    if (correctAnswers[questionNumber - 2] === clickedAnswer) {
      corrects.push(1);
    }
  }
}
