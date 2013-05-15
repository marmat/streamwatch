
/**
 * @fileoverview Contains classes to manage subscribed data sources via UI
 * elements.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.data.SourceManager');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');

goog.require('sw.data.PlusSourceConfigurationDialog');
goog.require('sw.data.YouTubeSourceConfigurationDialog');
goog.require('sw.sidebar.ButtonGroup');
goog.require('sw.sidebar.MenuButton');



/**
 * @param {sw.sidebar.Sidebar} sidebar The sidebar in which to render the
 *    active and available data sources.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
sw.data.SourceManager = function(sidebar) {
  goog.base(this);

  /** @private @type {sw.util.Settings} */
  this.settings_ = sw.util.Settings.getInstance();

  /** @private @type {sw.sidebar.ButtonGroup} */
  this.activeSources_ = new sw.sidebar.ButtonGroup('Active');
  sidebar.addChild(this.activeSources_, true);

  /** @private @type {sw.sidebar.ButtonGroup} */
  this.availableSources_ = new sw.sidebar.ButtonGroup('Add');
  sidebar.addChild(this.availableSources_, true);

  /** @private @type {Object.<string, sw.data.DataSource>} */
  this.sources_ = {};

  this.initializeActiveSources_();
  this.initializeAvailableSources_();
};
goog.inherits(sw.data.SourceManager, goog.events.EventTarget);


/**
 * @type {Object.<string, Object>}
 */
sw.data.SourceManager.AVAILABLE_SOURCES = {
  'gplus': {
    label: 'Google+',
    icon: 'swSidebarIconGooglePlus',
    dialog: sw.data.PlusSourceConfigurationDialog
  },
  'youtube': {
    label: 'YouTube',
    icon: 'swSidebarIconYouTube',
    dialog: sw.data.YouTubeSourceConfigurationDialog
  }
};


/**
 * @private
 */
sw.data.SourceManager.prototype.initializeActiveSources_ = function() {
  // TODO: Remember active sources in localStorage and restore them
};


/**
 * @private
 */
sw.data.SourceManager.prototype.initializeAvailableSources_ = function() {
  goog.object.forEach(sw.data.SourceManager.AVAILABLE_SOURCES,
      function(data, id) {
        var button = new sw.sidebar.MenuButton(data.label, data.icon);
        button.setId(id);
        button.addEventListener(goog.ui.Component.EventType.ACTION,
            this.onAvailableSourceClick, false, this);

        this.availableSources_.addChild(button, true);
      }, this);
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.data.SourceManager.prototype.onAvailableSourceClick = function(event) {
  var dialogConstructor =
      sw.data.SourceManager.AVAILABLE_SOURCES[event.target.getId()].dialog;

  var dialog = new dialogConstructor();
  dialog.addEventListener(sw.data.DataSourceEvent.CREATE,
      this.onDataSourceCreated, false, this);
  dialog.render();
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.data.SourceManager.prototype.onActiveSourceClick = function(event) {
  // Toggle active status
  var dataSource = this.sources_[event.target.getId()];
  window.console.dir(dataSource);
  if (!!dataSource) {
    dataSource.setEnabled(!dataSource.isEnabled());
  }
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.data.SourceManager.prototype.onDataSourceCreated = function(event) {
  var dataSource = (/** @type {sw.data.DataSource} */ event.target);
  var buttonId = 'btn' + goog.getUid(dataSource);
  var button = new sw.sidebar.MenuButton(dataSource.getTitle(),
      dataSource.getIcon());

  button.setId(buttonId);
  button.addEventListener(goog.ui.Component.EventType.ACTION,
      this.onActiveSourceClick, false, this);

  this.sources_[buttonId] = dataSource;
  this.activeSources_.addChild(button, true);

  // Let the event bubble
  this.dispatchEvent(event);
  dataSource.update();
};
