var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var jsPath = ['_header.js', 'core.js', 'helper.js', 'event.js', 'operations.js', 'setting.js', '_footer.js'];
var distPath = './dist/';

function addPrefix(fix, arr) {

    return;
}

gulp.task('concat', function () {

    gulp.src(jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('jDialog.js', {newLine: '\n/*  */\n'}))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(distPath));

});

gulp.task('watch', function () {
    gulp.src(jsPath)
        .pipe(watch(jsPath, function () {
            gulp.start('concat');
        }))

});


gulp.task('default', ['concat', 'watch']);