/**
 * AlphaMapper - Entry point and glue code for everythng.
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

// TODO:
// Use the leaflet plugin for scaled missing tiless

/** Main entry point of AlphaMapper; called from index.html */
function main()
{
    setupNavBox();
    setupMap();
}

/** Sets up the top navigational box */
function setupNavBox()
{
    var navBar   = document.querySelector("#navBar");
    var navInput = navBar.querySelector("input");

    navBar.onsubmit = function(e)
    {
        var coords = parseCoords(navInput.value);
        var pretty = coords2PrettyCoords(coords);
        console.log(coords);

        navInput.value = pretty;

        e.preventDefault();
        return false;
    };

    navInput.oninput = function(e)
    {
        if (navInput.validity.patternMismatch)
            navInput.setCustomValidity(
                'Coordinates must be in one of these formats: ' +
                '"1000N -1000E", "200N", "-1200s666E", etc.'
            );
        else
            navInput.setCustomValidity('');
    };
}

/** Sets up the Leaflet.js map */
function setupMap()
{
    // Helpful references:
    // http://leafletjs.com/examples/crs-simple/crs-simple.html
    // http://leafletjs.com/examples/extending/extending-2-layers.html
    var worldMap = L.map("map", {
        // Restricts panning and zooming to 350x350 area; entire map at zoom 0 but with
        // some padding, so that it's less annoying to get to edges or corners
        maxBounds: L.latLngBounds(
            L.latLng( -330, 0),
            L.latLng(    0, 330)
        ),

        // Make dragging on touch devices a little looser
        inertiaDeceleration: 1500,

        center: [-160, 160],
        crs:    L.CRS.Simple,
        layers: [ new AWLayer() ],
        zoom:   3
    });

    worldMap.addControl(new AWInfoControl({
        position: 'topright'
    }));
}


// Handles the user clicking the "Link here" link.
function linkHere()
{
    var center = worldMap.getCenter();
    var zoom = worldMap.getZoom();
    var linkURL = window.location.protocol + "//" + window.location.host + window.location.pathname + "?location=" + parseLatLng(center) + "&zoom=" + zoom;
    var linkElement = document.getElementById("linkHere");
    linkElement.innerHTML = linkURL;
    linkElement.href = linkURL;
}

// Handles the user clicking the "Teleport here" link.
function teleportHere()
{
    var center = worldMap.getCenter();
    var linkURL = "http://objects.activeworlds.com/cgi-bin/teleport.cgi?aw_" + parseLatLng(center);
    window.location = linkURL;
}

//Handles the user and client clicking the "goto" button.
function gotoLocation()
{
    worldMap.setCenter(parseLocation(document.getElementById("inputLocation").value));
    worldMap.setZoom(10);
    worldMap.savePosition();
}

//Takes an AW style coordinate and returns the corresponding GLatLng
function parseLocation(inputLocation)
{
    var nsCoord = inputLocation.match("[0-9]*[.]?[0-9]*[NnSs]");
    var ewCoord = inputLocation.match("[0-9]*[.]?[0-9]*[EeWw]");

    var lat, lng;
    if(nsCoord != null && ewCoord != null)
    {
        lat = parseFloat(nsCoord) * (inputLocation.match("[Nn]") != null ? 1 : -1);
        lng = parseFloat(ewCoord) * (inputLocation.match("[Ww]") != null ? 1 : -1);
    }
    else
    {
        lat = 0;
        lng = 0;
    }

    return new google.maps.LatLng(lat/1024, lng/1024);
}

function parseLatLng(center)
{
    return Math.floor( Math.abs(center.lat() * 1024) ) + (center.lat() >= 0 ? "N" : "S") + "_"
        +  Math.floor( Math.abs(center.lng() * 1024) ) + (center.lng() >= 0 ? "W" : "E")
}

//Handles the page being loaded.
function load()
{
    // Parses the query string as needed.
    var qsParm = [];
    function qs()
    {
        var query = window.location.search.substring(1);
        var parms = query.split('&');
        for (var i=0; i<parms.length; i++)
        {
            var pos = parms[i].indexOf('=');
            if (pos > 0)
            {
                var key = parms[i].substring(0,pos);
                qsParm[key] = parms[i].substring(pos + 1);
            }
        }
    }

    // qsParm['location'] = "42000s 46100w"; // TODO: Fix projections
    qsParm['location'] = "";
    qsParm['zoom']     = 0;
    qs();
}
