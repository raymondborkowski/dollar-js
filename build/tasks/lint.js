var config = require('../config'),
    gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs   = require('gulp-jscs'),
    gutil  = require('gulp-util');

gulp.task('lint', ['dollar'], function() {
    var inputs = [
        config.paths.src.modules + '/*.js'
    ];

    return gulp.src(inputs)
        .pipe(jshint())
        // for readability change blue to yellow in node_modules/jshint-stylish/index.js
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail')).on('error', config.onErrorQuiet)
        .pipe(jscs());
});

gulp.task('lint-tests', function() {
    var inputs = [
        config.paths.test + '/../test-new/**/*.js'
    ];

    return gulp.src(inputs)
        .pipe(jshint())
        // for readability change blue to yellow in node_modules/jshint-stylish/index.js
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail')).on('error', config.onErrorQuiet)
        .pipe(jscs());
});
