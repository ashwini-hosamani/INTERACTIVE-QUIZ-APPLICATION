// script.js
// LuminaQuest - Interactive Quiz Application
// Built with pure HTML, CSS & JavaScript
// Fully responsive, dark mode, voice support, timer system, dynamic questions

// ==================== QUESTIONS DATABASE ====================
// Questions are loaded dynamically at runtime from this object.
// In a real production app you could replace this with a fetch() to your own API.
// All questions are unique per category and include a mix of difficulties.

const questionsDB = {
    "AI": [
        { question: "What does 'AI' stand for?", options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Insight"], correct: 1 },
        { question: "Which company developed the first large language model GPT series?", options: ["Google", "OpenAI", "Meta", "Microsoft"], correct: 1 },
        { question: "What is the core idea behind Reinforcement Learning?", options: ["Learning from labeled data", "Learning by trial and error with rewards", "Clustering similar data", "Rule-based programming"], correct: 1 },
        { question: "Which of these is a popular framework for building AI models?", options: ["TensorFlow", "React", "Django", "WordPress"], correct: 0 }
    ],
    "General Knowledge": [
        { question: "What is the capital of France?", options: ["Madrid", "Paris", "Rome", "Berlin"], correct: 1 },
        { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], correct: 2 },
        { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
        { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 }
    ],
    "Aptitude": [
        { question: "What is the next number in the series: 2, 6, 12, 20, ?", options: ["28", "30", "32", "36"], correct: 1 },
        { question: "If 5 machines make 5 widgets in 5 minutes, how long for 100 machines to make 100 widgets?", options: ["5 minutes", "20 minutes", "100 minutes", "1 minute"], correct: 0 },
        { question: "A train travels 60 km/h. How far does it go in 15 minutes?", options: ["10 km", "15 km", "20 km", "30 km"], correct: 1 },
        { question: "If A is 20% more than B, then B is what % less than A?", options: ["16.67%", "20%", "25%", "30%"], correct: 0 }
    ],
    "Programming": [
        { question: "What does HTML stand for?", options: ["HyperText Markup Language", "High Transfer Machine Language", "Home Tool Markup Language", "Hyperlink Text Management"], correct: 0 },
        { question: "Which keyword is used to declare a constant in modern JavaScript?", options: ["var", "let", "const", "static"], correct: 2 },
        { question: "What is the time complexity of a binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2 },
        { question: "In Python, what does the 'len()' function return?", options: ["Length of string only", "Length of list/tuple/string", "Type of object", "Memory address"], correct: 1 }
    ],
    "Science": [
        { question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
        { question: "What force keeps planets in orbit around the Sun?", options: ["Magnetism", "Gravity", "Friction", "Electricity"], correct: 1 },
        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], correct: 2 },
        { question: "What is the speed of light in vacuum (approx)?", options: ["300 km/s", "300,000 km/s", "3,000 km/s", "30,000 km/s"], correct: 1 }
    ],
    "Logical Reasoning": [
        { question: "All cats are animals. Some animals are dogs. Therefore:", options: ["All cats are dogs", "Some cats are dogs", "No conclusion possible", "All dogs are cats"], correct: 2 },
        { question: "If the day after tomorrow is Wednesday, what day is today?", options: ["Monday", "Tuesday", "Sunday", "Saturday"], correct: 0 },
        { question: "Find the odd one out: Apple, Banana, Carrot, Orange", options: ["Apple", "Banana", "Carrot", "Orange"], correct: 2 },
        { question: "A is B's sister. C is B's mother. D is C's father. How is A related to D?", options: ["Granddaughter", "Daughter", "Sister", "Niece"], correct: 0 }
    ],
    "UPSC": [
        { question: "Who is known as the Father of the Indian Constitution?", options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Dr. B.R. Ambedkar", "Sardar Patel"], correct: 2 },
        { question: "Article 370 of the Indian Constitution was related to:", options: ["Emergency powers", "Special status of Jammu & Kashmir", "Right to Education", "Panchayati Raj"], correct: 1 },
        { question: "The Preamble of the Indian Constitution was adopted on:", options: ["26 January 1950", "15 August 1947", "26 November 1949", "2 October 1948"], correct: 2 },
        { question: "Which Fundamental Right was removed by the 44th Amendment?", options: ["Right to Equality", "Right to Property", "Right to Freedom", "Right against Exploitation"], correct: 1 }
    ],
    "Current Affairs": [
        { question: "Which country hosted the G20 Summit in 2023?", options: ["India", "Brazil", "Indonesia", "Germany"], correct: 0 },
        { question: "Who won the Nobel Peace Prize in 2024 (sample)?", options: ["UNICEF", "Nihon Hidankyo", "WHO", "ICRC"], correct: 1 },
        { question: "What is India's target year for achieving Net Zero emissions?", options: ["2030", "2047", "2070", "2050"], correct: 2 },
        { question: "Which mission was launched by ISRO in 2023 to study the Sun?", options: ["Chandrayaan-3", "Aditya-L1", "Gaganyaan", "Mangalyaan-2"], correct: 1 }
    ],
    "Others": [
        { question: "What is the national sport of India?", options: ["Cricket", "Hockey", "Kabaddi", "Football"], correct: 1 },
        { question: "Which festival is known as the Festival of Lights?", options: ["Holi", "Diwali", "Eid", "Christmas"], correct: 1 },
        { question: "What is the currency of Japan?", options: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2 },
        { question: "Who wrote the book 'Harry Potter' series?", options: ["J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin", "Suzanne Collins"], correct: 1 }
    ]
};

// ==================== GLOBAL STATE ====================
let currentCategory = "";
let currentDifficulty = "";
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 30;
let selectedAnswerIndex = null;
let answered = false;
let reviewData = [];

// ==================== UTILITY FUNCTIONS ====================
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function speakQuestion() {
    if ('speechSynthesis' in window) {
        const questionText = document.getElementById("question-text").textContent;
        const utterance = new SpeechSynthesisUtterance(questionText);
        utterance.pitch = 1;
        utterance.rate = 0.95;
        speechSynthesis.cancel(); // stop any previous speech
        speechSynthesis.speak(utterance);
    } else {
        alert("Voice synthesis is not supported in your browser.");
    }
}

// ==================== RENDER CATEGORIES ====================
function renderCategories() {
    const grid = document.getElementById("category-grid");
    grid.innerHTML = "";

    Object.keys(questionsDB).forEach(cat => {
        const card = document.createElement("div");
        card.className = "category-card";
        card.innerHTML = `
            <h3>${cat}</h3>
            <p>Explore ${cat} knowledge</p>
        `;
        card.onclick = () => selectCategory(cat);
        grid.appendChild(card);
    });
}

// ==================== CATEGORY & DIFFICULTY SELECTION ====================
function selectCategory(category) {
    currentCategory = category;
    document.getElementById("home-screen").classList.add("hidden");
    const diffScreen = document.getElementById("difficulty-screen");
    diffScreen.classList.remove("hidden");
    document.getElementById("selected-category-display").textContent = category;
}

function goBackToHome() {
    // Reset everything
    document.getElementById("difficulty-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("home-screen").classList.remove("hidden");
    currentCategory = "";
    currentDifficulty = "";
    resetQuizState();
}

// ==================== START QUIZ ====================
function startQuiz(difficulty) {
    currentDifficulty = difficulty;
    
    // Map difficulty to timer seconds
    if (difficulty === "Easy") timeLeft = 30;
    else if (difficulty === "Medium") timeLeft = 45;
    else timeLeft = 60;

    // Load and shuffle questions dynamically
    let allQuestions = questionsDB[currentCategory] || [];
    if (allQuestions.length === 0) {
        alert("No questions available for this category yet. Try another!");
        goBackToHome();
        return;
    }

    currentQuestions = shuffle([...allQuestions]).slice(0, 10); // max 10 questions
    currentQuestionIndex = 0;
    score = 0;
    reviewData = [];

    document.getElementById("difficulty-screen").classList.add("hidden");
    const quizScreen = document.getElementById("quiz-screen");
    quizScreen.classList.remove("hidden");

    // Set header info
    document.getElementById("quiz-category").textContent = currentCategory;
    document.getElementById("quiz-difficulty").innerHTML = `<span class="badge">${currentDifficulty}</span>`;

    loadQuestion();
}

// ==================== LOAD QUESTION ====================
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }

    answered = false;
    selectedAnswerIndex = null;
    const q = currentQuestions[currentQuestionIndex];

    // Update counter
    document.getElementById("question-counter").textContent = 
        `${currentQuestionIndex + 1} of ${currentQuestions.length}`;

    // Question text
    document.getElementById("question-text").textContent = q.question;

    // Options
    const container = document.getElementById("options-container");
    container.innerHTML = "";

    q.options.forEach((option, index) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span>${option}</span>
        `;
        div.onclick = () => handleAnswer(index, div);
        container.appendChild(div);
    });

    // Reset feedback and next button
    document.getElementById("feedback").classList.add("hidden");
    document.getElementById("next-btn").classList.add("hidden");

    // Start timer
    startTimer();
}

// ==================== TIMER ====================
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    const timerEl = document.getElementById("timer");
    const progressEl = document.getElementById("progress");
    timerEl.textContent = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        // Visual warning
        if (timeLeft <= 10) {
            timerEl.style.color = "#ef4444";
        }

        // Progress fill (based on remaining time)
        const totalTime = currentDifficulty === "Easy" ? 30 : currentDifficulty === "Medium" ? 45 : 60;
        const percentage = (timeLeft / totalTime) * 100;
        progressEl.style.width = `${percentage}%`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

// ==================== ANSWER HANDLING ====================
function handleAnswer(selectedIndex, element) {
    if (answered) return;
    answered = true;
    selectedAnswerIndex = selectedIndex;
    clearInterval(timerInterval);

    const q = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correct;

    // Record for review
    reviewData.push({
        question: q.question,
        selected: q.options[selectedIndex],
        correct: q.options[q.correct],
        isCorrect: isCorrect
    });

    // Highlight all options
    const options = document.querySelectorAll(".option");
    options.forEach((opt, i) => {
        opt.style.pointerEvents = "none";
        if (i === q.correct) {
            opt.classList.add("correct");
        }
        if (i === selectedIndex && !isCorrect) {
            opt.classList.add("wrong");
        }
    });

    // Feedback
    const feedbackEl = document.getElementById("feedback");
    feedbackEl.classList.remove("hidden");

    const iconEl = document.getElementById("feedback-icon");
    const textEl = document.getElementById("feedback-text");

    if (isCorrect) {
        score++;
        iconEl.innerHTML = "✅";
        textEl.innerHTML = `<strong>Correct!</strong>`;
        textEl.style.color = "#10b981";
    } else {
        iconEl.innerHTML = "❌";
        textEl.innerHTML = `<strong>Wrong.</strong> The correct answer was <strong>${q.options[q.correct]}</strong>`;
        textEl.style.color = "#ef4444";
    }

    // Show next button
    document.getElementById("next-btn").classList.remove("hidden");
}

// ==================== TIME OUT ====================
function handleTimeOut() {
    answered = true;
    const q = currentQuestions[currentQuestionIndex];

    // Record as incorrect
    reviewData.push({
        question: q.question,
        selected: "⏰ Time ran out",
        correct: q.options[q.correct],
        isCorrect: false
    });

    // Highlight correct option
    const options = document.querySelectorAll(".option");
    options.forEach((opt, i) => {
        opt.style.pointerEvents = "none";
        if (i === q.correct) opt.classList.add("correct");
    });

    const feedbackEl = document.getElementById("feedback");
    feedbackEl.classList.remove("hidden");
    document.getElementById("feedback-icon").innerHTML = "⏰";
    document.getElementById("feedback-text").innerHTML = `<strong>Time's up!</strong> The correct answer was <strong>${q.options[q.correct]}</strong>`;
    document.getElementById("feedback-text").style.color = "#f59e0b";

    document.getElementById("next-btn").classList.remove("hidden");
}

// ==================== NEXT QUESTION ====================
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// ==================== END QUIZ ====================
function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById("quiz-screen").classList.add("hidden");
    const resultScreen = document.getElementById("result-screen");
    resultScreen.classList.remove("hidden");

    const total = currentQuestions.length;
    const percentage = Math.round((score / total) * 100);

    // Fill results
    document.getElementById("final-score").textContent = score;
    document.getElementById("total-questions").textContent = total;
    document.getElementById("accuracy").textContent = `${percentage}%`;
    document.getElementById("score-percentage").textContent = percentage;

    // Dynamic message
    const messageEl = document.getElementById("result-message");
    if (percentage >= 90) messageEl.textContent = "Legendary performance! 🌟";
    else if (percentage >= 70) messageEl.textContent = "Excellent! You’re a knowledge champion!";
    else if (percentage >= 50) messageEl.textContent = "Good job! Keep learning!";
    else messageEl.textContent = "Keep practicing — every expert was once a beginner!";

    // Review list
    const reviewList = document.getElementById("review-list");
    reviewList.innerHTML = "";
    reviewData.forEach(item => {
        const div = document.createElement("div");
        div.className = "review-item";
        div.innerHTML = `
            <div>
                <strong>Q:</strong> ${item.question}<br>
                <span style="color:#64748b">Your answer: ${item.selected}</span>
            </div>
            <div style="text-align:right; color:${item.isCorrect ? '#10b981' : '#ef4444'}">
                ${item.isCorrect ? '✅' : '❌'}<br>
                <small>Correct: ${item.correct}</small>
            </div>
        `;
        reviewList.appendChild(div);
    });

    // Show restart button in header
    document.getElementById("restart-btn").classList.remove("hidden");
}

// ==================== RESTART FUNCTIONS ====================
function resetQuizState() {
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;
    reviewData = [];
    if (timerInterval) clearInterval(timerInterval);
}

function restartSameQuiz() {
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
    resetQuizState();
    startQuiz(currentDifficulty); // reuse same category & difficulty
}

function restartApp() {
    document.getElementById("restart-btn").classList.add("hidden");
    goBackToHome();
}

// ==================== DARK MODE ====================
function initDarkMode() {
    const toggle = document.getElementById("dark-toggle");
    const icon = document.getElementById("theme-icon");
    
    // Load saved preference
    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark");
        icon.textContent = "🌙";
    }

    toggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        const isDark = document.documentElement.classList.contains("dark");
        icon.textContent = isDark ? "🌙" : "☀️";
        localStorage.setItem("darkMode", isDark);
    });
}

// ==================== INITIALIZE APP ====================
function initApp() {
    renderCategories();
    initDarkMode();
    
    console.log("%c🚀 LuminaQuest initialized successfully! Ready for an epic quiz experience.", "color:#00d4ff; font-weight:700");
}

// Start the application
window.onload = initApp;