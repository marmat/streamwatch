
/**
 * @fileoverview Helper Library for the YouTube Data API V2.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.util.YouTubeDataApi');

goog.require('goog.net.XhrManager');
goog.require('goog.object');



/**
 * The API client. Use .getInstance() to obtain an instance of this class.
 * @constructor
 */
sw.util.YouTubeDataApi = function() {
  /** @private @type {goog.net.XhrManager} */
  this.xhrManager_ = new goog.net.XhrManager(1, null, 1, 5);

  /** @private @type {number} */
  this.requestCount_ = 0;
};
goog.addSingletonGetter(sw.util.YouTubeDataApi);


/**
 * The URL under which we can reach the server.
 * @const @type {string}
 */
sw.util.YouTubeDataApi.prototype.API_URL =
    'http://gdata.youtube.com/feeds/api/';


/**
 * Performs the actual XHR.
 * @param {string} url The API endpoint to call.
 * @param {string} method The method to use.
 * @param {Object} request The request object to pass in the call.
 * @param {function(Array)=} opt_callback Method which will receive the
 *    request result.
 * @param {Object=} opt_scope Scope in which to call the callback.
 * @private
 */
sw.util.YouTubeDataApi.prototype.request_ = function(url, method, request,
    opt_callback, opt_scope) {
  var boundCallback = null;
  if (!!opt_callback) {
    boundCallback = !!opt_scope ?
        goog.bind(opt_callback, opt_scope) : opt_callback;
  }

  this.xhrManager_.send('r' + (++this.requestCount_),
      this.API_URL + url + '?alt=json', method,
      window.JSON.stringify(request), {}, null, boundCallback);
};


/**
 * @param {Object} item The comment data to process.
 * @return {fp.data.Comment} The parsed comment as an application model.
 * @private
 */
sw.util.YouTubeDataApi.prototype.processCommentResponse_ = function(item) {
  var timestamp = fp.data.ActivityUtil.getTimestamp(item['published']['$t']);

  /** @type {fp.data.Comment} */
  var comment = {
    id: item['id']['$t'],
    published: timestamp,
    publishedFormatted: fp.data.ActivityUtil.formatDate(timestamp),
    actor: {
      id: item['author'][0]['name']['$t'],
      displayName: item['author'][0]['name']['$t'],
      url: item['author'][0]['uri']['$t'],
      image: {
        url: '/img/youtube-profile@2x.png'
      }
    },
    content: item['content']['$t'],
    inReplyTo: {
      id: item['yt$videoid']['$t'],
      url: 'https://youtube.com/watch?v=' + item['yt$videoid']['$t']
    }
  };

  return comment;
};


/**
 * Fetches comments on a video.
 * @param {string} id Video ID for which comments shall be fetched.
 * @param {function(Array.<fp.data.Comment>)} callback Method which will
 *    receive the request result.
 * @param {Object=} opt_scope The scope in which to call the callback
 *    function.
 */
sw.util.YouTubeDataApi.prototype.getComments = function(id, callback,
    opt_scope) {
  var postProcessCallback = function(event) {
    var parsedResponse = window.JSON.parse(event.target.getResponseText());
    var comments = [];

    goog.array.forEach(parsedResponse['feed']['entry'], function(data) {
      comments.push(this.processCommentResponse_(data));
    }, this);

    if (!!opt_scope) {
      goog.bind(callback, opt_scope)(comments);
    } else {
      callback(comments);
    }
  };

  this.request_(
      'videos/' + id + '/comments', 'GET', {}, postProcessCallback, this);
};
