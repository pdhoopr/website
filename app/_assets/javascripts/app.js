/* =========================================================================
   patrick.hoopr.io JavaScript / jQuery
   ========================================================================= */

/* Variables
   ======================================================================== */
const $wrapper = $('#wrapper');
const $masthead = $('#masthead');
const $mainNav = $('.main-nav');
const $logoLetters = $('.logo-letter.animate');
const $mainNavAbout = $('.main-nav .nav-about');
const $mainNavPortfolio = $('.main-nav .nav-portfolio');
let $lastActiveSection = null; // Holds last active section while scrolling
const $heroAnimation = $('#hero .hero-animation');
const $heroArrow = $('#hero .arrow');
const $heroTaglines = $('#hero .tagline'); // Hide all taglines initially
let heroTaglineNum = 0; // Counter for taglines
const $heroCTA = $('#hero .cta');
const $aboutSection = $('#about');
const $portfolioSection = $('#portfolio');
const $contactSection = $('#contact');
const $portfolioPage = $('.portfolio-page');

/* Functions
   ======================================================================== */

/**
 * Function that adds letter-collpased class and removes GSAP styles
 * from logo letters once tween is complete.
 *
 * @returns { Void } Returns no value
 */
function tweenLogoLettersComplete() {
  $logoLetters.addClass('collapsed').removeAttr('style');
}

/**
 * Function cycles through taglines in Hero section by fading in and out
 * taglines. Goes back to beginning once it reaches the end.
 *
 * @returns { Void } Returns no value
 */
function cycle() {
  $heroTaglines.eq(heroTaglineNum).fadeIn(1000).delay(1000).fadeOut(1000, cycle);
  heroTaglineNum = ++heroTaglineNum % $heroTaglines.length;
}

/* GSAP Tweens
   ======================================================================== */

/**
 * Tween logo letters from opacity of 1 and full width to no width and
 * opacity of 0. Start 1 seconds after page is ready.
 */
const tweenLogoLetters = TweenMax.to($logoLetters, 0.6, {
  delay: 0.6,
  width: 0,
  opacity: 0,
  onComplete: tweenLogoLettersComplete
});

/**
 * Tween Hero section from opacity of 1 to opacity of 0. Move top of section
 * from start location to 75% from the top of its parent over the duration
 * of the tween.
 */
const fadeHeroDiv = TweenMax.to($heroAnimation, 1, {
  opacity: 0,
  top: '75%'
});

/**
 * Tween Hero arrow from border properties over the duration
 * of the tween.
 */
const fadeHeroArrow = TweenMax.to($heroArrow, 0.3, {
  borderLeftWidth: 320,
  borderRightWidth: 320,
  borderTopWidth: 0,
  bottom: 0,
  marginLeft: -320
});

/* ScrollMagic Scenes
   ======================================================================== */

/* ScrollMagic Controller to handle scenes */
const scrollMagicController = new ScrollMagic.Controller();

/* Scene to fade Hero section and produce parallax effect */
const heroScene = new ScrollMagic.Scene({
  triggerElement: '#hero',
  triggerHook: 'onLeave', // Start when trigger starts leaving viewport
  duration: '100%' // End when viewport has moved 100%
})
.setTween(fadeHeroDiv); // Use the fadeHeroDiv tween defined

/* Scene to smush hero arrow up into itself when scrolling */
const heroArrowScene = new ScrollMagic.Scene({
  triggerElement: '#hero',
  triggerHook: 'onLeave', // Start when trigger starts leaving viewport
  duration: '75%' // End when viewport has moved 75%
})
.setTween(fadeHeroArrow);

/* Waypoints
   ======================================================================== */

/* Waypoints only for the home page */
if ($wrapper.hasClass('default-page')) {

  /**
   * Toggles active class for About and also flags the header as scrolling
   */
  const aboutWaypoint = $aboutSection.waypoint(function (direction) {

    /* When going down and you hit about section, do stuff */
    if (direction === 'down') {
      $wrapper.addClass('scrolling'); // Add class to header for scrolling
      $mainNavAbout.addClass('active'); // Add active class to about
      $mainNavPortfolio.removeClass('active'); // Remove active class from portfolio nav
      $lastActiveSection = $mainNavAbout; // Make about nav the last active

      /* When going up and you hit About section, do stuff */
    } else {
      $wrapper.removeClass('scrolling'); // Remove scrolling header class
      $mainNavAbout.removeClass('active'); // Remove active class from about
      $mainNavPortfolio.removeClass('active'); // Remove active class from portfolio
      $lastActiveSection = null; // Remove last active element
    }
  }, {
    /* Make offset the header height or the nav height (small devices) */
    offset: function () {
      return Modernizr.mq('(min-width: 46.0625rem)') ? $masthead.height() : $mainNav.height() + 1;
    }
  });

  /**
   * Toggles active class for Portfolio and removes for About
   */
  const portfolioWaypoint = $portfolioSection.waypoint(function (direction) {

    /* When going down and you hit Portfolio section, do stuff */
    if (direction === 'down') {
      $mainNavAbout.removeClass('active'); // Remove active class from about
      $mainNavPortfolio.addClass('active'); // Add active class to portfolio
      $lastActiveSection = $mainNavPortfolio; // Make portfolio nav the last active

      /* When going up and you hit Portfolio section, do stuff */
    } else {
      $mainNavAbout.addClass('active'); // Add active class to about
      $mainNavPortfolio.removeClass('active'); // Remove active class from portfolio
      $lastActiveSection = $mainNavAbout; // Make about the last active
    }
  }, {
    /* Make offset the header height or the nav height (small devices) */
    offset: function () {
      return Modernizr.mq('(min-width: 46.0625rem)') ? $masthead.height() : $mainNav.height() + 1;
    }
  });

  /**
   * Toggles active class Portfolio at bottom, restores previous active on up
   */
  const contactWaypoint = $contactSection.waypoint(function (direction) {

    /* When going down and you hit Contact section, do stuff */
    if (direction === 'down') {
      $mainNavAbout.removeClass('active'); // Remove active class from about
      $mainNavPortfolio.addClass('active'); // Add active class to portfolio

      /* When going up and you hit Contact section, do stuff */
    } else {
      $mainNavAbout.removeClass('active'); // Remove active class from about
      $mainNavPortfolio.removeClass('active'); // Remove active class from portfolio
      $lastActiveSection.addClass('active'); // Add active class to last active
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
  const projectWaypoint = $portfolioPage.waypoint(function (direction) {

    /* When going down, add scrolling header class. When up, remove */
    if (direction === 'down') {
      $wrapper.addClass('scrolling');
    } else {
      $wrapper.removeClass('scrolling');
    }
  }, {
    /* Offset is the top margin of the portfolio page title */
    offset: parseFloat($portfolioPage.find('.title').css('margin-top')) * -1
  });
}

/* Scripts
   ======================================================================== */

/* Tell ScrollMagic to animate scroll over 0.5 sec rather than jump */
scrollMagicController.scrollTo(function (newpos) {
  TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
});

/* Tell ScrollMagic to listen for anchor link clicks and scroll to them */
$(document).on('click', 'a[href^="#"]', function (e) {
  const id = $(this).attr('href');
  if ($(id).length > 0) {
    e.preventDefault();
    scrollMagicController.scrollTo(id);
    if (window.history && window.history.pushState) {
      history.pushState('', document.title, id);
    }
  }
});

/* Lazy loads images as they're 568px outside the view */
$('img.lazy').unveil(568);

/* Do the following only if this is the home page */
if ($wrapper.hasClass('default-page')) {

  /* Do the following only if this is a large screen */
  if (Modernizr.mq('(min-width: 46.0625rem)')) {

    /* Hide all taglines to start */
    $heroTaglines.hide();

    /* Start cycling through taglines 1 seconds after page ready */
    setTimeout(cycle, 500);

    /* Bring Learn More button to full opacity 8 seconds after page ready */
    setTimeout(function () {
      $heroCTA.animate({opacity: 1}, 3000);
    }, 5000);

    /* Add hero scenes to controller */
    scrollMagicController.addScene([heroScene, heroArrowScene]);
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
}
