'use strict';

//import fs from 'fs';
//import path from 'path';

import gulp from 'gulp';

// Load all gulp plugins automatically
// and attach them to the `plugins` object
import plugins from 'gulp-load-plugins';

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
import runSequence from 'run-sequence';

//import glob from 'glob';
//import del from 'del';

import gutil from 'gulp-util';

// import autoprefixer from 'gulp-autoprefixer';
// import sourcemaps from 'gulp-sourcemaps';

// Transform all required files with Babel
//require('babel/register');

import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import isparta from 'isparta';

// Files to process
var TEST_FILES = 'test/**/*.js';
var SRC_FILES = 'js/**/*.js';

// import pkg from './package.json';

// const dirs = pkg['hugo-sites-theme-configs'].directories;

/*
gulp.task('clean', (done) => {
    del([
        dirs.static
    ]).then( () => {
        done();
    });
});


gulp.task('copy', [
    //'copy:.htaccess',
    //'copy:index.html',
    //'copy:normalize'
]);
*/


/*
 * Instrument files using istanbul and isparta
 */
gulp.task('coverage:instrument', function() {
  return gulp.src(SRC_FILES)
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter // Use the isparta instrumenter (code coverage for ES6)
      // Istanbul configuration (see https://github.com/SBoudrias/gulp-istanbul#istanbulopt)
      // ...
    }))
    .pipe(istanbul.hookRequire()); // Force `require` to return covered files
});

/*
 * Write coverage reports after test success
 */
gulp.task('coverage:report', function() {
  return gulp.src(SRC_FILES, {read: false})
    .pipe(istanbul.writeReports({
      // Istanbul configuration (see https://github.com/SBoudrias/gulp-istanbul#istanbulwritereportsopt)
      // ...
    }));
});



gulp.task('lint:js', () =>
    gulp.src([
        'gulpfile.babel.js',
        //`${dirs.src}/js/*.js`,
        //`${dirs.test}/*.js`
    ]).pipe(plugins().jscs())
      .pipe(plugins().jshint())
      .pipe(plugins().jshint.reporter('jshint-stylish'))
      .pipe(plugins().jshint.reporter('fail'))
);

/**
 * Run unit tests
 */
gulp.task('test', function() {
  return gulp.src(TEST_FILES, {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

/**
 * Run unit tests with code coverage
 */
gulp.task('test:coverage', function(done) {
  runSequence('coverage:instrument', 'test', 'coverage:report', done);
});

/**
 * Watch files and run unit tests on changes
 */
gulp.task('tdd', function() {
  gulp.watch([
    TEST_FILES,
    SRC_FILES
  ], ['test']).on('error', gutil.log);
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------


gulp.task('build', (done) => {
    runSequence(
        ['clean', 'lint:js'],
        'copy',
    done);
});

gulp.task('default', ['test']);
