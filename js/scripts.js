/* ==========================================================================
   patrick.hoopr.io JavaScript / jQuery
   ========================================================================== */

$(document).ready(function () {

  /* Variables
     ======================================================================== */
  var wrapper = $('#wrapper'),
      masthead = $('#masthead'),
      mainNav = $('.main-nav'),
      letters = $('.letter-animate'),
      navAbout = $('.nav-about'),
      navPortfolio = $('.nav-portfolio'),
      navContact = $('.nav-contact'),
      hero = $('#hero'),
      heroAnimate = $('#hero .hero-animate'),
      fadeHeroDiv,
      taglines = $('.tagline'), // Hide all taglines initially
      i = 0, // Counter for taglines
      learnMore = $('.learn-more'),
      about = $('#about'),
      portfolio = $('#portfolio'),
      contact = $('#contact'),
      project = $('.portfolio-page');

  /* Functions
     ======================================================================== */

  /**
   * Function that adds letter-collpased class and removes GSAP styles
   * from logo letters once tween is complete.
   */
  function tweenLettersComplete() {
    letters.addClass('letter-collapsed').removeAttr('style');
  }

  /**
   * Function cycles through taglines in Hero section by fading in and out
   * taglines. Goes back to beginning once it reaches the end.
   */
  function cycle() {
    taglines.eq(i).fadeIn(1000)
              .delay(1000)
              .fadeOut(1000, cycle);
    i = ++i % taglines.length;
  };

  /* GSAP Tweens
     ======================================================================== */

  if (Modernizr.mq('(min-width: 768px)')) {

    /**
     * Tween logo letters from opacity of 1 and full width to no width and
     * opacity of 0. Start 1.5 seconds after page is ready.
     */
    var tweenLetters = TweenMax.to(letters, 1, {
      delay: 1,
      width: 0,
      opacity: 0,
      onComplete: tweenLettersComplete
    });

    /**
     * Tween Hero section from opacity of 1 to opacity of 0. Move top of section
     * from start location to 75% from the top of its parent over the duration
     * of the tween.
     */
    fadeHeroDiv = TweenMax.to(heroAnimate, 1, {
      opacity: 0,
      top: '75%'
    });
  }

  /* ScrollMagic Scenes
     ======================================================================== */

  /* ScrollMagic Controller to handle scenes */
  var scrollMagicController = new ScrollMagic.Controller();

  /* Scene to fade Hero section and produce parallax effect */
  var heroScene = new ScrollMagic.Scene({
    triggerElement: '#hero',
    triggerHook: 'onLeave', // Start when trigger starts leaving viewport
    duration: '100%' // End when viewport has moved 100%
  })
  .setTween(fadeHeroDiv); // Use the fadeHeroDiv tween defined

  /* Waypoints
     ======================================================================== */

  /* Waypoints only for the home page */
  if (wrapper.hasClass('layout-home')) {

    /**
     * Toggles active class for About and also flags the header as scrolling
     */
    var aboutWaypoint = about.waypoint(function(direction) {
      if (direction === 'down') {
        masthead.addClass('scroll-header');
        navAbout.addClass('active');
        navPortfolio.removeClass('active');
        navContact.removeClass('active');
      }
      else {
        masthead.removeClass('scroll-header');
        navAbout.removeClass('active');
        navPortfolio.removeClass('active');
        navContact.removeClass('active');
      }
    },{
      offset: function() {
        if (masthead.hasClass('scroll-header')) {
          return Modernizr.mq('(min-width: 768px)') ? masthead.height() : mainNav.height();
        }
        else {
          return Modernizr.mq('(min-width: 768px)') ? masthead.height() - 8 : mainNav.height() - 9;
        }
      }
    });

    /**
     * Toggles active class for Portfolio and removes for About
     */
    var portfolioWaypoint = portfolio.waypoint(function(direction) {
      if (direction === 'down') {
        navAbout.removeClass('active');
        navPortfolio.addClass('active');
        navContact.removeClass('active');
      }
      else {
        navAbout.addClass('active');
        navPortfolio.removeClass('active');
        navContact.removeClass('active');
      }
    },{
      offset: function() {
        if (masthead.hasClass('scroll-header')) {
          return Modernizr.mq('(min-width: 768px)') ? masthead.height() : mainNav.height();
        }
        else {
          return Modernizr.mq('(min-width: 768px)') ? masthead.height() - 8 : mainNav.height() - 9;
        }
      }
    });

    /**
     * Toggles active class for Contact and removes for Portfolio
     */
    var contactWaypoint = contact.waypoint(function(direction) {
      if (direction === 'down') {
        navAbout.removeClass('active');
        navPortfolio.removeClass('active');
        navContact.addClass('active');
      }
      else {
        navAbout.removeClass('active');
        navPortfolio.addClass('active');
        navContact.removeClass('active');
      }
    },{
      offset: 'bottom-in-view'
    });
  }

  /* Waypoints for Portfolio pages*/
  else {

    /**
     * Flags Portfolio page header as scrolling
     */
    var projectWaypoint = project.waypoint(function(direction) {
      if (direction === 'down') {
        masthead.addClass('scroll-header');
      }
      else {
        masthead.removeClass('scroll-header');
      }
    },{
      offset: parseFloat(project.find('.project_summary h2.title').css('margin-top')) * -1
    });
  }

  /* Scripts
     ======================================================================== */

  /* Tell ScrollMagic to animate scroll over 0.5 sec rather than jump */
  scrollMagicController.scrollTo(function (newpos) {
    TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
  });

  /* Tell ScrollMagic to listen for anchor link clicks and scroll to them */
  $(document).on("click", "a[href^='#']", function (e) {
    var id = $(this).attr("href");
    if ($(id).length > 0) {
      e.preventDefault();
      scrollMagicController.scrollTo(id);
      if (window.history && window.history.pushState) {
        history.pushState("", document.title, id);
      }
    }
  });

  /* Lazy loads images as they're 568px outside the view */
  $("img.lazy").unveil(568);

  /* Do the following only if this is the home page */
  if (wrapper.hasClass('layout-home')) {

    /* Do the following only if this is a large screen */
    if (Modernizr.mq('(min-width: 768px)')) {

      /* Hide all taglines to start */
      taglines.hide();

      /* Start cycling through taglines 3 seconds after page ready */
      setTimeout(cycle, 2000);

      /* Bring Learn More button to full opacity 17 seconds after page ready */
      setTimeout(function() {
        learnMore.animate({opacity: 1}, 2000);
      }, 16000);

      /* Add hero scene to controller */
      scrollMagicController.addScene([heroScene]);
    }

    /* Do the following only if this is not a touch device */
    if (!Modernizr.touch) {

      /* Slides up/down project logo overlay when it's hovered over on non-touch devices */
      $('.project').hover(function() {
        $(this).find('.project_overlay').slideToggle(500);
      });
    }
  }
});
