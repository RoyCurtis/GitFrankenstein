/**
 * AlphaMapper - Custom Leaflet control for displaying coordinates
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

/**
 * Custom Leaflet control for displaying coordinates on mouseover or tap.
 *
 * @type {L.Control}
 */
var AWInfoControl = L.Control.extend({

    onAdd: function(map)
    {
        var controlDom = document.body.querySelector("#infoControl");
        var valueDom   = controlDom.querySelector("value");

        controlDom.remove();

        // Update the coordinate display on mouse move
        map.on('mousemove', function(e)
        {
            valueDom.innerText = latLng2PrettyCoords(e.latlng);
        });

        // Update the coordinate display on touch device tap
        map.on('click', function(e)
        {
            valueDom.innerText = latLng2PrettyCoords(e.latlng);
        });

        return controlDom;
    }

});