
/**
 * @fileoverview A stream container that is able to show activities.
 * @author kaktus621@gmail.com (Martin Matysiak)
 */

goog.provide('fp.extension.EmptyStreamNote');
goog.provide('fp.extension.Stream');
goog.provide('fp.extension.Stream.EventType');

goog.require('fp.content.StreamComponent');
goog.require('fp.content.templates.common');
goog.require('fp.util.ResponsiveHelper');
goog.require('fp.util.ShortcutHelper');
goog.require('fp.util.ShortcutHelper.EventType');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.fx.dom.FadeIn');
goog.require('goog.fx.dom.Scroll');
goog.require('goog.ui.Component');



/**
 * @extends {goog.ui.Component}
 * @constructor
 */
fp.extension.Stream = function() {
  goog.base(this);

  /** @private @type {fp.util.ShortcutHelper} */
  this.shortcutHelper_ = fp.util.ShortcutHelper.getInstance();

  /** @private @type {fp.content.StreamComponent} */
  this.highlightedChild_ = null;

  /** @private @type {fp.extension.EmptyStreamNote} */
  this.placeholderChild_ = null;

  /** @private @type {goog.fx.Animation} */
  this.animation_ = null;

  /** @private @type {number} */
  this.animationCount_ = 0;
};
goog.inherits(fp.extension.Stream, goog.ui.Component);


/**
 * @enum {string}
 */
fp.extension.Stream.EventType = {
  STREAM_END: 'se'
};


/**
 * The length of the fade in animation in milliseconds.
 * @const @type {number}
 */
fp.extension.Stream.FADE_DURATION = 216;


/**
 * The length of the scroll animation in milliseconds.
 * @const @type {number}
 */
fp.extension.Stream.SCROLL_DURATION = 150;


/**
 * The delay in milliseconds to wait before starting the scroll animation (to
 * give the G+ internal animation some time).
 * @const @type {number}
 */
fp.extension.Stream.SCROLL_DELAY = 350;


/** @override */
fp.extension.Stream.prototype.createDom = function() {
  this.setElementInternal(goog.dom.createDom('div', 'fpStream'));
};


/** @override */
fp.extension.Stream.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  goog.events.listen(this.shortcutHelper_,
      fp.util.ShortcutHelper.EventType.NEXT_ELEMENT,
      this.onHighlightNext, false, this);
  goog.events.listen(this.shortcutHelper_,
      fp.util.ShortcutHelper.EventType.PREVIOUS_ELEMENT,
      this.onHighlightPrevious, false, this);
};


/** @override */
fp.extension.Stream.prototype.exitDocument = function() {
  goog.events.unlisten(this.shortcutHelper_,
      fp.util.ShortcutHelper.EventType.NEXT_ELEMENT,
      this.onHighlightNext, false, this);
  goog.events.unlisten(this.shortcutHelper_,
      fp.util.ShortcutHelper.EventType.PREVIOUS_ELEMENT,
      this.onHighlightPrevious, false, this);

  goog.base(this, 'exitDocument');
};


/** @override */
fp.extension.Stream.prototype.removeChildren = function(opt_unrender) {
  var superResult = goog.base(this, 'removeChildren', opt_unrender);
  this.highlightedChild_ = null;
  this.placeholderChild_ = null;
  return superResult;
};


/**
 * Adds the given streamcomponent in the rigt order into the stream.
 * @param {fp.content.StreamComponent} child The child to add.
 */
fp.extension.Stream.prototype.addChildInOrder = function(child) {
  // Ignore duplicate content.
  if (!!this.getChild(child.getId())) {
    return;
  }

  // Remove placeholder, if any
  if (!!this.placeholderChild_) {
    this.removeChild(this.placeholderChild_, true);
    this.placeholderChild_ = null;
  }

  // Look for the right position
  var insertAt = this.getChildCount();
  while (insertAt > 0 && (/** @type {fp.content.StreamComponent} */
      this.getChildAt(insertAt - 1)).getTimestamp() < child.getTimestamp()) {
    insertAt--;
  }

  this.addChildAt(child, insertAt, true);
  new goog.fx.dom.FadeIn(child.getElement(),
      fp.extension.Stream.FADE_DURATION).play();
};


/**
 * Adds a note with instructions for the extension to the stream.
 */
fp.extension.Stream.prototype.addPlaceholderChild = function() {
  this.placeholderChild_ = new fp.extension.EmptyStreamNote();
  this.addChild(this.placeholderChild_, true);
  new goog.fx.dom.FadeIn(this.placeholderChild_.getElement(),
      fp.extension.Stream.FADE_DURATION).play();
};


/**
 * Finds and returns the topmost visible child.
 * @return {fp.content.StreamComponent} The topmost child which is still fully
 * visible.
 * @private
 */
fp.extension.Stream.prototype.findTopMostChild_ = function() {
  var topMostChild = null;
  var topMostOffset = Infinity;

  // Find the activity with the closest positive y distance to 0.
  this.forEachChild(function(child) {
    var offset = child.getElement().getBoundingClientRect().top;
    if ((offset >= 0) && (offset < topMostOffset)) {
      topMostChild = child;
      topMostOffset = offset;
    }
  });

  return (/** @type {fp.content.StreamComponent} */ topMostChild);
};


/**
 * Scrolls the window to show the given child on top of the stream.
 * Unfortunately there is a default scroll animation happending from the
 * Google+ script. We can't prevent it from happening, so we wait until it's
 * done and then run our own animation.
 * @param {fp.content.StreamComponent} child The child to scroll to.
 * @private
 */
fp.extension.Stream.prototype.scrollTo_ = function(child) {
  // Stop any animations that are in progress.
  if (!!this.animation_) {
    this.animation_.stop();
    this.animation_ = null;
  }

  // Calculate our target coordinates before any animations
  // are manipulating the page.
  var elementOffset = child.getElement().getBoundingClientRect().top;
  var responsiveOffset = fp.util.ResponsiveHelper.getPageContentOffset(true);
  this.animation_ = new goog.fx.dom.Scroll(document.body,
      [0, document.body.scrollTop],
      [0, document.body.scrollTop + elementOffset - responsiveOffset],
      fp.extension.Stream.SCROLL_DURATION);

  // Nudge the page a bit to make the Google+ internal
  // scroll animation more bearable.
  document.body.scrollTop += fp.util.ResponsiveHelper.getPageContentOffset();

  // Keep track of the number of method calls so that always only the very last
  // triggering actually starts an animation (to prevent animation overlay)
  var animationCount = ++this.animationCount_;
  var delayedAnimation = function() {
    if (!!this.animation_ && animationCount == this.animationCount_) {
      this.animation_.play();
    }
  };

  setTimeout(goog.bind(delayedAnimation, this),
      fp.extension.Stream.SCROLL_DELAY);
};


/**
 * @param {goog.events.Event} event The event object.
 */
fp.extension.Stream.prototype.onHighlightNext = function(event) {
  if (!this.highlightedChild_ || !this.highlightedChild_.isInDocument()) {
    // Pick the topmost visible item as starting point
    this.highlightedChild_ = this.findTopMostChild_();
  }

  // Deactivate the old item
  this.highlightedChild_.setHovered(false);

  // Find the next item
  this.highlightedChild_ = (/** @type {fp.content.StreamComponent} */
      this.getChildAt(Math.min(this.getChildCount() - 1,
      this.indexOfChild(this.highlightedChild_) + 1)));

  // Activate the new item
  this.highlightedChild_.setHovered(true);
  this.scrollTo_(this.highlightedChild_);

  // Check if we hit the end of the stream
  if (this.indexOfChild(this.highlightedChild_) == this.getChildCount() - 1) {
    this.dispatchEvent(new goog.events.Event(
        fp.extension.Stream.EventType.STREAM_END, this));
  }
};


/**
 * @param {goog.events.Event} event The event object.
 */
fp.extension.Stream.prototype.onHighlightPrevious = function(event) {
  if (!this.highlightedChild_ || !this.highlightedChild_.isInDocument()) {
    // Pick the topmost visible item as starting point
    this.highlightedChild_ = this.findTopMostChild_();
  }

  // Deactivate the old item
  this.highlightedChild_.setHovered(false);

  // Find the next item
  this.highlightedChild_ = (/** @type {fp.content.StreamComponent} */
      this.getChildAt(Math.max(0,
      this.indexOfChild(this.highlightedChild_) - 1)));

  // Activate the new item
  this.highlightedChild_.setHovered(true);
  this.scrollTo_(this.highlightedChild_);
};



/**
 * Customized for StreamWatch.
 * @constructor
 * @extends {fp.content.StreamComponent}
 */
fp.extension.EmptyStreamNote = function() {
  // this is a static component without function
};
goog.inherits(fp.extension.EmptyStreamNote, fp.content.StreamComponent);


/** @override */
fp.extension.EmptyStreamNote.prototype.createDom = function() {
  this.setElementInternal(soy.renderAsElement(
      fp.content.templates.common.streamComponent, {
        actor: {
          id: '103109141246491742767',
          displayName: 'StreamWatch',
          url:
              'https://plus.google.com/b/103109141246491742767/' +
              '103109141246491742767',
          image: {
            url:
                '/img/sw-profile@2x.png'
          }

        },
        contentHtml:
            '<div class="fpCommentContentInner">' +
            'There are no posts here yet. Add a data source in the ' +
            'sidebar on the left in order to see a stream of posts.</div>'
      }));
};
