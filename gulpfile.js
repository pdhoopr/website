/* ==========================================================================
   patrick.hoopr.io Gulpfile
   ========================================================================== */

/* Variables
   ========================================================================== */

/* Initialize variables required to run gulp */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');

/* Set path objects used in locating and compiling assets */
var paths = {
 js: {
    src: [
          'vendors/js/**/*.js',
          'js/app.js'
         ],
    files: [
            'vendors/js/**/*.js',
            'js/app.js'
           ],
    dest: 'js'
  },
  sass: {
    src: 'sass/style.scss',
    files: [
            'vendors/sass/**/*.scss',
            'sass/**/*.scss'
           ],
    dest: 'css'
  }
};

/* If the NODE_ENV is not set (like to prd for production), default to dev for development */
var env = process.env.NODE_ENV || 'dev';

/* Tasks
   ========================================================================== */

/**
 * Javascript task
 *
 * 1. Locates the src of scripts specified in paths object
 * 2. Initializes sourcemaps
 * 3. Concatenates all scripts into one file called app.min.js
 * 4. Minifies the file if this is a production run
 * 5. Writes the file to the scripts destination specified in the paths object w/ sourcemap
 */
gulp.task('js', function () {
  return gulp.src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(gulpif(env === 'prd', uglify()))
    .on('error', util.log)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest))
});

/**
 * Sass task
 *
 * 1. Locates the src of stylesheets specified in paths object
 * 2. Initializes sourcemaps
 * 3. Minifies the file if this is a production run, otherwise leaves expanded
 * 4. Uses Autoprefixer to add vendor prefixes
 * 5. Writes the file to the stylesheets desintation specified in the paths object w/ sourcemap
 */
gulp.task('sass', function () {
  return gulp.src(paths.sass.src)
  .pipe(sourcemaps.init())
  .pipe(gulpif(env === 'prd', sass({outputStyle: 'compressed'}), sass({outputStyle: 'expanded'})))
  .on('error', util.log)
  .pipe(autoprefixer())
  .pipe(rename({suffix: '.min'}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.sass.dest))
});

/**
 * Watch task
 *
 * 1. Watches scripts specified in paths object for changes
 * 2. Watches stylesheets specified in paths object for changes
 */
gulp.task('watch', function () {
  gulp.watch(paths.js.files, ['js']);
  gulp.watch(paths.sass.files, ['sass']);
});

/**
 * Default task
 *
 * 1. Runs Javascript, Sass, and Watch task by default
 */
gulp.task('default', ['js', 'sass', 'watch']);
