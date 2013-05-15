
/**
 * @fileoverview Injects a menu button into the Sidebar on the left.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.sidebar.ButtonGroup');
goog.provide('sw.sidebar.ButtonGroupHeader');

goog.require('goog.ui.Component');



/**
 * Represents the decorated Sidebar menu
 * @extends {goog.ui.Component}
 * @constructor
 * @param {string} heading The heading to show.
 */
sw.sidebar.ButtonGroup = function(heading) {
  goog.base(this);

  /** @private @type {sw.sidebar.ButtonGroupHeader} */
  this.heading_ = new sw.sidebar.ButtonGroupHeader(heading);
  this.addChild(this.heading_, true);
};
goog.inherits(sw.sidebar.ButtonGroup, goog.ui.Component);


/** @override */
sw.sidebar.ButtonGroup.prototype.createDom = function() {
  this.setElementInternal(goog.dom.createDom('div', 'swSidebarButtonGroup'));
};



/**
 * A simple header element which can be used as a separator in a sidebar.
 * @extends {goog.ui.Component}
 * @constructor
 * @param {string} text The text to show.
 */
sw.sidebar.ButtonGroupHeader = function(text) {
  goog.base(this);

  /** @private @type {string} */
  this.text_ = text;
};
goog.inherits(sw.sidebar.ButtonGroupHeader, goog.ui.Component);


/** @override */
sw.sidebar.ButtonGroupHeader.prototype.createDom = function() {
  this.setElementInternal(
      goog.dom.createDom('div', 'swSidebarButtonGroupHeader', this.text_));
};
