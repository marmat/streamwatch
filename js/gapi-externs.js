
/**
 * @fileoverview Custom Externs for the Google API JavaScript Client since
 * there doesn't seem to be any official ones.
 * Method signatures taken from
 * developers.google.com/api-client-library/javascript/reference/referencedocs
 * @author kaktus621@gmail.com (Martin Matysiak)
 * @externs
 */


/** @type {Object} */
var gapi = {};


/** @type {Object} */
gapi.auth = {};


/**
 * @param {Object} params A key/value map of parameters for the request.
 * @param {function(Object)} callback The function to call once the login
 *    process is complete.
 */
gapi.auth.authorize = function(params, callback) {};


// TODO: Do this for ALL the methods...


/** @type {Object} */
gapi.client = {};


/**
 * @param {string} name The name of the API to load.
 * @param {string} version The version of the API to load.
 * @param {function()=} opt_callback The function that is called once the API
 *    interface is loaded.
 */
gapi.client.load = function(name, version, opt_callback) {};


/** @type {Object} */
gapi.client.plus = {};


/** @type {Object} */
gapi.client.plus.activities = {};


/**
 * @param {Object} params The request parameters.
 * @return {Object} The request instance.
 */
gapi.client.plus.activities.list = function(params) {};


/** @type {Object} */
gapi.client.plus.people = {};


/**
 * @param {Object} params The request parameters.
 * @return {Object} The request instance.
 */
gapi.client.plus.people.get = function(params) {};
