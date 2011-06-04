
var micro = require('micro');

var WebApp = exports.WebApp = micro.webapp();

WebApp.handleStatic(__dirname + '/../lib', '/amdjs-tests/impl/require-tiny');
WebApp.handleStatic(__dirname + '/../ext/amdjs-tests', '/amdjs-tests');


