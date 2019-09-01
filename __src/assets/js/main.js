import styles from './../scss/main';

import * as helper from './imports/helpers';

(function(){
  "use strict";

  var app = {};

  ////
  // Setting up Options
  //

  // Timings, with decimal places for Gsap
  app.timings = {
    LudicrousSpeed: .05,
    VeryFast: .1,
    Fast: .15,
    Normal: .25,
    Slow: .4,
    VerySlow: 1,
    GodDamnSlow: 2
  };

  // Timings for transitions
  app.transitionTime = {
    ForThisItem: app.timings.Slow,
    Stagger: app.timings.Fast,
    StaggerInsert: app.timings.Fast
  };

  // Distances in px to move
  app.transitionDistance = {
    normal: 10,
    far: 50
  };

  app.settings = {
    slideOut:{x:'-50px',opacity: 0},
    slideIn:{x:'100px',opacity: 0},
    fadeOut:{opacity: 0},
    fadeIn:{opacity: 0},
    transitionOut:'',
    transitionIn:''
  }

  // Classes name, to be same as those in scss if IsXXX
  app.classes = {
    isInitiallyHidden: "is-initially-hidden",
    isHidden: "is-hidden",
    isActive: "is-active", 
    isVisible: "is-visible",
    isInserted: "is-inserted",
    isLoading: "is-loading",
    isTransitingOut: "is-transiting-out",
    barbaWrapperId: "gem-wrapper",
    barbaContainerClass: "gem-container",
    introSection: ".csIntro",
    contentWrapperClass: ".contentWrapper",
    motionDesignVideos: ".motionDesignVideos",
    browserScreenshots: ".browser",
    mainNavLightClass: "mainNav--light",
    mainHeaderLightClass: "mainHeader--light",
    pageIsLight: "pageislight",
    pathNames: ["work","about","contact"],
    isHomepage: "mainHeader--isHomepage",
    isTrident: "is-trident"
  };

  ////
  // Status of app
  //
  app.status = {
    assetsLoaded: true,
    currentPageType: "",
    currentPathName: "",
    currentPageIsDark: true,
    isSmallScreen: true
    //numOfNav:"",
    //numOfPathNames: ""
  }

  ////
  // Components in App
  //
  app.components = {
    mainHeader: document.querySelector(".mainHeader"),
    mainNavID: document.querySelector("#mainNav"),
    barbaContainer: document.querySelector("."+app.classes.barbaContainerClass),
    win: "",
    barbaID: document.querySelector("#"+app.classes.barbaWrapperId),
    transAnimator: ""
  }

  ////
  // Listeners
  //

  // Prevents page from refreshing if the link to current page is clicked
  // https://github.com/luruke/barba.js/issues/34
  //app.components.mainNavID.addEventListener("click", function(e){
  //  if(e.target.href === window.location.href) {
  //    e.preventDefault();
  //    e.stopPropagation();
  //  }
  //});

  // When burger button is pressed, toggle the visibility of the small nav
  //app.components.mainNavBurger.addEventListener("click", function(e){
  //  app.toggleSmlMainNav();
  //});

  ////
  // App functions
  //
  /*
  app.toggleSmlMainNav = function(forceHide) {
    // ToDo: Add classlist.js for <= ie9
    if(forceHide) {
      app.components.mainNavBurger.classList.remove(app.classes.isActive);
      app.components.navigationBar.classList.remove(app.classes.isActive);
    } else {
      // Toggle active class for mainNavBurger; ie not support classList.toggle
      if(app.components.mainNavBurger.classList.contains(app.classes.isActive)) {
        app.components.mainNavBurger.classList.remove(app.classes.isActive);
      } else {
        app.components.mainNavBurger.classList.add(app.classes.isActive);
      }

      // Toggle active class for navigation; ie not support classList.toggle
      if(app.components.navigationBar.classList.contains(app.classes.isActive)) {
        app.components.navigationBar.classList.remove(app.classes.isActive);
      } else {
        app.components.navigationBar.classList.add(app.classes.isActive);
      }
    }
  }

  app.removeAllMainNavClass = function(classNameToRemove) {
    for (var i=0; i < app.status.numOfNav; i++) {
      app.components.navigationLinksAll[i].classList.remove(classNameToRemove);
    }
  }

  app.addAllMainNavClass = function(classNameToAdd) {
    for (var i=0; i < app.status.numOfNav; i++) {
      app.components.navigationLinksAll[i].classList.remove(classNameToAdd);
    }
  }

  app.updateMainNav = function() {
    // Update active page on main nav
    // $navigationLinksAll: all links on mainnav
    // $navigationLinkIsActive: matched link by href value
    //app.status.currentPathName = st.url.split(window.location.origin).toString().substr(1);

    var _c = window.location.pathname;

    app.removeAllMainNavClass(app.classes.isActive);

    app.status.currentPageType = ""
    for(var i=0; i<app.status.numOfPathNames; i++) {
      var regexr = new RegExp(app.classes.pathNames[i]);
      if(_c.match(regexr) != null) {
        app.status.currentPageType = app.classes.pathNames[i];
        app.components.navigationLinks[app.status.currentPageType].classList.add(app.classes.isActive);
        //console.log(app.components.navigationLinks[app.status.currentPageType]);

      }
    }
  }
  */

  app.updateMainNavToLight = function(changeNavToLight) {
    if (changeNavToLight) {
      app.components.mainHeader.classList.add(app.classes.mainHeaderLightClass);
      //app.components.mainNavID.classList.add(app.classes.mainNavLightClass);
    } else {
      app.components.mainHeader.classList.remove(app.classes.mainHeaderLightClass);
      //app.components.mainNavID.classList.remove(app.classes.mainNavLightClass);
    }
  }

  ////
  // Barba settings
  //

  Barba.Dispatcher.on('linkClicked', function(HTMLElement, MouseEvent) {
    //var $is = HTMLElement;
    //console.log($(HTMLElement).parent());
    //$("body").addClass(classes.IsLoading);
    //HTMLElement.classList.add(app.classes.isTransitingOut);
    if (window.location.pathname == "/") {
      //console.log(HTMLElement);
      HTMLElement.classList.add(app.classes.isTransitingOut);
    } else {
      if(HTMLElement.classList.contains("pageNavigation__links")) {
        HTMLElement.classList.add(app.classes.isTransitingOut);
      }
    }
    //app.toggleSmlMainNav(true);
  });

  //Barba.Dispatcher.on('initStateChange', function(st) {

    ////////////////////////////////
    //
    // Update active page on main nav
    // $navigationLinks: all links on mainnav
    // $navigationLinkIsActive: matched link by href value
    //app.updateMainNav(st);

    //console.log("initStateChange", st.url);
    //projectListView.onEnter();
  //});
  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, newContainer) {
    //$(newContainer).addClass(classes.IsInserted);
    //console.log("currentStatus:", currentStatus);
    //console.log("oldStatus:", oldStatus);
    //console.log("newContainer:", newContainer);

    /*if (window.location.pathname != "/") {
      console.log("newPageReady", window.location.pathname);
      var bLazy = new Blazy({
        selector:".lazy",
        loadInvisible:true,
        offset:200,
        successClass:"lazyLoaded"
      });
      //bLazy.load();
    }*/

    //ga('set', 'page', window.location.pathname);
    //ga('send', 'pageview');

    // TEMP app.updateMainNav();
    var _newContentData = newContainer.getAttribute("data-pageislight");

    if (_newContentData == 'light') {
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
    //console.log("A",_newContentData);

    // ToDo: This triggers a repaint, not gd
    //console.log(currentStatus, newContainer);
    if(currentStatus.namespace == "projectList") {
      app.components.mainHeader.classList.add(app.classes.isHomepage);
    } else {
      app.components.mainHeader.classList.remove(app.classes.isHomepage);
    }
  });

  //Barba.Dispatcher.on('transitionCompleted', function(currentStatus, oldStatus) {
    //console.log("transitionCompleted", window.location.pathname);
    /* if (window.location.pathname != "/") {
      var bLazy = new Blazy({
        selector:".lazy",
        loadInvisible:true,
        offset:200, 
        successClass:"lazyLoaded"
      });
    } */
  //});

  /*
  app.components.barbaFadeTransition = Barba.BaseTransition.extend({
    start: function() { 
      Promise
        .all([this.newContainerLoading, this.fadeOutOld()])
        .then(this.fadeInNew.bind(this));
    },

    fadeOutOld: function() {
      var deferred = Barba.Utils.deferred();
      
      TweenLite.to(this.oldContainer, .2, {
        opacity: 0,
        onComplete: function() {
          deferred.resolve();
        }
      });
        
      return deferred.promise;
    },

    fadeInNew: function() {
      var _this = this;
      var _newContainer = this.newContainer;
      var _newContentWrapper = _newContainer.querySelector(app.classes.contentWrapperClass);
      //var _newContentData = _newContainer.getAttribute("data-pageislight");
      var _introSection = _newContainer.querySelector(app.classes.introSection);
      var _toTween;

      TweenLite.set(window,{scrollTo:0});
      if(_introSection != null) {
        _toTween = _introSection;
      } else {
        _toTween = _newContainer;        
      }

      TweenLite.to(_toTween, app.timings.Normal, {
        opacity: 1
      });

      _this.done();
    }
  });
  */
  
  app.components.barbaLoadTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading])
        .then(this.slideInNew.bind(this));
    },

    slideInNew: function() {
      var _this = this;
      var _oldContainer = this.oldContainer;
      var _newContainer = this.newContainer;
      var _newContentWrapper = _newContainer.querySelector(app.classes.contentWrapperClass);
      var _introSection = _newContainer.querySelector(app.classes.introSection);
      var tl = new TimelineLite();
      var _toTween;

      function completeToDO() {
        _this.done();
        TweenLite.set(window,{scrollTo:0});
      }

      function doGSAP() {
        
        tl
          .to(_oldContainer, app.timings.Fast, app.settings.transitionOut)
          .call(completeToDO)
          .from(_toTween, app.timings.Normal, app.settings.transitionIn);
        /*
        tl
          .to(_oldContainer, app.timings.Fast, {
            x:'-50px',
            opacity: 0
          })
          .call(completeToDO)
          .from(_toTween, app.timings.Normal, {
            opacity: 0,
            x:'100px'
          });
          */
      }

      //app.showLoader();

      if(_introSection == null) {
        // Meaning it's homepage
        // we just transit
        _toTween = _newContainer;
        doGSAP();
      } else {
        // If it's a casestudy
        // Makes sure the intro__bg.jpg is loaded before transiting
        imagesLoaded( _introSection, function(instance) {
          _toTween = _introSection;
          doGSAP();
        });
      }
    }
  });

  // Call new Transition 
  Barba.Pjax.getTransition = function() {
    //var transitionObj = app.components.barbaFadeTransition;
    var transitionObj;

    transitionObj = app.components.barbaLoadTransition;
    /*      
    if (app.status.isSmallScreen) {
      transitionObj = app.components.barbaFadeTransition;
    } else {
      transitionObj = app.components.barbaLoadTransition;        
      //transitionObj = app.components.barbaSlideTransition;
    }
    */

    return transitionObj;
  };

  var projectListView = Barba.BaseView.extend({
    namespace: 'projectList',
    bLazy:'',
    //onEnter: function() {
      //console.log("home on enter");
    //},
    onEnterCompleted:function() {
     var tilts = document.querySelectorAll('a.project__link');
     var projWrapContainer = document.querySelector('.projectWrap');

     // We want to disable the click of other projects when the current one is still loading
     // Hack way since it's better to stop current loading, but currently not able
     projWrapContainer.addEventListener("click",function(e) {
      //console.log(e);
      //this.classList.add(app.classes.isTransitingOut);
      if(Barba.Pjax.transitionProgress) {
        //console.log(Barba.Pjax.transitionProgress);
        e.preventDefault();
        e.stopPropagation();        
      }
     });

     tilts.forEach(function(el,pos){
      new TiltFx(el);
     });

     this.bLazy = new Blazy({
       selector:".lazy",
       loadInvisible:true,
       successClass:"lazyLoaded"
     });
    },
    onLeave:function() {
      // Destroy the bLazy listeners
      this.bLazy.destroy();
    }
  });

  var caseStudyView = Barba.BaseView.extend({
    namespace: 'caseStudyView',
    videoWatchers:'',
    browserWatchers:'',
    bLazy:'',
    //onEnter: function() {
    //*  console.log("Status: proj onEnter");
    //},
    onEnterCompleted: function() {
      var _allBrowsers = document.querySelectorAll(app.classes.browserScreenshots);
      var _allVideos = document.querySelectorAll(app.classes.motionDesignVideos);

      // Setup lazyloading of images
      this.bLazy = new Blazy({
        selector:".lazy",
        loadInvisible:true,
        offset:200, 
        successClass:"lazyLoaded"
      });

      // Setup watchers for browsers
      // Add is-visible class which will scroll them up into view
      this.browserWatchers = Array.prototype.map.call(_allBrowsers, function(obj) {
        var browserWatcher = scrollMonitor.create( obj );
        browserWatcher.enterViewport(function() {
          obj.classList.add(app.classes.isVisible);
          browserWatcher.destroy;
        });
        return browserWatcher;
      });

      // Setup watchers for videos
      // Add is-played class and will play video if paused
      this.videoWatchers = Array.prototype.map.call(_allVideos, function(obj) {
        var videoWatcher = scrollMonitor.create( obj );
        videoWatcher.enterViewport(function() {
          obj.classList.add(app.classes.played);
          if (obj.paused) {
            obj.play();
          }
          // Find a way to destroy watchers when not in used
          //this.destroy();
        });
        return videoWatcher;
      });
    },
    onLeave: function() {
      // Destroy the bLazy listeners
      this.bLazy.destroy();

      // Destroy the video and browser watchers to free up memory
      this.videoWatchers.forEach(function(el,pos){
        el.destroy();
      });

      this.browserWatchers.forEach(function(el,pos){
        el.destroy();
      });
    }
  });
  
  app.init = function() {

    // Load commonly used google fonts
    WebFont.load({
      google: {
        families: ['Catamaran:300,300italic,400,700,800,900']
      }
    });

    // Customising Barba
    Barba.Pjax.Dom.wrapperId  = app.classes.barbaWrapperId;
    Barba.Pjax.Dom.containerClass = app.classes.barbaContainerClass;
    
    //Barba.Prefetch.init();

    /////////////////////////////////////////////////////
    //
    // DEV ONLY
    //Barba.Pjax.cacheEnabled = false;
    //
    // END DEV ONLY
    /////////////////////////////////////////////////////

    projectListView.init();
    caseStudyView.init();
    Barba.Pjax.init();
    //Barba.Pjax.start();

    if(helper.isTrident()) {
      //console.log(isTrident());
      document.documentElement.classList.add(app.classes.isTrident);
    }

    app.settings.transitionOut = app.settings.fadeOut;
    app.settings.transitionIn = app.settings.fadeIn;

    if(window.matchMedia) {
      if(window.matchMedia("only screen and (min-width: 760px)").matches) {
        app.status.isSmallScreen = false;
        app.settings.transitionOut = app.settings.slideOut;
        app.settings.transitionIn = app.settings.slideIn;
      }
    }

    //
    // Store the initial page brightness
    if(document.querySelector("."+app.classes.barbaContainerClass).getAttribute("data") == app.classes.pageIsLight) {
      app.status.currentPageIsDark = false;
    };
 
    //app.components.transAnimator = new TimelineLite();

    //
    // Store the number of navigation links for iteration later
    //app.status.numOfNav = app.components.navigationLinksAll.length;
    //app.status.numOfPathNames = app.classes.pathNames.length;

    //
    // Loop through all the navigation links on navbar and 
    // cache them into app.components.navigationLinks
    //for(var i=0;i<app.status.numOfNav;i++){
    //  var name = app.classes.pathNames[i];
    //  var link = app.components.navigationBar.querySelector("[data-pagetype$="+name+"]");
    //  app.components.navigationLinks[name] = link;
    //};
  }

  app.init();

})();