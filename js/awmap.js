/**
 * AlphaMapper - Entry point and glue code for everythng.
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

// TODO:
// Use the leaflet plugin for scaled missing tiles

/** Global for holding the Leaflet.js instance */
var worldMap;

/** Main entry point of AlphaMapper; called from index.html */
function main()
{
    setupMap();
    setupNavBox();

    // Grab state from URL
    var urlState     = query2CoordsAndZoom();
    var targetLatLng = coords2LatLng(urlState.location);
    worldMap.setView(targetLatLng, urlState.zoom);
}

/** Sets up the top navigational box */
function setupNavBox()
{
    var navBar   = document.querySelector("#navBar");
    var navInput = navBar.querySelector("input");

    navBar.onsubmit = function(e)
    {
        // Needed up here in case this function errors...
        e.preventDefault();

        // Only zoom in if we're zoomed pretty far out
        var targetZoom = Math.max( 8, worldMap.getZoom() );
        var coords     = parseCoords(navInput.value);
        var latlng     = coords2LatLng(coords);

        navInput.value = coords2PrettyCoords(coords);

        worldMap.setView(latlng, targetZoom);
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

    worldMap.on('moveend', function(e)
    {
        navInput.placeholder = latLng2PrettyCoords( worldMap.getCenter() );
    });
}

/** Sets up the Leaflet.js map */
function setupMap()
{
    // Helpful references:
    // http://leafletjs.com/examples/crs-simple/crs-simple.html
    // http://leafletjs.com/examples/extending/extending-2-layers.html
    worldMap = L.map("map", {
        // Make dragging on touch devices a little looser
        inertiaDeceleration: 2000,

        center: [-160, 160],
        crs:    L.CRS.Simple,
        layers: [ new AWLayer() ],
        zoom:   DEFAULT_ZOOM
    });

    worldMap.addControl(new AWInfoControl({
        position: 'topright'
    }));

    // Update URL when moving the map
    worldMap.on('moveend', function()
    {
        var center = worldMap.getCenter();
        var zoom   = worldMap.getZoom();

        history.replaceState(
            null,
            "AWMapper",
            "?location=" + latLng2PrettyCoords(center, '_') + "&zoom=" + zoom
        );
    });
}

// Handles the user clicking the "Teleport here" link.
function teleportHere()
{
    var center = worldMap.getCenter();
    var linkURL = "http://objects.activeworlds.com/cgi-bin/teleport.cgi?aw_" + parseLatLng(center);
    window.location = linkURL;
}
