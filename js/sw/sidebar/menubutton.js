
/**
 * @fileoverview A MenuButton for usage in the Sidebar.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.sidebar.MenuButton');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');



/**
 * Starts the injection into the Google+ UI.
 * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
 *     to display as the content of the component (if any).
 * @param {string=} opt_iconClass A CSS class to add to the icon element.
 * @extends {goog.ui.Control}
 * @constructor
 */
sw.sidebar.MenuButton = function(opt_content, opt_iconClass) {
  goog.base(this, opt_content || null);

  /** @private @type {goog.ui.ControlContent} */
  this.content_ = opt_content || null;

  /** @private @type {string} */
  this.iconClass_ = opt_iconClass || '';

  /** @protected @type {Element} */
  this.iconElement = null;

  /** @protected @type {Element} */
  this.captionElement = null;
};
goog.inherits(sw.sidebar.MenuButton, goog.ui.Control);


/** @override */
sw.sidebar.MenuButton.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  // Remember references to the content parts of our button
  var buttonParts = element.querySelectorAll('a > div > div');
  this.iconElement = buttonParts[0];
  this.captionElement = buttonParts[1];
};


/** @override */
sw.sidebar.MenuButton.prototype.createDom = function() {
  this.iconElement = goog.dom.createDom('div',
      'swSidebarMenuButtonIcon ' + this.iconClass_);
  this.captionElement = goog.dom.createDom('div',
      'swSidebarMenuButtonCaption', this.content_);
  this.setElementInternal(goog.dom.createDom('div', 'swSidebarMenuButton',
      this.iconElement, this.captionElement));
};
