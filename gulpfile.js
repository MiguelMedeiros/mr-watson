var gulp           = require('gulp'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify'),
	rename         = require('gulp-rename'),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	sourcemaps     = require('gulp-sourcemaps'),
	autoprefixer   = require('gulp-autoprefixer'),
	jshint         = require('gulp-jshint'),
	nodemon        = require('gulp-nodemon');

gulp.task('lint', function() {
  return gulp.src('./**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('browser-sync', ['nodemon', 'lint'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000",
		files: [
			"public/**/*.*",
			"components/**/*.*",
			"routes/**/*.*",
			"views/**/*.*"
		],
		port: 3000,
	});
});

gulp.task('nodemon', function (cb) {
    return nodemon({
      script: './bin/www'
    }).once('start', cb);
});

var config = {
	scripts: [
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/popper.js/dist/umd/popper.min.js',
		'./node_modules/bootstrap/dist/js/bootstrap.min.js',
		'./node_modules/jquery-mask-plugin/dist/jquery.mask.min.js',
		'./public/javascripts/app/**/*.js'
	],
	styles:[
		'./public/stylesheets/partials/**/*.scss',
		'./public/stylesheets/style.scss'
	]
};

gulp.task('scripts', function() {
	return gulp.src(config.scripts)
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest('./public/javascripts/'))
	.pipe(uglify())
	.pipe(rename({ extname: '.min.js' }))
	.pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('sass', function () {
	return gulp.src(config.styles)
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('watch', function () {
	gulp.watch('./bin/**/*.js', ['lint']);
	gulp.watch('./components/**/*.js', ['lint']);
	gulp.watch('./public/javascripts/app/**/*.js', ['scripts', 'lint']);
	gulp.watch('./public/stylesheets/**/*.scss', ['sass']);
	gulp.watch('./routes/**/*.js', ['lint']);
	gulp.watch('./app.js', ['lint']);
	gulp.watch('./variables.js', ['lint']);
});

gulp.task('default', ['browser-sync', 'sass', 'scripts', 'watch', 'lint']);