var require, define;

(function () {

    var mods    = {},
        paths   = {},
        doc     = document,
        head    = doc.getElementsByTagName('head')[0],
        waiting = [];
    
    function syncRequire (name) {
        if (! mods[name]) {
            throw 'module ' + name + ' has not been loaded';
        }
        return mods[name];
    }

    function process () {
        for (var i = 0; i < waiting.length; i++) {
            var ready = 1, mod;
            for (var j = 0; j < waiting[i].length - 1; j++) {
                if (typeof waiting[i][j] == 'string') {
                    if (mod = mods[waiting[i][j]]) {
                        waiting[i][j] = mod;
                    }
                    else {
                        ready = 0;
                    }
                }
            }
            if (ready) {
                mod = waiting[i][j].pop();
                mod.apply(null, waiting[i]);
                waiting.splice(i--, 1);
            }
        }
    }

    require = function () {
        if (args.length == 1) {
            for (var name in args[0]) {
                paths[name] = args[0][name];
            }
        }
        var args = Array.prototype.slice.apply(arguments),
            url,
            script;
        for (var i = 0; i < args.length - 1; i++) {
            if (mods[args[i]]) {
                args[i] = mods[args[i]];
            }
            else {
                if (! (url = paths[args[i]])) {
                    throw 'no path configured for ' + args[i];
                }
                script = doc.createElement('script');
                script.type = 'text/javascript';
                script.href = url;
                head.appendChild(script);
            }
        }
        waiting.push(args);
        process();
    };

    define = function (name, deps, callback) {
        if (! callback) {
            callback = deps;
            deps = [];
        }
        var mod = { name: name, exports: {} };
        for (var i = 0; i < deps.length; i++) {
            deps[i] =
                deps[i] == 'module' ?
                    mod :
                deps[i] == 'exports' ?
                    mod.exports :
                deps[i] == 'require' ?
                    syncRequire :
                    deps[i];
        }
        require(deps, function () {
            var ret = callback.apply(null, arguments);
            if (ret) {
                mods[name] = ret;
            }
            else {
                mods[name] = mod.exports;
            }
            process();
        });
    };

})();



