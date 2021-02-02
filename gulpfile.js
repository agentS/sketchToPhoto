const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const watchify = require("watchify");
const fancyLog = require("fancy-log");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const paths = {
	pages: ["src/*.html"]
};

const watchedBrowserify = watchify(
	browserify({
		basedir: ".",
		debug: true,
		entries: ["src/main.ts"],
		cache: {},
		packageCache: {},
	})
		.plugin(tsify)
		.transform("babelify", {
			presets: ["es2015"],
			extensions: [".ts"],
		})
);

gulp.task("copy-html", function() {
	return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

function bundle() {
	return watchedBrowserify
			.bundle()
			.on("error", fancyLog)
			.pipe(source("bundle.js"))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write("./"))
			.pipe(gulp.dest("dist"))
}

gulp.task(
	"default",
	gulp.series(gulp.parallel("copy-html"), bundle)
);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancyLog);

gulp.task("copy-html-release", function() {
	return gulp.src(paths.pages).pipe(gulp.dest("release"));
});

gulp.task(
	"release",
	gulp.series(gulp.parallel("copy-html-release"), function() {
		return browserify({
			basedir: ".",
			debug: true,
			entries: ["src/main.ts"],
			cache: {},
			packageCache: {},
		})
			.plugin(tsify)
			.transform("babelify", {
				presets: ["es2015"],
				extensions: [".ts"],
			})
			.bundle()
			.on("error", fancyLog)
			.pipe(source("bundle.js"))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(uglify())
			.pipe(sourcemaps.write("./"))
			.pipe(gulp.dest("release"))
	})
)
