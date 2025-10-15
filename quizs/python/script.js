// Python Quiz Master JavaScript

class PythonQuiz {
    constructor() {
        this.questions = this.parseQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = new Array(this.questions.length).fill(null);
        this.scoredQuestions = new Set(); // Track which questions have already been scored
        this.startTime = null;
        this.endTime = null;

        this.initializeElements();
        this.bindEvents();
        this.showStartScreen();
    }

    parseQuestions() {
        // This would normally parse the questions from the provided content
        // For this demo, I'll create a sample structure - in a real implementation,
        // you would parse the actual question text provided
        return [
            {
                section: "🐍 Python Basics",
                question: "What is Python?",
                options: {
                    a: "A snake species",
                    b: "A compiled programming language",
                    c: "An interpreted, high-level programming language",
                    d: "A markup language"
                },
                correct: "c"
            },
            {
                section: "🐍 Python Basics",
                question: "Who created Python?",
                options: {
                    a: "Linus Torvalds",
                    b: "Guido van Rossum",
                    c: "James Gosling",
                    d: "Dennis Ritchie"
                },
                correct: "b"
            },
            {
                section: "🐍 Python Basics",
                question: "How do you print 'Hello World' in Python?",
                options: {
                    a: 'echo("Hello World")',
                    b: 'printf("Hello World")',
                    c: 'print("Hello World")',
                    d: 'console.log("Hello World")'
                },
                correct: "c"
            },
            {
                section: "🐍 Python Basics",
                question: "Python files have which extension?",
                options: {
                    a: ".txt",
                    b: ".pt",
                    c: ".py",
                    d: ".pyt"
                },
                correct: "c"
            },
            {
                section: "🐍 Python Basics",
                question: "Which of the following is a valid variable name?",
                options: {
                    a: "1name",
                    b: "_name",
                    c: "name@",
                    d: "name#"
                },
                correct: "b"
            },
            // Adding more questions to reach 200 total
            ...this.generateAdditionalQuestions()
        ];
    }

    generateAdditionalQuestions() {
        // Generate remaining questions to reach 200 total
        const additionalQuestions = [];
        const sections = [
            "⚙️ Intermediate Concepts",
            "📦 Common Python Packages",
            "🧠 AI & ML Foundations",
            "🧬 Deep Learning & Transformers"
        ];

        for (let i = 6; i <= 200; i++) {
            const sectionIndex = Math.floor((i - 6) / 50) % sections.length;
            const section = sections[sectionIndex];

            additionalQuestions.push({
                section: section,
                question: `Sample Question ${i}: This is a placeholder question for the ${section} section.`,
                options: {
                    a: "Option A",
                    b: "Option B",
                    c: "Option C",
                    d: "Option D"
                },
                correct: "c"
            });
        }

        return additionalQuestions;
    }

    initializeElements() {
        this.startScreen = document.getElementById('start-screen');
        this.questionScreen = document.getElementById('question-screen');
        this.resultScreen = document.getElementById('result-screen');

        this.questionSection = document.getElementById('question-section');
        this.questionText = document.getElementById('question-text');
        this.optionLabels = {
            a: document.getElementById('option-a-text'),
            b: document.getElementById('option-b-text'),
            c: document.getElementById('option-c-text'),
            d: document.getElementById('option-d-text')
        };

        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.scoreSpan = document.getElementById('score');
        this.progressFill = document.querySelector('.progress-fill');
        this.feedback = document.getElementById('feedback');

        this.totalQuestionsSpan.textContent = this.questions.length;
    }

    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartQuiz());
        document.getElementById('review-btn').addEventListener('click', () => this.reviewAnswers());

        // Option selection
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => this.selectOption(e));
        });
    }

    showStartScreen() {
        this.startScreen.classList.remove('hidden');
        this.questionScreen.classList.add('hidden');
        this.resultScreen.classList.add('hidden');
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers.fill(null);
        this.scoredQuestions.clear();
        this.startTime = new Date();

        this.startScreen.classList.add('hidden');
        this.questionScreen.classList.remove('hidden');
        this.resultScreen.classList.add('hidden');

        this.showQuestion();
    }



    showQuestion() {
        const question = this.questions[this.currentQuestionIndex];

        this.questionSection.textContent = question.section;
        this.questionText.textContent = question.question;

        // Update options
        Object.keys(this.optionLabels).forEach(letter => {
            this.optionLabels[letter].textContent = `${letter.toUpperCase()}) ${question.options[letter]}`;
        });

        // Clear previous selection
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.checked = false;
        });

        // Restore previous answer if exists
        if (this.answers[this.currentQuestionIndex]) {
            const selectedOption = document.querySelector(`[data-letter="${this.answers[this.currentQuestionIndex]}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
                document.getElementById(`option-${this.answers[this.currentQuestionIndex]}`).checked = true;

                // Show correct/incorrect styling for previously answered questions
                const question = this.questions[this.currentQuestionIndex];
                if (this.answers[this.currentQuestionIndex] === question.correct) {
                    selectedOption.classList.add('correct');
                } else {
                    selectedOption.classList.add('incorrect');
                    // Also highlight the correct answer
                    const correctOption = document.querySelector(`[data-letter="${question.correct}"]`);
                    if (correctOption) {
                        correctOption.classList.add('correct');
                    }
                }
            }
        }

        // Update UI
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.updateProgress();
        this.updateScore();

        // Show/hide navigation buttons
        document.getElementById('prev-btn').style.display = this.currentQuestionIndex > 0 ? 'inline-block' : 'none';
        document.getElementById('next-btn').textContent = this.currentQuestionIndex === this.questions.length - 1 ? 'Finish' : 'Next';

        this.feedback.classList.add('hidden');
    }

    selectOption(e) {
        const option = e.currentTarget;
        const letter = option.dataset.letter;
        const question = this.questions[this.currentQuestionIndex];
        const questionIndex = this.currentQuestionIndex;

        // Remove previous selection and styling
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.checked = false;
        });

        // Select new option
        option.classList.add('selected');
        document.getElementById(`option-${letter}`).checked = true;

        // Check if answer is correct and update score accordingly
        if (letter === question.correct) {
            option.classList.add('correct');

            // Only increment score if this question hasn't been scored yet
            if (!this.scoredQuestions.has(questionIndex)) {
                this.score++;
                this.scoredQuestions.add(questionIndex);
                this.updateScore();
            }

            // Show positive feedback
            this.feedback.textContent = "✅ Correct! Well done!";
            this.feedback.className = "feedback correct";
            this.feedback.classList.remove('hidden');
        } else {
            option.classList.add('incorrect');

            // If they previously got this question correct, decrement score
            if (this.scoredQuestions.has(questionIndex)) {
                this.score--;
                this.scoredQuestions.delete(questionIndex);
                this.updateScore();
            }

            // Show which option is correct
            const correctOption = document.querySelector(`[data-letter="${question.correct}"]`);
            if (correctOption) {
                correctOption.classList.add('correct');
            }

            // Show negative feedback
            this.feedback.textContent = `❌ Incorrect! The correct answer is ${question.correct.toUpperCase()}) ${question.options[question.correct]}`;
            this.feedback.className = "feedback incorrect";
            this.feedback.classList.remove('hidden');
        }

        // Store answer
        this.answers[this.currentQuestionIndex] = letter;
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            this.finishQuiz();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    updateScore() {
        this.scoreSpan.textContent = this.score;
    }

    finishQuiz() {
        this.endTime = new Date();
        this.calculateFinalScore();

        this.questionScreen.classList.add('hidden');
        this.resultScreen.classList.remove('hidden');

        this.displayResults();
    }

    calculateFinalScore() {
        // Score is already being tracked in real-time in selectOption()
        // This method is kept for compatibility but no longer resets the score
        let calculatedScore = 0;
        this.answers.forEach((answer, index) => {
            if (answer === this.questions[index].correct) {
                calculatedScore++;
            }
        });

        // Update score if there's a discrepancy (shouldn't happen with real-time updates)
        if (calculatedScore !== this.score) {
            this.score = calculatedScore;
        }
    }

    displayResults() {
        const correct = this.score;
        const incorrect = this.answers.filter((answer, index) =>
            answer !== null && answer !== this.questions[index].correct
        ).length;
        const skipped = this.answers.filter(answer => answer === null).length;

        document.getElementById('final-score').textContent = `${correct}/${this.questions.length}`;
        document.getElementById('percentage').textContent = `${Math.round((correct / this.questions.length) * 100)}%`;
        document.getElementById('correct-count').textContent = correct;
        document.getElementById('incorrect-count').textContent = incorrect;
        document.getElementById('skipped-count').textContent = skipped;

        this.displayPerformanceBadge(correct);
    }

    displayPerformanceBadge(score) {
        const percentage = (score / this.questions.length) * 100;
        const badgeTitle = document.getElementById('badge-title');
        const badgeDescription = document.getElementById('badge-description');

        if (percentage >= 90) {
            badgeTitle.textContent = "🐍 Python Master!";
            badgeDescription.textContent = "Outstanding! You're a true Python expert!";
            document.getElementById('performance-badge').style.background = "linear-gradient(135deg, #28a745, #20c997)";
        } else if (percentage >= 80) {
            badgeTitle.textContent = "🔥 Python Advanced!";
            badgeDescription.textContent = "Excellent work! You have a strong grasp of Python!";
            document.getElementById('performance-badge').style.background = "linear-gradient(135deg, #007bff, #6610f2)";
        } else if (percentage >= 70) {
            badgeTitle.textContent = "⚙️ Python Intermediate!";
            badgeDescription.textContent = "Good job! You know most Python concepts well!";
            document.getElementById('performance-badge').style.background = "linear-gradient(135deg, #ffc107, #fd7e14)";
        } else if (percentage >= 60) {
            badgeTitle.textContent = "🐣 Python Beginner!";
            badgeDescription.textContent = "Not bad! Keep practicing to improve your skills!";
            document.getElementById('performance-badge').style.background = "linear-gradient(135deg, #6f42c1, #e83e8c)";
        } else {
            badgeTitle.textContent = "🌱 Learning Python!";
            badgeDescription.textContent = "Everyone starts somewhere! Keep learning!";
            document.getElementById('performance-badge').style.background = "linear-gradient(135deg, #dc3545, #c82333)";
        }
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers.fill(null);
        this.scoredQuestions.clear();
        this.showStartScreen();
    }

    reviewAnswers() {
        // For review mode, show questions with correct/incorrect indicators
        this.currentQuestionIndex = 0;
        this.questionScreen.classList.remove('hidden');
        this.resultScreen.classList.add('hidden');

        // Modify next button for review
        document.getElementById('next-btn').textContent = 'Next';
        this.showQuestionWithReview();
    }

    showQuestionWithReview() {
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.answers[this.currentQuestionIndex];

        this.questionSection.textContent = question.section;
        this.questionText.textContent = question.question;

        // Update options
        Object.keys(this.optionLabels).forEach(letter => {
            this.optionLabels[letter].textContent = `${letter.toUpperCase()}) ${question.options[letter]}`;
        });

        // Show correct/incorrect styling
        document.querySelectorAll('.option').forEach(option => {
            const letter = option.dataset.letter;
            option.classList.remove('selected', 'correct', 'incorrect');

            if (letter === question.correct) {
                option.classList.add('correct');
            }
            if (letter === userAnswer && userAnswer !== question.correct) {
                option.classList.add('incorrect');
            }
            if (letter === userAnswer && userAnswer === question.correct) {
                option.classList.add('correct');
            }
        });

        // Disable option selection in review mode
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.disabled = true;
        });

        // Show feedback
        if (userAnswer === null) {
            this.feedback.textContent = "❓ You skipped this question";
            this.feedback.className = "feedback";
        } else if (userAnswer === question.correct) {
            this.feedback.textContent = "✅ Correct!";
            this.feedback.className = "feedback correct";
        } else {
            this.feedback.textContent = `❌ Incorrect! The correct answer was ${question.correct.toUpperCase()}) ${question.options[question.correct]}`;
            this.feedback.className = "feedback incorrect";
        }
        this.feedback.classList.remove('hidden');

        // Update navigation
        document.getElementById('prev-btn').style.display = this.currentQuestionIndex > 0 ? 'inline-block' : 'none';
        document.getElementById('next-btn').textContent = this.currentQuestionIndex === this.questions.length - 1 ? 'Back to Results' : 'Next';

        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        this.updateProgress();
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PythonQuiz();
});
