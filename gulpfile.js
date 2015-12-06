var del = require('del');
var gulp = require('gulp');
var argv = require('yargs').argv;
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var exorcist = require('exorcist');
var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');

/**
 * Using different folders/file names? Change these constants:
 */
var PHASER_PATH = './node_modules/phaser/build/';
var BOOTSTRAP_PATH = './node_modules/bootstrap/dist/';
var JQUERY_PATH = './node_modules/jquery/dist/';
var ACORN_PATH = './node_modules/acorn/dist/';
var BLOCKLY_PATH = './node_modules/blockly-pre-release/';
var LIB_PATH = './lib/';
var BUILD_PATH = './build';
var SCRIPTS_PATH = BUILD_PATH + '/scripts';
var STYLES_PATH = BUILD_PATH + '/styles';
var SOURCE_PATH = './src';
var STATIC_PATH = './static';
var ENTRY_FILE = SOURCE_PATH + '/index.js';
var OUTPUT_FILE = 'game.js';

var keepFiles = false;

/**
 * Simple way to check for development/production mode.
 */
function isProduction() {
    return argv.production;
}

/**
 * Logs the current build mode on the console.
 */
function logBuildMode() {

    if (isProduction()) {
        gutil.log(gutil.colors.green('Running production build...'));
    } else {
        gutil.log(gutil.colors.yellow('Running development build...'));
    }

}

/**
 * Deletes all content inside the './build' folder.
 * If 'keepFiles' is true, no files will be deleted. This is a dirty workaround since we can't have
 * optional task dependencies :(
 * Note: keepFiles is set to true by gulp.watch (see serve()) and reseted here to avoid conflicts.
 */
function cleanBuild() {
    if (!keepFiles) {
        del(['build/**/*.*']);
    } else {
        keepFiles = false;
    }
}

/**
 * Copies the content of the './static' folder into the '/build' folder.
 * Check out README.md for more info on the '/static' folder.
 */
function copyStatic() {
    return gulp.src(STATIC_PATH + '/**/*')
        .pipe(gulp.dest(BUILD_PATH));
}

/**
 * Copies required Phaser files from the './node_modules/Phaser' folder into the './build/scripts' folder.
 * This way you can call 'npm update', get the lastest Phaser version and use it on your project with ease.
 */
function copyPhaser() {

    var srcList = ['phaser.min.js'];

    if (!isProduction()) {
        srcList.push('phaser.map', 'phaser.js');
    }

    srcList = srcList.map(function(file) {
        return PHASER_PATH + file;
    });

    return gulp.src(srcList)
        .pipe(gulp.dest(SCRIPTS_PATH));

}

/**
 * Copies required Bootstrap files from the './node_modules/bootstrap' folder into the './build/scripts' folder.
 * This way you can call 'npm update', get the lastest bootstrap version and use it on your project with ease.
 */
function copyBootstrapScripts() {

    var srcList = ['js/bootstrap.min.js'];

    srcList = srcList.map(function(file) {
        return BOOTSTRAP_PATH + file;
    });

    return gulp.src(srcList)
        .pipe(gulp.dest(SCRIPTS_PATH));
}

/**
 * Copies required Bootstrap files from the './node_modules/bootstrap' folder into the './build/styles' folder.
 * This way you can call 'npm update', get the lastest bootstrap version and use it on your project with ease.
 */
function copyBootstrapStyles() {

    var srcList = ['css/bootstrap.min.css'];

    srcList = srcList.map(function(file) {
        return BOOTSTRAP_PATH + file;
    });

    return gulp.src(srcList)
        .pipe(gulp.dest(STYLES_PATH));
}

/**
 * Copies required JQuery files from the './node_modules/jquery' folder into the './build/scripts' folder.
 * This way you can call 'npm update', get the lastest jquery version and use it on your project with ease.
 */
function copyJQuery() {

    var srcList = ['jquery.min.js'];

    srcList = srcList.map(function(file) {
        return JQUERY_PATH + file;
    });

    return gulp.src(srcList)
        .pipe(gulp.dest(SCRIPTS_PATH));
}

/**
 * Copies required Acorn files from the './node_modules/acorn' folder into the './build/scripts' folder.
 * This way you can call 'npm update', get the lastest Acorn version and use it on your project with ease.
 */
function copyAcorn() {

    var srcList = ['acorn.js'];

    srcList = srcList.map(function(file) {
        return ACORN_PATH + file;
    });

    return gulp.src(srcList)
        .pipe(gulp.dest(SCRIPTS_PATH));
}

/**
 * Copies required Blockly files from the './node_modules/blockly-pre-release' folder into the './build/scripts' folder.
 * This way you can call 'npm update', get the lastest Blockly version and use it on your project with ease.
 */
function copyBlockly() {
    var srcList = ['blockly_compressed.js',
        'blocks_compressed.js',
        'javascript_compressed.js',
        'msg/js/fr.js'
    ];

    srcList = srcList.map(function(file) {
        return BLOCKLY_PATH + file;
    });

    return gulp.src(srcList)
        .pipe(gulp.dest(SCRIPTS_PATH + '/blockly'));
}

/**
 * Copies lib folder into the './build/scripts' folder.
 */
function copyLibInterpreter() {
    var srcList = ['interpreter.js'];

    srcList = srcList.map(function (file) {
        return LIB_PATH + file;
    });

    return gulp.src(srcList)
        .pipe(gulp.dest(SCRIPTS_PATH));
}


/**
 * Transforms ES2015 code into ES5 code.
 * Optionally: Creates a sourcemap file 'game.js.map' for debugging.
 *
 * In order to avoid copying Phaser and Static files on each build,
 * I've abstracted the build logic into a separate function. This way
 * two different tasks (build and fastBuild) can use the same logic
 * but have different task dependencies.
 */
function build() {

    var sourcemapPath = SCRIPTS_PATH + '/' + OUTPUT_FILE + '.map';
    logBuildMode();

    return browserify({
        entries: ENTRY_FILE,
        debug: true
    })
        .transform(babelify)
        .bundle().on('error', function(error){
            gutil.log(gutil.colors.red('[Build Error]', error.message));
            this.emit('end');
        })
        .pipe(gulpif(!isProduction(), exorcist(sourcemapPath)))
        .pipe(source(OUTPUT_FILE))
        .pipe(buffer())
        .pipe(gulpif(isProduction(), uglify()))
        .pipe(gulp.dest(SCRIPTS_PATH));

}

/**
 * Starts the Browsersync server.
 * Watches for file changes in the 'src' folder.
 */
function serve() {

    var options = {
        server: {
            baseDir: BUILD_PATH
        },
        open: false // Change it to true if you wish to allow Browsersync to open a browser window.
    };

    browserSync(options);

    // Watches for changes in files inside the './src' folder.
    gulp.watch(SOURCE_PATH + '/**/*.js', ['watch-js']);

    // Watches for changes in files inside the './static' folder. Also sets 'keepFiles' to true (see cleanBuild()).
    gulp.watch(STATIC_PATH + '/**/*', ['watch-static']).on('change', function() {
        keepFiles = true;
    });

}


gulp.task('cleanBuild', cleanBuild);
gulp.task('copyStatic', ['cleanBuild'], copyStatic);
gulp.task('copyPhaser', ['copyStatic'], copyPhaser);
gulp.task('copyBootstrapScripts', ['copyPhaser'], copyBootstrapScripts);
gulp.task('copyBootstrapStyles', ['copyBootstrapScripts'], copyBootstrapStyles);
gulp.task('copyJQuery', ['copyBootstrapStyles'], copyJQuery);
gulp.task('copyAcorn', ['copyJQuery'], copyAcorn);
gulp.task('copyBlockly', ['copyAcorn'], copyBlockly);
gulp.task('copyLibInterpreter', ['copyBlockly'], copyLibInterpreter);
gulp.task('build', ['copyLibInterpreter'], build);
gulp.task('fastBuild', build);
gulp.task('serve', ['build'], serve);
gulp.task('watch-js', ['fastBuild'], browserSync.reload); // Rebuilds and reloads the project when executed.
gulp.task('watch-static', ['copyPhaser'], browserSync.reload);

/**
 * The tasks are executed in the following order:
 * 'cleanBuild' -> 'copyStatic' -> 'copyPhaser' -> 'build' -> 'serve'
 *
 * Read more about task dependencies in Gulp:
 * https://medium.com/@dave_lunny/task-dependencies-in-gulp-b885c1ab48f0
 */
gulp.task('default', ['serve']);