"use strict";

// “听说万物在于选择，基于我看法，何不一试？”
// — 化險為夷, 小塵埃

const 
    gulp        			= require('gulp')
,   autoprefixer      = require('gulp-autoprefixer')
,   babel             = require('gulp-babel')
,   browsersync       = require('browser-sync')
,   changed           = require('gulp-changed')
,   cleancss          = require('gulp-clean-css')
,   concat            = require('gulp-concat')
,   cp                = require('child_process')
//,   eslint            = require('gulp-eslint')
,   header            = require('gulp-header')
,   imagemin          = require('gulp-imagemin')
,   imageminMozjpeg   = require('imagemin-mozjpeg')
,   imageminPngquant  = require('imagemin-pngquant')
,   notify            = require("gulp-notify")
,   rename            = require('gulp-rename')
,   sass              = require('gulp-sass')
,   uglify            = require('gulp-uglify')
,   wait              = require('gulp-wait')
,   webpack           = require('webpack-stream')
,   webpackCompiler   = require('webpack')
;

//////////////////////////////////////////
// Options

const OPTIONS = {
  DEBUGMODE: true,
  IMG: {
    imagemin: {
      imageminMozjpegQuality:     95,
      imageminPngquantQuality:    '75',
      imageminPngquant:           1,
    }
  },
  CSS: {
    uncompressedStyle: "nested"
  }
};

const getHeaderComments = () => {
  let dateNow = new Date();
  let msg = '/* Generated on: ' + dateNow + ' */' + '\n';
  return msg;
}

//////////////////////////////////////////
// Folders
const folder = {
  src: './',
  assetsrc: './_assets_src/',
  build: '__build/',
  node: 'node_modules/'
};

const path = 
{
  src: {
    path:         folder.src,
    assetspath:   folder.assetsrc,
    scss: {
      main:       folder.assetsrc + 'scss/*.scss',
      all:        [
        folder.assetsrc + 'scss/**/*.scss',
        folder.assetsrc + 'scss/!_archive/*.scss',
        '!_assets_src/scss/_archive/**/*'
      ]
    },
    img:          [
                    folder.assetsrc + 'img/**/*'
                  ],
    js: {
      app:        folder.assetsrc + 'js/app.js', // have to match with filename in webpack
      components: folder.assetsrc + 'js/components/**/*.js',
    },
    vid:          folder.assetsrc + 'vid/**/*',
    html:         [
      folder.src + '*.html',
      folder.src + '_includes/*.html',
      folder.src + '_layouts/*.html',
      folder.src + '*.md',
      folder.src + '_includes/*.md',
      folder.src + '_layouts/*.md',
      folder.src + '_works/*.md',
      folder.src + '!NOTES.md',
    ]
  },
  build: {
    path:         folder.build,
    css:          'assets/css/',
    js:           'assets/js/',
    img:          'assets/img/',
    vid:          'assets/vid/',
    names: {
      app:      'app.js',
      plugins:  'plugins.js',
      plugins:  'plugins.js',
      main:     'main.js',
      mainMin:  'main.min.js',
      minify:   '.min'
    }
  },
};

//////////////////////////////////////////
// Javascript stuff

function jsapp() {
  let webpackMode = OPTIONS.DEBUGMODE ? 'development' : 'production';

  return gulp.src(path.src.js.app)
    .pipe(webpack({
      entry: [path.src.js.app],
      //entry: ["./_assets_src/js/app.js"],
      output: { 
          path: __dirname + path.build.js,
          filename: path.build.names.app
      },
      mode: webpackMode,
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            //exclude: /node_modules(?!(\/|\\)@barba)/,
            //exclude: /node_modules[\/\\](?!@barba|core-js|webpack)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                  "debug":true,
                  //"useBuiltIns": "entry",
                  "useBuiltIns": "usage",
                  //"corejs": 3,
                  //"modules": "umd",
                }]]
              }
            }
          }
        ]
      }
    }), webpackCompiler)
    .pipe(gulp.dest(path.build.js))
    .pipe(browsersync.stream())
    .pipe(gulp.dest(folder.build + path.build.js))
  ;
}

async function jsdist() {
  OPTIONS.DEBUGMODE = false;
  jsapp();
  //return;
}


//////////////////////////////////////////
// CSS

function scss() {
  return gulp
    .src(path.src.scss.main)
    .pipe(wait(500))
    .pipe(sass({
      onError: browsersync.notify,
      outputStyle: OPTIONS.CSS.uncompressedStyle
    }))
    .on('error', notify.onError())
    .pipe(autoprefixer())
    .pipe(header(getHeaderComments()))
    .pipe(gulp.dest(path.build.css))
    .pipe(cleancss())
    .pipe(rename({
      suffix: path.build.names.minify
    }))
    .pipe(header(getHeaderComments()))
    .pipe(gulp.dest(path.build.css))
    .pipe(gulp.dest(folder.build + path.build.css))
    .pipe(browsersync.stream())
    ;
}


//////////////////////////////////////////
// IMAGES

// Imagemin images and ouput them in dist
function images() {
  return gulp
    .src(path.src.img)
    .pipe(changed(path.build.img))
    .pipe(imagemin([
      imagemin.gifsicle(),
      imageminMozjpeg({
        quality:OPTIONS.IMG.imageminMozjpegQuality
      }),
      imageminPngquant({
        quality:OPTIONS.IMG.imageminPngquantQuality
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(path.build.img))
    .pipe(gulp.dest(folder.build + path.build.img))
  ;
}


//////////////////////////////////////////
// HTML & Markdown
// Using Jekyll to process

function jekyll(done) {
  // https://stackoverflow.com/questions/37459717/error-spawn-enoent-on-windows#answer-54515183
  return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: 'inherit', shell: process.platform == 'win32' }).on('close', done);
}


//////////////////////////////////////////
// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./__build/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}


//////////////////////////////////////////
// Watchers

function watchFiles() {
  gulp.watch(path.src.html,     gulp.series(jekyll, browserSyncReload));
  gulp.watch(path.src.scss.all, scss);
  gulp.watch(path.src.img,      images);
  gulp.watch([path.src.js.app, path.src.js.components],   jsapp);
}


//////////////////////////////////////////
// Complex Tasks
const build = gulp.parallel(
  jsdist,
  scss,
  images,
  jekyll
);
const watch = gulp.parallel(watchFiles, browserSync);


//////////////////////////////////////////
// Export Tasks
exports.img = images;
exports.css = scss;
exports.html = jekyll;
exports.jekyll = jekyll;
exports.js  = jsapp;
exports.jsdist  = jsdist;
exports.build = build;
exports.watch = watch;
exports.default = watch;