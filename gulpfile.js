
// “听说万物在于选择，基于我看法，何不一试？”
// — 化險為夷, 小塵埃

var gulp              = require('gulp');
var del               = require('del');
var autoprefixer      = require('gulp-autoprefixer');
var changed           = require('gulp-changed');
var cleancss          = require('gulp-clean-css');
var concat            = require('gulp-concat');
var imagemin          = require('gulp-imagemin');
var imageminPngquant  = require('imagemin-pngquant');
var imageminMozjpeg   = require('imagemin-mozjpeg');
var rename            = require('gulp-rename');
var sass              = require('gulp-sass');
var uglify            = require('gulp-uglify');
var notify            = require("gulp-notify");
var header            = require("gulp-header");
var concat            = require('gulp-concat');
var fs                = require('fs');
var browserSync       = require('browser-sync');
var cp                = require('child_process');
var assetsManifest    = require('gulp-assets-manifest');
var filelist          = require('gulp-filelist');
var imageResize       = require('gulp-image-resize');
var gm                = require('gulp-gm');

//var htmlmin       = require('gulp-htmlmin');

// Package information, including version
var pkg = require('./package.json');
 
var bases = {
  build:                '__build',
  buildJs:              '__build/js/',
  buildCss:             '__build/css/',
  buildImg:             '__build/img/',
  buildImgGithub:       'img/',
  buildImgSml:          '__build/img/sml/',
  buildImgSmlGithub :   'img/sml/',
  buildVid:             '__build/vid/',
  buildData:            '__build/data/',
  dist:                 'dist/',
};
 
var srcPaths = {
  htmlAll:      ['*.html', 
                '_layouts/*.html', 
                '_posts/*', 
                '_includes/*.html', 
                '*.md',
                '**/*.md',
                '!NOTES.md'],
  jsAll:        ['js/**/*.js','!js/_ARCHIVE/**/*.js'],
  jsMain:       'js/main.js',
  jsApp:        ['js/app/helpers.js','js/app/main.js'],
  jsVendor:     'js/vendor/**/*.js',
  jsOldIe:      'js/old-ie/**/*.js',
  jsPlugins:    ['js/plugins/console.js','js/plugins/**/*.js'],
  imgAll:       ['img_source/**/*','!img_source/sml/**/*.*'],
  imgJpgPng:    ['img_source/**/*.{jpg,png}','!img_source/sml/**/*.*'],
  vidAll:       'vid/**/*.*',
  scss:         'scss/**/*.scss',
  normalizeCss: 'css/normalize.css',
  extras:       ['plugin/**/*.*']
};

var buildPaths = {
  imgAll:       ['__build/img/**/*.*'],
}

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var imageminMozjpegQuality  = 95;
var imageminPngquantQuality = '30-90';


//////////////////////////////////////////
// JAVASCRIPT

// Build Build Plugin JS files
gulp.task('jsplugins', function () {
  return gulp.src(srcPaths.jsPlugins, { base: '.' })
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest(bases.buildJs))
    .pipe(gulp.dest('js'));
});

gulp.task('jsplugins:watch', ['jsplugins'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('jsapp', function () {
  return gulp.src(srcPaths.jsApp)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(bases.buildJs))
    .pipe(gulp.dest('js'));
});

gulp.task('jsapp:watch', ['jsapp'], function (done) {
  browserSync.reload();
  done();
});

// Uglify MainJS file
gulp.task('jsmain', function () {
  return gulp.src(srcPaths.jsMain)
    .pipe(uglify())
    .pipe(gulp.dest(bases.buildJs))
    .pipe(gulp.dest('js'));
});

gulp.task('jsmain:watch', ['jsmain'], function (done) {
  browserSync.reload();
  done();
});

// Copy Vendor JS files
gulp.task('jsvendor', function () {
  return gulp.src(srcPaths.jsVendor, { base: '.' })
    .pipe(changed(bases.build))
    .pipe(gulp.dest(bases.build));
});

gulp.task('jsvendor:watch', ['jsvendor'], function (done) {
  browserSync.reload();
  done();
});

// Copy Old IE JS files
gulp.task('jsoldie', function () {
  return gulp.src(srcPaths.jsOldIe, { base: '.' })
    .pipe(changed(bases.build))
    .pipe(gulp.dest(bases.build));
});

gulp.task('jsoldie:watch', ['jsoldie'], function (done) {
  browserSync.reload();
  done();
});

//////////////////////////////////////////
// CSS

gulp.task('sass:old', function () {
  var d = new Date(),
      headerComment = '/* Generated on:' + d + ' */' + '\n';

  return gulp.src(srcPaths.scss)
    .pipe(sass({
      //errLogToConsole: true,
      includePaths : ['scss/**/'],
      onError: browserSync.notify,
      outputStyle: 'nested'
    }))
    .pipe(autoprefixer({
      browsers: ['last 15 versions','> 1%','last 3 versions','Safari 5.1','ie 8']
    }))
    .pipe(header(fs.readFileSync(srcPaths.normalizeCss, 'utf8') + '\n'))
    .pipe(header(headerComment))
    .pipe(gulp.dest(bases.buildCss))
    .pipe(cleancss())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(header(headerComment))
    .pipe(gulp.dest(bases.buildCss))
    .pipe(notify("Style baby, style"));
});

gulp.task('sass', function () {
  var d = new Date(),
      headerComment = '/* Generated on:' + d + ' */' + '\n';

  return gulp.src(srcPaths.scss)
    .pipe(sass({
      //errLogToConsole: true,
      includePaths : ['scss/**/'],
      onError: browserSync.notify,
      outputStyle: 'nested'
    }))
    .pipe(autoprefixer({
      browsers: ['last 15 versions','> 1%','last 3 versions','Safari 5.1','ie 8']
    }))
    .pipe(header(fs.readFileSync(srcPaths.normalizeCss, 'utf8') + '\n'))
    .pipe(header(headerComment))
    .pipe(gulp.dest(bases.buildCss))
    .pipe(gulp.dest('css'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(header(headerComment))
    .pipe(gulp.dest(bases.buildCss))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('css'));
});

gulp.task('sass:watch', ['sass'], function (done) {
  browserSync.reload();
  done();
});

//////////////////////////////////////////
// IMAGES

//gulp.task("imageresize", function () {
////  debugger;
//  gulp.src(srcPaths.imgJpgPng)
//    .pipe(imageResize({ 
//        width : 100,
//        imageMagick: true,
//        filter: "Catrom" }))
//    .pipe(rename(function (path) { path.basename += "-sml"; }))
//    .pipe(gulp.dest(bases.buildImg));
//});

//Resize then blur image
gulp.task('imgresblur',function(){
  gulp.src(srcPaths.imgJpgPng)
    .pipe(changed(bases.buildImg))
    .pipe(gm(function (gmfile) {
      return gmfile.resize(100);
    }, {
      imageMagick: true
    }))
    .pipe(gm(function (gmfile) {
      return gmfile.blur("16x8");
    }, {
      imageMagick: true
    }))
    //.pipe(rename(function (path) { path.basename += "-sml"; }))
    .pipe(gulp.dest(bases.buildImgSml))
    .pipe(gulp.dest(bases.buildImgSmlGithub));
    //.pipe(gulp.dest('img/sml'));
});

gulp.task('imgresblur:dist',function(){
  gulp.src(srcPaths.imgJpgPng)
    .pipe(gm(function (gmfile) {
      return gmfile.resize(100);
    }, {
      imageMagick: true
    }))
    .pipe(gm(function (gmfile) {
      return gmfile.blur("16x8");
    }, {
      imageMagick: true
    }))
    .pipe(gulp.dest(bases.buildImgSml))
    .pipe(gulp.dest(bases.buildImgSmlGithub));
});

gulp.task('imgres',function(){
  gulp.src(srcPaths.imgJpgPng)   
    .pipe(gm(function (gmfile) {
      return gmfile.resize(100);
    }, {
      imageMagick: true
    }))
    .pipe(rename(function (path) { path.basename += "-sml"; }))
    .pipe(gulp.dest(bases.buildImg))
    .pipe(gulp.dest(bases.buildImgGithub));
});

gulp.task('imagemin', ['imgresblur'], function() {
 return gulp.src(srcPaths.imgAll)
 .pipe(changed(bases.buildImg))
 .pipe(imagemin([
   imagemin.gifsicle(),
   imageminMozjpeg({
     quality:imageminMozjpegQuality
   }),
   imageminPngquant({
     quality:imageminPngquantQuality
   }),
   imagemin.svgo()
 ]))
 .pipe(gulp.dest(bases.buildImg))
 .pipe(gulp.dest(bases.buildImgGithub));
});

gulp.task('imagemin:dist', ['imgresblur:dist'], function() {
 return gulp.src(srcPaths.imgAll)
 .pipe(imagemin([
    imagemin.gifsicle(),
    imageminMozjpeg({
        quality:imageminMozjpegQuality
      }),
    imageminPngquant({
        quality:imageminPngquantQuality
      }),
    imagemin.svgo()
    ]))
 .pipe(gulp.dest(bases.buildImg))
 .pipe(gulp.dest(bases.buildImgGithub));
});

gulp.task('manifest:img', function() {
    gulp.src(srcPaths.imgAll)
        .pipe(assetsManifest('assets.json', {
              assetsDir:"img",
              pathSeparator:"/"
            }))
        .pipe(gulp.dest(bases.build));
});

gulp.task('filelist:img', function() {
    gulp.src(srcPaths.imgAll, { base: '.' })
        .pipe(filelist('assetx.json', { absolute: false }))
        .pipe(gulp.dest(bases.build));
});



gulp.task('imagemin:watch', ['imagemin'], function (done) {
  browserSync.reload();
  done();
});

//////////////////////////////////////////
// Videos

// Copy video files
gulp.task('vid', function () {
  return gulp.src(srcPaths.vidAll)
    .pipe(changed(bases.buildVid))
    .pipe(gulp.dest(bases.buildVid));
});

gulp.task('vid:watch', ['vid'], function (done) {
  browserSync.reload();
  done();
});

//////////////////////////////////////////
// HTML

// Copy All html files that haz changed
gulp.task('html', function () {
  return gulp.src(srcPaths.htmlAll, { base: '.' })
  .pipe(changed(bases.build))
  .pipe(gulp.dest(bases.build))
  .pipe(notify("Good artists copy"));
});


// Jekyll
gulp.task('jekyll:dev', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll.bat', ['build', '--future'], {stdio: 'inherit'})
  .on('close', done);
});

gulp.task('jekyll:rebuild', ['jekyll:dev'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('jekyll:dist', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll.bat', ['build'], {stdio: 'inherit'})
  .on('close', done);
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll:dev', 'jsvendor', 'jsmain', 'jsplugins'], function() {
  browserSync({
    server: {
      baseDir: '__build'
    }
  });
});

gulp.task('browser-sync-no-buildfirst', function() {
  browserSync({
    server: {
      baseDir: '__build'
    }
  });
});

//////////////////////////////////////////

gulp.task('watch', function () {
  //gulp.watch(srcPaths.htmlAll, ['copy-html']);
  gulp.watch(srcPaths.imgAll,   ['imagemin:watch']);
  gulp.watch(srcPaths.htmlAll,  ['jekyll:rebuild']);
  gulp.watch(srcPaths.vidAll,   ['vid:watch']);
  gulp.watch(srcPaths.scss,     ['sass']);
  gulp.watch(srcPaths.jsVendor, ['jsvendor:watch']);
  gulp.watch(srcPaths.jsApp,    ['jsapp:watch']);
  gulp.watch(srcPaths.jsPlugins,['jsplugins:watch']);
  //gulp.watch(srcPaths.jsMain,   ['jsmain:watch']);
  //gulp.watch(srcPaths.jsAll, ['build-jsplugins','build-jsmain','copy-jsvendor']);
});

gulp.task('default', ['browser-sync-no-buildfirst','watch']);
gulp.task('dist', ['jekyll:dist','sass','jsplugins','jsapp','jsvendor','imagemin:dist']);