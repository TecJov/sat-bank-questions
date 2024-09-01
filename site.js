console.log("site.js is loaded");
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    let questions = [];
    let currentQuestionIndex = 0;

    console.log("Attempting to fetch data.json");

fetch('../data.json')
    .then(response => {
        console.log("Fetch response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("data.json successfully loaded. First question:", data[0]);
        questions = data;
        showQuestion();
    })
    .catch(error => {
        console.error('Error loading questions:', error);
    });

    function showQuestion() {
        currentQuestionIndex = Math.floor(Math.random() * questions.length);
        const questionData = questions[currentQuestionIndex];
        console.log('Showing question:', questionData);

        const questionIdElement = document.getElementById('question-id');
        questionIdElement.textContent = "Question ID: " + questionData["Question ID"];

        const questionElement = document.getElementById('question');
        questionElement.textContent = questionData.Question;

        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        Object.entries(questionData.Options).forEach(([key, value]) => {
            const optionElement = document.createElement('div');
            optionElement.innerHTML = `
                <input type="radio" name="option" value="${key}" id="${key}">
                <label for="${key}">${key}. ${value}</label>
            `;
            optionsContainer.appendChild(optionElement);
        });

        document.getElementById('feedback').textContent = '';
        document.getElementById('explanation').textContent = '';
    }

    function checkAnswer() {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            const userAnswer = selectedOption.value;
            const questionData = questions[currentQuestionIndex];

            const feedbackElement = document.getElementById('feedback');
            const explanationElement = document.getElementById('explanation');
            if (userAnswer === questionData.Answer) {
                feedbackElement.textContent = 'Correct!';
                feedbackElement.style.color = 'green';
                const audio = new Audio('ding.mp3');
                audio.play();
            } else {
                feedbackElement.textContent = 'Incorrect!';
                feedbackElement.style.color = 'red';
                const audio = new Audio('buzz.mp3');
                audio.play();
            }

            explanationElement.textContent = questionData.Explanation;
        } else {
            alert('Please select an option.');
        }
    }

    document.getElementById('submit').addEventListener('click', checkAnswer);
    document.getElementById('next').addEventListener('click', showQuestion);
});