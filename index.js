const wrapperElement = document.getElementById('wrapper');

/* 
Get the questions data
*/
async function fetchQuestions() {
    const response = await fetch('./questions.json');
    const questions = await response.json();
    const delayedResult = new Promise((resolve) => {
        setTimeout(() => {
            resolve(questions);
        }, 2000);
    })
    return delayedResult;
}

/* 
Get the questions status
*/
async function fetchQuestionsStatus() {
    const response = await fetch('./question-status.json');
    const questionsStatus = await response.json();
    const delayedResult = new Promise((resolve) => {
        setTimeout(() => {
            resolve(questionsStatus);
        }, 2000);
    })
    return delayedResult;
}

/* 
Build questionStatusModel
*/
function buildQuestionStatusModel(questions) {
    const questionStatusModel = {};

    questions.forEach((question) => {
        let status = question.status?.toLowerCase()?.replace('_', '-');

        questionStatusModel[question.id] = status;
    })

    return questionStatusModel;
}

/* 
Build a data model
*/
/*
questions = [
    {
        id: 'asdf',
        name: 'A sdf',
        category: 'HTML'
    },
]

TO

const questionsModel = {
    HTML: [
        {

        },
    ],
    CSS: [
        {

        },
    ],
}
*/
function buildCategoriesModel(questions, questionsStatusModel) {
    const categoriesModel = {};

    questions.forEach(question => {
        // Add status data for question
        question.status = questionsStatusModel[question.id] || 'unattempted';

        // Assign to category
        if (categoriesModel.hasOwnProperty(question.category)) {
            categoriesModel[question.category].push(question);
        } else {
            categoriesModel[question.category] = [question];
        }
    });
    return categoriesModel;
}

/* 
<!-- Model -->
<!-- 
<div class="category">
    <h2>HTML</h2>
    <div class="question">
        <div class="status partially-correct"></div>
        <h3>Stopwatch</h3>
    </div>
    <div class="question">
        <h3>Tic Tac toe</h3>
    </div>
</div> --> */

/* 
Create a category in DOM
*/
function createCategory(categoryName, questions) {
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('category');

    const h2Element = document.createElement('h2');
    h2Element.textContent = categoryName;
    categoryElement.append(h2Element);

    let correctAnswersQty = 0;

    questions.forEach((question) => {
        if (question.status === 'correct') {
            correctAnswersQty += 1;
        }

        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        
        const statusElement = document.createElement('div');
        statusElement.classList.add('status');
        statusElement.classList.add(question.status);
        questionElement.append(statusElement);

        const h3Element = document.createElement('h3');
        h3Element.textContent = question.name;
        questionElement.append(h3Element);

        categoryElement.append(questionElement);
    });

    h2Element.textContent += ` - ${correctAnswersQty} / ${questions.length}`;

    return categoryElement;
}


/* 
Iterate through model to output the desired markup
*/
function displayCategories(categoriesModel) {
    for (const [category, questions] of Object.entries(categoriesModel)) {
        const categoryElement = createCategory(category, questions);
        wrapperElement.append(categoryElement);
    }
}


/* 
Fetch and display questions by category
*/
async function fetchAndDisplayQuestions() {
    // const questions = await fetchQuestions();
    // const questionsStatus = await fetchQuestionsStatus();
    const [questions, questionsStatus] = await Promise.all([
        fetchQuestions(),
        fetchQuestionsStatus()
    ]);

    const questionsStatusModel = buildQuestionStatusModel(questionsStatus);
    const categoriesModel = buildCategoriesModel(questions, questionsStatusModel);
    displayCategories(categoriesModel);
}

fetchAndDisplayQuestions();
