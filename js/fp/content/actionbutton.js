
/**
 * @fileoverview Represents a single button in the ButtonBar.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.content.ActionButton');

goog.require('fp.content.templates.buttons');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');



/**
 * Starts the injection into the Google+ UI.
 * @param {string=} opt_iconClass The icon class to use for this button, if it's
 *    going to be created from scratch.
 * @param {string=} opt_tooltip The tooltip to show for this button.
 * @param {boolean=} opt_small Whether to render the button in a small version.
 * @extends {goog.ui.Control}
 * @constructor
 */
fp.content.ActionButton = function(opt_iconClass, opt_tooltip, opt_small) {
  goog.base(this, null);

  /** @private @type {string} */
  this.iconClass_ = opt_iconClass || '';

  /** @private @type {?string} */
  this.tooltip_ = opt_tooltip || null;

  /** @private @type {boolean} */
  this.small_ = opt_small || false;
};
goog.inherits(fp.content.ActionButton, goog.ui.Control);


/** @override */
fp.content.ActionButton.prototype.isSupportedState = function(state) {
  return state === goog.ui.Component.State.FOCUSED ? false :
      goog.base(this, 'isSupportedState', state);
};


/** @override */
fp.content.ActionButton.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  if (!!element.id) {
    this.setId(element.id);
  }
};


/** @override */
fp.content.ActionButton.prototype.createDom = function() {
  this.setElementInternal(soy.renderAsElement(
      fp.content.templates.buttons.actionButton, {
        iconClass: this.iconClass_,
        tooltip: this.tooltip_,
        small: this.small_
      }));
};


/**
 * Sets or updates the Tooltip text.
 * @param {?string} tooltip The new tooltip to show, or null if it should be
 *    hidden.
 */
fp.content.ActionButton.prototype.setTooltip = function(tooltip) {
  this.tooltip_ = tooltip;
  var attribute = this.small_ ? 'title' : 'data-tooltip';

  if (this.isInDocument()) {
    var element = this.getElement();

    if (!!tooltip) {
      element.setAttribute(attribute, tooltip);
      element.setAttribute('aria-label', tooltip);
    } else {
      element.removeAttribute(attribute);
      element.removeAttribute('aria-label');
    }
  }
};
