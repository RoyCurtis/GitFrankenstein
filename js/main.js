/**
 * Logic for Playlister.
 * Roy Curtis, MIT license, 2018
 */

// Global state and DOM references

var form          = document.querySelector('form');
var goBtn         = document.querySelector('#go');
var autodeleteBox = document.querySelector('#autodelete');
var luckyBox      = document.querySelector('#lucky');
var searchList    = document.querySelector('#search-list');
var entryList     = document.querySelector('#entry-list');
var editing       = true;

// Load state from storage

searchList.value      = localStorage['searchList']    || '';
autodeleteBox.checked = localStorage['autodeleteBox'] === 'true';
luckyBox.checked      = localStorage['luckyBox']      !== 'false';

// Global functions

/** Saves data (e.g. entry list, checkboxes) to storage */
function saveState()
{
    localStorage['searchList']    = searchList.value.trim();
    localStorage['autodeleteBox'] = autodeleteBox.checked;
    localStorage['luckyBox']      = luckyBox.checked;
}

/** Converts user-inputted list of search terms into an interactive list */
function search2EntryList()
{
    var entries = searchList.value.trim().split('\n');

    // Clear existing entries
    entryList.innerHTML = '';

    // Generate an OPTION element for each search term entry
    entries.forEach(function(v)
    {
        var opt = document.createElement("option");

        opt.value     = v;
        opt.innerText = v;

        entryList.add(opt);
    });
}

/** Converts the interactive list back to an editable list of search terms */
function entry2SearchList()
{
    var entries = entryList.children;

    // Clear existing entries
    searchList.value = '';

    for (var i = 0; i < entries.length; i++)
        searchList.value += entries[i].innerText + '\n';

    // Persist data to storage, in case an entry was auto-deleted
    saveState();
}

/** Opens the selected entry as a Google search in a new tab or window */
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
            // Auto-select next entry on delete
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

    editing         = !editing;
    goBtn.innerText = editing ? "Go!" : "Edit!";
};

// Handle ENTER key on selected element
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
