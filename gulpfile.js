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
    dest: 'public/docs'
  },
  images: {
    watchFiles: [
      'app/_assets/images/**',
      '!app/_assets/images/portfolio/university-of-michigan-athletics{,/**}',
      '!app/_assets/images/portfolio/wgi*{,/**}'
    ],
    src: [
      'app/_assets/images/**',
      '!app/_assets/images/portfolio/university-of-michigan-athletics{,/**}',
      '!app/_assets/images/portfolio/wgi*{,/**}'
    ],
    dest: 'public/assets/img'
  },
  javascripts: {
    watchFiles: 'app/_assets/javascripts/**',
    src: 'app/_assets/javascripts/**',
    dest: 'public/assets/js'
  },
  jekyll: {
    watchFiles: [
      'config/**',
      'app/**',
      '!app/_assets{,/**}'
    ],
    src: 'config',
    dest: 'public'
  },
  stylesheets: {
    watchFiles: [
      'vendor/assets/stylesheets/sassy-maps/**',
      'vendor/assets/stylesheets/breakpoint/**',
      'app/_assets/stylesheets/**'
    ],
    src: 'app/_assets/stylesheets/main.scss',
    dest: 'public/assets/css'
  },
  vendor: {
    javascripts: {
      watchFiles: 'vendor/assets/javascripts/**',
      src: 'vendor/assets/javascripts/**',
      dest: 'public/assets/js'
    },
    stylesheets: {
      watchFiles: [
        'vendor/assets/stylesheets/**',
        '!vendor/assets/stylesheets/sassy-maps/**',
        '!vendor/assets/stylesheets/breakpoint/**'
      ],
      src: 'vendor/assets/stylesheets/vendor.scss',
      dest: 'public/assets/css'
    }
  }
};

/* Returns a customized error message based on the task throwing the error */
function buildErrorMessage(task) {
  return '<span style="color: red; font-weight: bold;">' + task + ' task error!</span><span style="color: red;"> Please check the console and resolve the error ASAP because the build may be failing!</span>';
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
gulp.task('clean:docs', function cleanDocsTask() {
  return del(paths.docs.dest);
});

gulp.task('docs', ['clean:docs'], function docsTask() {
  return gulp.src(paths.docs.src)
    .pipe(plumber({
      errorHandler: function docsTaskError(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('docs'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      }
    }))
    .pipe(gulp.dest(paths.docs.dest))
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
gulp.task('clean:images', function cleanImagesTask() {
  return del(paths.images.dest);
});

gulp.task('images', ['clean:images'], function imagesTask() {
  return gulp.src(paths.images.src)
    .pipe(plumber({
      errorHandler: function imagesTaskError(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('images'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
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
gulp.task('javascripts', function javaScriptsTask() {
  return gulp.src(paths.javascripts.src)
    .pipe(plumber({
      errorHandler: function javaScriptsTaskError(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('javascripts'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(babel())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.javascripts.dest))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

/**
 * Jekyll Task
 *
 * 1. Spawns child process
 * 2. Runs "jekyll build" in src directory
 * 3. Closes process
 */
gulp.task('jekyll', function jekyllTask(done) {
  return childProcess.spawn('bundle', ['exec', 'jekyll', 'build'], {cwd: paths.jekyll.src, stdio: 'inherit'})
    .on('close', function jekyllTaskClose(code) {
      if (code !== 0) {
        browserSync.notify('<span style="color: red; font-weight: bold;">jekyll task error!</span><span style="color: red;"> Please check the console and resolve the error ASAP because the build may be failing!</span>');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
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
gulp.task('stylesheets', function stylesheetsTask() {
  return gulp.src(paths.stylesheets.src)
    .pipe(plumber({
      errorHandler: function stylesheetsTaskError(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('stylesheets'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(gulpif(env === 'production', sass({outputStyle: 'compressed'}), sass({outputStyle: 'expanded'})))
    .pipe(autoprefixer())
    .pipe(rename({
      basename: 'style'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.stylesheets.dest))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

/**
 * Vendor JavaScripts Task
 *
 * 1. Locates the src of vendor javascripts specified in paths object
 * 2. Concatenates all javascripts into one file called vendor.js
 * 3. Minifies the file if this is a production run
 * 4. Writes the file to the javascripts destination specified in the paths object
 */
gulp.task('vendor:javascripts', function vendorJavaScriptsTask() {
  return gulp.src(paths.vendor.javascripts.src)
    .pipe(plumber({
      errorHandler: function vendorJavaScriptsTaskError(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('vendor:javascripts'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      }
    }))
    .pipe(concat('vendor.js'))
    .pipe(gulpif(env === 'production', uglify()))
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
gulp.task('vendor:stylesheets', function vendorStylesheetsTask() {
  return gulp.src(paths.vendor.stylesheets.src)
    .pipe(plumber({
      errorHandler: function vendorStylesheetsTaskError(err) {
        util.log(err);
        browserSync.notify(buildErrorMessage('vendor:stylesheets'));
        this.emit('end');

        /* Throw error in production builds to stop npm test/deploy scripts */
        if (env === 'production') {
          throw err;
        }
      }
    }))
    .pipe(gulpif(env === 'production', sass({outputStyle: 'compressed'}), sass({outputStyle: 'expanded'})))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.vendor.stylesheets.dest))
    .pipe(browserSync.stream());
});

/**
 * Build Task
 *
 * 1. Run the jekyll task first
 * 2. When jekyll task is complete, runs other tasks in a specific order
 */
gulp.task('build', ['jekyll'], function buildTask(callback) {
  runSequence(['docs', 'images', 'vendor:stylesheets', 'stylesheets', 'vendor:javascripts', 'javascripts'], callback);
});

/**
 * Serve Task
 *
 * 1. Run the build of the site first
 * 2. When the build finishes, initialize browser-sync to serve files
 * 3. Watches docs for changes
 * 4. Watches images for changes
 * 5. Watches javascripts for changes
 * 6. Watches jekyll files that need to regenerate on change
 * 7. Watches stylesheets for changes
 * 8. Watches vendor files for changes
 */
gulp.task('serve', ['build'], function serveTask() {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });

  gulp.watch(paths.docs.watchFiles, ['docs']);
  gulp.watch(paths.images.watchFiles, ['images']);
  gulp.watch(paths.javascripts.watchFiles, ['javascripts']);
  gulp.watch(paths.jekyll.watchFiles, ['build'], browserSync.reload);
  gulp.watch(paths.stylesheets.watchFiles, ['stylesheets']);
  gulp.watch(paths.vendor.javascripts.watchFiles, ['vendor:javascripts']);
  gulp.watch(paths.vendor.stylesheets.watchFiles, ['vendor:stylesheets']);
});

/**
 * Default Task
 *
 * 1. Serves the site using serve task by default
 */
gulp.task('default', ['serve']);
