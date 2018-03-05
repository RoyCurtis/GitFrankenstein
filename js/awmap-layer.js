var AlphaWorldLayer = L.TileLayer.extend({
    options: {
        errorTileUrl: "http://maptiles.imabot.com/alphaworld/blank.png",

        maxZoom:  10,
        noWrap:   true,
        tileSize: 320
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