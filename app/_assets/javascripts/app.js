/* =========================================================================
   Variables
   ========================================================================= */
const $page = $(".page");
const $logoLetters = $(".logo-letter.animate");
const $header = $("header");
const $headerMenu = $("header .menu");
const $headerMenuItemAbout = $("header .menu-item-about");
const $headerMenuItemPortfolio = $("header .menu-item-portfolio");
let $lastHeaderMenuItem = null; // Holds last active section while scrolling
const $colophon = $(".colophon");
const scrollMagicController = new ScrollMagic.Controller();

/* Variables | Home
   ========================================================================= */
const $homeHeroAnimation = $(".home-hero-animation");
const $homeHeroAnimationTaglines = $(".home-hero-animation .tagline");
let homeHeroAnimationTaglineNum = 0; // Counter for taglines
const $homeHeroAnimationCta = $(".home-hero-animation .cta");
const $homeHeroArrow = $(".home-hero .arrow");
const $homeAboutSection = $(".home-about-section");
const $homePortfolioSection = $(".home-portfolio-section");

/* Variables | Portfolio
   ========================================================================= */
const $portfolioPage = $(".portfolio-page");

/* =========================================================================
   Functions
   ========================================================================= */

/**
 * Adds letter-collpased class and removes GSAP styles from logo
 * letters once tween is complete.
 * @returns { Void } No return value
 */
function tweenLogoLettersComplete() {
  $logoLetters.addClass("collapsed").removeAttr("style");
}

/* Functions | Home
   ========================================================================= */

/**
 * Cycles through taglines in Hero section by fading in and out
 * taglines. Goes back to beginning once it reaches the end.
 * @returns { Void } No return value
 */
function cycleHomeHeroTaglines() {
  $homeHeroAnimationTaglines
    .css("display", "none")
    .eq(homeHeroAnimationTaglineNum)
    .toggle("slide", {direction: "right"}, 900)
    .delay(1800)
    .toggle("slide", {direction: "left"}, 900, cycleHomeHeroTaglines);

  homeHeroAnimationTaglineNum = ++homeHeroAnimationTaglineNum % $homeHeroAnimationTaglines.length;
}

/**
 * Runs through the necessary steps to initialize the home hero
 * animation.
 * @returns { Void } No return value
 */
function playHomeHeroAnimation() {
  /* Cycle through taglines them after given time */
  setTimeout(cycleHomeHeroTaglines, 500);

  /* Bring "Learn More" button to full opacity specified amount of time */
  setTimeout(() => {
    $homeHeroAnimationCta.animate({opacity: 1}, 900);
  }, 2700);
}

/* Start home hero section animation on home page */
if ($page.hasClass("default-page")) {
  playHomeHeroAnimation();
}

/* =========================================================================
   GSAP Tweens
   ========================================================================= */

/**
 * Tween logo letters from opacity of 1 and full width to no width and opacity
 * of 0. Start 1 seconds after page is ready.
 * @type { TweenMax }
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
 * @type { TweenMax }
 */
const fadeHomeHeroAnimation = TweenMax.to($homeHeroAnimation, 1, {
  opacity: 0,
  top: "66%"
});

/**
 * Tween Hero arrow from border properties over the duration of the tween.
 * @type { TweenMax }
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

/* Tell ScrollMagic to animate scroll over 0.5 sec rather than jump */
scrollMagicController.scrollTo((newpos) => {
  TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
});

/* ScrollMagic Scenes | Home
   ========================================================================= */

if ($page.hasClass("default-page")) {
  /**
   * Fade out the Home Hero section and produce parallax scrolling effect.
   * @type { ScrollMagic Scene }
   */
  const homeHeroAnimationScene = new ScrollMagic.Scene({
    triggerElement: ".home-hero",
    triggerHook: "onLeave", // Start when trigger starts leaving viewport
    duration: "100%" // End when viewport has moved 100%
  })
  .setTween(fadeHomeHeroAnimation); // Use the fadeHomeHeroAnimation tween

  /**
   * Smush Hero arrow up into itself when scrolling down the Home page.
   * @type { ScrollMagic Scene }
   */
  const homeHeroArrowScene = new ScrollMagic.Scene({
    triggerElement: ".home-hero",
    triggerHook: "onLeave", // Start when trigger starts leaving viewport
    duration: "100%" // End when viewport has moved 75%
  })
  .setTween(fadeHomeHeroArrow);

  /* Add home animations to ScrollMagic controller */
  scrollMagicController.addScene([homeHeroAnimationScene, homeHeroArrowScene]);
}

/* =========================================================================
   Waypoints
   ========================================================================= */

/* Waypoints | Home
   ========================================================================= */
if ($page.hasClass("default-page")) {

  /**
   * Toggle the active class for About section and flag the page as scrolling.
   * @type { Waypoint }
   */
  const homeAboutSectionWaypoint = $homeAboutSection.waypoint((direction) => {

    /* When going down and you hit about section, do stuff */
    if (direction === "down") {
      $page.addClass("scrolling");
      $headerMenuItemAbout.addClass("active");
      $headerMenuItemPortfolio.removeClass("active");
      $lastHeaderMenuItem = $headerMenuItemAbout;

      /* When going up and you hit About section, do stuff */
    } else {
      $page.removeClass("scrolling");
      $headerMenuItemAbout.removeClass("active");
      $headerMenuItemPortfolio.removeClass("active");
      $lastHeaderMenuItem = null;
    }
  }, {
    /**
     * Make offset the nav bar height or the nav menu height (small devices).
     * @returns {Number} The height in pixels of the main navigation or menu
     */
    offset() {
      return Modernizr.mq("(min-width: 46.0625rem)") ? $header.height() : $headerMenu.height();
    }
  });

  /**
   * Toggles active class for Portfolio section and removes for About section.
   * @type { Waypoint }
   */
  const homePortfolioSectionWaypoint = $homePortfolioSection.waypoint((direction) => {

    /* When going down and you hit Portfolio section, do stuff */
    if (direction === "down") {
      $headerMenuItemAbout.removeClass("active");
      $headerMenuItemPortfolio.addClass("active");
      $lastHeaderMenuItem = $headerMenuItemPortfolio;

      /* When going up and you hit Portfolio section, do stuff */
    } else {
      $headerMenuItemAbout.addClass("active");
      $headerMenuItemPortfolio.removeClass("active");
      $lastHeaderMenuItem = $headerMenuItemAbout;
    }
  }, {
    /**
     * Make offset the nav bar height or the nav menu height (small devices).
     * @returns {Number} The height in pixels of the main navigation or menu
     */
    offset() {
      return Modernizr.mq("(min-width: 46.0625rem)") ? $header.height() : $headerMenu.height();
    }
  });

  /**
   * Toggles Portfolio section as active at bottom, restores previous active
   * section when scrolling back up.
   * @type { Waypoint }
   */
  const colophonWaypoint = $colophon.waypoint((direction) => {

    /* When going down and you hit the colophon (footer), do stuff */
    if (direction === "down") {
      $headerMenuItemAbout.removeClass("active");
      $headerMenuItemPortfolio.addClass("active");

      /* When going up and you hit the colophon (footer), do stuff */
    } else {
      $headerMenuItemAbout.removeClass("active");
      $headerMenuItemPortfolio.removeClass("active");
      $lastHeaderMenuItem.addClass("active");
    }
  }, {
    /* Offset is 100%, so when element enters into view */
    offset: "100%"
  });

/* Waypoints | Portfolio
   ========================================================================= */
} else {

  /**
   * Flags the Portfolio page as scrolling.
   * @type { Waypoint }
   */
  const portfolioPageWaypoint = $portfolioPage.waypoint((direction) => {

    /* When going down, add scrolling class to page. When up, remove */
    if (direction === "down") {
      $page.addClass("scrolling");
    } else {
      $page.removeClass("scrolling");
    }
  }, {
    /* Offset is the top margin of the portfolio page title */
    offset: parseFloat($portfolioPage.find(".title").css("margin-top")) * -1
  });
}

/* =========================================================================
   Event Listeners
   ========================================================================= */

/**
 * Tell ScrollMagic to listen for anchor link clicks and scroll to them.
 * @type { Click Event Listener }
 */
$(document).on("click", 'a[href^="#"]', function scrollToAnchor(e) {

  /* Get target element from the href attribute and if it exists, do stuff */
  const id = $(this).attr("href");

  if ($(id).length > 0) {

    /* Prevent default link action of jumping to the href and scroll instead */
    e.preventDefault();
    scrollMagicController.scrollTo(id);

    /* Push the section id to the url */
    if (window.history && window.history.pushState) {
      history.pushState("", document.title, id);
    }
  }
});

/* =========================================================================
   Other
   ========================================================================= */

/* Lazy loads images as they're <= 284px out of view */
$("img.lazy").unveil(284);
