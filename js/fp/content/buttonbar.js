
/**
 * @fileoverview A component which represents the button bar inside an activity.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.content.ButtonBar');

goog.require('fp.content.ActionButton');

goog.require('goog.dom');
goog.require('goog.ui.Component');



/**
 * Represents the button bar inside an activity.
 * @extends {goog.ui.Component}
 * @constructor
 */
fp.content.ButtonBar = function() {
  goog.base(this);
};
goog.inherits(fp.content.ButtonBar, goog.ui.Component);


/** @override */
fp.content.ButtonBar.prototype.decorate = function(element) {
  goog.base(this, 'decorate', element);

  // Decorate existing buttons and right hand side menu
  var children = goog.dom.getChildren(element);
  if (children.length > 0) {
    // Add the actual buttons
    for (var i = 0; i < children.length - 1; i++) {
      var button = new fp.content.ActionButton();
      button.decorate(children[i]);
      this.addChildAt(button, i);
    }

    // The right hand side menu should not be an actionButton
    var rhs = new goog.ui.Component();
    rhs.decorate(children[children.length - 1]);
    this.addChildAt(rhs, children.length - 1);
  }
};


/** @override */
fp.content.ButtonBar.prototype.addChild = function(child, opt_render) {
  // We want to place new children to the last-but-one position in order not
  // to mess up the right hand side action area.
  this.addChildAt(child, this.getChildCount() - 1, opt_render);
};
