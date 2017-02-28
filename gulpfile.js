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
const tasks = {
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
    watchFiles: ['app/_assets/img/**', '!app/_assets/img/branding/favicon/**'],
    src: ['app/_assets/img/**', '!app/_assets/img/branding/favicon/**'],
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
  css: {
    watchFiles: [
      'app/_assets/css/**',
      'node_modules/breakpoint-sass/stylesheets/**',
      'node_modules/sassy-maps/sass/**',
      'node_modules/unsemantic/assets/sass/**',
    ],
    src: 'app/_assets/css/main.scss',
    dest: 'public/css',
    sass: {
      includePaths: [
        'node_modules/breakpoint-sass/stylesheets',
        'node_modules/sassy-maps/sass',
        'node_modules/unsemantic/assets/sass',
      ],
    },
  },
  vendor: {
    fonts: {
      watchFiles: 'node_modules/font-awesome/fonts/**',
      src: 'node_modules/font-awesome/fonts/**',
      dest: 'public/fonts',
    },
    js: {
      watchFiles: [
        'app/_assets/vendor/modernizr/modernizr.min.js',
        'node_modules/babel-polyfill/dist/polyfill.min.js',
        'node_modules/gsap/src/minified/jquery.gsap.min.js',
        'node_modules/gsap/src/minified/plugins/ScrollToPlugin.min.js',
        'node_modules/gsap/src/minified/TweenMax.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        'node_modules/typed.js/dist/typed.min.js',
        'node_modules/unveil2/dist/jquery.unveil2.min.js',
        'node_modules/waypoints/lib/jquery.waypoints.min.js',
      ],
      src: [
        'app/_assets/vendor/modernizr/modernizr.min.js',
        'node_modules/babel-polyfill/dist/polyfill.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/gsap/src/minified/TweenMax.min.js',
        'node_modules/gsap/src/minified/jquery.gsap.min.js',
        'node_modules/gsap/src/minified/plugins/ScrollToPlugin.min.js',
        'node_modules/typed.js/dist/typed.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        'node_modules/scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js',
        'node_modules/waypoints/lib/jquery.waypoints.min.js',
        'node_modules/unveil2/dist/jquery.unveil2.min.js',
      ],
      dest: 'public/js',
    },
    css: {
      watchFiles: ['node_modules/font-awesome/scss/**', 'node_modules/reset-css/reset.css'],
      src: ['node_modules/reset-css/reset.css', 'node_modules/font-awesome/scss/font-awesome.scss'],
      dest: 'public/css',
    },
  },
};

/* Returns a customized error message based on the task throwing the error */
function buildErrorMessage(task) {
  return `<span style="color: red; font-weight: bold;">${task} task error!</span>` +
    `<span style="color: red;"> Please check the command line and resolve the error ASAP because ` +
    `the build may be failing!</span>`;
}

/* =========================================================================
   Tasks
   ========================================================================= */

/**
 * Stylesheets Task
 *
 * 1. Locates the src of css files specified in tasks object
 * 2. Initializes sourcemaps
 * 3. Minifies the file if this is a production run, otherwise leaves expanded
 * 4. Uses Autoprefixer to add vendor prefixes
 * 5. Renames file to style.css
 * 6. Writes the file to the css destination specified in the tasks object w/ sourcemap
 */
gulp.task('css', () =>
  gulp.src(tasks.css.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('css'));
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
      sass(Object.assign(tasks.css.sass, {
        outputStyle: 'compressed',
      })),
      sass(Object.assign(tasks.css.sass), {
        outputStyle: 'expanded',
      })
    ))
    .pipe(autoprefixer())
    .pipe(rename({
      basename: 'app',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(tasks.css.dest))
    .pipe(browserSync.stream({
      match: '**/*.css',
    }))
);

/**
 * Docs Task
 *
 * 1. Deletes any previous files in the built docs folder
 * 2. Locates the src of docs specified in tasks object
 * 3. Copies selected docs to the destination specified in the tasks object
 */
gulp.task('clean:docs', () =>
  del(tasks.docs.dest)
);

gulp.task('docs', ['clean:docs'], () =>
  gulp.src(tasks.docs.src)
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
    .pipe(gulp.dest(tasks.docs.dest))
    .pipe(browserSync.stream())
);

/**
 * Favicon Task
 *
 * 1. Deletes any previous files in the build folder
 * 2. Locates the src of favicon files specified in tasks object
 * 3. Flattens the directory structure
 * 4. Copies favicon files to the destination specified in the tasks object
 */
gulp.task('clean:favicon', () =>
  del(tasks.favicon.manifest)
);

gulp.task('favicon', ['clean:favicon'], () =>
  gulp.src(tasks.favicon.src)
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
    .pipe(gulp.dest(tasks.favicon.dest))
    .pipe(browserSync.stream())
);

/**
 * Images Task
 *
 * 1. Deletes any previous files in the built img folder
 * 2. Locates the src of img files specified in tasks object
 * 3. Flattens the directory structure
 * 4. Copies img files to the destination specified in the tasks object
 */
gulp.task('clean:img', () =>
  del(tasks.img.dest)
);

gulp.task('img', ['clean:img'], () =>
  gulp.src(tasks.img.src)
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
    .pipe(gulp.dest(tasks.img.dest))
    .pipe(browserSync.stream())
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
      cwd: tasks.jekyll.src,
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
 * JavaScript Task
 *
 * 1. Deletes any previous files in the built js folder
 * 2. Locates the src of js files specified in tasks object
 * 3. Initializes sourcemaps
 * 4. Concatenates all js files into one file called bundle.js
 * 5. Minifies the file if this is a production run
 * 6. Writes the file to the js destination specified in the tasks object w/ sourcemap
 */
gulp.task('js', () =>
  gulp.src(tasks.js.src)
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
    .pipe(gulp.dest(tasks.js.dest))
    .pipe(browserSync.stream({
      match: '**/*.js',
    }))
);

/**
 * Vendor Fonts Task
 *
 * 1. Deletes all fonts in the destination directory
 * 2. Locates the src of vendor fonts specified in tasks object
 * 3. Flattens the folder structure to one folder
 * 4. Copies flattened structure to fonts destination specified in the tasks object
 */
gulp.task('clean:fonts', () =>
  del(tasks.vendor.fonts.dest)
);

gulp.task('vendor:fonts', ['clean:fonts'], () =>
  gulp.src(tasks.vendor.fonts.src)
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
    .pipe(gulp.dest(tasks.vendor.fonts.dest))
    .pipe(browserSync.stream())
);

/**
 * Vendor Stylesheets Task
 *
 * 1. Locates the src of vendor css files specified in tasks object
 * 2. Minifies the file if this is a production run, otherwise leaves expanded
 * 3. Uses Autoprefixer to add vendor prefixes
 * 4. Writes the file to the vendor css destination specified in the tasks object
 */
gulp.task('vendor:css', () =>
  gulp.src(tasks.vendor.css.src)
    .pipe(plumber({
      errorHandler(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('vendor:css'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.css'))
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
    .pipe(gulp.dest(tasks.vendor.css.dest))
    .pipe(browserSync.stream())
);

/**
 * Vendor JavaScript Task
 *
 * 1. Locates the src of vendor js files specified in tasks object
 * 2. Concatenates all vendor js files into one file called vendor.js
 * 3. Minifies the file if this is a production run
 * 4. Writes the file to the vendor js destination specified in the tasks object
 */
gulp.task('vendor:js', () =>
  gulp.src(tasks.vendor.js.src)
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
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(tasks.vendor.js.dest))
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
    'vendor:css',
    'css',
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

  gulp.watch(tasks.css.watchFiles, ['css']);
  gulp.watch(tasks.docs.watchFiles, ['docs']);
  gulp.watch(tasks.favicon.watchFiles, ['favicon']);
  gulp.watch(tasks.img.watchFiles, ['img']);
  gulp.watch(tasks.jekyll.watchFiles, ['build'], browserSync.reload);
  gulp.watch(tasks.js.watchFiles, ['js']);
  gulp.watch(tasks.vendor.fonts.watchFiles, ['vendor:fonts']);
  gulp.watch(tasks.vendor.css.watchFiles, ['vendor:css']);
  gulp.watch(tasks.vendor.js.watchFiles, ['vendor:js']);
});

/**
 * Default Task
 *
 * 1. Serves the site using serve task by default
 */
gulp.task('default', ['serve']);
