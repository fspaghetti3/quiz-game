// What do we need in order to create a quiz?
// A way to keep score via the timer function.
// A way to add/subtract from the timer if a question is correct/incorrect
// A way to display and switch between a set of questiosns
// A way to randomize which questions appear in which order (may be too complex)
// An end screen with a high score board (probably using localStorage)

const options = document.getElementsByClassName("options");

document.addEventListener("DOMContentLoaded", function(){
    const container = document.getElementById("container");
    const button = document.getElementById("start");
    const questionEl = document.querySelector(".ask1 p");
    const optionsEl = document.querySelectorAll(".options1 p");

    let currentQuestion = 0;
    let score = 0;
    let timer = document.getElementById("timer");
    let timeLeft = 20;
    let timerInterval;

    // Timer Function.
    function startTimer() {
        timerInterval = setInterval(function() {
            if (timeLeft >= 0) {
                timer.textContent = 'Timer: ' + timeLeft;
                timeLeft--;
            } else {
                clearInterval(timerInterval);
                endQuiz();
            }
        }, 1000);
    }

    document.getElementById('saveScoreBtn').addEventListener('click', function() {
        const name = document.getElementById('participantName').value;
        if (name.trim() !== "") {
            saveScore(score, name);
            displayLeaderboard();

            document.getElementById('nameInputDiv').style.display = "none";
        } else {
            alert("Please enter your name before saving!");
        }
    });

    function endQuiz() {
        clearInterval(timerInterval);
        
        score += timeLeft;

        container.style.display = "none"

        const scoreboard = document.getElementById("scoreboard");
        scoreboard.style.display = "flex";

        const finalScoreElement = document.getElementById("finalScore");
        finalScoreElement.textContent = "Your final score: " + score;
  
        displayLeaderboard();
        const nameInputDiv = document.getElementById('nameInputDiv');
        nameInputDiv.style.display = "flex";

        button.disabled = false;
        button.textContent = "Restart Quiz?";
        button.addEventListener("click", function() {
            location.reload();
        })
    }

    // Question/Answer Functions.
    const setsOfQuestions = [
    [    
        {
            questionText: "What day of the year is Halloween on?",
            options: ["October 31st", "November 25th", "April 1st", "December 25th"],
            correctAnswer: "October 31st"
        }

    ],
    [
        {
            questionText: "How many pounds of candy are sold on Halloween every year?",
            options: ["20 grams", "40 million", "600 million", "1.4 billion"],
            correctAnswer: "600 million"

        }
    ],
    [
        {
            questionText: "How heavy is the worlds heaviest pumpkin?",
            options: ["47.3lbs", "120.6lbs", "918.1lbs", "2,684lbs"],
            correctAnswer: "2,684lbs"

    }   
    ],
    [
        {
            questionText: "Are your doors locked?",
            options: ["Yes", "No", "Why do you ask?", "I hope so"],
            correctAnswer: "No"

        }
    ],
    [
        {
            questionText: "Look behind you.",
            options: ["Ok...", "No", "Why", "You're not in my house!"],
            correctAnswer: "Ok..."
        }
    ]

]


    function displayQuestion() {
        const q = setsOfQuestions[currentSet][currentQuestion];
        questionEl.textContent = q.questionText;

        optionsEl.forEach(option => option.textContent = "");

        q.options.forEach((text, index) => {
            if (optionsEl[index]) {
                optionsEl[index].textContent = text;
                optionsEl[index].removeEventListener('click', handleOptionClick);
                optionsEl[index].addEventListener('click', handleOptionClick);
            }
        });
    }

    function handleOptionClick(event) {
        const selectedOption = event.target.textContent;
        checkAnswer(selectedOption);
    }

    let currentSet = 0;

    function checkAnswer(selectedOption) {
        const correctAnswer = setsOfQuestions[currentSet][currentQuestion].correctAnswer;
        const feedbackEl = document.getElementById('feedback');
    
        if (selectedOption === correctAnswer) {
            score++;
            feedbackEl.textContent = 'Correct!';
            feedbackEl.style.color = 'green';
            feedbackEl.style.display = 'flex';
    
            setTimeout(() => {
                feedbackEl.style.display = 'none';
                currentQuestion++;
                timeLeft += 5;
    
                if (currentQuestion < setsOfQuestions[currentSet].length) {
                    displayQuestion();
                } else {
                    currentQuestion = 0;
                    currentSet++;
    
                    if (currentSet < setsOfQuestions.length) {
                        displayQuestion();
                    } else {
                        endQuiz("I farted" + score);
                    }
                }
            }, 1000); 
        } else {
            feedbackEl.textContent = 'Incorrect, guess again!';
            feedbackEl.style.color = 'red';
            feedbackEl.style.display = 'flex'; 
    
            setTimeout(() => {
                feedbackEl.style.display = 'none';
            }, 1000);
        }
    }

    // Start button functions.
    button.addEventListener("click", function(event) {
        event.preventDefault();

        if (container.style.display === "none" || container.style.display === "") { 
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.alignItems = "center";
            container.style.textAlign = "center";

            button.disabled = true;

            document.getElementById('leaderboard').style.display = 'none';
            startTimer();
            displayQuestion();
        } else {
            resetQuiz();
        }
    });

    // Function to save score.
    function saveScore(score, name) {
        let scores = JSON.parse(localStorage.getItem('leaderboardScores')) || [];

        scores.push({ score, name });

        scores.sort((a, b) => b.score - a.score);

        scores = scores.slice(0, 10);

        localStorage.setItem('leaderboardScores', JSON.stringify(scores));
    }

    // Leaderboard Function.
    function displayLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('leaderboardScores')) || [];
        const leaderboardList = document.getElementById('leaderboardScores');

        leaderboardList.innerHTML = '';

        scores.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
            leaderboardList.appendChild(listItem);
        });
        document.getElementById('leaderboard').style.display = 'flex';
    }

});