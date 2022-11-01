const wrapperElement = document.getElementById('wrapper');

/* 
Get the data
*/

async function fetchQuestions() {
    const response = await fetch('./questions.json');
    const questions = await response.json();
    return questions;
}

/* 
Build a data model

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
function buildCategoriesModel(questions) {
    const categoriesModel = {};

    questions.forEach(question => {
        if (categoriesModel.hasOwnProperty(question.category)) {
            categoriesModel[question.category].push(question);
        } else {
            categoriesModel[question.category] = [];
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

    questions.forEach((question) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const h3Element = document.createElement('h3');
        h3Element.textContent = question.name;
        questionElement.append(h3Element);

        categoryElement.append(questionElement);
    });

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
Iterate through model to output the desired markup
*/
async function fetchAndDisplayQuestions() {
    const questions = await fetchQuestions();
    const categoriesModel = buildCategoriesModel(questions);
    displayCategories(categoriesModel);
}

fetchAndDisplayQuestions();