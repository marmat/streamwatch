
/**
 * @fileoverview A data model for activities. Has the same structure as
 * activities from the official REST API.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.data.Activity');
goog.provide('fp.data.ActivityUtil');
goog.provide('fp.data.Attachment');
goog.provide('fp.data.AttachmentUtil');
goog.provide('fp.data.Comment');
goog.provide('fp.data.CommentUtil');

goog.require('goog.array');
goog.require('goog.date.Date');
goog.require('goog.date.DateTime');
goog.require('goog.i18n.DateTimeFormat');


/**
 * A slightly stripped down activity resource (i.e. it lacks fields from the
 * official documentation that aren't used in this extension).
 *
 * @typedef {{
 *   id: string,
 *   url: string,
 *   verb: string,
 *   published: number,
 *   publishedFormatted: string,
 *   visibility: string,
 *   actor: {
 *     id: string,
 *     displayName: string,
 *     url: string,
 *     image: {
 *       url: string
 *     }
 *   },
 *   annotation: string,
 *   object: {
 *     content: string,
 *     url: string,
 *     attachments: Array.<fp.data.Attachment>
 *   },
 *   comments: Array.<fp.data.Comment>
 * }}
 */
fp.data.Activity;


/**
 * The data type for an attachment.
 *
 * @typedef {{
 *   objectType: string,
 *   displayName: string,
 *   content: string,
 *   domain: string,
 *   url: string,
 *   image: {
 *     url: string,
 *     type: string
 *   },
 *   embed: {
 *     url: string,
 *     width: number,
 *     height: number
 *   }
 * }}
 */
fp.data.Attachment;


/**
 * The data type for a comment.
 *
 * @typedef {{
 *   id: string,
 *   published: number,
 *   publishedFormatted: string,
 *   actor: {
 *     id: string,
 *     displayName: string,
 *     url: string,
 *     image: {
 *       url: string
 *     }
 *   },
 *   content: string,
 *   inReplyTo: {
 *     id: string,
 *     url: string
 *   }
 * }}
 */
fp.data.Comment;


/** @type {fp.data.Activity} */
fp.data.ActivityUtil.ERROR_ACTIVITY = {
  id: 'undefined',
  url: '',
  published: 0,
  publishedFormatted: 'Check if the post still exists',
  visibility: 'public',
  verb: 'post',
  actor: {
    id: '',
    displayName: 'Error',
    url: '',
    image: {
      url: '/img/error-profile@2x.png'
    }
  },
  annotation: '',
  object: {
    content:
        'There was an error fetching a post. It may have been deleted by ' +
        'the author, in which case you can remove the favorite by removing ' +
        'this placeholder. You can also try opening on the link above in a ' +
        'new tab to see if it\'s only a temporary error and the post is ' +
        'still there.',
    url: '',
    attachments: []
  },
  comments: []
};


/** @type {fp.data.Comment} */
fp.data.CommentUtil.ERROR_COMMENT = {
  id: 'undefined#0',
  published: 0,
  publishedFormatted: 'Check if the comment still exists',
  actor: {
    id: '',
    displayName: 'Error',
    url: '',
    image: {
      url: '/img/error-profile@2x.png'
    }
  },
  content: 'There was an error fetching a comment. It may have been deleted ' +
      'by the author, in which case you can remove the favorite by removing ' +
      'this placeholder. You can also try clicking on the link above in a ' +
      'new tab to see if it\'s only a temporary error and the comment is ' +
      'still there.',
  inReplyTo: {
    id: 'undefined',
    url: ''
  }
};


/** @const @type {goog.i18n.DateTimeFormat} */
fp.data.ActivityUtil.TIME_FORMAT = new goog.i18n.DateTimeFormat('h:mm a');


/** @const @type {goog.i18n.DateTimeFormat} */
fp.data.ActivityUtil.DATE_FORMAT = new goog.i18n.DateTimeFormat('MMM dd, yyyy');


/**
 * Formats a Java timestamp (milliseconds) into a readable date in the same
 * style as Google+ does it.
 * @param {number} timestamp The date to show.
 * @return {string} A formatted date string.
 */
fp.data.ActivityUtil.formatDate = function(timestamp) {
  var dateTime = new goog.date.DateTime();
  dateTime.setTime(timestamp);

  // If the date is from today, we want to show the time, otherwise the date.
  if (new goog.date.Date().equals(dateTime)) {
    return fp.data.ActivityUtil.TIME_FORMAT.format(dateTime);
  } else {
    return fp.data.ActivityUtil.DATE_FORMAT.format(dateTime);
  }
};


/**
 * Returns the timestamp in milliseconds given a formatted time string.
 * @param {string} formattedTime A RFC3339 formatted timestamp.
 * @return {number} The timestamp in milliseconds.
 */
fp.data.ActivityUtil.getTimestamp = function(formattedTime) {
  return goog.date.fromIsoString(formattedTime).getTime();
};
