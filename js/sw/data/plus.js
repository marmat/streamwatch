
/**
 * @fileoverview Data Sources based on Google+.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.data.PlusCommentsSource');
goog.provide('sw.data.PlusProfileSource');
goog.provide('sw.data.PlusSearchSource');
goog.provide('sw.data.PlusSourceConfigurationDialog');

goog.require('fp.content.Activity');
goog.require('fp.content.Comment');
goog.require('fp.data.Activity');
goog.require('fp.extension.Dialog');

goog.require('goog.ui.Button');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.CustomButtonRenderer');
goog.require('goog.ui.LabelInput');

goog.require('sw.data.DataSource');
goog.require('sw.util.GoogleApi');



/**
 * Watches the stream of a specific Google+ user.
 * @param {string} id The user's profile ID.
 * @constructor
 * @extends {sw.data.DataSource}
 */
sw.data.PlusProfileSource = function(id) {
  goog.base(this, id, 'swSidebarIconGooglePlus');

  /** @private @type {string} */
  this.googleApi_ = sw.util.GoogleApi.getInstance();

  /** @private @type {string} */
  this.id_ = id;
};
goog.inherits(sw.data.PlusProfileSource, sw.data.DataSource);


/** @override */
sw.data.PlusProfileSource.prototype.update = function() {
  window.console.log('Updating PlusProfileSource');
  this.googleApi_.getProfileStream(this.id_, this.onProfileData, this);
};


/**
 * Callback for the GoogleAPI request.
 * @param {Array.<fp.data.Activity>} stream A list of the profile's most recent
 *    activities.
 */
sw.data.PlusProfileSource.prototype.onProfileData = function(stream) {
  goog.array.forEachRight(stream, function(activity) {
    if (!this.hasSeen(activity.id)) {
      this.enqueue(new fp.content.Activity(activity));
    }
  }, this);
};



/**
 * Watches a search stream of Google+.
 * @param {string} query The search query to watch.
 * @constructor
 * @extends {sw.data.DataSource}
 */
sw.data.PlusSearchSource = function(query) {
  goog.base(this, 'Search for ' + query, 'swSidebarIconGooglePlus');

  /** @private @type {string} */
  this.googleApi_ = sw.util.GoogleApi.getInstance();

  /** @private @type {string} */
  this.query_ = query;
};
goog.inherits(sw.data.PlusSearchSource, sw.data.DataSource);


/** @override */
sw.data.PlusSearchSource.prototype.update = function() {
  window.console.log('Updating PlusSearchSource');
  this.googleApi_.getActivityStream(this.query_, this.onStreamData, this);
};


/**
 * Callback for the GoogleAPI request.
 * @param {Array.<fp.data.Activity>} stream A list of the profile's most recent
 *    activities.
 */
sw.data.PlusSearchSource.prototype.onStreamData = function(stream) {
  goog.array.forEachRight(stream, function(activity) {
    if (!this.hasSeen(activity.id)) {
      this.enqueue(new fp.content.Activity(activity));
    }
  }, this);
};



/**
 * Watches a specific Google+ activity.
 * @param {string} activityId The activity to watch.
 * @constructor
 * @extends {sw.data.DataSource}
 */
sw.data.PlusCommentsSource = function(activityId) {
  goog.base(this, activityId, 'swSidebarIconGooglePlus');

  /** @private @type {string} */
  this.googleApi_ = sw.util.GoogleApi.getInstance();

  /** @private @type {string} */
  this.activityId_ = activityId;
};
goog.inherits(sw.data.PlusCommentsSource, sw.data.DataSource);


/** @override */
sw.data.PlusCommentsSource.prototype.update = function() {
  window.console.log('Updating PlusCommentsSource');
  this.googleApi_.getComments(this.activityId_, this.onComments, this);
};


/**
 * Callback for the GoogleAPI request.
 * @param {Array.<fp.data.Comment>} stream A list of the profile's most recent
 *    activities.
 */
sw.data.PlusCommentsSource.prototype.onComments = function(stream) {
  goog.array.forEachRight(stream, function(comment) {
    if (!this.hasSeen(comment.id)) {
      this.enqueue(new fp.content.Comment(comment));
    }
  }, this);
};



/**
 * A dialog which can be used to create new configured instances of Google+
 * data sources.
 * @constructor
 * @extends {fp.extension.Dialog}
 */
sw.data.PlusSourceConfigurationDialog = function() {
  goog.base(this, 'Add a Google+ Data Source');

  /** @private @type {goog.ui.LabelInput} */
  this.query_ = new goog.ui.LabelInput('ID or Query');

  /** @private @type {goog.ui.ComboBox} */
  this.type_ = new goog.ui.ComboBox();
  this.type_.setDefaultText('Type');
  this.type_.setUseDropdownArrow(true);
  this.type_.addItem(new goog.ui.ComboBoxItem('Search'));
  this.type_.addItem(new goog.ui.ComboBoxItem('Profile'));
  this.type_.addItem(new goog.ui.ComboBoxItem('Activity'));

  /** @private @type {goog.ui.Button} */
  this.submit_ = new goog.ui.Button('Add',
      goog.ui.CustomButtonRenderer.getInstance());
  this.submit_.addEventListener(goog.ui.Component.EventType.ACTION,
      this.onSubmitClick, false, this);
};
goog.inherits(sw.data.PlusSourceConfigurationDialog, fp.extension.Dialog);


/** @override */
sw.data.PlusSourceConfigurationDialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.addContentChild(this.query_, true);
  this.addContentChild(this.type_, true);
  this.addContentChild(this.submit_, true);
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.data.PlusSourceConfigurationDialog.prototype.onSubmitClick =
    function(event) {
  var sourceMap = {
    'Search': sw.data.PlusSearchSource,
    'Profile': sw.data.PlusProfileSource,
    'Activity': sw.data.PlusCommentsSource
  };

  var dataSource = new sourceMap[this.type_.getValue()](this.query_.getValue());
  this.dispatchEvent(new goog.events.Event(
      sw.data.DataSourceEvent.CREATE, dataSource));
  this.dispose();
};
