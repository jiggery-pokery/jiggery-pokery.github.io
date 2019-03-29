$(function(){      
  var timings = {
      LudicrousSpeed    : .05,
      Fast              : .150,
      Normal            : .250,
      Slow              : .400,
      VerySlow          : 1,
      GodDamnSlow       : 2
  };

  var classes = {
      IsInitiallyHidden : "is-initially-hidden",
      IsHidden          : "is-hidden",
      IsActive          : "is-active",
      IsVisible         : "is-visible",
  };
      
  var linkURL;
  var loadedPages               = [];
  var isLoading                 = false;
  var $loadingContainer         = $(".loading-container");
  var $loadingText              = $loadingContainer.find(".percentage");

  var $mainNavID                = $("#mainNav");
  var $navigation               = $(".navbar-nav");
  var $navigationLinks          = $(".navbar-nav li");
  var $navigationLinkIsActive;   
  var barbaWrapperId            = "gem-wrapper";
  var barbaContainerClass       = "gem-container";
  var $barbaID                  = $("#"+barbaWrapperId);
  //var $barbaContainer         = $("."+barbaContainerClass);
  var barbaFadeTransition;  

  // Customising Barba
  Barba.Pjax.Dom.wrapperId  = barbaWrapperId;
  Barba.Pjax.Dom.containerClass = barbaContainerClass;
  Barba.Pjax.init();
  Barba.Prefetch.init();

  /////////////////////////////////////////////////////
  //
  // DEV ONLY
  Barba.Pjax.cacheEnabled = false;
  //
  // END DEV ONLY
  /////////////////////////////////////////////////////

  //function init() {
    console.log("every story has a beginning");
    var loadingProgress;
    //* 
    var preload = new createjs.LoadQueue(false);

    preload.on('progress', handleProgress);
    preload.on('complete', handleComplete);
    preload.on('error', handleError);
    preload.on("loadstart", handleStart);
    preload.on("fileload", handleFileLoad);
    preload.loadManifest({src:"assets.json"});
    //*/
    //* 
    //*/
    /*
     $barbaID.imagesLoaded()
      .always(function(inst) {
        console.log('all images loaded');
        //$("."+barbaContainerClass).removeClass(classes.IsInitiallyHidden);
        $barbaID.removeClass(classes.IsInitiallyHidden);
      })
      .fail( function() {
          console.log('all images loaded, at least one is broken');
        })
      .progress( function( instance, image ) {
        var result = image.isLoaded ? 'loaded' : 'broken';
        console.log( 'image is ' + result + ' for ' + image.img.src );
      });
    */
    // Prevents page from refreshing if the link to current page is clicked
    // https://github.com/luruke/barba.js/issues/34
    $mainNavID.on("click","a",function(e){
      if(e.target.href === window.location.href) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

  //}

  function handleFileLoad(e) {
    var image = e.result;
    //var b = new createjs.Bitmap(e.item.id);
    //var imgSource = preload.getItem(e.item.id);
    var img = preload.getResult(e.item.id,true);
    console.log(image);
    console.log(e.item.id);
    //console.log(imgSource);
    //var item = new Image();
    //item.src = e.item.id;
    //var tI = new createjs.Bitmap(image);
    //map[map.length] = {'src':String(String(e.src).toLowerCase()).replace('assets/image','').replace('.jpg','').replace('.png',''),'data':img};
    //console.log(map);
  }

  function handleStart() {
    console.log("start liao loh");
    showLoading();    
  }

  function handleProgress(e) {
    loadingProgress = Math.round(e.loaded * 100);
    //console.log(loadingProgress);
    //console.log('General progress', Math.round(e.loaded) * 100, e);
    $loadingText.text(loadingProgress + '%');
  }

  function handleComplete() {
    console.log("complete liao loh");
    hideLoading();
    TweenLite.fromTo($barbaID,timings.Fast,{autoAlpha:0, display:"none"},{autoAlpha:1,display:"block",onComplete:function(){$barbaID.removeClass(classes.IsInitiallyHidden);}});
    //$barbaID.removeClass(classes.IsInitiallyHidden); 
  }

  function handleError() {
    console.log("shits, got problem");
  }

  function showLoading() {
    isLoading = true;
    TweenLite.fromTo($loadingContainer, timings.Slow, {scale:1.25, autoAlpha:0}, {scale:1, autoAlpha:1});
  }

  function hideLoading() {
    TweenLite.to($loadingContainer, timings.Slow, {autoAlpha:0, scale:.75});
    isLoading = false;
  }

  Barba.Dispatcher.on('initStateChange', function(st) {

    ////////////////////////////////
    //
    // Update active page on main nav
    // $navigationLinks: all links on mainnav
    // $navigationLinkIsActive: matched link by href value

    linkURL = st.url.split(window.location.origin)[1].substring(1); // get path of current page    
    $navigationLinkIsActive = $navigation.find("[href$='/" + linkURL + "']");

    $navigationLinks.removeClass(classes.IsActive);
    $navigationLinkIsActive.parent().addClass(classes.IsActive); // add CSS class to current .navigation__link


    ////////////////////////////////
    //
    // Loading Screen Director, LSD
    // If page loaded before, then dont show Loading screen
    /* 
    if(loadedPages.length > 0) {
      // If pages are already loaded, we check to see if current page
      // is already in the list, if no, then we show the loading screen
      if(jQuery.inArray(st.url, loadedPages) == -1) {
        loadedPages.push(st.url);
        if(!isLoading) {showLoading()};
      }
    } else {
      // First page load, just add into the list
      loadedPages.push(st.url);
      if(!isLoading) {showLoading()};
      //console.log("first!")
    }
    */
    //console.log(loadedPages);
  });

  Barba.Dispatcher.on('transitionCompleted', function(currentStatus, prevStatus){
    /* 
    $barbaID.imagesLoaded()
      .always(function(inst) {
        if(isLoading) {hideLoading()};
        $("."+barbaContainerClass).removeClass(classes.IsInitiallyHidden);
      });
    */
  });
 
  barbaFadeTransition = Barba.BaseTransition.extend({
    start: function() {

      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
      },

      fadeOut: function() {
        var deferred = Barba.Utils.deferred();
        var animation = new TimelineLite();
        
        animation
          //.to(window, transitionFast, {scrollTo:0})
          .to(this.oldContainer, timings.Fast, {opacity:0, y:10, onComplete:function(){deferred.resolve();}})
          .set(this.oldContainer,{autoAlpha:0,display:'none'});
          
        return deferred.promise;
      },

      fadeIn: function() {
        var animation = new TimelineLite();
        var _this = this;
        var $newContainerHead = $(this.newContainer).find("h1");
        //console.log(this);
        //$(this.newContainer).addClass(classes.IsInitiallyHidden);
        animation
          //.to(window, timings.Fast, {scrollTo:0})
          .set(window,{scrollTo:0})
          .fromTo(this.newContainer, timings.LudicrousSpeed, {autoAlpha:0,y:-10},{autoAlpha:1, y:0, onComplete:function(){_this.done();}})
          .fromTo($newContainerHead, timings.Normal,{autoAlpha:0, y:-10},{autoAlpha:1, y:0});
      }
  });

  var barbaCatTransition = Barba.BaseTransition.extend({
    start: function() {

      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
      },

      fadeOut: function() {
        var deferred = Barba.Utils.deferred();
        var animation = new TimelineLite();
        
        animation
          //.to(window, transitionFast, {scrollTo:0})
          .to(this.oldContainer, timings.Fast, {opacity:0, onComplete:function(){deferred.resolve();}})
          .set(this.oldContainer,{autoAlpha:0,display:'none'});
        
          
        return deferred.promise;
      },

      fadeIn: function() {
        var animation = new TimelineLite();
        var _this = this;

        /*
        animation
          .to(window, transitionFast, {scrollTo:0})
          .fromTo(this.newContainer, timings.Normal, {autoAlpha:0},{autoAlpha:1, onComplete:function(){_this.done();}});
        */

        //_this.done();

        //$(this.newContainer).addClass(classes.IsInitiallyHidden);

        animation
          .to(window, timings.Fast, {scrollTo:0, onComplete:function(){_this.done();}});
          //.set(this.newContainer, {autoAlpha:0, onComplete:function(){_this.done();}});
      }
  });
  
  // Call new Transition
  Barba.Pjax.getTransition = function() {
    var transitionObj = barbaFadeTransition;
    var urlWithoutDotHtml = Barba.HistoryManager.currentStatus().url.split('/').pop().split('.').shift();

    if (urlWithoutDotHtml === 'cat') {
      transitionObj = barbaCatTransition;
    }
    
    return transitionObj;
  };

  var Catpage = Barba.BaseView.extend({
    namespace: 'cat',
    onEnter: function() {

    },
    onEnterCompleted: function() {

    },
    onLeave: function() {
      //console.log("New Transition toward a new page has just started.");
    },
    onLeaveCompleted: function() {
      //console.log("Cat Container has just been removed from the DOM.");
    }
  });

  //init();

  Catpage.init();
  Barba.Pjax.start();

});