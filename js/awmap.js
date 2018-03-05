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
