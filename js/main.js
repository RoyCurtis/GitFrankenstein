/**
 * Logic for Playlister.
 * Roy Curtis, MIT license, 2018
 */

var goBtn      = document.getElementById('go');
var luckyBox   = document.getElementById('lucky');
var searchList = document.getElementById('search-list');
var entryList  = document.getElementById('entry-list');
var editing    = true;

searchList.value = "";

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
        searchList.classList.remove('hidden');
        entryList.classList.add('hidden');
    }

    editing = !editing;
    goBtn.innerText = editing ? "Go!" : "Edit!";
};

entryList.ondblclick = function(e)
{
    if (e.target.nodeName.toLowerCase() === 'option')
    if (e.target.value)
    {
        var term  = encodeURIComponent(e.target.value);
        var lucky = luckyBox.checked ? "&btnI=1" : "";

        window.open("http://google.com/search?q=" + term + "+site%3Ayoutube.com" + lucky);
    }
};