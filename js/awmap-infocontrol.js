/**
 * AlphaMapper - Custom Leaflet control for displaying coordinates
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

var AWInfoControl = L.Control.extend({

    onAdd: function(map)
    {
        var controlDom = document.body.querySelector("#infoControl");
        var valueDom   = controlDom.querySelector("value");

        controlDom.remove();

        map.on('mousemove', function(e)
        {
            valueDom.innerText = AWCoords.fromLatLngPretty(e.latlng);
        });

        map.on('click', function(e)
        {
            valueDom.innerText = AWCoords.fromLatLngPretty(e.latlng);
        });

        return controlDom;
    }

});