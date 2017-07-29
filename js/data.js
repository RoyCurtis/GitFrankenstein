/**
 * Sleep charter, data handlers
 * Roy Curtis, MIT license, 2017
 */

/**
 * Parses the given raw CSV data into an array of {@link SleepEvent}s
 *
 * @param {string} csv
 */
function parseCSV(csv)
{
    var lines = csv.split('\n');

    // Remove CSV header
    lines.shift();
    return lines.map(parseCSVLine);
}

/** @param {string} line */
function parseCSVLine(line)
{
    var ends  = line.split(','),
        begin = parseDate(ends[0]),
        end   = parseDate(ends[1]);

    // Validate date pair
    if (end.getTime() - begin.getTime() <= 0)
        throw new Error("End time is before begin time: " + line);

    return [begin, end];
}

/**
 * Parse Google Sheets default date format (DD/MM/YYYY HH:mm:ss) into Date object
 *
 * @param {string} date
 * @return {Date}
 */
function parseDate(date)
{
    var matches = date.match(GOOGLE_DATETIME_REGEX);

    if (!matches)
        throw new Error("Date/time failed to parse: " + date);
    else if (matches.index !== 0 || matches.length !== 7)
        throw new Error("Date/time parsed incorrectly: " + date);

    return new Date(
        matches[3], matches[2] - 1, matches[1],
        matches[4], matches[5], matches[6]
    );
}