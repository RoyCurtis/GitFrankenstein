/**
 * AlphaMapper - Utility functions for converting between coordinates, latlongs, etc.
 *
 * Code originally by Byte and Ima Genius. Updated to Leaflet.js by Roy Curtis.
 * License unknown.
 */

/**
 * A tuple, representing Active Worlds coordinates, where:
 *
 * • Index 0 is latitude (north-south), where south is positive
 * • Index 1 is longitude (west-east), where east is positive
 *
 * @typedef {number[]} AWCoords
 */

/**
 * Regex pattern for matching coordinate strings, where:
 *
 * • Group 1 is numerical value of latitude
 * • Group 2 is north/south indicator
 * • Group 3 is numerical value of longitude
 * • Group 4 is west/east indicator
 *
 * @type {RegExp}
 */
var REGEX_COORDS = /^(\d{1,5}(?:\.\d{1,5})?)([NS])\s*(?:(\d{1,5}(?:\.\d{1,5})?)([WE]))?$/mi;

/**
 * Scale factor for converting between lat/long and AW coordinates.
 *
 * 65536 is the max. diameter of the entire map in decameters (aka cells or coords)...
 * Divide it by tile size 320, and we get the scale (how many cells make up one map unit).
 *
 * @const
 * @type {number}
 */
var LATLNG2COORDS = 65536 / 320;

/**
 * Converts a given latitude and longitude to Active Worlds coordinates.
 *
 * Conversion notes:
 * Latitude goes from 0 to -320 from north to south
 * Longitude goes from 0 to 320 from west to east
 *
 * @param {L.LatLng} latlng
 * @returns {AWCoords}
 */
function latLng2Coords(latlng)
{
    // First, convert the lat/longs to something more sane
    // Makes it so lat/lng 0/0 is ground zero and south-east is positive
    var lat = Math.abs(latlng.lat) - 160;
    var lng = latlng.lng - 160;

    // Scale the lat/longs and round them
    lat = Math.round(lat * LATLNG2COORDS);
    lng = Math.round(lng * LATLNG2COORDS);

    // Finally, clamp them so they don't go beyond AW's limits
    lat = Math.min(Math.max(lat, -32767), 32767);
    lng = Math.min(Math.max(lng, -32767), 32767);

    return [lat, lng];
}

/**
 * Converts a given latitude and longitude to a pretty-formatted AW coordinate string.
 *
 * @param {L.LatLng} latlng
 * @returns {string}
 */
function latLng2PrettyCoords(latlng)
{
    var coords = latLng2Coords(latlng);

    return coords2PrettyCoords(coords);
}

/**
 * Converts given coords into latitude and longitude for Leaflet.
 *
 * @param {AWCoords} coords
 * @returns {L.LatLng}
 */
function coords2LatLng(coords)
{
    // First, convert the lat/longs to something more sane
    // Makes it so lat/lng 0/0 is ground zero and south-east is positive
    // var lat = Math.abs(latlng.lat) - 160;
    // var lng = latlng.lng - 160;

// * Conversion notes:
// * Latitude goes from 0 to -320 from north to south
// * Longitude goes from 0 to 320 from west to east

    // First, scale the coordinates back to lat/longs
    var lat = coords[0] / LATLNG2COORDS;
    var lng = coords[1] / LATLNG2COORDS;

    // Finally, offset values back to lat/long ranges
    lat += 160;
    lat *= -1;
    lng += 160;

    return L.latLng(lat, lng);
}

/**
 * Converts the given coords into a human (and AW) readable string
 *
 * @param {AWCoords} coords
 * @returns {string}
 */
function coords2PrettyCoords(coords)
{
    return "" +
        Math.abs(coords[0]) + (coords[0] < 0 ? "N" : "S") + " " +
        Math.abs(coords[1]) + (coords[1] < 0 ? "W" : "E");
}

/**
 * Parses a given string into coordinates
 *
 * @param {string} str
 * @return {AWCoords}
 */
function parseCoords(str)
{
    var matches = str.trim().match(REGEX_COORDS);

    // Using parseInt to discard decimal numbers; don't need them
    var lat = parseInt(matches[1]);
    var lng = matches[3] ? parseInt(matches[3]) : 0;

    if (matches[2].toLowerCase() === 'n')
        lat *= -1;

    if (matches[4] && matches[4].toLowerCase() === 'w')
        lng *= -1;

    return [lat, lng];
}