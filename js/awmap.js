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
    if (location.protocol === 'https:')
        alert("Warning: Loading this page as HTTPS may prevent map tiles from loading, " +
            "as they are served via HTTP only. Try changing the 'https' to 'http' " +
            "if you encounter problems.");

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

    // Add the information (coordinates) control
    worldMap.addControl(new AWInfoControl({
        position: 'topright'
    }));

    // Add the teleport button control
    worldMap.addControl(new AWTeleportControl({
        position: 'topleft'
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