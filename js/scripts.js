/* ==========================================================================
   patrick.hoopr.io JavaScript / jQuery
   ========================================================================== */

$(document).ready(function () {

  /* Variables
     ======================================================================== */
  var windowHeight = $(window).height(),
      wrapper = $('#wrapper'),
      masthead = $('#masthead'),
      main_nav = $('.main-nav'),
      mastheadHeight = masthead.height(),
      letters = $('.letter-animate'),
      hero = $('#hero'),
      hero_animate = $('#hero .hero-animate'),
      fadeHeroDiv,
      taglines = $('.tagline'), // Hide all taglines initially
      i = 0, // Counter for taglines
      learn_more = $('.learn-more'),
      about = $('#about'),
      portfolio = $('#portfolio'),
      contact = $('#contact');

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

  /**
   * Function that updates the header height stored in mastheadHeight variable
   * when called.
   */
  function updateMasthead() {
    if (Modernizr.mq('(min-width: 768px)')) {
      mastheadHeight = masthead.height();
    }
    else {
      mastheadHeight = main_nav.height();
    }
  }

  /**
   * Function that the offset of the active home ScrollMagic scene when called.
   */
  function updateActiveHomeScene() {
    activeHomeScene.offset(mastheadHeight * -1);
  }

  /**
   * Function that updates the offset and duration of the
   * About section ScrollMagic scene when called.
   */
  function updateAboutScene() {
    aboutScene.offset(mastheadHeight * -1);
    aboutScene.duration(about.innerHeight());
  }

  /**
   * Function that updates the offset and duration of the
   * Portfolio section ScrollMagic scene when called.
   */
  function updatePortfolioScene() {
    portfolioScene.offset(mastheadHeight * -1);
    portfolioScene.duration(portfolio.innerHeight() + mastheadHeight - (windowHeight - contact.innerHeight()));
  }

  /**
   * Function that updates the offset of the
   * Contact section ScrollMagic scene when called.
   */
  function updateContactScene() {
    contactScene.offset(contact.innerHeight() - 1);
  }

  /**
   * Function that runs all updates when called.
   */
  function updateScenes() {
    updateMasthead();
    if (wrapper.hasClass('layout-home')) {
      updateActiveHomeScene();
      updateAboutScene();
      updatePortfolioScene();
      updateContactScene();
    }
  }

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
    fadeHeroDiv = TweenMax.to(hero_animate, 1, {
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

  /* Scene to toggle when Header is scrolling outside the Hero section */
  var activeHomeScene = new ScrollMagic.Scene({
    triggerElement: '#about',
    triggerHook: 'onLeave', // Start when trigger starts leaving viewport
    offset: mastheadHeight * -1, // Offset the start (early) by header height
  })
  .setClassToggle("#masthead", "scroll-header");

  /* Scene to toggle when scroll is within the About section */
  var aboutScene = new ScrollMagic.Scene({
    triggerElement: '#about',
    triggerHook: 'onLeave', // Start when trigger starts leaving viewport
    offset: mastheadHeight * -1, // Offset the start (early) by header height
    duration: about.innerHeight() // End when section has moved its height
  })
  .setClassToggle(".nav-about", "about-active");

  /* Scene to toggle when scroll is within the Portfolio section */
  var portfolioScene = new ScrollMagic.Scene({
    triggerElement: '#portfolio',
    triggerHook: 'onLeave', // Start when trigger starts leaving viewport
    offset: mastheadHeight * -1, // Offset the start (early) by header height
    duration: portfolio.innerHeight() + mastheadHeight - (windowHeight - contact.innerHeight()) // End when page is at the bottom
  })
  .setClassToggle(".nav-portfolio", "portfolio-active");

  /* Scene to toggle when scroll is at the Contact section (bottom of page) */
  var contactScene = new ScrollMagic.Scene({
    triggerElement: '#contact',
    triggerHook: 'onEnter', // Start when trigger enters the viewport
    offset: contact.innerHeight() - 1 // Offset the start (late) by section height - 1
  })
  .setClassToggle(".nav-contact", "contact-active");

  /* Scene to toggle when Header is scrolling outside the Hero section */
  var activePortfolioScene = new ScrollMagic.Scene({
//    triggerElement: '#project',
    triggerHook: 'onLeave', // Start when trigger starts leaving viewport
    offset: $('.title').css('margin-top'), // Offset the start (early) by header height
  })
  .setClassToggle("#masthead", "scroll-header");


  /* Scripts
     ======================================================================== */
  if (Modernizr.mq('(min-width: 768px)')) {

    /* Hide all taglines to start */
    taglines.hide();

    /* Start cycling through taglines 3 seconds after page ready */
    setTimeout(cycle, 2000);

    /* Bring Learn More button to full opacity 17 seconds after page ready */
    setTimeout(function() {
      learn_more.animate({opacity: 1}, 2000);
    }, 16000);
  }
  else {
    updateScenes();
  }

  if (!Modernizr.touch) {
    /* Slides up/down project logo overlay when it's hovered over on non-touch devices */
    $('.project').hover(function() {
      $(this).find('.project_overlay').slideToggle(500);
    });
  }

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

  if (wrapper.hasClass('layout-home')) {
    if (Modernizr.mq('(min-width: 768px)')) {
      scrollMagicController.addScene([heroScene]);
    }
    scrollMagicController.addScene([activeHomeScene, aboutScene, portfolioScene, contactScene]);
  }
  else if (wrapper.hasClass('layout-portfolio')) {
    scrollMagicController.addScene([activePortfolioScene]);
  }

  /* Lazy loads images as they're 568px outside the view */
  $("img.lazy").unveil(568);

  /* Run functions when window resizes (only every 100ms) */
  $(window).smartresize(function() {
    updateScenes();
  });
});
