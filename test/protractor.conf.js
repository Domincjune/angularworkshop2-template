'use strict';

var _ = require('lodash'),
    argv = require('yargs').argv,
    logger = require('log4js').getLogger(),
    SELENIUM_STANDALONE_JAR = './node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',
    GRID_URL = 'http://m-qa-aopseleniummaster-01.aol.com:4444/wd/hub',
    options,
    mock = {};

 function getConfig () {
    var config = {
        // Really only useful locally (because it needs chrome/firefox)
        seleniumAddress:  'http://127.0.0.1:4444/wd/hub',
        framework: 'jasmine2',
        jasmineNodeOpts: {
            showColors: true,
            defaultTimeoutInterval: 180000,
            isVerbose: true,
            includeStackTrace: true
        },
        capabilities: {
            browserName: 'chrome' // argv.browser || 'firefox'
        },
        rootElement:'html',
        baseUrl: 'http://localhost:8888/',
        allScriptsTimeout: 30000,

        mocks : {
          default: ['user'],
          dir: './functional/mocks/'
        },

        onPrepare: function(){
          require('protractor-http-mock').config = {
            rootDirectory:  __dirname,
            protractorConfig: 'protractor.conf'
          };
        }
    };

    options = options || {};


    // this bit of code make sure the functional tests run against the grid
    if (argv.grid) {
        logger.info('Using Selenium grid:', GRID_URL);
        config.capabilities.seleniumAddress = GRID_URL;
    } else {
        logger.info('Using Selenium standalone server');
        config.seleniumServerJar = SELENIUM_STANDALONE_JAR;
    }

   //config options for runnning the tests in parallel
    if (argv.parallel) {
        logger.info('Running', argv.parallel, 'threads in parallel');
        _.assign(config.capabilities, {
            maxInstances: argv.parallel,
            shardTestFiles: true
        });
    }

   // _.assign(config, PropertyLoader.properties());
    config.baseUrl = argv.baseUrl || config.baseUrl;
    logger.info('Running tests against', config.baseUrl);

    return config;
};

exports.config = getConfig();
