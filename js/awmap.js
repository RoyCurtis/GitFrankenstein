var GLOBALS = {
    /** @type L.Map */
    worldMap : null
};

/** Main entry point of AlphaMapper; called from index.html */
function main()
{
    GLOBALS.worldMap = L.map("map", {
        center: [0, 0],
        zoom:   0,

        maxBounds: L.latLngBounds(
            L.latLng(-1024, -1024),
            L.latLng( 1024,  1024)
        ),

        layers: [ new AlphaWorldLayer() ]
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

function getTileUrl(point, zoom)
{
    // console.log(point, zoom);

}

function AlphaWorldMapType()
{
    this.alt        = "AlphaWorld";
    this.maxZoom    = 10;
    this.minZoom    = 0;
    this.name       = "AlphaWorld";
    this.projection = new AWProjection(16, 320);
    this.tileSize   = new google.maps.Size(320, 320);
}

AlphaWorldMapType.prototype.getTile = function(tileCoord, zoom, ownerDocument)
{
    var img = ownerDocument.createElement('img');

    img.src     = getTileUrl(tileCoord, zoom);
    img.width   = this.tileSize.width;
    img.height  = this.tileSize.height;
    img.onerror = function()
    {
        img.src = "http://maptiles.imabot.com/alphaworld/blank.png";
    };

    return img;
};

AlphaWorldMapType.prototype.releaseTile = function(node)
{
    node.onerror = null;
    node.remove();
};

//Handles the page being loaded.
function load()
{
    // ====== Create the MapType ==============
    var customMap = new AlphaWorldMapType();

    // === create the map ===
    worldMap = new google.maps.Map( document.getElementById("map") );

    // === add the new maptype to it ===
    // This feels dumb but it's the only way to get zoom information...
    customMap.projection.attachMap(worldMap);
    worldMap.mapTypes.set("ALPHAWORLD", customMap);
    worldMap.setOptions({
        gestureHandling : "greedy",
        disableDoubleClickZoom : true,
        streetViewControl: false,
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_RIGHT
        },
        mapTypeId : "ALPHAWORLD",
        mapTypeControl : false
    });

    // === set some properties ===

    infoControl = new InformationControl(worldMap);
    worldMap.controls[google.maps.ControlPosition.TOP_LEFT].push(infoControl.div);

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

    worldMap.setCenter( parseLocation(qsParm['location']) );
    worldMap.setZoom( parseInt(qsParm['zoom']) );

    document.getElementById("map").style.height = document.body.offsetHeight-51 + "px";
    google.maps.event.trigger(worldMap, 'resize');

    google.maps.event.addDomListener(window, "resize", function()
    {
        document.getElementById("map").style.height = document.body.offsetHeight-51 + "px";
        google.maps.event.trigger(worldMap, 'resize');
    });
}
