// Kindle Triviamaster by Roy Curtis 2015

// Globals
var DATABASE   = {};
var CATEGORIES = [];

var eQuestionRoll = document.querySelector('#questionRoll');
var eCategoryRoll = document.querySelector('#categoryRoll');
var eBtnPrevPage  = document.querySelector('#btnPrevPage');
var eBtnNextPage  = document.querySelector('#btnNextPage');
var eBtnRandom    = document.querySelector('#btnRandom');
var eBtnCategory  = document.querySelector('#btnCategory');

var eSelectionScreen = document.querySelector('#selectionScreen');
var eQuestionScreen  = document.querySelector('#questionScreen');
var eCategoryScreen  = document.querySelector('#categoryScreen');

var currentCategory;
var entriesPerPage = 10;
var currentPage    = 0;
var totalPages     = 0;

// MDN
function randInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
if (window.NodeList && !NodeList.prototype.forEach)
    NodeList.prototype.forEach = function (callback, thisArg)
    {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++)
            callback.call(thisArg, this[i], i, this);
    };

// Functions
function prepareDatabase(results)
{
    var database = {};
    var data     = results.data;

    data.forEach(function (question) {
        var category = question['Category'];

        if (CATEGORIES.indexOf(question['Category']) === -1)
        {
            var option = document.createElement('btn');

            option.innerText = category;
            option.onclick   = function()
            {
                selectCategory(category);
                eCategoryScreen.classList.add("hidden");
            };

            eCategoryRoll.appendChild(option);
            CATEGORIES.push(category);
            database[category]         = [];
            database[category].history = [];
        }

        database[category].push(question);
    });

    return database;
}

function selectCategory(category)
{
    currentCategory = DATABASE[category];
    currentPage     = 0;
    totalPages      = Math.ceil(DATABASE[category].length / entriesPerPage);

    selectPage(0);
    eBtnCategory.innerText = category;
}

function selectPage(page)
{
    var firstEntry = page * entriesPerPage;
    var lastEntry  = firstEntry + entriesPerPage;
    currentPage = page;

    eQuestionRoll.childNodes.forEach( function(entry)
    {
        entry.entryData = null;
        entry.onclick   = null;
    });

    eQuestionRoll.innerHTML = null;

    for (var i = firstEntry; i < lastEntry; i++)
    {
        var entryData = currentCategory[i];

        if (!entryData) break;

        var entry = document.createElement("li");

        entry.innerText = entryData['Question'];
        entry.entryData = entryData;
        entry.onclick   = function (event)
        {
            showQuestion(event.currentTarget);
        };

        eQuestionRoll.appendChild(entry);
    }
}

function showQuestion(target)
{
    eQuestionScreen.classList.remove("hidden");

    var data    = target.entryData || target;
    var answers = eQuestionScreen.querySelectorAll("answer");

    eQuestionScreen.querySelector("question").innerText = data["Question"];

    for (var i = 0; i < 4; i++)
    {
        var answer     = answers[i];
        var answerText = data["Option " + (i + 1)];
        answer.innerText = answerText;

        if ( answerText.toLowerCase() === data["Answer"].toLowerCase() )
            answer.classList.add("correct");
        else
            answer.classList.remove("correct");
    }
}

// Events


// Main
Papa.parse("RoyCurtis2012.csv", {
    download: true,
    header:   true,
    comments: true,
    complete: function (results)
    {
        DATABASE = prepareDatabase(results);

        selectCategory("General");

        document.body.onclick = document.body.ontouchstart = function()
        {
            document.body.onclick = null;
            document.body.classList.remove('splash');

            eSelectionScreen.classList.remove('hidden');
        };

        eQuestionScreen.onclick = function()
        {
            eQuestionScreen.classList.add("hidden");
        };

        eBtnPrevPage.onclick = function()
        {
            currentPage--;

            if (currentPage < 0)
                currentPage = totalPages - 1;

            selectPage(currentPage);
        };

        eBtnNextPage.onclick = function()
        {
            currentPage++;

            if (currentPage >= totalPages)
                currentPage = 0;

            selectPage(currentPage);
        };

        eBtnRandom.onclick = function()
        {
            for (var i = 0; i < 1000; i++)
            {
                var randIdx = randInt(0, currentCategory.length);

                if (currentCategory.history.indexOf(randIdx) === -1)
                    currentCategory.history.push(randIdx);
                else
                    continue;

                if (currentCategory.history.length === currentCategory.length)
                {
                    console.log("Exhausted all random");
                    currentCategory.history = [];
                }

                var randEntry = currentCategory[randIdx];
                showQuestion(randEntry);
                break;
            }
        };

        eBtnCategory.onclick = function()
        {
            eCategoryScreen.classList.remove("hidden");
        };

        // Emulates touch response CSS on Kindle
        document.querySelectorAll('toolbar > btn').forEach( function(btn)
        {
            btn.addEventListener('click', function()
            {
                btn.classList.add('touched');
                setTimeout(function() { btn.classList.remove('touched'); }, 250);
            });
        });

    }
});