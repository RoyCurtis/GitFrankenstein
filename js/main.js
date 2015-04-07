// Kindle Triviamaster by Roy Curtis 2015

// Globals
var DATABASE;
var CATEGORIES = [];

var eCatRoll      = $('#catRoll');
var eQuestionRoll = $('#questionRoll');
var eDebugger     = $('#debug');

var eSelectionScreen = $('#selectionScreen');
var eQuestionScreen  = $('#questionScreen');

// Functions
function populateCategories()
{
    $.each(DATABASE, function (_, question) {
        if ( $.inArray(question['Category'], CATEGORIES) == -1 )
        {
            var category = question['Category'];
            var option   = $('<option>')
                .attr('value', category)
                .text(category);

            eCatRoll.append(option);
            CATEGORIES.push(category);
        }
    });
}

function selectCategory(category)
{
    eQuestionRoll.children().unbind();
    eQuestionRoll.empty();

    $.each(DATABASE, function (_, question) {
        if ( question['Category'] == category )
        {
            var entry = $('<li>')
                .text(question['Question'])
                .data("question", question)
                .click( function (event) {
                    showQuestion(event.currentTarget);
                });

            eQuestionRoll.append(entry);
        }
    });
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
    DATABASE = results.data;

    populateCategories();
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

eQuestionScreen.click(function() {
    eQuestionScreen.addClass("hidden");
});