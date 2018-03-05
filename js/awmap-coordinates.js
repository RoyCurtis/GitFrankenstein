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
    var lat = latlng.lat + 160;
    var lng = latlng.lng - 160;

    // Scale the lat/longs and round them
    lat = Math.round(lat * LATLNG2COORDS);
    lng = Math.round(lng * LATLNG2COORDS);

    // Flip latitude's polarity
    lat *= -1;

    // Finally, clamp them so they don't go beyond AW's limits
    lat = Math.min(Math.max(lat, -32767), 32767);
    lng = Math.min(Math.max(lng, -32767), 32767);

    return [lat, lng];
}

/**
 * Converts a given latitude and longitude to a pretty-formatted AW coordinate string.
 *
 * @param {L.LatLng} latlng
 * @param {string= } delimiter
 * @returns {string}
 */
function latLng2PrettyCoords(latlng, delimiter)
{
    if (delimiter === undefined)
        delimiter = ' ';

    var coords = latLng2Coords(latlng);

    return coords2PrettyCoords(coords, delimiter);
}

/**
 * Converts given coords into latitude and longitude for Leaflet.
 *
 * @param {AWCoords} coords
 * @returns {L.LatLng}
 */
function coords2LatLng(coords)
{
    // First, scale the coordinates back to lat/longs
    var lat = coords[0] / LATLNG2COORDS;
    var lng = coords[1] / LATLNG2COORDS;

    // Flip latitude's polarity back
    lat *= -1;

    // Finally, offset values back to lat/long ranges
    lat -= 160;
    lng += 160;

    return L.latLng(lat, lng);
}

/**
 * Converts the given coords into a human (and AW) readable string
 *
 * @param {AWCoords} coords
 * @param {string= } delimiter
 * @returns {string}
 */
function coords2PrettyCoords(coords, delimiter)
{
    if (delimiter === undefined)
        delimiter = ' ';

    return "" +
        Math.abs(coords[0]) + (coords[0] < 0 ? "N" : "S") + delimiter +
        Math.abs(coords[1]) + (coords[1] < 0 ? "W" : "E");
}

/**
 * Parses a given string into coordinates. Invalid strings will return zero'd coordinates
 * where appropriate.
 *
 * @param {string} str
 * @return {AWCoords}
 */
function parseCoords(str)
{
    var matches = str.trim().match(REGEX_COORDS) || [];

    // Using parseInt to discard decimal numbers; don't need them
    var lat = matches[1] ? parseInt(matches[1]) : 0;
    var lng = matches[3] ? parseInt(matches[3]) : 0;

    if (matches[2] && matches[2].toLowerCase() === 'n')
        lat *= -1;

    if (matches[4] && matches[4].toLowerCase() === 'w')
        lng *= -1;

    return [lat, lng];
}

/** Parses the current URL's query string to coordinates and zoom */
function query2CoordsAndZoom()
{
    var result = {
        location: [0, 0],
        zoom:     DEFAULT_ZOOM
    };

    var query = window.location.search.substring(1);
    var parms = query.split('&');

    for (var i = 0; i < parms.length; i++)
    {
        var pos = parms[i].indexOf('=');

        if (pos <= 0)
            continue;

        var key   = parms[i].substring(0, pos).toLowerCase();
        var value = parms[i].substring(pos + 1);

        switch (key)
        {
            case "location":
                value = value.replace('_', ' ');
                result.location = parseCoords(value);
                break;

            case "zoom":
                var zoom = parseInt(value);

                if ( !isNaN(zoom) && zoom >= 0 && zoom <= MAX_ZOOM )
                    result.zoom = zoom;
                else
                    console.warn("Not a valid zoom:", value);

                break;
        }
    }

    return result;
}