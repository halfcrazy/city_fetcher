var
    jslint = require('gulp-jslint'),
    gulp = require('gulp');

gulp.task('jslint', function () {
    return gulp.src([
        './proxy/*.js',
        './common/*.js',
        './api/*.js',
        './models/*.js',
        './*.js'
    ]).pipe(jslint({
        node: true,
        nomen: true,
        sloppy: true,
        plusplus: true,
        unparam: true,
        stupid: true
    }));
});

gulp.task('default', ['jslint']);