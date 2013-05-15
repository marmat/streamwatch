
/**
 * @fileoverview A helper class that observes the website for keyboard
 * shortcuts and propagates them through the application.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.util.ShortcutHelper');
goog.provide('fp.util.ShortcutHelper.EventType');

goog.require('goog.dom.TagName');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');



/**
 * Singleton class!
 * @constructor
 * @extends {goog.events.EventTarget}
 */
fp.util.ShortcutHelper = function() {
  goog.base(this);

  /**
   * A map from keyCode to EventType
   * @private @type {Object.<number, fp.util.ShortcutHelper.EventType>}
   */
  this.keyMap_ = {
    74: fp.util.ShortcutHelper.EventType.NEXT_ELEMENT,
    75: fp.util.ShortcutHelper.EventType.PREVIOUS_ELEMENT,
    83: fp.util.ShortcutHelper.EventType.TOGGLE_SIDEBAR
  };

  goog.events.listen(document.body, goog.events.EventType.KEYDOWN,
      this.onKeyDown, false, this);
};
goog.inherits(fp.util.ShortcutHelper, goog.events.EventTarget);
goog.addSingletonGetter(fp.util.ShortcutHelper);


/** @enum {string} */
fp.util.ShortcutHelper.EventType = {
  NEXT_ELEMENT: 'ne',
  PREVIOUS_ELEMENT: 'pe',
  TOGGLE_SIDEBAR: 'si'
};


/** @override */
fp.util.ShortcutHelper.prototype.dispose = function() {
  goog.events.unlisten(document.body, goog.events.EventType.KEYDOWN,
      this.onKeyDown, false, this);
};


/**
 * @param {goog.events.Event} event The event object.
 */
fp.util.ShortcutHelper.prototype.onKeyDown = function(event) {
  if ((event.target.tagName !== goog.dom.TagName.INPUT) &&
      (event.target.tagName !== goog.dom.TagName.TEXTAREA) &&
      (!event.target.getAttribute('contenteditable')) &&
      (!!this.keyMap_[event.keyCode])) {
    this.dispatchEvent(
        new goog.events.Event(this.keyMap_[event.keyCode], event.target));
  }
};
