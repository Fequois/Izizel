/**
 *
 *  Izizel Build Tool
 *  Modified Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';



/* Setup
---------------------------------------------------------------------------- */

var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var del         = require('del');
var runSequence = require('run-sequence');
var pagespeed   = require('psi');
var path        = require('path');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;



/* Lint JavaScript on error
---------------------------------------------------------------------------- */

gulp.task('jshint', function () {
    return gulp.src(
            [
                'app/scripts/**/*.js',
                '!app/scripts/vendor{,/**}'
            ]
        )
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});



/* Optimise images
---------------------------------------------------------------------------- */

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size({title: 'images'}));
});



/* Copy files from app/ to dist/ with exceptions
---------------------------------------------------------------------------- */

gulp.task('copy', [
    'copy:all',
    'copy:jquery'
]);

gulp.task('copy:all', function () {
    return gulp.src([
        'app/*',
        '!app/*.html',
        '!app/vendor{,/**}'
        ], {
            dot: true
        }).pipe(gulp.dest('dist'))
        .pipe($.size({title: 'copy'}));
});

gulp.task('copy:jquery', function () {
    return gulp.src(['bower_components/jquery/dist/jquery.min.js'])
        .pipe($.rename('jquery.js'))
        .pipe(gulp.dest('dist/scripts/vendor'));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
    return gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size({title: 'fonts'}));
});



/* Compile and prefix stylesheets
---------------------------------------------------------------------------- */

gulp.task('styles', function () {

    var AUTOPREFIXER_BROWSERS = [
        '> 2%',
        'last 2 versions',
        'firefox esr',
        'ie >= 8'
    ];

    return gulp.src([
        'app/**/main.scss'
        ])
        .pipe($.changed('.tmp/styles', {extension: '.css'}))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 6
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.csso()))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'styles'}));
});



/* Concatenate and minify JavaScript
---------------------------------------------------------------------------- */

gulp.task('scripts', function () {
    var sources = [
        // Scripts
        'app/scripts/**/*.js'
    ];
    return gulp.src(sources)
        .pipe($.concat('main.min.js'))
        .pipe($.uglify({preserveComments: 'some'}))
        // Output files
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.size({title: 'scripts'}));
});



/* Scan HTML for assets and optimise them
---------------------------------------------------------------------------- */

gulp.task('html', function () {
    var assets = $.useref.assets({searchPath: '{.tmp,app}'});

    return gulp.src('app/**/**/*.html')
        .pipe(assets)
        // Remove unused CSS
        .pipe($.if('*.css', $.uncss({
            html: [
                'app/index.html'
            ],
            // CSS selectors for UnCSS to ignore
            ignore: []
        })))

        // Concatenate and minify styles
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())

        // Minify any HTML
        .pipe($.if('*.html', $.minifyHtml()))
        // Output files
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});



/* Clean up output directory dist/
---------------------------------------------------------------------------- */

gulp.task('clean', del.bind(null,['.tmp', 'dist/*', '!dist/.git'], {dot: true}));



/* Watch files for changes and reload
---------------------------------------------------------------------------- */

gulp.task('serve', ['styles'], function () {
    browserSync({
        notify: false,
        logPrefix: 'IZL',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate
        // https: true,
        server: ['.tmp', 'app']
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/**/**/**/*.{scss,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], reload);
});



/* Build and serve the output from dist/
---------------------------------------------------------------------------- */

gulp.task('serve:dist', ['default'], function () {
    browserSync({
        notify: false,
        logPrefix: 'IZL',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate
        // https: true,
        server: 'dist',
        baseDir: 'dist'
    });
});



/* Build production files (default task)
---------------------------------------------------------------------------- */

gulp.task('default', ['clean'], function () {
    runSequence(
        'styles',
        ['jshint', 'html', 'scripts', 'images', 'fonts', 'copy']
    );
});



/* Run PageSpeed Insights
---------------------------------------------------------------------------- */

gulp.task('pagespeed', function () {
    // Update the below URL to the public URL of your site
    pagespeed.output('example.com', {
        strategy: 'mobile',
        // By default we use the PageSpeed Insights free (no API key) tier.
        // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
        // key: 'YOUR_API_KEY'
    });
});
