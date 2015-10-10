var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var gutil = require('gulp-util');
var babelify = require('babelify');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var connect = require('gulp-connect');
var open = require('gulp-open');
var ghPages = require('gulp-gh-pages');

var config = {
	HTML: 'index.html',
	CSS: 'css/**/*.css',
	JS: 'js/**/*.js',
	JS_OUT: 'build.js',
	MIN_JS_OUT: 'build.min.js',
	CSS_OUT: 'style.css',
	MIN_CSS_OUT: 'style.min.css',
	DEST: 'build',
	ENTRY_POINT: './js/app.js',
	ENTRY_HTML: './build/index.html',
	PORT: 9000,
	DEV_BASE_URL: 'http://localhost'
};

function replaceHTML(dev) {
	return gulp.src(config.HTML)
		.pipe(gulpif(dev, htmlreplace({
			'js': config.JS_OUT,
			'css': config.CSS_OUT
		})))
		.pipe(gulpif(!dev, htmlreplace({
			'js': config.MIN_JS_OUT,
			'css': config.MIN_CSS_OUT
		})))
		.pipe(gulp.dest(config.DEST));
}

gulp.task('html', function() {
	return replaceHTML(true);
});

gulp.task('html_prod', function() {
	return replaceHTML(false);
});

function bundleCSS(dev) {
	return gulp.src(config.CSS)
		.pipe(gulpif(dev, concatCss(config.CSS_OUT)))
		.pipe(gulpif(!dev, concatCss(config.MIN_CSS_OUT)))
		.pipe(gulpif(!dev, minifyCss({compatibility: 'ie8'})))
		.pipe(gulp.dest(config.DEST));
}

gulp.task('css', function() {
	return bundleCSS(true);
});

gulp.task('css_prod', function() {
	return bundleCSS(false);
});

function bundleJS(dev) {
	var bundler = browserify({
		entries: [config.ENTRY_POINT],
		debug: dev,
		transform: [babelify, reactify],
		cache: {},
		packageCache: {},
		fullPaths: true
	});

	if (dev) {
		bundler = watchify(bundler);
	}

	function rebundle() {
		return bundler.bundle()
			.on('error', function(err) {
				gutil.log(
					gutil.colors.red('Browserify compile error:'),
					err.message
				);
				this.emit('end');
			})
			.pipe(gulpif(dev, source(config.JS_OUT)))
			.pipe(gulpif(!dev, source(config.MIN_JS_OUT)))
			.pipe(gulpif(!dev, streamify(uglify())))
			.pipe(gulp.dest(config.DEST));
	}

	if (dev) {
		bundler.on('update', function() {
			gutil.log('Rebundling JS');
			rebundle();
		});
	}

	bundler.on('log', function(msg) {
		gutil.log(msg);
	});

	return rebundle();
}

gulp.task('js', function() {
	return bundleJS(true);
});

gulp.task('js_prod', function() {
	return bundleJS(false);
});

gulp.task('watch', function() {
	gulp.watch(config.HTML, ['html']);
	gulp.watch(config.CSS, ['css']);
});

gulp.task('connect', function() {
	connect.server({
		root: [config.DEST],
		port: config.PORT,
		base: config.DEV_BASE_URL,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	return gulp.src(config.ENTRY_HTML)
		.pipe(gulp.dest(config.DEST))
		.pipe(connect.reload());
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages({
        branch: 'gh-pages'
    }));
});

gulp.task('prod', ['html_prod', 'css_prod', 'js_prod']);

gulp.task('default', ['html', 'css', 'js', 'watch', 'open']);
