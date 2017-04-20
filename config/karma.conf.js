var webpackConfig = require('./webpack.test');

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    failOnEmptyTestSuite: false,

    files: [
      //{pattern: './config/karma-test-shim.js', watched: true},
        {pattern: './src/tests/karma-test-shim2.js', watched: true},
       // './src/app/1st.spec.js'
    ],

    preprocessors: {
      './src/tests/karma-test-shim2.js': ['webpack', 'sourcemap'],
        './src/**/!(*.spec).(ts|js)': [
            'sourcemap'
        ]
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  };

  config.set(_config);
};
