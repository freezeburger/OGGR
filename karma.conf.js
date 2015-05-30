//karma start --browsers chrome_without_security
//open -a Google\ Chrome --args --disable-web-security
//npm install karma-json-preprocessor --save-dev

// Karma configuration
// Generated on Fri May 29 2015 13:04:30 GMT+0400 (GST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: 'www',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'lib/ionic/js/ionic.bundle.js',
            'lib/firebase/firebase.js',
            'https://cdn.firebase.com/libs/angularfire/1.1.1/angularfire.min.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            'app/**/!(*.specs).js',
            'app/**/*.specs.js', {
                pattern: 'app/**/*.json',
                watched: false,
                served: true,
                included: false
            }
        ],


        // list of files to exclude
        exclude: [
            //'www/lib/**/*.js'
            'app/_block.js'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/**/*.json': ['json']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'html'],

        // the default configuration 
        htmlReporter: {
            outputDir: 'karma_reports', // where to put the reports  
            templatePath: null, // set if you moved jasmine_template.html 
            focusOnFailures: true, // reports show failures on start 
            namedFiles: false, // name files instead of creating sub-directories 
            pageTitle: null, // page title for reports; browser info by default 
            urlFriendlyName: false, // simply replaces spaces with _ for files/dirs 
            // experimental 
            preserveDescribeNesting: false, // folded suites stay folded  
            foldAll: false, // reports start folded (only with preserveDescribeNesting) 
        },


        // web server port
        port: 9876,

        proxies : {
          'app/core/data/': 'http://192.168.1.105:50/app/core/data/'
        },


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'chrome_without_security'], //, 'PhantomJS'],

        // you can define custom flags
        customLaunchers: {
            chrome_without_security: {
                base: 'Chrome',
                flags: ['--disable-web-security']
            }
        },


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
