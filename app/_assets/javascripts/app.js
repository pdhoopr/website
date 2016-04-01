/* =========================================================================
   Variables
   ========================================================================= */
const $page = $(".page");
const $logoLetters = $(".logo-letter.animate");
const $header = $("header");
const $headerMenu = $("header .menu");
const $headerMenuItemAbout = $("header .menu-item-about");
const $headerMenuItemProjects = $("header .menu-item-projects");
let $lastHeaderMenuItem = null; // Holds last active section while scrolling
const $colophon = $(".colophon");
const scrollMagicController = new ScrollMagic.Controller();

/* Variables | Home
   ========================================================================= */
const $homeHeroAnimation = $(".home-hero-animation");
const $homeHeroAnimationCta = $(".home-hero-animation .cta");
const $homeHeroArrow = $(".home-hero .arrow");
const $homeAboutSection = $(".home-about-section");
const $homeProjectsSection = $(".home-projects-section");

/* Variables | Project
   ========================================================================= */
const $projectPage = $(".project-page");

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

/* Start home hero section animation on home page */
if ($page.hasClass("default-page")) {

  /* Start typed animation on home page hero section */
  $(".typed").typed({
    stringsElement: $(".typed-strings"),
    startDelay: 500,
    typeSpeed: 50,
    backDelay: 1000,
    loop: true,
    loopCount: false
  });

  /* Bring "Learn More" button to full opacity specified amount of time */
  setTimeout(() => {
    $homeHeroAnimationCta.animate({opacity: 1}, 500);
  }, 3000);
}

/* =========================================================================
   GSAP Tweens
   ========================================================================= */

/**
 * Tween logo letters from opacity of 1 and full width to no width and opacity
 * of 0. Start 1 seconds after page is ready.
 * @type { TweenMax }
 */
const tweenLogoLetters = TweenMax.to($logoLetters, .5, {
  delay: .5,
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
const fadeHomeHeroArrow = TweenMax.to($homeHeroArrow, .25, {
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
  TweenMax.to(window, .5, {scrollTo: {y: newpos}});
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
      $headerMenuItemProjects.removeClass("active");
      $lastHeaderMenuItem = $headerMenuItemAbout;

      /* When going up and you hit About section, do stuff */
    } else {
      $page.removeClass("scrolling");
      $headerMenuItemAbout.removeClass("active");
      $headerMenuItemProjects.removeClass("active");
      $lastHeaderMenuItem = null;
    }
  }, {
    /**
     * Make offset the nav bar height or the nav menu height (small devices).
     * @returns {Number} The height in pixels of the main navigation or menu
     */
    offset() {
      return Modernizr.mq("(min-width: 46.0625em)") ? $header.height() : $headerMenu.height();
    }
  });

  /**
   * Toggles active class for Projects section and removes for About section.
   * @type { Waypoint }
   */
  const homeProjectsSectionWaypoint = $homeProjectsSection.waypoint((direction) => {

    /* When going down and you hit Projects section, do stuff */
    if (direction === "down") {
      $headerMenuItemAbout.removeClass("active");
      $headerMenuItemProjects.addClass("active");
      $lastHeaderMenuItem = $headerMenuItemProjects;

      /* When going up and you hit Projects section, do stuff */
    } else {
      $headerMenuItemAbout.addClass("active");
      $headerMenuItemProjects.removeClass("active");
      $lastHeaderMenuItem = $headerMenuItemAbout;
    }
  }, {
    /**
     * Make offset the nav bar height or the nav menu height (small devices).
     * @returns {Number} The height in pixels of the main navigation or menu
     */
    offset() {
      return Modernizr.mq("(min-width: 46.0625em)") ? $header.height() : $headerMenu.height();
    }
  });

  /**
   * Toggles Projects section as active at bottom, restores previous active
   * section when scrolling back up.
   * @type { Waypoint }
   */
  const colophonWaypoint = $colophon.waypoint((direction) => {

    /* When going down and you hit the colophon (footer), do stuff */
    if (direction === "down") {
      $headerMenuItemAbout.removeClass("active");
      $headerMenuItemProjects.addClass("active");

      /* When going up and you hit the colophon (footer), do stuff */
    } else {
      $headerMenuItemAbout.removeClass("active");
      $headerMenuItemProjects.removeClass("active");
      $lastHeaderMenuItem.addClass("active");
    }
  }, {
    /* Offset is 100%, so when element enters into view */
    offset: "100%"
  });

/* Waypoints | Project
   ========================================================================= */
} else {

  /**
   * Flags a project page as scrolling.
   * @type { Waypoint }
   */
  const projectPageWaypoint = $projectPage.waypoint((direction) => {

    /* When going down, add scrolling class to page. When up, remove */
    if (direction === "down") {
      $page.addClass("scrolling");
    } else {
      $page.removeClass("scrolling");
    }
  }, {
    /* Offset is the top margin of the project page title */
    offset: parseFloat($projectPage.find(".title").css("margin-top")) * -1
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
