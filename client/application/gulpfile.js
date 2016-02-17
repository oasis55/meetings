var gulp         = require('gulp'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    minifyCss    = require('gulp-minify-css'),
    less         = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer');

var src = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
    'bower_components/angular-translate/angular-translate.js',
    'bower_components/ngCordova/dist/ng-cordova.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-touch/angular-touch.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-sanitize/angular-sanitize.js',
    'bower_components/autoheight/src/angular-autoheight.js',
    'ngMeeting/*.js',
    'ngMeeting/**/*.js'
];

gulp.task('release', function () {

    gulp
        .src(src)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('www/js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('www/js'));

});

gulp.task('debug', function () {

    gulp
        .src(src)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('www/js'));

});

gulp.task('i18n', function () {

    gulp
        .src('bower_components/angular-i18n/*.js')
        .pipe(gulp.dest('www/js/angular-i18n'));

});

// Less
gulp.task('less', function () {

    return gulp
        .src('less/main.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('www/css'));

});

// Действия по умолчанию
gulp.task('default', ['release', 'debug','less'], function () {

    gulp.watch('ngMeeting/**/*.js', ['debug']);
    gulp.watch(['less/*.*', 'less/**/*.*'], ['less']);

});