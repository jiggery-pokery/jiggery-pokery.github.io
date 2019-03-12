;(function(){
  'use strict';

  // can we support addEventListener
  const hasNative = 'addEventListener' in (new Image());

  /**
   * @constructor
   * @param {Array} images - string of images to load
   * @param {Object=} options - overrides to defaults
   */
  const PreLoader = function(images, options){
    this.options = {
      pipeline: false,
      auto: true,
      prefetch: false,
      /* onProgress: function(){}, */
      /* onError: function(){}, */
      onComplete: function(){
      }
    };

    options && typeof options == 'object' && this.setOptions(options);

    this.addQueue(images);
    this.queue.length && this.options.auto && this.processQueue();
  };(function(){"use strict";function c(a,b){const c=[],d=this.options;return d.onProgress&&a&&d.onProgress.call(this,a,b,this.completed.length),this.completed.length+this.errors.length===this.queue.length&&(c.push(this.completed),this.errors.length&&c.push(this.errors),d.onComplete.apply(this,c)),this}const a="addEventListener"in new Image,b=function(a,b){this.options={pipeline:!1,auto:!0,prefetch:!1,onComplete:function(){}},b&&"object"==typeof b&&this.setOptions(b),this.addQueue(a),this.queue.length&&this.options.auto&&this.processQueue()};b.prototype.setOptions=function(a){const b=this.options;let c;for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return this},b.prototype.addQueue=function(a){return this.queue=a.slice(),this},b.prototype.reset=function(){return this.completed=[],this.errors=[],this},b.prototype._addEvents=function(b,d,e){const f=this,g=this.options,h=function(){a?(this.removeEventListener("error",i),this.removeEventListener("abort",i),this.removeEventListener("load",j)):this.onerror=this.onabort=this.onload=null},i=function(){h.call(this),f.errors.push(d),g.onError&&g.onError.call(f,d),c.call(f,d),g.pipeline&&f._loadNext(e)},j=function(){h.call(this),f.completed.push(d),c.call(f,d,this),g.pipeline&&f._loadNext(e)};return a?(b.addEventListener("error",i,!1),b.addEventListener("abort",i,!1),b.addEventListener("load",j,!1)):(b.onerror=b.onabort=i,b.onload=j),this},b.prototype._load=function(a,b){const c=new Image;return this._addEvents(c,a,b),c.src=a,this},b.prototype._loadNext=function(a){return a++,this.queue[a]&&this._load(this.queue[a],a),this},b.prototype.processQueue=function(){const a=this.queue,b=a.length;let c=0;if(this.reset(),this.options.pipeline)this._load(a[0],0);else for(;c<b;++c)this._load(a[c],c);return this},b.lazyLoad=function(a){a||(a={});const c=document.querySelectorAll(a.selector||"img[data-preload]"),d=c.length,e=[];let g,f=0;for(;f<d;f++)e.push(c[f].getAttribute("data-preload"));return a.onProgress&&(g=a.onProgress),a.onProgress=function(a,b,d){c[d-1].src=a,c[d-1].removeAttribute("data-preload"),g&&g.apply(this,arguments)},e.length?new b(e,a):null},"function"==typeof define&&define.amd?define(function(){return b}):"object"==typeof module&&module.exports?module.exports=b:this.preLoader=b}).call(this);

  /**
   * naive shallow copy/reference from options into proto options
   * @param {Object} options
   * @returns {PreLoader}
   */
  PreLoader.prototype.setOptions = function(options){
    // shallow copy
    const o = this.options;
    let key;

    for (key in options) options.hasOwnProperty(key) && (o[key] = options[key]);

    return this;
  };

  /**
   * stores a local array, dereferenced from original
   * @param images
   * @returns {PreLoader}
   */
  PreLoader.prototype.addQueue = function(images){
    this.queue = images.slice();

    return this;
  };

  /**
   * reset the arrays
   * @returns {PreLoader}
   */
  PreLoader.prototype.reset = function(){
    this.completed = [];
    this.errors = [];

    return this;
  };

  /**
   * Subscribe to events for an imag object and a source
   * @param {Object} image
   * @param {String} src
   * @param {Number} index
   * @returns {PreLoader}
   * @private
   */
  PreLoader.prototype._addEvents = function(image, src, index){
    const self = this,
          o = this.options,
          cleanup = function(){
            if (hasNative){
              this.removeEventListener('error', abort);
              this.removeEventListener('abort', abort);
              this.removeEventListener('load', load);
            }
            else {
              this.onerror = this.onabort = this.onload = null;
            }
          },
          abort = function(){
            cleanup.call(this);

            self.errors.push(src);
            o.onError && o.onError.call(self, src);
            _checkProgress.call(self, src);
            o.pipeline && self._loadNext(index);
          },
          load = function(){
            cleanup.call(this);

            // store progress. this === image
            self.completed.push(src); // this.src may differ
            _checkProgress.call(self, src, this);
            o.pipeline && self._loadNext(index);
          };

    if (hasNative){
      image.addEventListener('error', abort, false);
      image.addEventListener('abort', abort, false);
      image.addEventListener('load', load, false);
    }
    else {
      image.onerror = image.onabort = abort;
      image.onload = load;
    }

    return this;
  };

  /**
   * Private API to load an image
   * @param {String} src
   * @param {Number} index
   * @returns {PreLoader}
   * @private
   */
  PreLoader.prototype._load = function(src, index){
    /*jshint -W058 */
    const image = new Image;

    this._addEvents(image, src, index);

    // actually load
    image.src = src;

    return this;
  };

  /**
   * Move up the queue index
   * @param {Number} index
   * @returns {PreLoader}
   * @private
   */
  PreLoader.prototype._loadNext = function(index){
    // when pipeline loading is enabled, calls next item
    index++;
    this.queue[index] && this._load(this.queue[index], index);

    return this;
  };

  /**
   * Iterates through the queue of images to load
   * @returns {PreLoader}
   */
  PreLoader.prototype.processQueue = function(){
    // runs through all queued items.
    const queue = this.queue,
          len = queue.length;

    let i = 0;

    // process all queue items
    this.reset();

    if (!this.options.pipeline) for (; i < len; ++i) this._load(queue[i], i);
    else this._load(queue[0], 0);

    return this;
  };

  /*jshint validthis:true */
  /**
   * Internal checker on the queue progress
   * @param {String} src
   * @param {Object} image
   * @returns {PreLoader}
   * @private
   */
  function _checkProgress(src, image){
    // intermediate checker for queue remaining. not exported.
    // called on preLoader instance as scope
    const args = [],
          o = this.options;

    // call onProgress
    o.onProgress && src && o.onProgress.call(this, src, image, this.completed.length);

    if (this.completed.length + this.errors.length === this.queue.length){
      args.push(this.completed);
      this.errors.length && args.push(this.errors);
      o.onComplete.apply(this, args);
    }

    return this;
  }

  /*jshint validthis:false */

  /**
   * Static method that loads images lazily from DOM based upon data-preload attribute
   * @param {Object} options= optional options to pass to PreLoader
   * @returns {PreLoader} instance
   */
  PreLoader.lazyLoad = function(options){
    if (!options)
      options = {};

    const lazyImages = document.querySelectorAll(options.selector || 'img[data-preload]'),
          l = lazyImages.length,
          toLoad = [];

    let i = 0,
        oldProgress;

    for (; i < l; i++) toLoad.push(lazyImages[i].getAttribute('data-preload'));

    options.onProgress && (oldProgress = options.onProgress);
    options.onProgress = function(item, imgEl, index){
      lazyImages[index - 1].src = item;
      lazyImages[index - 1].removeAttribute('data-preload');
      oldProgress && oldProgress.apply(this, arguments);
    };

    return toLoad.length ? new PreLoader(toLoad, options) : null;
  };

  if (typeof define === 'function' && define.amd){
    // we have an AMD loader.
    define(function(){
      return PreLoader;
    });
  }
  else if (typeof module === 'object' && module.exports){
    module.exports = PreLoader;
  }
  else {
    this.preLoader = PreLoader;
  }
}).call(this);
