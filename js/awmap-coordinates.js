/**
 * AlphaMapper - Utility functions for converting between coordinates, latlongs, etc.
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

/** Namespace for coordinate-related utility functions */
var AWCoords = {};

/**
 * A tuple, representing Active Worlds coordinates, where:
 *
 * • Index 0 is latitude (north-south), where south is positive
 * • Index 1 is longitude (west-east), where east is positive
 *
 * @typedef {number[]} AWCoord
 */

/**
 * Converts a given latitude and longitude to Active Worlds coordinates.
 *
 * Conversion notes:
 * Latitude goes from 0 to -320 from north to south
 * Longitude goes from 0 to 320 from west to east
 *
 * @param {L.LatLng} latlng
 * @returns {AWCoord}
 */
AWCoords.fromLatLng = function(latlng)
{
    // First, convert the lat/longs to something more sane
    // Makes it so lat/lng 0/0 is ground zero and south-east is positive
    var lat = Math.abs(latlng.lat) - 160;
    var lng = latlng.lng - 160;

    // 65535 is the max. diameter of the entire map in decameters (aka cells or coords)...
    // Divide it by tile size 320, and we get the scale. Or, how many cells make up one
    // map unit.
    var scale = 65535 / 320;

    // Scale the lat/longs and round them
    lat = Math.round(lat * scale);
    lng = Math.round(lng * scale);

    // Finally, clamp them so they don't go beyond AW's limits
    lat = Math.min(Math.max(lat, -32767), 32767);
    lng = Math.min(Math.max(lng, -32767), 32767);

    return [lat, lng];
};

/**
 * Converts a given latitude and longitude to a pretty-formatted AW coordinate string.
 *
 * @param {L.LatLng} latlng
 * @returns {string}
 */
AWCoords.fromLatLngPretty = function(latlng)
{
    var coords = AWCoords.fromLatLng(latlng);

    return "" +
        Math.abs(coords[0]) + (coords[0] < 0 ? "N" : "S") + " " +
        Math.abs(coords[1]) + (coords[1] < 0 ? "W" : "E");
};