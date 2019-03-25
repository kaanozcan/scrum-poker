const gulp = require("gulp"),
      webpack = require("webpack"),
      babel = require("gulp-babel"),
      webpackConfig = require("./webpack.config"),
      nodemon = require("nodemon")
      path = require("path"),
      exec = require('child_process').exec;


const logMessage = (message) => console.log(message);

const webpackRunCallback = (callback) => (err, stats) => {
  if (err) {
    throw new Error(err);
  }

  if (stats && stats.hasErrors()) {
    console.log("Webpack Build Error");
    console.log(stats.toString());

    return;
  }

  console.log(stats.toString());
  callback();
}

const getCompiler = () => webpack(webpackConfig);

const bundleClient = (done) => {
  const callback = webpackRunCallback(done);
  const compiler = getCompiler();

  compiler.run(callback);
}

const copyVendor = () => {
  return gulp
    .src("./node_modules/antd/**/*")
    .pipe(gulp.dest("./public/vendor/antd"))
}

const copyPublic = (done) => gulp
  .src("./public/**/*")
  .pipe(gulp.dest("./dist/public"))
  .on('end', function () {
      if (done) {
        done(); // callback to signal end of build
      }
    });

const buildClient = gulp.series([bundleClient, copyVendor, copyPublic]);

const watchClient = (done) => {
  const callback = webpackRunCallback(() => {
    copyPublic(done)
  });
  const compiler = getCompiler();

  compiler.watch({
    aggregateTimeout: 300
  }, callback);
};

const buildBackendSrc = () => gulp
  .src(["./src/**/*"])
  .pipe(babel())
  .pipe(gulp.dest("./dist/src"));

const buildBackendLib = () => gulp
  .src(["./lib/**/*"])
  .pipe(babel())
  .pipe(gulp.dest("./dist/lib"));

const buildBackend = gulp.parallel([buildBackendSrc, buildBackendLib]);

const watchBackend = () => gulp.watch(["./src/**/*", "./lib/**/*"], buildBackend);

const watch = (done) => {
  const childBackend = exec("npm run watch-backend"),
        childFrontend = exec("npm run watch-client");

  childBackend.stdout.on('data', logMessage);

  childFrontend.stdout.on('data', logMessage);
}

const build = () => gulp.series(buildBackend, buildClient);

module.exports = Object.assign({}, exports, {
  bundleClient,
  buildClient,
  watchClient,

  copyPublic,
  copyVendor,

  buildBackend,
  watchBackend,

  watch,
  build
});
