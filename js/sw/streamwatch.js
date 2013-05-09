
/**
 * @fileoverview The main entry point into the StreamWatch script.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.StreamWatch');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.dom.query');
goog.require('goog.events');
goog.require('goog.ui.Component.EventType');



/**
 * Launches the application.
 * @constructor
 */
sw.StreamWatch = function() {
  window.console.log('Hello, World!');
};


/** @type {sw.StreamWatch} */
window.streamWatch = new sw.StreamWatch();
