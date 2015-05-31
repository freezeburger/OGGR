var gulp = require('gulp');
module.exports = gulp;

var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var del = require('del');
var debug = require('gulp-debug');
var gulpIgnore = require('gulp-ignore');
var size = require('gulp-filesize');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
    sass: ['./scss/**/*.scss'],
    js: ['./www/app/*.js', './www/app/**/*.js']
};

var ignored = '*.specs.js';

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    //gulp.watch(paths.js, ['bundle']);
});

gulp.task('watchjs', function() {
    gulp.watch(paths.js, ['bundle']);
});

gulp.task('bundle', function() {
    del('./www/lib/app.js');

    return gulp.src(paths.js)
        .pipe(gulpIgnore.exclude(ignored))
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(concat('app.bundle.js'))
        //.pipe(uglify())
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./www/lib'))
        //.on('end', function(){ gutil.log('Done!'); sh.exec('r');});
        .pipe(size())
        .on('end', function() {
            gutil.log('Done!');
        });

});

gulp.task('clean', function() {
    return del('./www/lib/app.bundle.js');
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});