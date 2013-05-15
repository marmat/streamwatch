
/**
 * @fileoverview The main entry point into the StreamWatch script.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.StreamWatch');
goog.provide('sw.StreamWatchDependency');

goog.require('fp.extension.Stream');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.ui.Component.EventType');

goog.require('sw.data.PlusCommentsSource');
goog.require('sw.data.PlusProfileSource');
goog.require('sw.data.PlusSearchSource');
goog.require('sw.data.PlusSourceConfigurationDialog');
goog.require('sw.data.SourceManager');
goog.require('sw.sidebar.Sidebar');
goog.require('sw.util.Settings');



/**
 * Launches the application.
 * @constructor
 */
sw.StreamWatch = function() {

  /** @private @type {Object.<sw.StreamWatchDependency, boolean>} */
  this.dependencies_ = {};
  this.dependencies_[sw.StreamWatchDependency.PLUS] = false;

  /** @private @type {sw.util.Settings} */
  this.settings_ = sw.util.Settings.getInstance();

  /** @private @type {sw.sidebar.Sidebar} */
  this.sidebar_ = new sw.sidebar.Sidebar();
  this.sidebar_.render();

  /** @private @type {fp.extension.Stream} */
  this.stream_ = new fp.extension.Stream();
  this.stream_.render();
  this.stream_.addPlaceholderChild();

  /** @private @type {sw.data.SourceManager} */
  this.sourceManager_ = null;

  /** @private @type {Array.<sw.data.DataSource>} */
  this.activeSources_ = [];

  /** @private @type {Array.<fp.content.StreamComponent} */
  this.pendingActivities_ = [];

  /** @private @type {number} */
  this.throttleTimer_ = setInterval(goog.bind(this.onInsertComponent, this),
      this.THROTTLE_DELAY);
};


/**
 * @enum {string}
 */
sw.StreamWatchDependency = {
  PLUS: 'plus'
};


/**
 * Time in milliseconds which will be taken between
 * adding two consecutive posts to the stream
 * @const @type {number}
 */
sw.StreamWatch.prototype.THROTTLE_DELAY = 5000;


/**
 * Indicates that an extenral dependency has finished loading. When all
 * dependencies are loaded, the application can start.
 * @param {sw.StreamWatchDependency} dependency The dependency which is now
 *    ready to use.
 */
sw.StreamWatch.prototype.onDependencyReady = function(dependency) {
  this.dependencies_[dependency] = true;
  if (goog.object.every(this.dependencies_, function(item) { return !!item })) {
    this.loadData_();
  }
};

// Export the method to make it usable from the outside
sw.StreamWatch.prototype['onDependencyReady'] =
    sw.StreamWatch.prototype.onDependencyReady;


/** @private */
sw.StreamWatch.prototype.loadData_ = function() {
  this.sourceManager_ = new sw.data.SourceManager(this.sidebar_);
  this.sourceManager_.addEventListener(sw.data.DataSourceEvent.CREATE,
      this.onDataSourceCreated, false, this);
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.StreamWatch.prototype.onDataSourceCreated = function(event) {
  event.target.addEventListener(sw.data.DataSourceEvent.ENABLED,
      this.onDataSourceEnabled, false, this);
  event.target.addEventListener(sw.data.DataSourceEvent.DISABLED,
      this.onDataSourceDisabled, false, this);
  event.target.addEventListener(sw.data.DataSourceEvent.DATA_ADDED,
      this.onDataAvailable, false, this);
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.StreamWatch.prototype.onDataSourceEnabled = function(event) {
  window.console.log('Source Enabled');
  event.target.addEventListener(sw.data.DataSourceEvent.DATA_ADDED,
      this.onDataAvailable, false, this);
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.StreamWatch.prototype.onDataSourceDisabled = function(event) {
  window.console.log('Source Disabled');
  event.target.removeEventListener(sw.data.DataSourceEvent.DATA_ADDED,
      this.onDataAvailable, false, this);
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.StreamWatch.prototype.onDataAvailable = function(event) {
  window.console.dir(event.target);
  // Add in a throttled way, like 5 seconds between each post or sth.
  this.pendingActivities_.push(
      (/** @type {sw.data.DataSource} */ event.target.dequeue()));
};


/**
 * Inserts the next pending streamcomponent to the stream, if
 * there is any.
 */
sw.StreamWatch.prototype.onInsertComponent = function() {
  if (this.pendingActivities_.length > 0) {
    this.stream_.addChildInOrder(this.pendingActivities_.shift());
  }
};


/** @type {sw.StreamWatch} */
window['streamWatch'] = new sw.StreamWatch();
