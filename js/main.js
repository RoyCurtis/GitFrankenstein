/**
 * Logic for Playlister.
 * Roy Curtis, MIT license, 2018
 */

var form          = document.querySelector('form');
var goBtn         = document.querySelector('#go');
var autodeleteBox = document.querySelector('#autodelete');
var luckyBox      = document.querySelector('#lucky');
var searchList    = document.querySelector('#search-list');
var entryList     = document.querySelector('#entry-list');
var editing       = true;

searchList.value      = localStorage['searchList']    || '';
autodeleteBox.checked = localStorage['autodeleteBox'] === 'true';
luckyBox.checked      = localStorage['luckyBox']      !== 'false';

// Global functions

function saveState()
{
    localStorage['searchList']    = searchList.value.trim();
    localStorage['autodeleteBox'] = autodeleteBox.checked;
    localStorage['luckyBox']      = luckyBox.checked;
}

function search2EntryList()
{
    var entries = searchList.value.trim().split('\n');

    entryList.innerHTML = '';

    entries.forEach(function(v)
    {
        var opt = document.createElement("option");

        opt.value     = v;
        opt.innerText = v;

        entryList.add(opt);
    });
}

function entry2SearchList()
{
    var entries = entryList.children;

    searchList.value = '';

    for (var i = 0; i < entries.length; i++)
        searchList.value += entries[i].innerText + '\n';

    saveState();
}

function playEntry(e)
{
    if (e.target.nodeName.toLowerCase() === 'option')
    if (e.target.value)
    {
        var term  = encodeURIComponent(e.target.value);
        var lucky = luckyBox.checked ? "&btnI=1" : "";

        window.open("http://google.com/search?q=" + term + "+site%3Ayoutube.com" + lucky);

        if (autodeleteBox.checked)
        {
            entryList.selectedIndex += 1;
            e.target.remove();
            entry2SearchList();
        }
    }
}

// Event handlers

goBtn.onclick = function()
{
    if (editing)
    {
        search2EntryList();
        searchList.classList.add('hidden');
        entryList.classList.remove('hidden');
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

form.onsubmit = function(e)
{
    e.preventDefault();

    var selected = entryList.selectedOptions;

    if (selected.length === 0)
        return;

    playEntry({ target: selected[0] });
};

entryList.ondblclick   = playEntry;
searchList.oninput     = saveState;
luckyBox.onchange      = saveState;
autodeleteBox.onchange = saveState;
