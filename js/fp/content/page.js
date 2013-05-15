
/**
 * @fileoverview A generic component for decorating content pages. Can be used
 * to decorate pages provided by the Google+ UI.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.content.Page');

goog.require('goog.ui.Component');



/**
 * Represents a single content page.
 * @extends {goog.ui.Component}
 * @constructor
 */
fp.content.Page = function() {
  goog.base(this);
};
goog.inherits(fp.content.Page, goog.ui.Component);


/**
 * @return {boolean} Whether the page is currently visible.
 */
fp.content.Page.prototype.isVisible = function() {
  return !!this.getElement() &&
      !!this.getElement().parentNode &&
      this.getElement().style['display'] !== 'none' &&
      this.getElement().style['visibility'] !== 'hidden';
};


/**
 * Changes the visibility of this page.
 * @param {boolean} visible Whether the page shall be visible.
 */
fp.content.Page.prototype.setVisible = function(visible) {
  if (!!this.getElement()) {
    this.getElement().style['display'] = visible ? 'block' : 'none';
  }
};
