/**
 * Logic for Playlister.
 * Roy Curtis, MIT license, 2018
 */

var goBtn         = document.getElementById('go');
var luckyBox      = document.getElementById('lucky');
var autodeleteBox = document.getElementById('autodelete');
var searchList    = document.getElementById('search-list');
var entryList     = document.getElementById('entry-list');
var editing       = true;

searchList.value = localStorage['searchList'] || '';

function saveState()
{
    localStorage['searchList'] = searchList.value.trim();
}

function entry2SearchList()
{
    var entries = entryList.children;

    searchList.value = '';

    for (var i = 0; i < entries.length; i++)
        searchList.value += entries[i].innerText + '\n';

    saveState();
}

goBtn.onclick = function()
{
    if (editing)
    {
        var entries = searchList.value.trim().split('\n');

        searchList.classList.add('hidden');
        entryList.classList.remove('hidden');

        entryList.innerHTML = '';

        entries.forEach(function(v)
        {
            var opt = document.createElement("option");

            opt.value     = v;
            opt.innerText = v;

            entryList.add(opt);
        });
    }
    else
    {
        entry2SearchList();
        searchList.classList.remove('hidden');
        entryList.classList.add('hidden');
    }

    editing = !editing;
    goBtn.innerText = editing ? "Go!" : "Edit!";
};

searchList.oninput = saveState;

entryList.ondblclick = function(e)
{
    if (e.target.nodeName.toLowerCase() === 'option')
    if (e.target.value)
    {
        var term  = encodeURIComponent(e.target.value);
        var lucky = luckyBox.checked ? "&btnI=1" : "";

        window.open("http://google.com/search?q=" + term + "+site%3Ayoutube.com" + lucky);

        if (autodeleteBox.checked)
        {
            e.target.remove();
            entry2SearchList();
        }
    }
};