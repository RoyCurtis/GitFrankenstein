/**
 * AlphaMapper - Custom Leaflet control for the teleport-to-Active-Worlds button
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

/**
 * Custom Leaflet control for the teleport-to-Active-Worlds button.
 *
 * @type {L.Control}
 */
var AWTeleportControl = L.Control.extend({

    onAdd: function()
    {
        var controlDom = document.body.querySelector("#teleportControl");
        controlDom.remove();

        // Change URL to AW's teleport script with current coordinates
        controlDom.onclick = function()
        {
            var center  = worldMap.getCenter();
            var coords  = latLng2PrettyCoords(center, '_');

            window.location = TELEPORT_CGI + coords;
        };

        return controlDom;
    }

});