(function(){
  "use strict";

  var app = {};

  ////
  // Setting up Options
  //

  // Timings, with decimal places for Gsap
  app.options.timings = {
    LudicrousSpeed: .05,
    VeryFast: .1,
    Fast: .15,
    Normal: .25,
    Slow: .4,
    VerySlow: 1,
    GodDamnSlow: 2
  };

  // Timings for transitions
  app.options.transitionTime = {
    ForThisItem: timings.Slow,
    Stagger: timings.Fast,
    StaggerInsert: timings.Fast
  };

  // Distances in px to move
  app.options.transitionDistance = {
    normal: 10,
    far: 50
  };

  // Classes name, to be same as those in scss if IsXXX
  app.options.classes = {
    IsInitiallyHidden: "is-initially-hidden",
    IsHidden: "is-hidden",
    IsActive: "is-active", 
    IsVisible: "is-visible",
    IsInserted: "is-inserted",
    IsLoading: "is-loading",
    IsTransitingOut: "is-transiting-out",
    barbaWrapperId: "gem-wrapper",
    barbaContainerClass: "gem-container",
    contentWrapperClass: ".contentWrapper",
    motionDesignVideos: ".motionDesignVideos",
    browserScreenshots: ".browser",
    mainNavLightClass: "mainNav--light"
  };

  ////
  // Status of app
  //
  app.status = {
    assetsLoaded: true,
    currentPageType: "",
    currentPathName: "",
    currentPageIsDark: true
  }

  ////
  // Components in App
  //
  app.components = {
    loadingContainer: document.querySelector(".loading-container"),
    loadingText: loadingContainer.querySelector(".percentage"),
    mainNavID: document.querySelector("#mainNav"),
    navigation: document.querySelector(".mainNav__navbar"),
    navigationLinks: navigation.querySelectorAll("a"),
    navigationLinkIsActive:"",
    mainNavBurger: document.querySelector("#mainNav__burger"),
    barbaContainer: document.querySelector("."+app.options.classes.barbaContainerClass),
    allVideos: "",               // Used for Motion Design Videos
    allBrowsers: "",             // Used for Screenshots
    win: "",
    barbaID: document.querySelector("#"+app.options.classes.barbaWrapperId),
    barbaFadeTransition: ""
  }

  ////
  // Listeners
  //

  // Prevents page from refreshing if the link to current page is clicked
  // https://github.com/luruke/barba.js/issues/34
  app.components.mainNavID.addEventListener("click", function(e){
    if(e.target.href === window.location.href) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  ////
  // App functions
  //

  app.checkItemIsVisible = function() {
    // Todo: find js solution
//    var tAllVideos = app.components.allVideos;
//    var l = tAllVideos.length;
//    var el;
//
//    for (var i=0; i < l; i++) {
//      
//    }
//
//    $allVideos.each(function(i, el) {
//      var el = $(el);
//      if (el.visible(true)) {
//        //console.log(el);
//        el.addClass("played");
//        if (el.get(0).paused) {
//          el.get(0).play();
//        }
//      } 
//    });
//
//    $allBrowsers.each(function(i, el) {
//      var el = $(el);
//      if (el.visible(true)) {
//        el.addClass(classes.IsVisible);
//      } 
//    });
  }

  app.toggleSmlMainNav = function(forceHide) {
    // ToDo: Add classlist.js for <= ie9
    if(forceHide) {
      app.components.mainNavBurger.classList.remove(app.options.classes.IsActive);
      app.components.navigation.classList.remove(app.options.classes.IsActive);
    } else {
      // Toggle active class for mainNavBurger; ie not support classList.toggle
      if(app.components.mainNavBurger.classList.contains(app.options.classes.IsActive)) {
        app.components.mainNavBurger.classList.remove(app.options.classes.IsActive);
      } else {
        app.components.mainNavBurger.classList.add(app.options.classes.IsActive);
      }

      // Toggle active class for navigation; ie not support classList.toggle
      if(app.components.navigation.classList.contains(app.options.classes.IsActive)) {
        app.components.navigation.classList.remove(app.options.classes.IsActive);
      } else {
        app.components.navigation.classList.add(app.options.classes.IsActive);
      }
    }
  }

  app.updateMainNav = function(st) {
    // Update active page on main nav
    // $navigationLinks: all links on mainnav
    // $navigationLinkIsActive: matched link by href value
    currentPathName = st.url.split(window.location.origin).toString().substr(1);

    // ToDo: Use an array for pathnames
    if (currentPathName.match(/websites/)) {
      currentPageType = "websites";
    } else if (currentPathName.match(/edmsecards/)) {
      currentPageType = "edmsecards"; 
    } else if (currentPathName.match(/adaptations/)) {
      currentPageType = "adaptations";
    } else if (currentPathName.match(/about/)) {
      currentPageType = "about";
    } else if (currentPathName.match(/contact/)) {
      currentPageType = "contact";
    }else {
      currentPageType = "";
    }

    if (currentPageType !== "") {
      app.components.navigationLinkIsActive = app.components.navigation.querySelector("[data-pagetype$="+currentPageType+"]");
      app.components.navigationLinkIsActive.classList.add(app.options.classes.IsActive);
      app.components.navigationLinks.classList.remove(app.options.classes.IsActive);
    } else { // is homepage
      app.components.navigationLinks.classList.remove(app.options.classes.IsActive);
    }
  }

  app.updateMainNavToLight = function(changeNavToLight) {
    if (changeNavToLight) {
      app.components.mainNavID.classList.add(app.options.classes.mainNavLightClass);
    } else {
      app.components.mainNavID.classList.remove(app.options.classes.mainNavLightClass);
    }
  }

  ////
  // Barba settings
  //

  Barba.Dispatcher.on('linkClicked', function(HTMLElement, MouseEvent) {
    //var $is = HTMLElement;
    //console.log($(HTMLElement).parent());
    //$("body").addClass(classes.IsLoading);
    //console.log("body is loading");
    app.toggleSmlMainNav(true);
  });

  Barba.Dispatcher.on('initStateChange', function(st) {

    ////////////////////////////////
    //
    // Update active page on main nav
    // $navigationLinks: all links on mainnav
    // $navigationLinkIsActive: matched link by href value
    app.updateMainNav(st);
  });

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, newContainer) {
    //$(newContainer).addClass(classes.IsInserted);
  });

  barbaFadeTransition = Barba.BaseTransition.extend({
    start: function() { 
      Promise
        .all([this.newContainerLoading, this.fadeOutOld()])
        .then(this.fadeInNew.bind(this));
    },

    fadeOutOld: function() {
      var deferred            = Barba.Utils.deferred();
      var animation           = new TimelineMax();

      this.oldContainer.classList.addClass(app.options.classes.IsTransitingOut);
      
      animation
        .to(this.oldContainer, timings.Normal, {ease: Power3.easeIn, x:'-20%'})
        .set(this.oldContainer, {opacity:0,display:'none', onComplete:function(){deferred.resolve();}});
//* console.log("Status: All fadeOutOld");
        
      return deferred.promise;
    },

    fadeInNew: function() {
      var animation = new TimelineLite();
      var _this = this;
      var _newContainer = this.newContainer;
      var _newContentWrapper = _newContainer.querySelector(app.options.classes.contentWrapperClass);
      var _newContentData = _newContainer.getAttribute("data");
      //
      // Check if new container is bright
      if (_newContentData == 'pageislight') {
        if (app.status.currentPageIsDark) {
          app.status.currentPageIsDark = false;
          app.updateMainNavToLight(true);
        }
      } else { // new container is dark
        if (!app.status.currentPageIsDark) {
          app.status.currentPageIsDark = true;
          app.updateMainNavToLight(false);
        }
      }

      animation
        .set(window,{scrollTo:0})
        .fromTo(_newContainer, timings.Slow,{opacity:0,x:"+10%"},{opacity:1,x:"0%"});

      _this.done();
    }
  });
  
  // Call new Transition
  Barba.Pjax.getTransition = function() {
    var transitionObj = barbaFadeTransition;
    return transitionObj;
  };

  var projectListView = Barba.BaseView.extend({
    namespace: 'projectList',
    onEnter: function() {
    },
    onEnterCompleted:function() {
      var bLazy = new Blazy({
        selector:".lazy",
        loadInvisible:true,
        successClass:"lazyLoaded"
      });
    }
  });

  var caseStudiesView = Barba.BaseView.extend({
    namespace: 'caseStudies',
    onEnter: function() {
//* console.log("Status: proj onEnter");

    },
    onEnterCompleted: function() {
      $("."+barbaContainerClass).removeClass(classes.IsInserted);

      $win = $(window);
      $allVideos    = $(motionDesignVideos);
      $allBrowsers  = $(browserScreenshots);

      // Already visible modules
      $allVideos.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.addClass("already-visible"); 
        } 
      });

      // Already visible modules
      $allBrowsers.each(function(i, el) {
        var el = $(el);
        $(el).addClass(classes.IsInserted);
        if (el.visible(true)) {
          el.addClass("already-visible"); 
        } 
      });

      window.addEventListener('scroll', _throttle(checkItemIsVisible, 100));
    },
    onLeave: function() {
//*      console.log("Project page onleave", $allProjects);
    },
    onLeaveCompleted: function() {
//& console.log("Cat Container has just been removed from the DOM.");
    }
  });
  
  // Customising Barba
  Barba.Pjax.Dom.wrapperId  = barbaWrapperId;
  Barba.Pjax.Dom.containerClass = barbaContainerClass;
  Barba.Pjax.init();
  Barba.Prefetch.init();
})();

$(function(){

  var timings = {
      LudicrousSpeed            : .05,
      VeryFast                  : .1,
      Fast                      : .15,
      Normal                    : .25,
      Slow                      : .4,
      VerySlow                  : 1,
      GodDamnSlow               : 2      
  };

  var transitionTime = {
      ForThisItem               : timings.Slow,
      Stagger                   : timings.Fast,
      StaggerInsert             : timings.Fast
  }; 

  var transitionDistance        = 10;
  var transitionDistanceFar     = 50;

  var classes = {
      IsInitiallyHidden : "is-initially-hidden",
      IsHidden          : "is-hidden",
      IsActive          : "is-active", 
      IsVisible         : "is-visible",
      IsInserted        : "is-inserted",
      IsLoading         : "is-loading",
      IsTransitingOut   : "is-transiting-out"
  };
      
  var $loadingContainer         = $(".loading-container");
  var $loadingText              = $loadingContainer.find(".percentage");
  var assetsNotLoaded           = true;

  var $mainNavID                = $("#mainNav");
  var $navigation               = $(".mainNav__navbar");
  var $navigationLinks          = $(".mainNav__navbar a");
  var $navigationLinkIsActive;
  var $mainNavBurger            = $("#mainNav__burger");
  var barbaWrapperId            = "gem-wrapper";
  var barbaContainerClass       = "gem-container";
  var $barbaContainer           = $("."+barbaContainerClass);

  var contentWrapperClass       = ".contentWrapper";
  var contentAreaClass          = ".contentArea";

  var motionDesignVideos        = ".motionDesignVideos";
  var browserScreenshots        = ".browser";
  var $allVideos;               // Used for Motion Design Videos
  var $allBrowsers;             // Used for Screenshots
  var $win;

  var $barbaID                  = $("#"+barbaWrapperId);
  var barbaFadeTransition;
  var currentPageType;
  var currentPathName;
  var currentPageIsDark         = true;
  var mainNavLightClass         = "mainNav--light";

  

  // Customising Barba
  Barba.Pjax.Dom.wrapperId  = barbaWrapperId;
  Barba.Pjax.Dom.containerClass = barbaContainerClass;
  Barba.Pjax.init();
  Barba.Prefetch.init();

  /////////////////////////////////////////////////////
  //
  // DEV ONLY
  //Barba.Pjax.cacheEnabled = false;
  //
  // END DEV ONLY
  /////////////////////////////////////////////////////
/*
  var loadingProgress;
  var preload = new createjs.LoadQueue(false);
  preload.on('progress', handleProgress);
  preload.on('complete', handleComplete);
  preload.on('error', handleError);
  preload.on("loadstart", handleStart);
  preload.on("fileload", handleFileLoad);
  preload.loadManifest({src:"assets.json"});

  function handleFileLoad(e) {
    var image = e.result;
    var img = preload.getResult(e.item.id,true);
    console.log(image);
    console.log(e.item.id);
  }

  function handleStart() {
    console.log("start liao loh");
    showLoading();    
  }

  function handleProgress(e) {
    loadingProgress = Math.round(e.loaded * 100);
    //console.log('General progress', Math.round(e.loaded) * 100, e);
    $loadingText.text(loadingProgress + '%');
  }

  function handleComplete() {
    console.log("complete liao loh");
    hideLoading();
    TweenLite.fromTo($barbaID,timings.Fast,{autoAlpha:0, display:"none"},{autoAlpha:1,display:"block",onComplete:function(){$barbaID.removeClass(classes.IsInitiallyHidden);}});
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
*/
  // Prevents page from refreshing if the link to current page is clicked
  // https://github.com/luruke/barba.js/issues/34
  $mainNavID.on("click","a",function(e){
    if(e.target.href === window.location.href) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  function checkItemIsVisible() {
    //console.log($(".motionDesignVideos").visible(true));
    $allVideos.each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        //console.log(el);
        el.addClass("played");
        if (el.get(0).paused) {
          el.get(0).play();
        }
      } 
    });

    $allBrowsers.each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass(classes.IsVisible);
      } 
    });
  }

  function toggleSmlMainNav(forceHide) {
    if(forceHide) {
      $mainNavBurger.removeClass(classes.IsActive);
      $navigation.removeClass(classes.IsActive);
    } else {
      $mainNavBurger.toggleClass(classes.IsActive);
      $navigation.toggleClass(classes.IsActive);
    }
  }

  function updateMainNav(st) {
    ////////////////////////////////
    //
    // Update active page on main nav
    // $navigationLinks: all links on mainnav
    // $navigationLinkIsActive: matched link by href value

    currentPathName = st.url.split(window.location.origin).toString().substr(1);

    if (currentPathName.match(/websites/)) {
      currentPageType = "websites";
    } else if (currentPathName.match(/edmsecards/)) {
      currentPageType = "edmsecards"; 
    } else if (currentPathName.match(/adaptations/)) {
      currentPageType = "adaptations";
    } else if (currentPathName.match(/about/)) {
      currentPageType = "about";
    } else if (currentPathName.match(/contact/)) {
      currentPageType = "contact";
    }else {
      currentPageType = "";
    }

    if (currentPageType !== "") {
      $navigationLinkIsActive = $navigation.find("[data-pagetype$="+currentPageType+"]");
      $navigationLinks.removeClass(classes.IsActive);
      $navigationLinkIsActive.addClass(classes.IsActive); // add CSS class to current .navigation__link
    } else { // is homepage
      $navigationLinks.removeClass(classes.IsActive);      
    }
  }

  function updateMainNavToLight(changeNavToLight) {

    if (changeNavToLight) {
      $mainNavID.addClass(mainNavLightClass);
    } else {
      $mainNavID.removeClass(mainNavLightClass);
    }
  }

  Barba.Dispatcher.on('linkClicked', function(HTMLElement, MouseEvent) {
    //var $is = HTMLElement;
    //console.log($(HTMLElement).parent());
    //$("body").addClass(classes.IsLoading);
    //console.log("body is loading");
    toggleSmlMainNav(true);
  });

  Barba.Dispatcher.on('initStateChange', function(st) {

    ////////////////////////////////
    //
    // Update active page on main nav
    // $navigationLinks: all links on mainnav
    // $navigationLinkIsActive: matched link by href value
    updateMainNav(st);
  });

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, newContainer) {
    //$(newContainer).addClass(classes.IsInserted);
  });

  Barba.Dispatcher.on('transitionCompleted', function(currentStatus) {
  });
 
  barbaFadeTransition = Barba.BaseTransition.extend({
    start: function() { 
      Promise
        .all([this.newContainerLoading, this.fadeOutOld()])
        .then(this.fadeInNew.bind(this));
    },

    fadeOutOld: function() {
      var deferred            = Barba.Utils.deferred();
      var animation           = new TimelineMax();

      $(this.oldContainer).addClass(classes.IsTransitingOut);
      
      animation
        .to(this.oldContainer, timings.Normal, {ease: Power3.easeIn, x:'-20%'})
        .set(this.oldContainer, {opacity:0,display:'none', onComplete:function(){deferred.resolve();}});
//* console.log("Status: All fadeOutOld");
        
      return deferred.promise;
    },

    fadeInNew: function() {
      var animation = new TimelineLite();
      var _this = this;
      var $newContainer = $(this.newContainer);
      var $newContentWrapper = $newContainer.find(contentWrapperClass);

      //
      // Check if new container is bright
      if ($newContainer.data('pageislight')) {
        if (currentPageIsDark) {
          currentPageIsDark = false;
          updateMainNavToLight(true);
        }
      } else {
        if (!currentPageIsDark) {
          currentPageIsDark = true;
          updateMainNavToLight(false);
        }
      }

      animation
        .set(window,{scrollTo:0})
        .fromTo(this.newContainer, timings.Slow,{opacity:0,x:"+10%"},{opacity:1,x:"0%"});
        //.from(this.newContainer, timings.Slow,{ease: Power4.easeOut, x:'+100%'});

      _this.done();
    }
  });
  
  // Call new Transition
  Barba.Pjax.getTransition = function() {
    var transitionObj = barbaFadeTransition;
    return transitionObj;
  };
 
  var homePageView = Barba.BaseView.extend({
    namespace: 'home',
    onEnterCompleted: function() {
      if(assetsNotLoaded) {
        $("#"+barbaWrapperId).imagesLoaded()
          .always(function(inst) {
            console.log('all images loaded');
            $("body").removeClass(classes.IsLoading);
            assetsNotLoaded = false;
          })
          .fail( function() {
              console.log('all images loaded, at least one is broken');
            })
          .progress( function( instance, image ) {
            var result = image.isLoaded ? 'loaded' : 'broken';
            console.log( 'image is ' + result + ' for ' + image.img.src );
          });
      }
    }
  });

  var projectListView = Barba.BaseView.extend({
    namespace: 'projectList',
    onEnter: function() {
    },
    onEnterCompleted:function() {
      var bLazy = new Blazy({
        selector:".lazy",
        loadInvisible:true,
        successClass:"lazyLoaded"
      });
    }
  });

  var caseStudiesView = Barba.BaseView.extend({
    namespace: 'caseStudies',
    onEnter: function() {
//* console.log("Status: proj onEnter");

    },
    onEnterCompleted: function() {
      $("."+barbaContainerClass).removeClass(classes.IsInserted);

      $win = $(window);
      $allVideos    = $(motionDesignVideos);
      $allBrowsers  = $(browserScreenshots);

      // Already visible modules
      $allVideos.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.addClass("already-visible"); 
        } 
      });

      // Already visible modules
      $allBrowsers.each(function(i, el) {
        var el = $(el);
        $(el).addClass(classes.IsInserted);
        if (el.visible(true)) {
          el.addClass("already-visible"); 
        } 
      });

      window.addEventListener('scroll', _throttle(checkItemIsVisible, 100));
    },
    onLeave: function() {
//*      console.log("Project page onleave", $allProjects);
    },
    onLeaveCompleted: function() {
//& console.log("Cat Container has just been removed from the DOM.");
    }
  });

  homePageView.init();
  caseStudiesView.init();
  projectListView.init();
  Barba.Pjax.start();

  if ($("."+barbaContainerClass).data("pageislight")) {
    currentPageIsDark = false;
  }

  $mainNavBurger.on("click",function() {
    toggleSmlMainNav();
  })

});