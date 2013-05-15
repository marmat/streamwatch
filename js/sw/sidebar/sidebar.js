
/**
 * @fileoverview Injects a menu button into the Sidebar on the left.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.sidebar.Sidebar');

goog.require('fp.util.ShortcutHelper');
goog.require('fp.util.ShortcutHelper.EventType');

goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');

goog.require('sw.sidebar.MenuButton');



/**
 * Represents the decorated Sidebar menu
 * @extends {goog.ui.Component}
 * @constructor
 */
sw.sidebar.Sidebar = function() {
  goog.base(this);

  /** @private @type {fp.util.ShortcutHelper} */
  this.shortcutHelper_ = fp.util.ShortcutHelper.getInstance();
};
goog.inherits(sw.sidebar.Sidebar, goog.ui.Component);


/** @override */
sw.sidebar.Sidebar.prototype.decorate = function(element) {
  goog.base(this, 'decorate', element);

  // Add existing sidebar buttons as Components
  goog.array.forEach(goog.dom.getChildren(element), function(child) {
    var control = new sw.sidebar.MenuButton();
    control.decorate(child);
    this.addChild(control);
  }, this);
};


/** @override */
sw.sidebar.Sidebar.prototype.createDom = function() {
  this.setElementInternal(goog.dom.createDom('aside'));
};


/** @override */
sw.sidebar.Sidebar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  goog.dom.classlist.add(this.getElement(), 'swSidebar');
  this.shortcutHelper_.addEventListener(
      fp.util.ShortcutHelper.EventType.TOGGLE_SIDEBAR,
      this.onToggleSidebar, false, this);
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.sidebar.Sidebar.prototype.onToggleSidebar = function(event) {
  goog.dom.classlist.toggle(this.getElement(), 'swSidebarHidden');
};


/**
 * Slides the sidebar in or out.
 * @param {boolean} visible Whether the sidebar shall be visible.
 */
sw.sidebar.Sidebar.prototype.setVisible = function(visible) {
  goog.dom.classlist.enable(this.getElement(), 'swSidebarHidden', !visible);
};

