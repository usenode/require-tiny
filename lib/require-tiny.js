var require, define;

(function () {

    var mods          = {},
        required      = {},
        paths         = {},
        doc           = document,
        head          = doc.getElementsByTagName('head')[0],
        waiting       = [],
        requireString = 'require';
    
    function syncRequire (name) {
        if (! mods[name] && ! required[name]) {
            throw 'module ' + name + ' has not been loaded';
        }
        return mods[name] || required[name];
    }

    function process () {
        for (var i = 0; i < waiting.length; i++) {
            var ready = 1, mod, args;
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
                mod = waiting[i].pop();
                args = waiting[i];
                waiting.splice(i--, 1);
                mod.apply(null, args);
            }
        }
    }

    require = function (deps, callback) {
        if (! callback) {
            for (var name in deps.paths) {
                paths[name] = deps[name];
            }
            return;
        }
        var url, script, name;
        for (var i = 0; i < deps.length; i++) {
            name = deps[i];
            if (typeof name == 'string') {
                if (name == requireString) {
                    name = syncRequire;
                }
                else if (mods[name]) {
                    name = mods[name];
                }
                else if (! required[name]) {
                    required[name] = {};
                    if (! (url = paths[name])) {
                        url = name + '.js';
                    }
                    script = doc.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    head.appendChild(script);
                }
            }
        }
        deps.push(callback);
        waiting.push(deps);
        process();
    };

    require.def = define = function (name, deps, callback) {
        var mod = { name: name, exports: required[name] || {} },
            exportsString = 'exports', moduleString = 'module';
        if (! callback) {
            callback = deps;
            deps = [requireString, exportsString, moduleString];
        }
        if (typeof callback != 'function') {
            mods[name] = callback;
            process();
            return;
        }
        for (var i = 0; i < deps.length; i++) {
            deps[i] =
                deps[i] == moduleString ?
                    mod :
                deps[i] == exportsString ?
                    mod.exports :
                deps[i] == requireString ?
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

    define.amd = {};
})();

