
/**
 * @fileoverview Everything about options.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.content.Option');
goog.provide('fp.content.OptionsMenu');

goog.require('fp.css.Class');

goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');


/**
 * Common items for the custom options menu of a stream component.
 * @enum {string}
 */
fp.content.Option = {
  REMOVE_ALL: 'o-rma'
};



/**
 * @extends {goog.ui.Component}
 * @constructor
 */
fp.content.OptionsMenu = function() {
  goog.base(this);

  /** @private @type {goog.ui.Menu} */
  this.menu_ = new goog.ui.Menu();
  var items = [
    [fp.content.Option.REMOVE_ALL, 'Remove from Favorites']
  ];

  goog.array.forEach(items, function(item) {
    this.addItem(item[0], item[1]);
  }, this);

  // Create the node which will contain our icon
  var buttonEl = goog.dom.createDom('div',
      fp.css.Class.STREAM_COMPONENT_OPTIONS_MENU);

  /** @private @type {goog.ui.MenuButton} */
  this.button_ = new goog.ui.MenuButton(buttonEl, this.menu_,
      goog.ui.FlatButtonRenderer.getInstance());
  this.button_.setAlignMenuToStart(false);
};
goog.inherits(fp.content.OptionsMenu, goog.ui.Component);


/** @override */
fp.content.OptionsMenu.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  goog.dom.classlist.add(this.menu_.getElement(), 'fpOptionsMenu');
  this.addChild(this.button_, true);
};


/**
 * A helper function to add new menu items to the custom menu (if existent)
 * without having to create the components themselves.
 * @param {string} id Identifier for the menu item. Should be unique.
 * @param {string} caption Text to show as menu item text.
 */
fp.content.OptionsMenu.prototype.addItem = function(id, caption) {
  var item = new goog.ui.Control(caption);
  item.setId(id);
  this.menu_.addChild(item, true);
};
