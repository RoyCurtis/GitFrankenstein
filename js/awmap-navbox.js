/**
 * AlphaMapper - Navigation box to allow panning to given coordinates
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

/** Sets up the top navigational box */
function setupNavBox()
{
    var navBar   = document.querySelector("#navBar");
    var navInput = navBar.querySelector("input");

    // Pans and zooms the map to the user given coordinates
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

    // Handle custom validation error as coordinates are typed
    navInput.oninput = function()
    {
        if (navInput.validity.patternMismatch)
            navInput.setCustomValidity(
                'Coordinates must be in one of these formats: ' +
                '"1000N -1000E", "200N", "-1200s666E", etc.'
            );
        else
            navInput.setCustomValidity('');
    };

    // Make the placeholder text show the current map center
    worldMap.on('moveend', function()
    {
        navInput.placeholder = latLng2PrettyCoords( worldMap.getCenter() );
    });
}