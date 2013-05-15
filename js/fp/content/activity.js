
/**
 * @fileoverview A component which represents a single activity.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.content.Activity');

goog.require('fp.content.ActionButton');
goog.require('fp.content.ButtonBar');
goog.require('fp.content.StreamComponent');
goog.require('fp.content.templates.activities');
goog.require('fp.css.Class');
goog.require('fp.data.Activity');
goog.require('fp.data.ActivityUtil');

goog.require('goog.events');
goog.require('goog.string');
goog.require('goog.ui.Component.EventType');
goog.require('soy');



/**
 * Represents a single content page.
 * @param {fp.data.Activity=} opt_data If this activity will be created from
 *    scratch rather than decorating an existing activity, pass the activity's
 *    data object as a parameter.
 * @extends {fp.content.StreamComponent}
 * @constructor
 */
fp.content.Activity = function(opt_data) {
  goog.base(this);

  /** @private @type {fp.data.Activity} */
  this.data_ = opt_data || null;

  /** @private @type {fp.content.ButtonBar} */
  this.buttonBar_ = null;

  /** @private @type {Array.<fp.content.Comment>} */
  this.comments_ = [];

  if (!!opt_data) {
    this.setId(opt_data.id);
    this.setUrl(opt_data.url);
    this.setTimestamp(opt_data.published);
  }
};
goog.inherits(fp.content.Activity, fp.content.StreamComponent);


/**
 * The attribute which will be used to check if an element has already been
 * decorated by a component.
 * @const @type {string}
 */
fp.content.Activity.DECORATED_TAG = 'data-fp-decorated';


/** @override */
fp.content.Activity.prototype.createDom = function() {
  if (goog.isNull(this.data_)) {
    this.data_ = fp.data.ActivityUtil.ERROR_ACTIVITY;
  }

  this.setElementInternal(soy.renderAsElement(
      fp.content.templates.activities.activity, {data: this.data_}));

  this.buttonBar_ = new fp.content.ButtonBar();
  // this.buttonBar_.decorate(this.getElement().querySelector(
  //     '.' + fp.css.Class.STREAM_COMPONENT_FOOT));

  this.enableCustomMenuInternal(this.getElement().querySelector(
      '.' + fp.css.Class.STREAM_COMPONENT_OPTIONS_MENU_CONTAINER));
};


/** @override */
fp.content.Activity.prototype.canDecorate = function(element) {
  return goog.string.startsWith(element.id || '', 'update-') &&
      element.getAttribute(fp.content.Activity.DECORATED_TAG) !== 'true';
};


/** @override */
fp.content.Activity.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  // Extract ID
  this.setId(element.id.substring(element.id.lastIndexOf('-') + 1));

  // Extract URL & Timestamp
  var permalink = element.querySelector('a[href*="/posts/"]');
  if (!!permalink) {
    this.setUrl(permalink.href);
    this.setTimestamp(Date.parse(permalink.title));
  }

  // Find the Button Box and decorate it
  var buttonContainer = element.querySelector('div[id^="po-"]').parentNode;
  this.buttonBar_ = new fp.content.ButtonBar();
  this.buttonBar_.decorate((/** @type {Element} */ buttonContainer));

  // Remember decoration
  element.setAttribute(fp.content.Activity.DECORATED_TAG, 'true');
};
