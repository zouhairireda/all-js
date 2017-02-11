var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var environments = require('gulp-environments');

var development = environments.development;
var production = environments.production;

var configFile = production() ? "./src/env/prod.js" : "./src/env/dev.js";

gulp.task('lint', function() {
	return gulp.src('./src/app/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('browserify', function() {
	return browserify('./src/app/app.js')
	.bundle()
	.pipe(source('main.js'))
	.pipe(gulp.dest('./public/'));
});

gulp.task('browser-sync', function() {
	browserSync.init({
		server : {
			baseDir : "./public",
			routes: {
				"/bower_components": "bower_components",
				"/node_modules": "node_modules"
			}
		}
	});
});

gulp.task('scripts', function(){
        return gulp.src(['./src/assets/**/*.js',configFile])
                .pipe(uglify())
                .pipe(concat('vendor.min.js'))
                .pipe(gulp.dest('./public/'));
});

gulp.task('copy', ['browserify','scss'], function() {
        gulp.src(['./src/**/*.html','./src/**/*.css'])
            .pipe(gulp.dest('./public'))
            .pipe(browserSync.stream())
    });

    gulp.task('scss', function() {
        gulp.src('./src/assets/scss/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./src/assets/stylesheets/'));
    });

        gulp.task('build',['lint', 'scss', 'copy', 'scripts']);

gulp.task('default', ['browser-sync'], function(){
        gulp.watch("./src/**/*.*", ["build"]);
        gulp.watch("./public/**/*.*").on('change', browserSync.reload);
    });