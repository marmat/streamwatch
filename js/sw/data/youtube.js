
/**
 * @fileoverview Data Sources based on Google+.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.data.YouTubeCommentsSource');
goog.provide('sw.data.YouTubeSourceConfigurationDialog');

goog.require('fp.content.Comment');
goog.require('fp.data.Comment');
goog.require('fp.extension.Dialog');

goog.require('goog.ui.Button');
goog.require('goog.ui.CustomButtonRenderer');
goog.require('goog.ui.LabelInput');

goog.require('sw.data.DataSource');
goog.require('sw.util.YouTubeDataApi');



/**
 * Watches a search stream of Google+.
 * @param {string} id The video ID to watch.
 * @constructor
 * @extends {sw.data.DataSource}
 */
sw.data.YouTubeCommentsSource = function(id) {
  goog.base(this, 'YouTube Comments', 'swSidebarIconYouTube');

  /** @private @type {sw.util.YouTubeDataApi} */
  this.api_ = sw.util.YouTubeDataApi.getInstance();

  /** @private @type {string} */
  this.id_ = id;
};
goog.inherits(sw.data.YouTubeCommentsSource, sw.data.DataSource);


/** @override */
sw.data.YouTubeCommentsSource.prototype.update = function() {
  window.console.log('Updating YouTubeCommentsSource');
  this.api_.getComments(this.id_, this.onComments, this);
};


/**
 * Callback for the YouTube API request.
 * @param {Array.<fp.data.Comment>} comments A list of the profile's most recent
 *    activities.
 */
sw.data.YouTubeCommentsSource.prototype.onComments = function(comments) {
  goog.array.forEachRight(comments, function(comment) {
    if (!this.hasSeen(comment.id)) {
      this.enqueue(new fp.content.Comment(comment));
    }
  }, this);
};



/**
 * A dialog which can be used to create new configured instances of YouTube
 * data sources.
 * @constructor
 * @extends {fp.extension.Dialog}
 */
sw.data.YouTubeSourceConfigurationDialog = function() {
  goog.base(this, 'Add a YouTube Data Source');

  /** @private @type {goog.ui.LabelInput} */
  this.query_ = new goog.ui.LabelInput('Video ID');

  /** @private @type {goog.ui.Button} */
  this.submit_ = new goog.ui.Button('Add',
      goog.ui.CustomButtonRenderer.getInstance());
  this.submit_.addEventListener(goog.ui.Component.EventType.ACTION,
      this.onSubmitClick, false, this);
};
goog.inherits(sw.data.YouTubeSourceConfigurationDialog, fp.extension.Dialog);


/** @override */
sw.data.YouTubeSourceConfigurationDialog.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.addContentChild(this.query_, true);
  this.addContentChild(this.submit_, true);
};


/**
 * @param {goog.events.Event} event The event object.
 */
sw.data.YouTubeSourceConfigurationDialog.prototype.onSubmitClick =
    function(event) {
  var dataSource = new sw.data.YouTubeCommentsSource(this.query_.getValue());
  this.dispatchEvent(new goog.events.Event(
      sw.data.DataSourceEvent.CREATE, dataSource));
  this.dispose();
};
