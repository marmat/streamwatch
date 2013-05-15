
/**
 * @fileoverview A utility class to access application settings in a
 * unified way. Abstracts away from where the settings are stored and retrieved.
 * Migrated and modified from the Favorite Posts extension, where a hybrid
 * approach was used (chrome.storage.sync + chrome.storage.local). This class
 * only uses the HTML5 localStorage to be browser independent.
 * TODO: Add localStorage listener!
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('sw.util.Setting');
goog.provide('sw.util.Settings');
goog.provide('sw.util.Settings.EventType');

goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.object');


/**
 * Available settings
 * @enum {string}
 */
sw.util.Setting = {
  DATA_SOURCES: 'dataSources',
  TWITTER_API_TOKEN: 'twitterApiToken'
};



/**
 * This class is a Singleton to ensure that all depending classes work with the
 * same set of settings and are informed correctly on changes.
 * Use .getInstance() to obtain an instance of this class.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
sw.util.Settings = function() {
  goog.base(this);

  /**
   * An object holding the current raw application settings. Do not modify
   * this object directly but use getter and setter instead, to ensure that
   * modifications will be correctly propagated.
   * @private
   * @type {Object.<string, *>}
   */
  this.settings_ = {};
  this.initializeSettings_();
};
goog.inherits(sw.util.Settings, goog.events.EventTarget);
goog.addSingletonGetter(sw.util.Settings);


/**
 * Events that can be fired by this class.
 * @enum {string}
 */
sw.util.Settings.EventType = {
  CHANGE: 'c'
};


/**
 * Fetches the application settings from its various locations. This method
 * used to be much fancier in FavoritePosts ;-).
 * @private
 */
sw.util.Settings.prototype.initializeSettings_ = function() {
  // Retrieve available settings from the localStorage
  goog.object.forEach(sw.util.Setting, function(setting) {
    if (!!window.localStorage[setting]) {
      this.settings_[setting] = window.JSON.parse(window.localStorage[setting]);
    }
  }, this);
};


/**
 * Writes the given kv-pair into the local storage.
 * @param {string} key The setting to set.
 * @param {*} value The value to set.
 * @private
 */
sw.util.Settings.prototype.persistLocal_ = function(key, value) {
  window.localStorage[key] = window.JSON.stringify(value);
};


/**
 * @param {string} key The setting to retrieve.
 * @return {*} The parameter or undefined, if the key doesn't exist.
 */
sw.util.Settings.prototype.get = function(key) {
  if (goog.isArray(this.settings_[key])) {
    return goog.array.clone((/** @type {Array} */ this.settings_[key]));
  } else if (goog.isObject(this.settings_[key])) {
    return goog.object.clone((/** @type {Object} */ this.settings_[key]));
  } else {
    return this.settings_[key];
  }
};


/**
 * Modifies the setting and notifies registered listeners, if the value has
 * changed.
 * @param {string} key The setting to set.
 * @param {(Array|Object|boolean|number|string|null)} value The value to set.
 * @param {boolean=} opt_runtimeOnly Whether to store the setting only locally
 *     and not persisting it in the chrome storage.
 */
sw.util.Settings.prototype.set = function(key, value, opt_runtimeOnly) {
  // Don't notify listeners if the value hasn't changed.
  if (this.settings_[key] !== value) {
    this.settings_[key] = value;

    // Persist setting
    if (!opt_runtimeOnly) {
      this.persistLocal_(key, value);
    }

    // Notify listeners
    this.dispatchEvent(new goog.events.Event(
        sw.util.Settings.EventType.CHANGE,
        {
          key: key,
          value: value
        }));
  }
};


// /**
//  * @param {Object.<string, StorageChange>} changes Object mapping each key that
//  *    changed to its corresponding StorageChange for that item.
//  * @param {string} areaName The area in which change occurred.
//  */
// sw.util.Settings.prototype.onStorageChanged = function(changes, areaName) {
//   for (var key in changes) {
//     if (goog.object.contains(sw.util.Setting, key)) {
//       // window.console.log('Storage change: ' + key + ' ' +
//       //     changes[key]['newValue']);
//       this.set(key, changes[key]['newValue'], true);
//     }
//   }
// };

