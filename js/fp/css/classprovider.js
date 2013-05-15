
/**
 * @fileoverview The ClassProvider holds all CSS classes used in this extension
 * in order not to have constant strings scattered all around the code.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.css.Class');
goog.provide('fp.css.ClassProvider');



/**
 * The default implementation of a ClassProvider, just returns our
 * application specific CSS classes.
 * @constructor
 */
fp.css.ClassProvider = function() {
  // Do nothing
};
goog.addSingletonGetter(fp.css.ClassProvider);


/**
 * A list of all CSS classes used in this extension.
 * @enum {string}
 */
fp.css.Class = {
  CONTEXT_NOTIFICATIONS: 'fpContextNotifications',
  CONTEXT_STREAMWIDGETS: 'fpContextStreamwidgets',
  STREAM_COMPONENT_HOVER: 'fpStreamComponentHovered',
  STREAM_COMPONENT_FOOT: 'fpStreamComponentContentFoot',
  STREAM_COMPONENT_OPTIONS_MENU: 'fpStreamComponentOptionsMenu',
  STREAM_COMPONENT_OPTIONS_MENU_CONTAINER:
      'fpStreamComponentOptionsMenuContainer',
  SIDEBAR_BUTTON_ICON: 'fpSidebarButtonIcon',
  SIDEBAR_BUTTON_LABEL: 'fpSidebarButtonLabel',
  SIDEBAR_BUTTON_SELECTED: 'fpSidebarButtonSelected'
};


/**
 * @param {fp.css.Class} className The class which should be looked up.
 * @return {string} The application specific CSS class for the given identifier.
 */
fp.css.ClassProvider.prototype.getClass = function(className) {
  return className;
};
