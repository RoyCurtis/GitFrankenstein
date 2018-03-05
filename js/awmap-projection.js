// ====== Create the Euclidean Projection for the flat map ======
// == Constructor ==
function AWProjection(zoomLevels, tileSize)
{
    this.pixelsPerLonDegree = [];
    this.pixelsPerLonRadian = [];
    this.degreesPerPixel    = [];
    this.pixelOrigo         = [];
    this.tileBounds         = [];
    this.tileSize           = tileSize;
    this.map                = {};

    var tileModifier = tileSize;
    var tileBounds   = 1;

    for(var i = 0; i < zoomLevels; i++)
    {
        var origo = tileModifier / 2;
        this.pixelsPerLonDegree.push(1024*Math.pow(2,i-11)*10);
        this.pixelOrigo.push(new google.maps.Point(origo, origo));
        this.tileBounds.push(tileBounds);
        tileModifier *= 2;
        tileBounds *= 2
    }
}

AWProjection.prototype.attachMap = function(map)
{
    this.map = map;
};

// == A method for converting latitudes and longitudes to pixel coordinates ==
AWProjection.prototype.fromLatLngToPoint = function(latlng, opt_point)
{
    console.log("fromLatLngToPoint", latlng.lat(), latlng.lng(), opt_point);
    var point = opt_point || new google.maps.Point(0, 0);
    var zoom  = this.map.getZoom();

    point.x = Math.round(this.pixelOrigo[zoom].x + (-1 * latlng.lng()) * this.pixelsPerLonDegree[zoom]);
    point.y = Math.round(this.pixelOrigo[zoom].y + (-1 * latlng.lat()) * this.pixelsPerLonDegree[zoom]);

    return point;
};

// == a method for converting pixel coordinates to latitudes and longitudes ==
AWProjection.prototype.fromPointToLatLng = function(point, unbounded)
{
    console.log("fromPointToLatLng", point, unbounded);
    var zoom = this.map.getZoom();

    var lng = -1 * (point.x - this.pixelOrigo[zoom].x) / this.pixelsPerLonDegree[zoom];
    var lat = -1 * (point.y - this.pixelOrigo[zoom].y) / this.pixelsPerLonDegree[zoom];

    // return new google.maps.LatLng(lat, lng, unbounded);
    return new google.maps.LatLng(0, 0, false);
};

// == a method that checks if the y value is in range, and wraps the x value ==
AWProjection.prototype.tileCheckRange = function(tile, zoom, tileSize)
{
    var d = this.tileBounds[zoom];

    if (tile.y < 0 || tile.y >= d)
        return false;

    if (tile.x < 0 || tile.x >= d)
        return false;

    return true;
};

// == a method that returns the width of the tilespace ==
AWProjection.prototype.getWrapWidth = function(zoom)
{
    return this.tileBounds[zoom]*this.tileSize;
    //return Math.pow(2,zoom)*this.tileSize;
};