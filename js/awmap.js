/**
 * AlphaMapper - Entry point and glue code for everythng.
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

var GLOBALS = {
    /** @type L.Map */
    worldMap : null
};

/** Main entry point of AlphaMapper; called from index.html */
function main()
{
    GLOBALS.worldMap = L.map("map", {
        // Restricts tile loading to 320x320 area (entire map at zoom 0)
        maxBounds: L.latLngBounds(
            L.latLng( -320, 0),
            L.latLng(    0, 320)
        ),

        crs:    L.CRS.Simple,
        center: [-160, 160],
        zoom:   3,
        layers: [ new AlphaWorldLayer() ]
    });

    GLOBALS.worldMap.on('click', function(e)
    {
        console.log(e.latlng, e.layerPoint);
    });
}


// General event handlers
// Handles the user pressing enter while searching coordinates.
function handleEnter(event)
{
    var keyCode = null;

    if(event.which)
    {
        keyCode = event.which;
    }
    else if(event.keyCode)
    {
        keyCode = event.keyCode;
    }

    if (keyCode === 13)
    {
        document.getElementById("gotoBtn").click();
        return false;
    }

    return true;
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
