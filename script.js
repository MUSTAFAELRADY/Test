let question = document.querySelector(".body h3");
let checkarea = document.querySelector(".body #check");
let labelarea = document.querySelector(".body #label");
let footer = document.querySelector(".footer");
let body = document.querySelector(".body");
let history = document.querySelector(".box-history");
let currentIndex = 0;
let rightAnswers = 0;
let qCount;

//save to local storage
let datatask;
if (localStorage.task != null) {
  datatask = JSON.parse(localStorage.task);
} else {
  datatask = [];
}
// the main function
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      createBullets(qCount);

      first.innerHTML = currentIndex + 1;

      addthequestion(questionsObject[currentIndex], qCount);
      submit.onclick = () => {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);
        //part for print  to build history
        let tiq = question;
        let ch = checkarea;
        let lab = labelarea;

        let newtask = {
          que: tiq.innerHTML,
          che: ch.innerHTML,
          labe: lab.innerHTML,
        };
        datatask.push(newtask);
        // localStorage.setItem("task", JSON.stringify(datatask));
        if (datatask.length <= qCount) {
          localStorage.setItem("task", JSON.stringify(datatask));
        }
        //
        if (currentIndex + 1 <= qCount) {
          first.innerHTML = currentIndex + 1;
        }
        question.innerHTML = "";
        checkarea.innerHTML = "";
        labelarea.innerHTML = "";
        addthequestion(questionsObject[currentIndex], qCount);
        handleBullets();
        showResults(qCount);

        //disappear the restart button
        if (currentIndex >= qCount - 1) {
          restart.style.display = "none";
          showanswers.style.display = "block";
        }
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();

// restart the quiz
function theindex() {
  window.location.reload();
}
//get the question fton the json file
function addthequestion(obj, count) {
  if (currentIndex < count) {
    let questext = document.createTextNode(obj["title"]);
    question.appendChild(questext);
    for (let i = 1; i <= 4; i++) {
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "checkbox";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      checkarea.appendChild(radioInput);
    }
    for (let i = 1; i <= 4; i++) {
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      labelarea.appendChild(theLabel);
    }
  }
}

//create the bullets under question area
function createBullets(qCount) {
  thespan.innerHTML = qCount;
  for (let i = 0; i < qCount; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bullets.appendChild(theBullet);
  }
}
//treate with bullets
function handleBullets() {
  let bulletsSpans = document.querySelectorAll("#bullets span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    span.classList.remove("on");
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
//check all answers
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
      answers[i].setAttribute("checked", "");
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}
//show final result for the test
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    submit.remove();
    footer.remove();
    checkarea.remove();
    labelarea.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      congrats.innerHTML = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      congrats.innerHTML = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      congrats.innerHTML = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
  }
}
//showing the answers after finshing the  test
function showtask() {
  let inbody = ``;
  for (let i = 0; i < datatask.length; i++) {
    inbody += `
       <h3>(${i + 1}) ${datatask[i].que}</h3> 
      <div class="ansers">
      <div id="check"> ${datatask[i].che}</div>
      <div id="label"> ${datatask[i].labe}</div>
      </div>
      `;
  }
  document.querySelector(".box-history").innerHTML = inbody;
  showanswers.innerHTML = "(x2)hide answers";
}
// for hiding answers
function hideanswers() {
  if (history !== null) {
    history.innerHTML = "";
    showanswers.innerHTML = "show answers";
  }
}
//empty local storage when clicking restart
function del() {
  if (window.location.reload) {
    localStorage.removeItem("task");
  }
}
del();
//unabled the history section.....
function unabled() {
  history.style.pointerEvents = "none";
}
unabled();
