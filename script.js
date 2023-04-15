const quiz = async () => {
  try {
    const response = await fetch("https://the-trivia-api.com/v2/questions");
    const data = await response.json();
    let currentIndex = 0;
    updateDOM(data, currentIndex);
  } catch (error) {
    console.log(error);
  }
};

let submitBtn;
let nextBtn;

const updateDOM = (data, currentIndex) => {
  const question = document.querySelector("#question");
  const choices = document.querySelector("#choices");

  question.textContent = data[currentIndex].question.text;

  choices.innerHTML = data[currentIndex].incorrectAnswers
    .concat(data[currentIndex].correctAnswer)
    .sort()
    .map(
      (choice, index) => `
              <input type="radio" id="choice${index}" name="choice" value="${choice}" />
              <label for="choice${index}">${choice}</label>
            `
    )
    .join("");

  submitBtn = document.querySelector("#submit");
  nextBtn = document.querySelector("#next");

  submitBtn.disabled = true;
  nextBtn.disabled = true;

  const choicesList = document.querySelectorAll('input[name="choice"]');
  choicesList.forEach(choice => {
    choice.addEventListener("click", () => {
      submitBtn.disabled = false;
    });
  });

  submitBtn.addEventListener("click", () => {
    checkAndNext(data, currentIndex);
  });
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < data.length) {
      updateDOM(data, currentIndex);
    }
  });
};

const checkAndNext = (data, currentIndex) => {
  const choices = document.getElementsByName("choice");
  const selectedChoice = Array.from(choices).find(choice => choice.checked);
  if (!selectedChoice) {
    submitBtn.disabled = true;
    return alert("Please select an answer.");
  }

  submitBtn.disabled = true;
  nextBtn.disabled = false;
  checkAnswer(selectedChoice.value, data[currentIndex].correctAnswer);
};

const checkAnswer = (selectedAnswer, correctAnswer) => {
  const resultText =
    selectedAnswer === correctAnswer ? "Correct!" : "Incorrect!";
  marking(resultText);
};

const marking = resultText => {
  const resultsDiv = document.querySelector("#results");
  resultsDiv.textContent = resultText;
};

quiz();
