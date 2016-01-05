/* =========================================================================
   Variables
   ========================================================================= */
const $page = $('.page');
const $logoLetters = $('.logo-letter.animate');
const $mainNav = $('.main-nav');
const $mainNavMenu = $('.main-nav .menu');
const $mainNavMenuItemAbout = $('.main-nav .menu-item-about');
const $mainNavMenuItemPortfolio = $('.main-nav .menu-item-portfolio');
let $lastMainNavMenuItem = null; // Holds last active section while scrolling
const $colophon = $('.colophon');

/* Variables | Home
   ========================================================================= */
const $homeHeroAnimation = $('.home-hero-animation');
const $homeHeroAnimationTaglines = $('.home-hero-animation .tagline');
let homeHeroAnimationTaglineNum = 0; // Counter for taglines
const $homeHeroAnimationCTA = $('.home-hero-animation .cta');
const $homeHeroArrow = $('.home-hero .arrow');
const $homeAboutSection = $('.home-about-section');
const $homePortfolioSection = $('.home-portfolio-section');

/* Variables | Portfolio
   ========================================================================= */
const $portfolioPage = $('.portfolio-page');

/* =========================================================================
   Functions
   ========================================================================= */

/**
 * Function that adds letter-collpased class and removes GSAP styles
 * from logo letters once tween is complete.
 *
 * @returns { Void } Returns no value
 */
function tweenLogoLettersComplete() {
  $logoLetters.addClass('collapsed').removeAttr('style');
}

/* Functions | Home
   ========================================================================= */

/**
 * Function cycles through taglines in Hero section by fading in and out
 * taglines. Goes back to beginning once it reaches the end.
 *
 * @returns { Void } Returns no value
 */
function cycle() {
  $homeHeroAnimationTaglines.eq(homeHeroAnimationTaglineNum).fadeIn(1000).delay(1000).fadeOut(1000, cycle);
  homeHeroAnimationTaglineNum = ++homeHeroAnimationTaglineNum % $homeHeroAnimationTaglines.length;
}

/* =========================================================================
   GSAP Tweens
   ========================================================================= */

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

/* GSAP Tweens | Home
   ========================================================================= */

/**
 * Tween Hero section from opacity of 1 to opacity of 0. Move top of section
 * from start location to 66% from the top of its parent over the duration
 * of the tween.
 */
const fadeHomeHeroAnimation = TweenMax.to($homeHeroAnimation, 1, {
  opacity: 0,
  top: '66%'
});

/**
 * Tween Hero arrow from border properties over the duration
 * of the tween.
 */
const fadeHomeHeroArrow = TweenMax.to($homeHeroArrow, 0.3, {
  borderLeftWidth: 320,
  borderRightWidth: 320,
  borderTopWidth: 0,
  bottom: 0,
  marginLeft: -320
});

/* =========================================================================
   ScrollMagic Scenes
   ========================================================================= */
const scrollMagicController = new ScrollMagic.Controller();

/* ScrollMagic Scenes | Home
   ========================================================================= */

/**
 * Fade Home Hero section and produce parallax effect
 */
const homeHeroAnimationScene = new ScrollMagic.Scene({
  triggerElement: '.home-hero',
  triggerHook: 'onLeave', // Start when trigger starts leaving viewport
  duration: '100%' // End when viewport has moved 100%
})
.setTween(fadeHomeHeroAnimation); // Use the fadeHomeHeroAnimation tween

/**
 * Smush Hero arrow up into itself when scrolling
 */
const homeHeroArrowScene = new ScrollMagic.Scene({
  triggerElement: '.home-hero',
  triggerHook: 'onLeave', // Start when trigger starts leaving viewport
  duration: '100%' // End when viewport has moved 75%
})
.setTween(fadeHomeHeroArrow);

/* =========================================================================
   Waypoints
   ========================================================================= */

/* Waypoints | Home
   ========================================================================= */
if ($page.hasClass('default-page')) {

  /**
   * Toggles active class for About and also flags the page as scrolling
   */
  const homeAboutSectionWaypoint = $homeAboutSection.waypoint((direction) => {

    /* When going down and you hit about section, do stuff */
    if (direction === 'down') {
      $page.addClass('scrolling');
      $mainNavMenuItemAbout.addClass('active');
      $mainNavMenuItemPortfolio.removeClass('active');
      $lastMainNavMenuItem = $mainNavMenuItemAbout;

      /* When going up and you hit About section, do stuff */
    } else {
      $page.removeClass('scrolling');
      $mainNavMenuItemAbout.removeClass('active');
      $mainNavMenuItemPortfolio.removeClass('active');
      $lastMainNavMenuItem = null;
    }
  }, {
    /* Make offset the nav bar height or the nav menu height (small devices) */
    offset() {
      return Modernizr.mq('(min-width: 46.0625rem)') ? $mainNav.height() : $mainNavMenu.height();
    }
  });

  /**
   * Toggles active class for Portfolio and removes for About
   */
  const homePortfolioSectionWaypoint = $homePortfolioSection.waypoint((direction) => {

    /* When going down and you hit Portfolio section, do stuff */
    if (direction === 'down') {
      $mainNavMenuItemAbout.removeClass('active');
      $mainNavMenuItemPortfolio.addClass('active');
      $lastMainNavMenuItem = $mainNavMenuItemPortfolio;

      /* When going up and you hit Portfolio section, do stuff */
    } else {
      $mainNavMenuItemAbout.addClass('active');
      $mainNavMenuItemPortfolio.removeClass('active');
      $lastMainNavMenuItem = $mainNavMenuItemAbout;
    }
  }, {
    /* Make offset the nav bar height or the nav menu height (small devices) */
    offset() {
      return Modernizr.mq('(min-width: 46.0625rem)') ? $mainNav.height() : $mainNavMenu.height();
    }
  });

  /**
   * Toggles active class Portfolio at bottom, restores previous active on up
   */
  const colophonWaypoint = $colophon.waypoint((direction) => {

    /* When going down and you hit the colophon (footer), do stuff */
    if (direction === 'down') {
      $mainNavMenuItemAbout.removeClass('active');
      $mainNavMenuItemPortfolio.addClass('active');

      /* When going up and you hit the colophon (footer), do stuff */
    } else {
      $mainNavMenuItemAbout.removeClass('active');
      $mainNavMenuItemPortfolio.removeClass('active');
      $lastMainNavMenuItem.addClass('active');
    }
  }, {
    /* Offset is 100%, so when it enters into view */
    offset: '100%'
  });

/* Waypoints | Portfolio
   ========================================================================= */
} else {

  /**
   * Flags Portfolio page as scrolling
   */
  const portfolioPageWaypoint = $portfolioPage.waypoint((direction) => {

    /* When going down, add scrolling class to page. When up, remove */
    if (direction === 'down') {
      $page.addClass('scrolling');
    } else {
      $page.removeClass('scrolling');
    }
  }, {
    /* Offset is the top margin of the portfolio page title */
    offset: parseFloat($portfolioPage.find('.title').css('margin-top')) * -1
  });
}

/* =========================================================================
   Scripts
   ========================================================================= */

/* Tell ScrollMagic to animate scroll over 0.5 sec rather than jump */
scrollMagicController.scrollTo((newpos) => {
  TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
});

/* Tell ScrollMagic to listen for anchor link clicks and scroll to them */
$(document).on('click', 'a[href^="#"]', function scrollToAnchor(e) {

  /* Get the element the link points to from the href attribute of this link */
  const id = $(this).attr('href');

  /* If the element the ID links to exists (length > 0), scroll to it */
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
if ($page.hasClass('default-page')) {

  /* Do the following only if this is a large screen */
  if (Modernizr.mq('(min-width: 46.0625rem)')) {

    /* Hide all taglines to start */
    $homeHeroAnimationTaglines.hide();

    /* Start cycling through taglines after specified amount of time */
    setTimeout(cycle, 500);

    /* Bring Learn More button to full opacity specified amount of time */
    setTimeout(() => {
      $homeHeroAnimationCTA.animate({opacity: 1}, 3000);
    }, 5000);

    /* Add hero scenes to controller */
    scrollMagicController.addScene([homeHeroAnimationScene, homeHeroArrowScene]);
  }

  /* Initialize snapshots with Kwicks */
  $('.snapshots').kwicks({
    behavior: 'menu',
    duration: 300,
    maxSize: '85%',
    isVertical: true,
    selectOnClick: false,
    spacing: 0
  });
}
