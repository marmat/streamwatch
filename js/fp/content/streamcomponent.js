
/**
 * @fileoverview A component which can be placed inside a stream.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.content.StreamComponent');

goog.require('fp.content.Option');
goog.require('fp.content.OptionsMenu');
goog.require('fp.css.Class');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.fx.dom.FadeOutAndHide');
goog.require('goog.fx.dom.ResizeHeight');
goog.require('goog.object');
goog.require('goog.ui.Component');



/**
 * @extends {goog.ui.Component}
 * @constructor
 */
fp.content.StreamComponent = function() {
  goog.base(this);

  /** @private @type {string} */
  this.url_ = '';

  /** @private @type {number} */
  this.timestamp_ = 0;

  /** @private @type {fp.content.OptionsMenu} */
  this.customMenu_ = null;

  /** @private @type {boolean} */
  this.mouseInside_ = false;
};
goog.inherits(fp.content.StreamComponent, goog.ui.Component);


/**
 * @param {number} timestamp The new timestamp to set.
 */
fp.content.StreamComponent.prototype.setTimestamp = function(timestamp) {
  this.timestamp_ = timestamp;
};


/**
 * Getter for the timestamp.
 * @return {number} Timestamp of this activity.
 */
fp.content.StreamComponent.prototype.getTimestamp = function() {
  return this.timestamp_;
};


/**
 * @param {string} url The new url to set.
 */
fp.content.StreamComponent.prototype.setUrl = function(url) {
  this.url_ = url;
};


/**
 * @return {string} The component's URL (permalink).
 */
fp.content.StreamComponent.prototype.getUrl = function() {
  return this.url_;
};


/**
 * Enables or disables the extension specific hover class on the element.
 * @param {boolean} hovered Whether to show the element in a hovered state.
 */
fp.content.StreamComponent.prototype.setHovered = function(hovered) {
  if (this.isInDocument()) {
    goog.dom.classlist.enable(this.getElement(),
        fp.css.Class.STREAM_COMPONENT_HOVER,
        this.mouseInside_ || hovered);
  }
};


/**
 * Creates a custom menu, prepopulated with an "Remove from Favorites" menu
 * item. This menu should only be used when rendering a component, not when
 * decorating an existing one.
 * @param {Element} element The element inside the activity which will hold
 *    the menu drop down button. If hidden, it will be set to being visible
 *    after the menu has been created.
 * @protected
 */
fp.content.StreamComponent.prototype.enableCustomMenuInternal =
    function(element) {
  if (!!this.customMenu_) {
    return;
  }

  this.customMenu_ = new fp.content.OptionsMenu();
  this.customMenu_.decorate(element);
  goog.events.listen(this.customMenu_, goog.ui.Component.EventType.ACTION,
      this.onOptionsMenuAction, false, this);
};


/** @override */
fp.content.StreamComponent.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  goog.events.listen(this.getElement(),
      [goog.events.EventType.MOUSEOVER, goog.events.EventType.MOUSEOUT],
      this.onMouseAction, false, this);
};


/**
 * Taken from goog.ui.Control.isMouseEventWithinElement_.
 * @param {goog.events.Event} event The event object.
 * @param {Element} element The ancestor element.
 * @return {boolean} Whether the event has a relatedTarget (the element the
 *     mouse is coming from) and it's a descendent of elem.
 * @private
 */
fp.content.StreamComponent.prototype.isMouseEventWithinElement_ =
    function(event, element) {
  return !!event.relatedTarget &&
      goog.dom.contains(element, event.relatedTarget);
};


/**
 * @param {goog.events.Event} event The event object.
 */
fp.content.StreamComponent.prototype.onMouseAction = function(event) {
  if (!this.isMouseEventWithinElement_(event, this.getElement())) {
    this.mouseInside_ = event.type === goog.events.EventType.MOUSEOVER;
    this.setHovered(this.mouseInside_);
  }
};


/**
 * @param {goog.events.Event} event The event object.
 */
fp.content.StreamComponent.prototype.onOptionsMenuAction = function(event) {
  switch (event.target.getId()) {
    case fp.content.Option.REMOVE_ALL:
      this.fadeOut();
      break;
  }
};


/**
 * Removes the component in an animated way.
 */
fp.content.StreamComponent.prototype.fadeOut = function() {
  new goog.fx.dom.ResizeHeight(
      this.getElement(), this.getElement().clientHeight, 0, 300).play();
  new goog.fx.dom.FadeOutAndHide(this.getElement(), 300).play();
};
