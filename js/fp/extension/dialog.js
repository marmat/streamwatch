
/**
 * @fileoverview A generic dialog utility class.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.extension.Dialog');

goog.require('fp.extension.templates.common');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Component');
goog.require('soy');



/**
 * Ideally this would extend from goog.ui.ModalDialog, but since some parts of
 * Google+ actually use uncompiled Modal Dialogs as well, this might cause some
 * problems with overloaded CSS. Therefore we use this custom implementation.
 * @param {string=} opt_title Title to show.
 * @param {string=} opt_description Description to show.
 * @extends {goog.ui.Component}
 * @constructor
 */
fp.extension.Dialog = function(opt_title, opt_description) {
  goog.base(this);

  /** @private @type {string?} */
  this.title_ = opt_title;

  /** @private @type {string?} */
  this.description_ = opt_description;

  /** @private @type {goog.ui.Component} */
  this.content_ = new goog.ui.Component();
  this.addChild(this.content_);
};
goog.inherits(fp.extension.Dialog, goog.ui.Component);


/** @override */
fp.extension.Dialog.prototype.createDom = function() {
  this.setElementInternal(soy.renderAsElement(
      fp.extension.templates.common.dialog, {
        title: this.title_,
        description: this.description_
      }));

  this.content_.decorate(this.getElement().querySelector('.fpDialogContent'));
};


/** @override */
fp.extension.Dialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var closeButton = this.getElement().querySelector('.fpDialogClose');
  goog.events.listen(closeButton, goog.events.EventType.CLICK, this.dispose,
      false, this);
};


/** @override */
fp.extension.Dialog.prototype.render = function(opt_parent) {
  // Render ALWAYS in the body and ignore the given container
  goog.base(this, 'render');
};


/**
 * Adds an element to the content part of this dialog
 * @param {goog.ui.Component} child The child component to add.
 * @param {boolean=} opt_render Whether to render the component.
 */
fp.extension.Dialog.prototype.addContentChild = function(child, opt_render) {
  this.content_.addChild(child, opt_render);
};
