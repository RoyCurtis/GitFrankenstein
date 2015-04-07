// Kindle Triviamaster by Roy Curtis 2015

// Globals
var DATABASE;
var CATEGORIES = [];

var eCatRoll      = $('#catRoll');
var eQuestionRoll = $('#questionRoll');

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
    eQuestionRoll.empty();

    $.each(DATABASE, function (_, question) {
        if ( question['Category'] == category )
        {
            var entry = $('<li>')
                .text(question['Question']);

            eQuestionRoll.append(entry);
        }
    });
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