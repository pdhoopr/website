/* =========================================================================
   patrick.hoopr.io Gulpfile
   ========================================================================= */
'use strict'; // Strict mode

/* Variables
   ========================================================================= */

/* Initialize variables required to run gulp */
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const childProcess = require('child_process');
const concat = require('gulp-concat');
const del = require('del');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const util = require('gulp-util');

/* Default to dev for environment */
const env = process.env.NODE_ENV || 'dev';

/* Set path objects used in locating and compiling assets */
const paths = {
  jekyll: {
    watchFiles: [
      'app/**/*',
      '!app/_assets{,/**/*}'
    ],
    src: 'app',
    dest: 'public'
  },
  docs: {
    watchFiles: [
      'docs/**/*'
    ],
    src: [
      'docs/**/*'
    ],
    dest: 'public/docs'
  },
  img: {
    watchFiles: [
      'app/_assets/img/**/*',
      '!app/_assets/img/portfolio/university-of-michigan-athletics{,/**/*}',
      '!app/_assets/img/portfolio/wgi*{,/**/*}'
    ],
    src: [
      'app/_assets/img/**/*',
      '!app/_assets/img/portfolio/university-of-michigan-athletics{,/**/*}',
      '!app/_assets/img/portfolio/wgi*{,/**/*}'
    ],
    dest: 'public/img'
  },
  js: {
    watchFiles: [
      'app/_assets/js/**/*.js'
    ],
    src: [
      'app/_assets/js/**/*.js'
    ],
    dest: 'public/js'
  },
  sass: {
    watchFiles: [
      'vendor/assets/sass/sassy-maps/**/*.scss',
      'vendor/assets/sass/breakpoint/**/*.scss',
      'app/_assets/sass/**/*.scss'
    ],
    src: 'app/_assets/sass/style.scss',
    dest: 'public/css'
  },
  vendor: {
    js: {
      watchFiles: [
        'vendor/assets/js/**/*.js'
      ],
      src: [
        'vendor/assets/js/**/*.js'
      ],
      dest: 'public/js'
    },
    sass: {
      watchFiles: [
        'vendor/assets/sass/**/*.scss',
        '!vendor/assets/sass/sassy-maps/**/*.scss',
        '!vendor/assets/sass/breakpoint/**/*.scss'
      ],
      src: 'vendor/assets/sass/vendor.scss',
      dest: 'public/css'
    }
  }
};

/* Returns a customized error message based on the task throwing the error */
function buildErrorMessage(task) {
  return '<span style="color: red; font-weight: bold;">' + task + ' task error!</span><span style="color: red;"> Please check the console and resolve the error ASAP because the build may be failing!</span>';
}

/* Tasks
   ========================================================================= */

/**
 * Jekyll task
 *
 * 1. Spawns child process
 * 2. Runs "jekyll build" in src directory
 * 3. Closes process
 */
gulp.task('jekyll', function (done) {
  return childProcess.spawn('bundle', ['exec', 'jekyll', 'build'], {cwd: paths.jekyll.src, stdio: 'inherit'})
    .on('close', function (code) {
      if (code !== 0) {
        browserSync.notify('<span style="color: red; font-weight: bold;">jekyll task error!</span><span style="color: red;"> Please check the console and resolve the error ASAP because the build may be failing!</span>');
      }
      done();
    });
});

/**
 * Docs task
 *
 * 1. Deletes any previous files in the built docs folder
 * 2. Locates the src of docs specified in paths object
 * 3. Copies selected docs to the destination specified in the paths object
 */
gulp.task('clean:docs', function () {
  return del(paths.docs.dest);
});

gulp.task('docs', ['clean:docs'], function () {
  return gulp.src(paths.docs.src)
    .pipe(plumber({
      errorHandler: function (err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('docs'));
        this.emit('end');
      }
    }))
    .pipe(gulp.dest(paths.docs.dest))
    .pipe(browserSync.stream());
});

/**
 * Images task
 *
 * 1. Deletes any previous files in the built img folder
 * 2. Locates the src of images specified in paths object
 * 3. Copies selected images to the destination specified in the paths object
 */
gulp.task('clean:img', function () {
  return del(paths.img.dest);
});

gulp.task('img', ['clean:img'], function () {
  return gulp.src(paths.img.src)
    .pipe(plumber({
      errorHandler: function (err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('img'));
        this.emit('end');
      }
    }))
    .pipe(gulp.dest(paths.img.dest))
    .pipe(browserSync.stream());
});

/**
 * Vendor Javascript task
 *
 * 1. Locates the src of vendor scripts specified in paths object
 * 2. Concatenates all scripts into one file called vendor.js
 * 3. Minifies the file if this is a production run
 * 4. Writes the file to the scripts destination specified in the paths object
 */
gulp.task('vendorJS', function () {
  return gulp.src(paths.vendor.js.src)
    .pipe(plumber({
      errorHandler: function (err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('vendorJS'));
        this.emit('end');
      }
    }))
    .pipe(concat('vendor.js'))
    .pipe(gulpif(env === 'prd', uglify()))
    .pipe(gulp.dest(paths.vendor.js.dest))
    .pipe(browserSync.stream());
});

/**
 * Javascript task
 *
 * 1. Deletes any previous files in the built js folder
 * 2. Locates the src of scripts specified in paths object
 * 3. Initializes sourcemaps
 * 4. Concatenates all scripts into one file called bundle.js
 * 5. Minifies the file if this is a production run
 * 6. Writes the file to the scripts destination specified in the paths object w/ sourcemap
 */
gulp.task('js', function () {
  return gulp.src(paths.js.src)
    .pipe(plumber({
      errorHandler: function (err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('js'));
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(babel({
      presets: ['es2015', 'stage-0']
    }))
    .pipe(gulpif(env === 'prd', uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

/**
 * Vendor Sass task
 *
 * 1. Locates the src of vendor stylesheets specified in paths object
 * 2. Minifies the file if this is a production run, otherwise leaves expanded
 * 3. Uses Autoprefixer to add vendor prefixes
 * 4. Writes the file to the stylesheets destination specified in the paths object
 */
gulp.task('vendorSass', function () {
  return gulp.src(paths.vendor.sass.src)
    .pipe(plumber({
      errorHandler: function (err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('vendorSass'));
        this.emit('end');
      }
    }))
    .pipe(gulpif(env === 'prd', sass({outputStyle: 'compressed'}), sass({outputStyle: 'expanded'})))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.vendor.sass.dest))
    .pipe(browserSync.stream());
});

/**
 * Sass task
 *
 * 1. Locates the src of stylesheets specified in paths object
 * 2. Initializes sourcemaps
 * 3. Minifies the file if this is a production run, otherwise leaves expanded
 * 4. Uses Autoprefixer to add vendor prefixes
 * 5. Writes the file to the stylesheets destination specified in the paths object w/ sourcemap
 */
gulp.task('sass', function () {
  return gulp.src(paths.sass.src)
    .pipe(plumber({
      errorHandler: function (err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('sass'));
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(gulpif(env === 'prd', sass({outputStyle: 'compressed'}), sass({outputStyle: 'expanded'})))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

/**
 * Build task
 *
 * 1. Run the jekyll task first
 * 2. When jekyll task is complete, run docs, img, js, and sass tasks
 */
gulp.task('build', ['jekyll'], function (callback) {
  runSequence(['docs', 'img', 'vendorJS', 'js', 'vendorSass', 'sass'], callback);
});

/**
 * Serve task
 *
 * 1. Run the build of the site first
 * 2. When the build finishes, initialize browser-sync to serve files
 * 3. Watches jekyll files that need to regenerate on change
 * 4. Watches docs for changes
 * 5. Watches images for changes
 * 6. Watches scripts for changes
 * 7. Watches styles for changes
 */
gulp.task('serve', ['build'], function () {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });

  gulp.watch(paths.jekyll.watchFiles, ['build']);
  gulp.watch(paths.docs.watchFiles, ['docs']);
  gulp.watch(paths.img.watchFiles, ['img']);
  gulp.watch(paths.vendor.js.watchFiles, ['vendorJS']);
  gulp.watch(paths.js.watchFiles, ['js']);
  gulp.watch(paths.vendor.sass.watchFiles, ['vendorSass']);
  gulp.watch(paths.sass.watchFiles, ['sass']);
});

/**
 * Default task
 *
 * 1. Serves the site using serve task by default
 */
gulp.task('default', ['serve']);
