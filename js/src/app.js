/* ==========================================================================
   patrick.hoopr.io JavaScript / jQuery
   ========================================================================== */

/* Variables
   ======================================================================== */
var wrapper = $('#wrapper'),
    masthead = $('#masthead'),
    mainNav = $('.main-nav'),
    letters = $('.letter-animate'),
    navAbout = $('.nav-about'),
    navPortfolio = $('.nav-portfolio'),
    lastActive = null,
    hero = $('#hero'),
    heroAnimate = $('#hero .hero-animate'),
    heroArrow = $('#hero .hero_arrow'),
    fadeHeroDiv,
    fadeHeroArrow,
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
  taglines.eq(i).fadeIn(900)
            .delay(1000)
            .fadeOut(900, cycle);
  i = ++i % taglines.length;
};

/* GSAP Tweens
   ======================================================================== */

if (Modernizr.mq('(min-width: 46.0625rem)')) {

  /**
   * Tween logo letters from opacity of 1 and full width to no width and
   * opacity of 0. Start 1 seconds after page is ready.
   */
  var tweenLetters = TweenMax.to(letters, 0.6, {
    delay: 0.6,
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

  /**
   * Tween Hero arrow from border properties over the duration
   * of the tween.
   */
  fadeHeroArrow = TweenMax.to(heroArrow, 0.3, {
    borderLeftWidth: 320,
    borderRightWidth: 320,
    borderTopWidth: 0,
    bottom: 0,
    marginLeft: -320
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

/* Scene to smush hero arrow up into itself when scrolling */
var heroArrow = new ScrollMagic.Scene({
  triggerElement: '#hero',
  triggerHook: 'onLeave', // Start when trigger starts leaving viewport
  duration: '75%' // End when viewport has moved 75%
})
.setTween(fadeHeroArrow);

/* Waypoints
   ======================================================================== */

/* Waypoints only for the home page */
if (wrapper.hasClass('layout-home')) {

  /**
   * Toggles active class for About and also flags the header as scrolling
   */
  var aboutWaypoint = about.waypoint(function(direction) {

    /* When going down and you hit about section, do stuff */
    if (direction === 'down') {
      masthead.addClass('scroll-header'); // Add class to header for scrolling
      navAbout.addClass('active'); // Add active class to about
      navPortfolio.removeClass('active'); // Remove active class from portfolio nav
      lastActive = navAbout; // Make about nav the last active

      /* When going up and you hit About section, do stuff */
    } else {
      masthead.removeClass('scroll-header'); // Remove scrolling header class
      navAbout.removeClass('active'); // Remove active class from about
      navPortfolio.removeClass('active'); // Remove active class from portfolio
      lastActive = null; // Remove last active element
    }
  },{
    /* Make offset the header height or the nav height (small devices) */
    offset: function() {
      return Modernizr.mq('(min-width: 46.0625rem)') ? masthead.height() + 17 : mainNav.height();
    }
  });

  /**
   * Toggles active class for Portfolio and removes for About
   */
  var portfolioWaypoint = portfolio.waypoint(function(direction) {

    /* When going down and you hit Portfolio section, do stuff */
    if (direction === 'down') {
      navAbout.removeClass('active'); // Remove active class from about
      navPortfolio.addClass('active'); // Add active class to portfolio
      lastActive = navPortfolio; // Make portfolio nav the last active

      /* When going up and you hit Portfolio section, do stuff */
    } else {
      navAbout.addClass('active'); // Add active class to about
      navPortfolio.removeClass('active'); // Remove active class from portfolio
      lastActive = navAbout; // Make about the last active
    }
  },{
    /* Make offset the header height or the nav height (small devices) */
    offset: function() {
      return Modernizr.mq('(min-width: 46.0625rem)') ? masthead.height() + 17 : mainNav.height();
    }
  });

  /**
   * Toggles active class Portfolio at bottom, restores previous active on up
   */
  var contactWaypoint = contact.waypoint(function(direction) {

    /* When going down and you hit Contact section, do stuff */
    if (direction === 'down') {
      navAbout.removeClass('active'); // Remove active class from about
      navPortfolio.addClass('active'); // Add active class to portfolio

      /* When going up and you hit Contact section, do stuff */
    } else {
      navAbout.removeClass('active'); // Remove active class from about
      navPortfolio.removeClass('active'); // Remove active class from portfolio
      lastActive.addClass('active'); // Add active class to last active
    }
  }, {
    /* Offset is 100%, so when it enters into view */
    offset: '100%'
  });

  /* Waypoints for Portfolio pages */
} else {

  /**
   * Flags Portfolio page header as scrolling
   */
  var projectWaypoint = project.waypoint(function(direction) {

    /* When going down, add scrolling header class. When up, remove */
    if (direction === 'down') {
      masthead.addClass('scroll-header');
    } else {
      masthead.removeClass('scroll-header');
    }
  }, {
    /* Offset is the top margin of the portfolio page title */
    offset: parseFloat(project.find('.project_summary h2.title').css('margin-top')) * -1
  });
}

/* Scripts
   ======================================================================== */

/* Tell ScrollMagic to animate scroll over 0.6 sec rather than jump */
scrollMagicController.scrollTo(function (newpos) {
  TweenMax.to(window, 0.6, {scrollTo: {y: newpos}});
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
  if (Modernizr.mq('(min-width: 46.0625rem)')) {

    /* Hide all taglines to start */
    taglines.hide();

    /* Start cycling through taglines 1 seconds after page ready */
    setTimeout(cycle, 1100);

    /* Bring Learn More button to full opacity 8 seconds after page ready */
    setTimeout(function() {
      learnMore.animate({opacity: 1}, 3000);
    }, 7000);

    /* Add hero scenes to controller */
    scrollMagicController.addScene([heroScene, heroArrow]);
  }

  /* Initialize kwicks */
  $('.kwicks-vertical').kwicks({
    behavior: 'menu',
    duration: 300,
    maxSize: '85%',
    isVertical: true,
    selectOnClick: false,
    spacing: 0
  });

  /* Do the following only if this is not a touch device */
  if (!Modernizr.touch) {

    /* Slides up/down project logo overlay when it's hovered over on non-touch devices */
    $('.project').hover(function() {
      $(this).find('.project_overlay').css('max-height', $(this).height()).slideToggle(300);
    });
  }
}
