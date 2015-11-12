/* =========================================================================
   patrick.hoopr.io Gulpfile
   ========================================================================= */

/* Variables
   ========================================================================= */

/* Initialize variables required to run gulp */
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var childProcess = require('child_process');
var concat = require('gulp-concat');
var del = require('del');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

/* Default to dev for environment */
var env = process.env.NODE_ENV || 'dev';

/* Set path objects used in locating and compiling assets */
var paths = {
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
      'vendor/assets/js/**/*.js',
      'app/_assets/js/**/*.js'
    ],
    src: [
      'vendor/assets/js/**/*.js',
      'app/_assets/js/**/*.js'
    ],
    dest: 'public/js'
  },
  sass: {
    watchFiles: [
      'vendor/assets/sass/**/*.scss',
      'app/_assets/sass/**/*.scss'
    ],
    src: 'app/_assets/sass/style.scss',
    dest: 'public/css'
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
 * Javascript task
 *
 * 1. Deletes any previous files in the built js folder
 * 2. Locates the src of scripts specified in paths object
 * 3. Initializes sourcemaps
 * 4. Concatenates all scripts into one file called app.min.js
 * 5. Minifies the file if this is a production run
 * 6. Writes the file to the scripts destination specified in the paths object w/ sourcemap
 */
gulp.task('clean:js', function () {
  return del(paths.js.dest);
});

gulp.task('js', ['clean:js'], function () {
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
    .pipe(gulpif(env === 'prd', uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

/**
 * Sass task
 *
 * 1. Deletes any previous files in the built css folder
 * 2. Locates the src of stylesheets specified in paths object
 * 3. Initializes sourcemaps
 * 4. Minifies the file if this is a production run, otherwise leaves expanded
 * 5. Uses Autoprefixer to add vendor prefixes
 * 6. Writes the file to the stylesheets desintation specified in the paths object w/ sourcemap
 */
gulp.task('clean:css', function () {
  return del(paths.sass.dest);
});

gulp.task('sass', ['clean:css'], function () {
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
  runSequence(['docs', 'img', 'js', 'sass'], callback);
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
  gulp.watch(paths.js.watchFiles, ['js']);
  gulp.watch(paths.sass.watchFiles, ['sass']);
});

/**
 * Default task
 *
 * 1. Serves the site using serve task by default
 */
gulp.task('default', ['serve']);
