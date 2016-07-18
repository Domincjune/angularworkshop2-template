
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    gulpProtractorAngular = require('gulp-angular-protractor'),

    //gulp-eslint, fs libraries goes here

    _ = require('lodash'),

    // jspath goes here

    protractor = require('gulp-protractor'),
    argv = require('yargs').argv,
    //setProxy = true,
    logger = require('log4js').getLogger(),
    getFiles = function () {
      return [
            'app/vendor/jquery/dist/jquery.js',
            'app/vendor/angular/angular.js',
            'app/vendor/angular-animate/angular-animate.js',
            'app/vendor/angular-route/angular-route.js',
            'app/vendor/angular-mocks/angular-mocks.js',
            'app/vendor/lodash/lodash.js',
            'app/config/*.js',
            'app/core/**/*.js',
            'app/user/userModule.js',
            'app/user/userController.js',
            'app/user/userRestService.js',
            'test/unit/**/*-spec.js',
            'test/functional/mocks/*.js'
      ]
    },
    del = require('del'),
    karma = require('node-karma-wrapper'),
    prereqs = ([]).concat('test:clean'),
    portfinder = require('portfinder'),
    testPaths = {
            protractor: {
                configurationFile: 'test/protractor.conf.js'
            },
            functional: {
                testFiles: 'test/functional/**/*.js'
            },
            smoke: {
                testFiles: 'test/smoke/**/*-spec.js'
            }
    },
    proxyList = [
      '^/testendpoint/(.*)$ http://localhost:1337/$1 [P]',
      '^/groups/(.*)$ http://localhost:1337/$1 [P]'
    ],
    modRewrite = require('connect-modrewrite'),
    integrationServerOptions = _.identity;

gulp.task('default', function () {
  connect.server({
    root: 'app/',
    port: 8888,
    livereload: true,
    middleware: function () {
          return [
              modRewrite(proxyList)
          ];
      }
  });
});

//eslint taslks goes here..

gulp.task('test:clean', function(callback) {
  del([ 'coverage/*' ], callback);
});

gulp.task('test:unit', prereqs, function(callback) {
  var karmaTest = karma({ configFile: 'test/karma.conf.js', files: getFiles() });
  karmaTest.simpleRun(function (exitCode) {
    if(exitCode !== 0) {
      throw new Error('Unit Tests Failed');
    }
  });
});

gulp.task('watch:test:unit', prereqs, function () {
  var karmaTest = karma({ configFile: 'test/karma.conf.js', files: getFiles() });
  karmaTest.inBackground();
  karmaTest.start();
});


gulp.task('default:stop', function(){
  connect.serverClose();
});

gulp.task('test:functional',['default'], function(callback) {
  gulp
      .src([testPaths.functional.testFiles])
      .pipe(gulpProtractorAngular({
        'configFile': 'test/protractor.conf.js',
        'debug': false,
        'autoStartStopServer': true
      }))
      .on('error', function(e) {
        console.log(e);
      })
      .on('end',callback);
});


