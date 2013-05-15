
/**
 * @fileoverview A closure wrapper for the MutationObserver class.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.util.MutationObserver');
goog.provide('fp.util.MutationObserver.EventType');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');



/**
 * @param {Node} node The node to observe.
 * @param {MutationObserverInit=} opt_configuration An object
 *    specifying what to observe.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
fp.util.MutationObserver = function(node, opt_configuration) {
  goog.base(this);

  /** @private @type {MutationObserver} */
  this.observer_ = new window.WebKitMutationObserver(
      goog.bind(this.onMutation, this));

  this.observer_.observe(node, opt_configuration);
};
goog.inherits(fp.util.MutationObserver, goog.events.EventTarget);


/** @enum {string} */
fp.util.MutationObserver.EventType = {
  ATTRIBUTE_CHANGED: 't',
  CHARACTER_DATA_CHANGED: 'c',
  NODE_ADDED: 'a',
  NODE_REMOVED: 'r'
};


/** @override */
fp.util.MutationObserver.prototype.dispose = function() {
  this.observer_.disconnect();
  goog.base(this, 'dispose');
};


/**
 * A listener for the MutationObserver.
 * @param {Array.<MutationRecord>} mutations The mutations that occurred.
 */
fp.util.MutationObserver.prototype.onMutation = function(mutations) {
  goog.array.forEach(mutations, function(mutation) {
    switch (mutation['type']) {
      case 'childList':
        goog.array.forEach(mutation['addedNodes'], function(node) {
          this.dispatchEvent(new goog.events.Event(
              fp.util.MutationObserver.EventType.NODE_ADDED, node));
        }, this);
        goog.array.forEach(mutation['removedNodes'], function(node) {
          this.dispatchEvent(new goog.events.Event(
              fp.util.MutationObserver.EventType.NODE_REMOVED, node));
        }, this);
        break;
      case 'attributes':
        this.dispatchEvent(new goog.events.Event(
            fp.util.MutationObserver.EventType.ATTRIBUTE_CHANGED,
            mutation['target']));
      case 'characterData':
        this.dispatchEvent(new goog.events.Event(
            fp.util.MutationObserver.EventType.CHARACTER_DATA_CHANGED,
            mutation['target']));
    }
  }, this);
};
