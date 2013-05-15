
/**
 * @fileoverview The base class for all data sources.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.data.DataSource');
goog.provide('sw.data.DataSourceEvent');

goog.require('fp.content.StreamComponent');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');



/**
 * @param {string} title The source's title.
 * @param {string} iconClass The class of the icon representing the source type.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
sw.data.DataSource = function(title, iconClass) {
  goog.base(this);

  /** @private @type {string} */
  this.title_ = title;

  /** @private @type {string} */
  this.iconClass_ = iconClass;

  /** @private @type {number} */
  this.interval_ = sw.data.DataSource.DEFAULT_INTERVAL;

  /** @private @type {number?} */
  this.timer_ = null;

  /** @private @type {boolean} */
  this.enabled_ = true;

  /** @private @type {Array.<fp.content.StreamComponent>} */
  this.queue_ = [];

  /** @private @type {Object.<string, boolean>} */
  this.seen_ = {};

  // Start the timer
  this.setEnabled(true);
};
goog.inherits(sw.data.DataSource, goog.events.EventTarget);


/**
 * The default polling interval in milliseconds.
 * @type {number}
 */
sw.data.DataSource.DEFAULT_INTERVAL = 60000;


/**
 * Possible event types dispatched by this class.
 * @enum {string}
 */
sw.data.DataSourceEvent = {
  CREATE: 'c',
  DATA_ADDED: 'a',
  DISPOSE: 'd',
  ENABLED: 'e',
  DISABLED: 'di'
};


/**
 * @return {string} The source's title.
 */
sw.data.DataSource.prototype.getTitle = function() {
  return this.title_;
};


/**
 * @return {string} THe source's icon class.
 */
sw.data.DataSource.prototype.getIcon = function() {
  return this.iconClass_;
};


/**
 * Sets the interval in which the source will be polled. Has no effect on
 * data-sources that are push based.
 * @param {number} interval The polling interval in milliseconds.
 */
sw.data.DataSource.prototype.setUpdateInterval = function(interval) {
  this.interval_ = interval;

  // Reconfigure the timer
  this.setEnabled(this.isEnabled());
};


/**
 * @return {boolean} Whether the source is currently enabled.
 */
sw.data.DataSource.prototype.isEnabled = function() {
  return this.enabled_;
};


/**
 * Used to enable or disable the data source.
 * @param {boolean} enabled Whether to enable the source.
 */
sw.data.DataSource.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;

  // Stop the timer, if any
  if (!!this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }

  // Start a new one if enabled is true
  if (enabled) {
    this.timer = setInterval(goog.bind(this.update, this), this.interval_);
  }

  // Notify listeners
  this.dispatchEvent(new goog.events.Event(enabled ?
      sw.data.DataSourceEvent.ENABLED : sw.data.DataSourceEvent.DISABLED,
      this));
};


/**
 * Updates the data source. Should be overridden by implementing classes.
 */
sw.data.DataSource.prototype.update = function() {
  /* Override me! */
};


/**
 * Adds the activity to the internal queue and notifies listeners. Should not
 * be called by external objects.
 * @param {fp.content.StreamComponent} streamComponent The activity to add.
 * @protected
 */
sw.data.DataSource.prototype.enqueue = function(streamComponent) {
  if (!this.hasSeen(streamComponent.getId())) {
    this.queue_.push(streamComponent);
    this.seen_[streamComponent.getId()] = true;

    // Notify listeners
    this.dispatchEvent(new goog.events.Event(
        sw.data.DataSourceEvent.DATA_ADDED, this));
  }
};


/**
 * @return {fp.content.StreamComponent} The next StreamComponent in the queue or
 * null if there isn't any.
 */
sw.data.DataSource.prototype.dequeue = function() {
  return this.queue_.length > 0 ? this.queue_.shift() : null;
};


/**
 * Removes all elements from the queue and returns them in the order from oldest
 * to most recent.
 * @return {Array.<fp.content.StreamComponent>} All elements in the queue.
 */
sw.data.DataSource.prototype.flush = function() {
  var components = this.queue_;
  this.queue_ = [];
  return components;
};


/**
 * @param {string} id The ID to check.
 * @return {boolean} Whether an activity with the given ID has ever been seen
 * in this data source.
 */
sw.data.DataSource.prototype.hasSeen = function(id) {
  return !!this.seen_[id];
};



