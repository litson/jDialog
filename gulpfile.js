var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat-util');
var sourcemaps = require('gulp-sourcemaps');
var yuidoc = require('gulp-yuidoc');
var docco = require("gulp-docco");

var less = require('gulp-less');


var jsPath = ['core.js', 'helper.js', 'event.js', 'operations.js', 'setting.js', 'components.js'];
var lessPath = './src/*.less';
var distPath = './dist/';

function addPrefixToEachItem(prefix, items) {
    var i = items.length;

    while (i--) {
        items[i] = prefix + items[i];
    }

    return items;
}
jsPath = addPrefixToEachItem('./src/', jsPath);

// todo:文档生成
gulp.task('docs', function () {
    //gulp.src(jsPath)
    //    .pipe(yuidoc())
    //    //.pipe(yuidoc.reporter())
    //    //.pipe(yuidoc.generator())
    //    .pipe(gulp.dest('./docs/'));
    //gulp.src(jsPath)
    //    .pipe(docco())
    //    .pipe(gulp.dest('./docs/'));
});

gulp.task('less', function () {
    gulp.src(lessPath)
        .pipe(less())
        .pipe(gulp.dest(distPath));
});

gulp.task('concat', function () {

    var fileHeader = '\n;(function (window, document) {\n\n';
    var fileFooter = '\n\n window.jDialog = jDialog;\n})(window, window.document);\n';

    gulp.src(jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('jDialog.js', {
            process: function (src) {
                var pathComments = "\n/* concat from'" + this.path.replace(__dirname, "") + "' */\n"
                return pathComments + src.trim();
            }
        }))
        .pipe(concat.header(fileHeader))
        .pipe(concat.footer(fileFooter))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(distPath));

});

gulp.task('watch', function () {
    //
    gulp.src(jsPath)
        .pipe(watch(jsPath, function () {
            gulp.start('concat');
        }));
    //
    gulp.src(lessPath)
        .pipe(watch(lessPath, function () {
            gulp.start('less');
        }));

});

gulp.task('default', ['concat', 'less', 'watch']);
