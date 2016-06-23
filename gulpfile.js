/* eslint strict: 0 */
'use strict'; // Strict mode

/* =========================================================================
   Variables
   ========================================================================= */

/* Initialize variables required to run gulp */
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const childProcess = require('child_process');
const concat = require('gulp-concat');
const del = require('del');
const flatten = require('gulp-flatten');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const util = require('gulp-util');

/* Default to development for environment */
const env = process.env.NODE_ENV || 'development';

/* Set path objects used in locating and compiling assets */
const paths = {
  docs: {
    watchFiles: 'docs/**',
    src: 'docs/**',
    dest: 'public/docs',
  },
  favicon: {
    watchFiles: 'app/_assets/img/branding/favicon/**',
    src: 'app/_assets/img/branding/favicon/**',
    dest: 'public',
    manifest: [
      'public/android-chrome*.png',
      'public/apple-touch-icon*.png',
      'public/browserconfig.xml',
      'public/favicon*',
      'public/manifest.json',
      'public/mstile*.png',
      'public/safari-pinned-tab.svg',
    ],
  },
  img: {
    watchFiles: [
      'app/_assets/img/**',
      '!app/_assets/img/branding/favicon/**',
      '!app/_assets/img/projects/umich-athletics{,/**}',
      '!app/_assets/img/projects/wgi*{,/**}',
    ],
    src: [
      'app/_assets/img/**',
      '!app/_assets/img/branding/favicon/**',
      '!app/_assets/img/projects/umich-athletics{,/**}',
      '!app/_assets/img/projects/wgi*{,/**}',
    ],
    dest: 'public/img',
  },
  js: {
    watchFiles: 'app/_assets/js/**',
    src: 'app/_assets/js/**',
    dest: 'public/js',
  },
  jekyll: {
    watchFiles: ['_config.yml', 'app/**', '!app/_assets{,/**}'],
    src: '.',
    dest: 'public',
  },
  stylesheets: {
    watchFiles: [
      'vendor/assets/css/sassy-maps/**',
      'vendor/assets/css/breakpoint/**',
      'app/_assets/css/**',
    ],
    src: 'app/_assets/css/main.scss',
    dest: 'public/css',
  },
  vendor: {
    fonts: {
      watchFiles: 'vendor/assets/fonts/**',
      src: 'vendor/assets/fonts/**',
      dest: 'public/fonts',
    },
    js: {
      watchFiles: 'vendor/assets/js/**',
      src: [
        'vendor/assets/js/modernizr/modernizr.min.js',
        'vendor/assets/js/jquery/jquery.js',
        'vendor/assets/js/gsap/TweenMax.js',
        'vendor/assets/js/gsap/jquery.gsap.js',
        'vendor/assets/js/gsap/ScrollToPlugin.js',
        'vendor/assets/js/scrollmagic/ScrollMagic.js',
        'vendor/assets/js/scrollmagic/animation.gsap.js',
        'vendor/assets/js/waypoints/jquery.waypoints.js',
        'vendor/assets/js/typedjs/typed.js',
        'vendor/assets/js/unveil/jquery.unveil.js',
        'vendor/assets/js/babel/polyfill.js',
      ],
      dest: 'public/js',
    },
    stylesheets: {
      watchFiles: [
        'vendor/assets/css/**',
        '!vendor/assets/css/sassy-maps/**',
        '!vendor/assets/css/breakpoint/**',
      ],
      src: 'vendor/assets/css/vendor.scss',
      dest: 'public/css',
    },
  },
};

/* Returns a customized error message based on the task throwing the error */
function buildErrorMessage(task) {
  return `<span style="color: red; font-weight: bold;">${task} task error!</span>` +
    '<span style="color: red;"> Please check the command line and resolve the error ASAP because ' +
    'the build may be failing!</span>';
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
gulp.task('clean:docs', () =>
  del(paths.docs.dest)
);

gulp.task('docs', ['clean:docs'], () =>
  gulp.src(paths.docs.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('docs'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(gulp.dest(paths.docs.dest))
    .pipe(browserSync.stream())
);

/**
 * Favicon Task
 *
 * 1. Deletes any previous files in the build folder
 * 2. Locates the src of favicon files specified in paths object
 * 3. Flattens the directory structure
 * 4. Copies favicon files to the destination specified in the paths object
 */
gulp.task('clean:favicon', () =>
  del(paths.favicon.manifest)
);

gulp.task('favicon', ['clean:favicon'], () =>
  gulp.src(paths.favicon.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('favicon'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(gulp.dest(paths.favicon.dest))
    .pipe(browserSync.stream())
);

/**
 * Images Task
 *
 * 1. Deletes any previous files in the built img folder
 * 2. Locates the src of img files specified in paths object
 * 3. Flattens the directory structure
 * 4. Copies img files to the destination specified in the paths object
 */
gulp.task('clean:img', () =>
  del(paths.img.dest)
);

gulp.task('img', ['clean:img'], () =>
  gulp.src(paths.img.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('img'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.img.dest))
    .pipe(browserSync.stream())
);

/**
 * JavaScript Task
 *
 * 1. Deletes any previous files in the built js folder
 * 2. Locates the src of js files specified in paths object
 * 3. Initializes sourcemaps
 * 4. Concatenates all js files into one file called bundle.js
 * 5. Minifies the file if this is a production run
 * 6. Writes the file to the js destination specified in the paths object w/ sourcemap
 */
gulp.task('js', () =>
  gulp.src(paths.js.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('js'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(babel())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream({
      match: '**/*.js',
    }))
);

/**
 * Jekyll Task
 *
 * 1. Spawns child process
 * 2. Runs 'jekyll build' in src directory
 * 3. Closes process
 */
gulp.task('jekyll', (done) =>
  childProcess
    .spawn('jekyll', ['build'], {
      cwd: paths.jekyll.src,
      stdio: 'inherit',
    })
    .on('close', (code) => {
      if (code !== 0) {
        browserSync.notify(
          '<span style="color: red; font-weight: bold;">jekyll task error!</span>' +
          '<span style="color: red;"> Please check the command line and resolve the error ASAP ' +
          'because the build may be failing!</span>'
        );

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw code;
        }
      }
      done();
    })
);

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
gulp.task('stylesheets', () =>
  gulp.src(paths.stylesheets.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('stylesheets'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(gulpif(
        env === 'production',
        sass({
          outputStyle: 'compressed',
        }),
        sass({
          outputStyle: 'expanded',
        })
    ))
    .pipe(autoprefixer())
    .pipe(rename({
      basename: 'style',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.stylesheets.dest))
    .pipe(browserSync.stream({
      match: '**/*.css',
    }))
);

/**
 * Vendor Fonts Task
 *
 * 1. Deletes all fonts in the destination directory
 * 2. Locates the src of vendor fonts specified in paths object
 * 3. Flattens the folder structure to one folder
 * 4. Copies flattened structure to fonts destination specified in the paths object
 */
gulp.task('clean:fonts', () =>
  del(paths.vendor.fonts.dest)
);

gulp.task('vendor:fonts', ['clean:fonts'], () =>
  gulp.src(paths.vendor.fonts.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('vendor:fonts'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.vendor.fonts.dest))
    .pipe(browserSync.stream())
);

/**
 * Vendor JavaScript Task
 *
 * 1. Locates the src of vendor js files specified in paths object
 * 2. Concatenates all vendor js files into one file called vendor.js
 * 3. Minifies the file if this is a production run
 * 4. Writes the file to the vendor js destination specified in the paths object
 */
gulp.task('vendor:js', () =>
  gulp.src(paths.vendor.js.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('vendor:js'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.vendor.js.dest))
    .pipe(browserSync.stream())
);

/**
 * Vendor Stylesheets Task
 *
 * 1. Locates the src of vendor stylesheets specified in paths object
 * 2. Minifies the file if this is a production run, otherwise leaves expanded
 * 3. Uses Autoprefixer to add vendor prefixes
 * 4. Writes the file to the stylesheets destination specified in the paths object
 */
gulp.task('vendor:stylesheets', () =>
  gulp.src(paths.vendor.stylesheets.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('vendor:stylesheets'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(gulpif(
      env === 'production',
      sass({
        outputStyle: 'compressed',
      }),
      sass({
        outputStyle: 'expanded',
      })
    ))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.vendor.stylesheets.dest))
    .pipe(browserSync.stream())
);

/**
 * Build Task
 *
 * 1. Run the jekyll task first
 * 2. When jekyll task is complete, runs other tasks in a specific order
 */
gulp.task('build', ['jekyll'], (callback) => {
  runSequence([
    'docs',
    'favicon',
    'img',
    'vendor:fonts',
    'vendor:stylesheets',
    'stylesheets',
    'vendor:js',
    'js',
  ], callback);
});

/**
 * Serve Task
 *
 * 1. Run the build of the site first
 * 2. When the build finishes, initialize browser-sync to serve files
 * 3. Watch various file paths and rerun respective task when something changes
 */
gulp.task('serve', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: './public',
    },
  });

  gulp.watch(paths.docs.watchFiles, ['docs']);
  gulp.watch(paths.favicon.watchFiles, ['favicon']);
  gulp.watch(paths.img.watchFiles, ['img']);
  gulp.watch(paths.js.watchFiles, ['js']);
  gulp.watch(paths.jekyll.watchFiles, ['build'], browserSync.reload);
  gulp.watch(paths.stylesheets.watchFiles, ['stylesheets']);
  gulp.watch(paths.vendor.fonts.watchFiles, ['vendor:fonts']);
  gulp.watch(paths.vendor.js.watchFiles, ['vendor:js']);
  gulp.watch(paths.vendor.stylesheets.watchFiles, ['vendor:stylesheets']);
});

/**
 * Default Task
 *
 * 1. Serves the site using serve task by default
 */
gulp.task('default', ['serve']);
