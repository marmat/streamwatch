
/**
 * @fileoverview A component which represents a single comment.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.content.Comment');

goog.require('fp.content.ActionButton');
goog.require('fp.content.StreamComponent');
goog.require('fp.content.templates.comments');
goog.require('fp.data.Comment');
goog.require('fp.data.CommentUtil');

goog.require('goog.events');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('soy');



/**
 * @param {fp.data.Comment=} opt_data A comment data object if we want to
 *    render an entirerly new comment.
 * @extends {fp.content.StreamComponent}
 * @constructor
 */
fp.content.Comment = function(opt_data) {
  goog.base(this);

  /** @private @type {fp.data.Comment} */
  this.data_ = opt_data || null;

  if (!!opt_data) {
    this.setId(opt_data.id);
    this.setUrl(opt_data.inReplyTo.url);
    this.setTimestamp(opt_data.published);
  }
};
goog.inherits(fp.content.Comment, fp.content.StreamComponent);


/** @override */
fp.content.Comment.prototype.createDom = function() {
  if (goog.isNull(this.data_)) {
    this.data_ = fp.data.CommentUtil.ERROR_COMMENT;
  }

  this.setElementInternal(soy.renderAsElement(
      fp.content.templates.comments.comment, {data: this.data_}));

  this.enableCustomMenuInternal(this.getElement().querySelector(
      '.' + fp.css.Class.STREAM_COMPONENT_OPTIONS_MENU_CONTAINER));
};


/** @override */
fp.content.Comment.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  // Extract ID
  this.setId(element.id);

  // Extract Timestamp
  var timestamp = element.id.substring(element.id.lastIndexOf('#') + 1);
  this.setTimestamp(
      Math.floor(goog.string.toNumber(timestamp) / 1000) || Date.now());

  var plusOneButtonEl = element.querySelector('button');
  if (!!plusOneButtonEl) {
    // Decorate the +1 button to catch events if desired
    this.plusOneButton_ = new fp.content.ActionButton();
    this.addChild(this.plusOneButton_);
    this.plusOneButton_.decorate(plusOneButtonEl);
  }
};
