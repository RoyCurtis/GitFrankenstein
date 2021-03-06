/**
 * Sleep charter, IDE JSDoc definitions
 * Roy Curtis, MIT license, 2017
 *
 * This file is simply for IDEs (e.g. WebStorm). It defines types using JSDoc, to improve
 * autocompletion, warnings, etc.
 */

/*
 * Chart types
 */

/**
 * Hierarchical container for the day bars that make up the chart. Structured as:
 *
 * * Integer index to a year's DIV element (e.g. `dayBars[2017]`)
 * * Integer index to a month's DIV element (e.g. `dayBars[2017][2]`)
 * * Integer index to a day's DIV element (e.g. `dayBars[2017][2][26]`)
 *
 * @typedef {Object.<number, (DayBars~Month|HTMLElement)>} DayBars
 */

/**
 * A DIV element held by a year container, that contains day bars.
 *
 * @typedef {Element.<number, DayBars~Day>} DayBars~Month
 */

/**
 * A DIV element held by a month container, that contains sleep bars.
 *
 * @typedef {HTMLElement} DayBars~Day
 */

/**
 * A DIV element that represents a sleep event on the chart
 *
 * @typedef {Element} SleepBar
 * @prop {Date} from Gets the start date and time of this sleep bar's event
 * @prop {Date} to Gets the end date and time of this sleep bar's event
 * @prop {?boolean} isTopBar Whether this is a top bar, if this bar is split across days
 * @prop {?SleepBar} pairedBar Gets the paired bar, if this bar is split across days
 * @prop {?boolean} isPrediction Whether this bar's event is a prediction
 */

/**
 * A tuple for a sleep event. First and second elements are start and end dates.
 *
 * @typedef {[Date, Date]} SleepEvent
 * @prop {boolean} isPrediction Whether this event is a prediction
 */

/*
 * Vendor types
 */

// The following is necessary because WebStorm cannot correctly analyse fetch.js

/** Begins an asynchronous fetch for an external resource */
var fetch   = function() {};
/** Chains a callback to execute after the fetch, or a prior callback, is done */
fetch.then  = function() {};
/** Chains a callback to execute if the fetch, or any callbacks, throw an error */
fetch.catch = function() {};