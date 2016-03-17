/* eslint strict: 0 */
"use strict"; // Strict mode

/* =========================================================================
   Variables
   ========================================================================= */

/* Initialize variables required to run gulp */
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const childProcess = require("child_process");
const concat = require("gulp-concat");
const del = require("del");
const flatten = require("gulp-flatten");
const gulpif = require("gulp-if");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const runSequence = require("run-sequence");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const util = require("gulp-util");

/* Default to development for environment */
const env = process.env.NODE_ENV || "development";

/* Set path objects used in locating and compiling assets */
const paths = {
  docs: {
    watchFiles: "docs/**",
    src: "docs/**",
    dest: "public/docs"
  },
  favicon: {
    watchFiles: "app/_assets/images/branding/favicon/**",
    src: "app/_assets/images/branding/favicon/**",
    dest: "public",
    manifest: [
      "public/android-chrome*.png",
      "public/apple-touch-icon*.png",
      "public/browserconfig.xml",
      "public/favicon*",
      "public/manifest.json",
      "public/mstile*.png",
      "public/safari-pinned-tab.svg"
    ]
  },
  images: {
    watchFiles: [
      "app/_assets/images/**",
      "!app/_assets/images/branding/favicon/**",
      "!app/_assets/images/portfolio/university-of-michigan-athletics{,/**}",
      "!app/_assets/images/portfolio/wgi*{,/**}"
    ],
    src: [
      "app/_assets/images/**",
      "!app/_assets/images/branding/favicon/**",
      "!app/_assets/images/portfolio/university-of-michigan-athletics{,/**}",
      "!app/_assets/images/portfolio/wgi*{,/**}"
    ],
    dest: "public/img"
  },
  javascripts: {
    watchFiles: "app/_assets/javascripts/**",
    src: "app/_assets/javascripts/**",
    dest: "public/js"
  },
  jekyll: {
    watchFiles: [
      "config/**",
      "app/**",
      "!app/_assets{,/**}"
    ],
    src: "config",
    dest: "public"
  },
  stylesheets: {
    watchFiles: [
      "vendor/assets/stylesheets/sassy-maps/**",
      "vendor/assets/stylesheets/breakpoint/**",
      "app/_assets/stylesheets/**"
    ],
    src: "app/_assets/stylesheets/main.scss",
    dest: "public/css"
  },
  vendor: {
    fonts: {
      watchFiles: "vendor/assets/fonts/**",
      src: "vendor/assets/fonts/**",
      dest: "public/fonts"
    },
    javascripts: {
      watchFiles: "vendor/assets/javascripts/**",
      src: [
        "vendor/assets/javascripts/modernizr/modernizr.min.js",
        "vendor/assets/javascripts/jquery/jquery.js",
        "vendor/assets/javascripts/jquery/jquery-ui.js",
        "vendor/assets/javascripts/gsap/TweenMax.js",
        "vendor/assets/javascripts/gsap/jquery.gsap.js",
        "vendor/assets/javascripts/gsap/ScrollToPlugin.js",
        "vendor/assets/javascripts/scrollmagic/ScrollMagic.js",
        "vendor/assets/javascripts/scrollmagic/animation.gsap.js",
        "vendor/assets/javascripts/waypoints/jquery.waypoints.js",
        "vendor/assets/javascripts/unveil/jquery.unveil.js",
        "vendor/assets/javascripts/babel/polyfill.js"
      ],
      dest: "public/js"
    },
    stylesheets: {
      watchFiles: [
        "vendor/assets/stylesheets/**",
        "!vendor/assets/stylesheets/sassy-maps/**",
        "!vendor/assets/stylesheets/breakpoint/**"
      ],
      src: "vendor/assets/stylesheets/vendor.scss",
      dest: "public/css"
    }
  }
};

/* Returns a customized error message based on the task throwing the error */
function buildErrorMessage(task) {
  return `<span style="color: red; font-weight: bold;">${task} task error!</span><span style="color: red;"> Please check the command line and resolve the error ASAP because the build may be failing!</span>`;
}

/* =========================================================================
   Tasks
   ========================================================================= */

/**
 * Docs Task
 *
 * 1. Deletes any previous files in the built docs folder
 * 2. Locates the src of docs specified in paths object
 * 3. Copies selected docs to the destination specified in the paths object
 */
gulp.task("clean:docs", () => {
  return del(paths.docs.dest);
});

gulp.task("docs", ["clean:docs"], () => {
  return gulp.src(paths.docs.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage("docs"));
        this.emit("end");

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw err;
        }
      }
    }))
    .pipe(gulp.dest(paths.docs.dest))
    .pipe(browserSync.stream());
});

/**
 * Favicon Task
 *
 * 1. Deletes any previous files in the build folder
 * 2. Locates the src of images specified in paths object
 * 3. Flattens the directory structure
 * 4. Copies selected images to the destination specified in the paths object
 */
gulp.task("clean:favicon", () => {
  return del(paths.favicon.manifest);
});

gulp.task("favicon", ["clean:favicon"], () => {
  return gulp.src(paths.favicon.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage("favicon"));
        this.emit("end");

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw err;
        }
      }
    }))
    .pipe(gulp.dest(paths.favicon.dest))
    .pipe(browserSync.stream());
});

/**
 * Images Task
 *
 * 1. Deletes any previous files in the built images folder
 * 2. Locates the src of images specified in paths object
 * 3. Flattens the directory structure
 * 4. Copies selected images to the destination specified in the paths object
 */
gulp.task("clean:images", () => {
  return del(paths.images.dest);
});

gulp.task("images", ["clean:images"], () => {
  return gulp.src(paths.images.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage("images"));
        this.emit("end");

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw err;
        }
      }
    }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
});

/**
 * JavaScripts Task
 *
 * 1. Deletes any previous files in the built javascripts folder
 * 2. Locates the src of javascripts specified in paths object
 * 3. Initializes sourcemaps
 * 4. Concatenates all javascripts into one file called bundle.js
 * 5. Minifies the file if this is a production run
 * 6. Writes the file to the javascripts destination specified in the paths object w/ sourcemap
 */
gulp.task("javascripts", () => {
  return gulp.src(paths.javascripts.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage("javascripts"));
        this.emit("end");

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw err;
        }
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat("app.js"))
    .pipe(babel())
    .pipe(gulpif(env === "production", uglify()))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.javascripts.dest))
    .pipe(browserSync.stream({match: "**/*.js"}));
});

/**
 * Jekyll Task
 *
 * 1. Spawns child process
 * 2. Runs "jekyll build" in src directory
 * 3. Closes process
 */
gulp.task("jekyll", (done) => {
  return childProcess.spawn("bundle", ["exec", "jekyll", "build"], {cwd: paths.jekyll.src, stdio: "inherit"})
    .on("close", (code) => {
      if (code !== 0) {
        browserSync.notify('<span style="color: red; font-weight: bold;">jekyll task error!</span><span style="color: red;"> Please check the command line and resolve the error ASAP because the build may be failing!</span>');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw code;
        }
      }
      done();
    });
});

/**
 * Stylesheets Task
 *
 * 1. Locates the src of stylesheets specified in paths object
 * 2. Initializes sourcemaps
 * 3. Minifies the file if this is a production run, otherwise leaves expanded
 * 4. Uses Autoprefixer to add vendor prefixes
 * 5. Renames file to style.css
 * 6. Writes the file to the stylesheets destination specified in the paths object w/ sourcemap
 */
gulp.task("stylesheets", () => {
  return gulp.src(paths.stylesheets.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage("stylesheets"));
        this.emit("end");

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw err;
        }
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(gulpif(env === "production", sass({outputStyle: "compressed"}), sass({outputStyle: "expanded"})))
    .pipe(autoprefixer())
    .pipe(rename({
      basename: "style"
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.stylesheets.dest))
    .pipe(browserSync.stream({match: "**/*.css"}));
});

/**
 * Vendor Fonts Task
 *
 * 1. Deletes all fonts in the destination directory
 * 2. Locates the src of vendor fonts specified in paths object
 * 3. Flattens the folder structure to one folder
 * 4. Copies flattened structure to fonts destination specified in the paths object
 */
gulp.task("clean:fonts", () => {
  return del(paths.vendor.fonts.dest);
});

gulp.task("vendor:fonts", ["clean:fonts"], () => {
  return gulp.src(paths.vendor.fonts.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage("vendor:fonts"));
        this.emit("end");

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw err;
        }
      }
    }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.vendor.fonts.dest))
    .pipe(browserSync.stream());
});

/**
 * Vendor JavaScripts Task
 *
 * 1. Locates the src of vendor javascripts specified in paths object
 * 2. Concatenates all javascripts into one file called vendor.js
 * 3. Minifies the file if this is a production run
 * 4. Writes the file to the javascripts destination specified in the paths object
 */
gulp.task("vendor:javascripts", () => {
  return gulp.src(paths.vendor.javascripts.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage("vendor:javascripts"));
        this.emit("end");

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw err;
        }
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat("vendor.js"))
    .pipe(gulpif(env === "production", uglify()))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.vendor.javascripts.dest))
    .pipe(browserSync.stream());
});

/**
 * Vendor Stylesheets Task
 *
 * 1. Locates the src of vendor stylesheets specified in paths object
 * 2. Minifies the file if this is a production run, otherwise leaves expanded
 * 3. Uses Autoprefixer to add vendor prefixes
 * 4. Writes the file to the stylesheets destination specified in the paths object
 */
gulp.task("vendor:stylesheets", () => {
  return gulp.src(paths.vendor.stylesheets.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage("vendor:stylesheets"));
        this.emit("end");

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === "production") {
          throw err;
        }
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(gulpif(env === "production", sass({outputStyle: "compressed"}), sass({outputStyle: "expanded"})))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.vendor.stylesheets.dest))
    .pipe(browserSync.stream());
});

/**
 * Build Task
 *
 * 1. Run the jekyll task first
 * 2. When jekyll task is complete, runs other tasks in a specific order
 */
gulp.task("build", ["jekyll"], (callback) => {
  runSequence([
    "docs",
    "favicon",
    "images",
    "vendor:fonts",
    "vendor:stylesheets",
    "stylesheets",
    "vendor:javascripts",
    "javascripts"
  ], callback);
});

/**
 * Serve Task
 *
 * 1. Run the build of the site first
 * 2. When the build finishes, initialize browser-sync to serve files
 * 3. Watch various file paths and rerun respective task when something changes
 */
gulp.task("serve", ["build"], () => {
  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });

  gulp.watch(paths.docs.watchFiles, ["docs"]);
  gulp.watch(paths.favicon.watchFiles, ["favicon"]);
  gulp.watch(paths.images.watchFiles, ["images"]);
  gulp.watch(paths.javascripts.watchFiles, ["javascripts"]);
  gulp.watch(paths.jekyll.watchFiles, ["build"], browserSync.reload);
  gulp.watch(paths.stylesheets.watchFiles, ["stylesheets"]);
  gulp.watch(paths.vendor.fonts.watchFiles, ["vendor:fonts"]);
  gulp.watch(paths.vendor.javascripts.watchFiles, ["vendor:javascripts"]);
  gulp.watch(paths.vendor.stylesheets.watchFiles, ["vendor:stylesheets"]);
});

/**
 * Default Task
 *
 * 1. Serves the site using serve task by default
 */
gulp.task("default", ["serve"]);
