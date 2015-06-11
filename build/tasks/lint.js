var config     = require('../config'),
    gulp       = require('gulp'),
    jshint     = require('gulp-jshint'),
    jscs       = require('gulp-jscs'),
    gutil      = require('gulp-util');

function deps () {
    if (gutil.env.docs) {
        return ['docs'];
    }
    return ['dollar'];
}

gulp.task('lint', deps(), function() {
    var inputs = [
        config.paths.src.modules + '/*.js'
    ];

    return gulp.src(inputs)
        .pipe(jshint())
        // for readability change blue to yellow in jshint-stylish/stylish.js
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail')).on('error', config.onErrorQuiet)
        .pipe(jscs());
});