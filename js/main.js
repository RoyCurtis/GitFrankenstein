// Kindle Triviamaster by Roy Curtis 2015

// Globals
var DATABASE   = {};
var CATEGORIES = [];

var eCatRoll      = $('#catRoll');
var eQuestionRoll = $('#questionRoll');
var eBtnPrevPage  = $('#btnPrevPage');
var eBtnNextPage  = $('#btnNextPage');

var eSelectionScreen = $('#selectionScreen');
var eQuestionScreen  = $('#questionScreen');

var currentCategory;
var entriesPerPage = 9;
var currentPage    = 0;
var totalPages     = 0;

// Functions
function prepareDatabase(results)
{
    var db   = {};
    var data = results.data;

    $.each(data, function (_, question) {
        var category = question['Category'];

        if ( $.inArray(question['Category'], CATEGORIES) == -1 )
        {
            var option = $('<option>')
                .attr('value', category)
                .text(category);

            eCatRoll.append(option);
            CATEGORIES.push(category);
            db[category] = [];
        }

        db[category].push(question);
    });

    console.log(db);
    return db;
}

function selectCategory(category)
{
    currentCategory = DATABASE[category];
    currentPage     = 0;
    totalPages      = Math.ceil(DATABASE[category].length / entriesPerPage);

    selectPage(0);
}

function selectPage(page)
{
    var firstEntry = page * entriesPerPage;
    var lastEntry  = firstEntry + entriesPerPage;
    currentPage = page;

    eQuestionRoll.children().removeData().unbind();
    eQuestionRoll.empty();

    for (var i = firstEntry; i < lastEntry; i++)
    {
        var entryData = currentCategory[i];

        if (!entryData) break;

        var entry = $('<li>')
            .text(entryData['Question'])
            .data("question", entryData)
            .click( function (event) {
                showQuestion(event.currentTarget);
            });

        eQuestionRoll.append(entry);
    }
}

function showQuestion(target)
{
    eQuestionScreen.removeClass("hidden");

    var data    = $(target).data("question");
    var answers = eQuestionScreen.find("answer");

    eQuestionScreen
        .find("question").text(data["Question"]);

    for (var i = 0; i < 4; i++)
    {
        var answer     = answers.eq(i);
        var answerText = data["Option " + (i + 1)];
        answer.text(answerText);

        if ( answerText.toLowerCase() == data["Answer"].toLowerCase() )
            answer.attr("class", "correct");
        else
            answer.attr("class", "");
    }
}

// Events
function onDownload(results)
{
    DATABASE = prepareDatabase(results);

    selectCategory("General");
    eCatRoll.val("General");

    eCatRoll.change(function()
    {
        selectCategory( eCatRoll.val() );
    });
}

// Main
Papa.parse("RoyCurtis2012.csv", {
    download: true,
    header:   true,
    complete: onDownload
});

eQuestionScreen.click(function()
{
    eQuestionScreen.addClass("hidden");
});

eBtnPrevPage.click(function ()
{
    currentPage--;

    if (currentPage < 0)
        currentPage = totalPages - 1;

    selectPage(currentPage);
});

eBtnNextPage.click(function ()
{
    currentPage++;

    if (currentPage >= totalPages)
        currentPage = 0;

    selectPage(currentPage);
});

// Emulates touch response CSS on Kindle
$('btn').click(function(event)
{
    var btn = $(event.currentTarget);
    btn.addClass('touched');
    setTimeout(function() { btn.removeClass('touched'); }, 250);
});