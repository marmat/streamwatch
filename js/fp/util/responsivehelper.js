
/**
 * @fileoverview A helper class that offers some static methods to deal with the
 * responsive layout behavior.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.util.ResponsiveHelper');


/**
 * The default padding which is always there.
 * @const @type {number}
 */
fp.util.ResponsiveHelper.CONTENT_PADDING = 13;


/**
 * Height of the gray+black header bars.
 * @const @type {number}
 */
fp.util.ResponsiveHelper.HEADER_HEIGHT = 100;


/**
 * Height of a content-specific menubar.
 * @const @type {number}
 */
fp.util.ResponsiveHelper.MENUBAR_HEIGHT = 58;


/**
 * The minimal window width for the expanded layout.
 * @private @const @type {number}
 */
fp.util.ResponsiveHelper.MIN_INNER_WIDTH_ = 1060;


/**
 * The minimal window height for the expanded layout with fixed menu bar.
 * @private @const @type {number}
 */
fp.util.ResponsiveHelper.MIN_INNER_HEIGHT_ = 840;


/**
 * @param {boolean=} opt_menuBar Whether the page has a responsive menuBar.
 * @return {number} The offset in pixels where content shall start.
 */
fp.util.ResponsiveHelper.getPageContentOffset = function(opt_menuBar) {
  var offset = fp.util.ResponsiveHelper.CONTENT_PADDING;
  if (window.innerWidth >= fp.util.ResponsiveHelper.MIN_INNER_WIDTH_) {
    offset += fp.util.ResponsiveHelper.HEADER_HEIGHT;

    if ((!!opt_menuBar) &&
        (window.innerHeight >= fp.util.ResponsiveHelper.MIN_INNER_HEIGHT_)) {
      offset += fp.util.ResponsiveHelper.MENUBAR_HEIGHT;
    }
  }

  return offset;
};
