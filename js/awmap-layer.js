/**
 * AlphaMapper - Custom TileLayer class for loading AlphaMapper tiles
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

/**
 * Custom TileLayer class for loading AlphaMapper tiles with a fallback.
 *
 * @type {FallbackTileLayer}
 */
var AWLayer = FallbackTileLayer.extend({

    options: {
        // Restricts tile loading to 320x320 area (entire map at zoom 0)
        bounds: L.latLngBounds(
            L.latLng( -320, 0),
            L.latLng(    0, 320)
        ),

        errorTileUrl: "http://maptiles.imabot.com/alphaworld/blank.png",
        maxZoom:      MAX_ZOOM,
        noWrap:       true,
        tileSize:     320
    },

    getTileUrl: function(coords)
    {
        if (coords.z < 6)
            return "http://maptiles.imabot.com/alphaworld/upper/"
                + (coords.z) + "_"
                + (coords.x) + "_"
                + (coords.y) + ".png";
        else
        {
            var workx = Math.floor( (coords.x) / Math.pow(2, coords.z - 6) );
            var worky = Math.floor( (coords.y) / Math.pow(2, coords.z - 6) );

            return "http://maptiles.imabot.com/alphaworld/"
                + workx + "_"
                + worky + "/"
                + coords.z + "_"
                + coords.x + "_"
                + coords.y + ".png";
        }
    },

    getAttribution: function()
    {
        return "(C) 2009 <a href='http://www.imabot.com/'>ImaBot</a>, originally " +
            "from <a href='http://www.imabot.com/alphamapper/'>AlphaMapper</a>"
    }
});