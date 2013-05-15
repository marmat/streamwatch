
/**
 * @fileoverview A wrapper class for the Google+ API JavaScript library. Does
 * some post-processing on the retrieved data and converts them into the
 * application-specific format (a remnant of the use inside the Favorite Posts
 * extension).
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.util.GoogleApi');

goog.require('fp.data.Activity');
goog.require('fp.data.ActivityUtil');

goog.require('goog.array');



/**
 * The API client. Use .getInstance() to obtain an instance of this class.
 * @constructor
 */
sw.util.GoogleApi = function() {
  /* Hi there. */
};
goog.addSingletonGetter(sw.util.GoogleApi);


/**
 * Converts a response object from the API to the application internal model.
 * @param {Object} item The API response object.
 * @return {fp.data.Activity} The parsed activity.
 * @private
 */
sw.util.GoogleApi.prototype.processActivityResponse_ = function(item) {
  // Unfortunately we have to copy the data attribute by attribute, otherwise
  // the advanced compilation messes up with attribute renaming.

  var timestamp = fp.data.ActivityUtil.getTimestamp(item['published']);

  /** @type {fp.data.Activity} */
  var activity = {
    id: item['id'],
    url: item['url'],
    verb: item['verb'],
    published: timestamp,
    publishedFormatted: fp.data.ActivityUtil.formatDate(timestamp),
    visibility: 'public',
    actor: {
      id: item['actor']['id'],
      displayName: item['actor']['displayName'],
      url: item['actor']['url'],
      image: {
        url: item['actor']['image']['url'] + '&sz=96'
      }
    },
    annotation: '',
    object: {
      content: item['object']['content'],
      url: item['object']['url'],
      attachments: []
    },
    comments: []
  };

  if (activity.verb == 'share') {
    activity.annotation = item['annotation'];
    activity.object.actor = {
      id: item['object']['actor']['id'],
      displayName: item['object']['actor']['displayName'],
      url: item['object']['actor']['url'],
      image: {
        url: item['object']['actor']['image']['url'] + '&sz=64'
      }
    };
  }

  goog.array.forEach(item['object']['attachments'] || [], function(data) {
    var attachment = {
      objectType: data['objectType'],
      displayName: data['displayName'] || '',
      content: data['content'] || '',
      domain: data['domain'] || '',
      url: data['url'] || ''
    };

    if (!!data['image']) {
      attachment.image = {
        url: data['image']['url'],
        type: data['image']['type']
      };
    }

    switch (data['objectType']) {
      case 'photo':
        // Note: the image height is kind of broken as it always returns 373
        // (see plus platform issue #447). We work around this fact by
        // recalculating from the fullImage
        attachment.embed = {
          url: data['url'],
          width: data['image']['width'],
          height: Math.min(
              data['fullImage']['height'] /
              data['fullImage']['width'] * data['image']['width'],
              data['image']['height'])
        };
        break;
      case 'album':
        if (attachment.displayName == '') {
          attachment.displayName = 'Photo album';
        } else {
          attachment.content = 'Photo album';
        }

        if (data['thumbnails'].length > 0) {
          attachment.image = {
            url: data['thumbnails'][0]['image']['url'],
            type: data['thumbnails'][0]['image']['type']
          };
        }
        break;
    }

    activity.object.attachments.push(attachment);
  });

  return activity;
};


/**
 * Converts a response object from the API to the application internal model.
 * @param {Object} item The API response object.
 * @return {fp.data.Comment} The parsed comment.
 * @private
 */
sw.util.GoogleApi.prototype.processCommentResponse_ = function(item) {
  var timestamp = fp.data.ActivityUtil.getTimestamp(item['published']);

  /** @type {fp.data.Comment} */
  var comment = {
    id: item['id'],
    published: timestamp,
    publishedFormatted: fp.data.ActivityUtil.formatDate(timestamp),
    actor: {
      id: item['actor']['id'],
      displayName: item['actor']['displayName'],
      url: item['actor']['url'],
      image: {
        url: item['actor']['image']['url']
      }
    },
    content: item['object']['content'],
    inReplyTo: {
      id: item['inReplyTo']['id'],
      url: item['inReplyTo']['url']
    }
  };

  return comment;
};


/**
 * Requests the profile stream of a user.
 * @param {string} id ID of the user to fetch.
 * @param {function(Array.<fp.data.Activity>)} callback Method which will
 *    receive the request result.
 * @param {Object=} opt_scope The scope in which to call the callback
 *    function.
 */
sw.util.GoogleApi.prototype.getProfileStream = function(id, callback,
    opt_scope) {
  var processingCallback = function(response) {
    var activities = [];
    goog.array.forEach(response['items'] || [], function(item) {
      activities.push(this.processActivityResponse_(item));
    }, this);

    if (!!opt_scope) {
      goog.bind(callback, opt_scope)(activities);
    } else {
      callback(activities);
    }
  };

  var request = gapi.client.plus.activities.list({
    'userId': id,
    'collection': 'public'
  });

  request.execute(goog.bind(processingCallback, this));
};


/**
 * Requests a generic activity stream based on a search query.
 * @param {string} query The query to search for.
 * @param {function(Array.<fp.data.Activity>)} callback Method which will
 *    receive the request result.
 * @param {Object=} opt_scope The scope in which to call the callback
 *    function.
 */
sw.util.GoogleApi.prototype.getActivityStream = function(query, callback,
    opt_scope) {
  var processingCallback = function(response) {
    var activities = [];
    goog.array.forEach(response['items'] || [], function(item) {
      activities.push(this.processActivityResponse_(item));
    }, this);

    if (!!opt_scope) {
      goog.bind(callback, opt_scope)(activities);
    } else {
      callback(activities);
    }
  };

  var request = gapi.client.plus.activities.search({
    'query': query
  });

  request.execute(goog.bind(processingCallback, this));
};


/**
 * @param {string} activityId The activity ID for which we want to get comments.
 * @param {function(Array.<fp.data.Comment>)} callback Method which will
 *    receive the request result.
 * @param {Object=} opt_scope The scope in which to call the callback
 *    function.
 */
sw.util.GoogleApi.prototype.getComments = function(activityId, callback,
    opt_scope) {
  var processingCallback = function(response) {
    var comments = [];
    goog.array.forEach(response['items'] || [], function(item) {
      comments.push(this.processCommentResponse_(item));
    }, this);

    if (!!opt_scope) {
      goog.bind(callback, opt_scope)(comments);
    } else {
      callback(comments);
    }
  };

  var request = gapi.client.plus.comments.list({
    'activityId': activityId
  });

  request.execute(goog.bind(processingCallback, this));
};
