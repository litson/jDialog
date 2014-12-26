var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat-util');
var sourcemaps = require('gulp-sourcemaps');

var jsPath = ['core.js', 'helper.js', 'event.js', 'operations.js', 'setting.js'];
var distPath = './dist/';

function addPrefixToEachItem(prefix, items) {
    var i = items.length;

    while (i--) {
        items[i] = prefix + items[i];
    }

    return items;
}
jsPath = addPrefixToEachItem('./src/', jsPath);

gulp.task('concat', function() {

    var fileHeader = '\n;(function (window, document) {\n\n';
    var fileFooter = '\n\n window.jDialog = jDialog;\n})(window, window.document);\n';

    gulp.src(jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('jDialog.js', {
            process: function(src) {
                var pathComments = "\n/* concat from'" + this.path + "' */\n"
                return pathComments + src.trim();
            }
        }))
        .pipe(concat.header(fileHeader))
        .pipe(concat.footer(fileFooter))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(distPath));

});

gulp.task('watch', function() {
    gulp.src(jsPath)
        .pipe(watch(jsPath, function() {
            gulp.start('concat');
        }))

});

gulp.task('default', ['concat', 'watch']);
