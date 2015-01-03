var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat-util');
var sourcemaps = require('gulp-sourcemaps');
//var yuidoc = require('gulp-yuidoc');
//var docco = require("gulp-docco");
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
//var size = require('gulp-size');
var csso = require('gulp-csso');
//var livereload = require('gulp-livereload');
//var tinylr = require('tiny-lr');

var jsFiles = ['core.js',
    'helper.js',
    'event.js',
    'operations.js',
    'setting.js',
    'components.js',
    'compatibleAMD.js'
];

var lessPath = './src/*.less';
var distPath = './dist/';
// todo 从package.json中获取
var version = '1.0.0';

function addPrefixToEachItem(prefix, items) {
    var i = items.length;

    while (i--) {
        items[i] = prefix + items[i];
    }

    return items;
}
var jsPath = addPrefixToEachItem('./src/', jsFiles);

// TODO:文档生成
gulp.task('docs', function() {});

//
gulp.task('compress', function() {
    var compressPath = distPath + "/jDialog-" + version;

    gulp.src(distPath + "*.js")
        .pipe(uglify())
        .pipe(gulp.dest(compressPath));

    gulp.src(distPath + "*.css")
        .pipe(csso())
        .pipe(gulp.dest(compressPath));

});

// 代码检查
gulp.task('lint', function() {
    gulp.src(jsPath)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// less编译
gulp.task('less', function() {
    gulp.src(lessPath)
        .pipe(less())
        .pipe(gulp.dest(distPath));
});

// 添加前缀，需要先做less编译
gulp.task('ap', function() {
    gulp.src(distPath + '*.css').pipe(autoprefixer({
        //browsers: ['Chrome'],
        cascade: true,
        remove: true
    })).pipe(gulp.dest(distPath));
});

// 合并
gulp.task('concat', function() {

    var fileHeader = '\n;(function (window, document) {\n\n';
    var fileFooter = '\n\n})(window, window.document);\n';

    gulp.src(jsPath)
        .pipe(sourcemaps.init())
        .pipe(concat('jDialog.js', {
            process: function(src) {
                var pathComments = '\n/* concat from"' + this.path.replace(__dirname, '') + '" */\n';
                var src = pathComments + src.trim();
                return src.replace(/\n/g, '\n    ');
            }
        }))
        .pipe(concat.header(fileHeader))
        .pipe(concat.footer(fileFooter))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(distPath));

});

// watch
gulp.task('watch', function() {
    //
    gulp.src(jsPath)
        .pipe(watch(jsPath, function() {
            gulp.start('concat');
        }));
    //
    gulp.src(lessPath)
        .pipe(watch(lessPath, function() {
            gulp.start('less');
        }));

});

gulp.task('default', ['concat', 'less', 'ap', 'watch']);
