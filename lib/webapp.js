
var micro = require('micro');

var WebApp = exports.WebApp = micro.webapp(),
    get = WebApp.get;

WebApp.handleStatic(__dirname + '/../lib', '/amdjs-tests/impl/require-tiny');
WebApp.handleStatic(__dirname + '/../ext/amdjs-tests', '/amdjs-tests');

get('/', function (request, response) {
    response.redirect('/amdjs-tests/tests/doh/runner.html?config=require-tiny/config.js&impl=require-tiny/require-tiny.js');
});

