;(function(global, window, document, process){
/**/require([
/***/[function (require, module, exports) {


// setup feather-test-runner
var featherTestOptions = {
    dirnameAvailable: true,
    exitProcessWhenFailing: true,
    helpers: [
        "../test/helpers/global_modules.js",
        "../test/helpers/selectors.js",
    ],
    nodeAsBrowser: {
    },
    stopAfterFistFailure: false,
    timeout: 5000,
    customMatchers: [
        {
        name: "toMatchElements",
        message: "to match elements",
        matcher: function (expected, actual, utils) {
            var dollar = actual.get();

            var dom = [];
            if (typeof expected === 'string') {
                dom = Array.prototype.slice.call(document.querySelectorAll(expected));
            } else if (Array.isArray(expected)) {
                dom = expected;
            } else if (expected.length) {
                dom = expected.get();
            }

            return utils.deepMatch(dom, dollar);
        },
    },
    ],
    beforeEach: function () {
            document.body.innerHTML = origHTML;
        },
    specs: [
        "../test/specs/",
    ],
    reporterTargetElement: "#results",
};
var FeatherTestRunner = require(1);
var featherTest = new FeatherTestRunner(featherTestOptions);
featherTest.listen();

// load your plugins
featherTest.addPlugin("external", require(8));

// load your helpers
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/helpers";
require.cache.clear();
require(9);
require.cache.clear();
require(13);

// run your specs
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/specs/core";
require.cache.clear();
require(14);
require.cache.clear();
require(15);
require.cache.clear();
require(16);
require.cache.clear();
require(17);
require.cache.clear();
require(18);
require.cache.clear();
require(19);
require.cache.clear();
require(20);
require.cache.clear();
require(21);
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/specs/filter";
require.cache.clear();
require(22);
require.cache.clear();
require(23);
require.cache.clear();
require(24);
require.cache.clear();
require(25);
require.cache.clear();
require(26);
require.cache.clear();
require(27);
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/specs/mutate";
require.cache.clear();
require(28);
require.cache.clear();
require(29);
require.cache.clear();
require(30);
require.cache.clear();
require(31);
require.cache.clear();
require(32);
require.cache.clear();
require(33);
require.cache.clear();
require(34);
require.cache.clear();
require(35);
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/specs/readwrite";
require.cache.clear();
require(36);
require.cache.clear();
require(37);
require.cache.clear();
require(38);
require.cache.clear();
require(39);
require.cache.clear();
require(40);
require.cache.clear();
require(41);
require.cache.clear();
require(42);
require.cache.clear();
require(43);
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/specs/style";
require.cache.clear();
require(44);
require.cache.clear();
require(45);
require.cache.clear();
require(46);
require.cache.clear();
require(47);
require.cache.clear();
require(48);
require.cache.clear();
require(49);
require.cache.clear();
require(50);
require.cache.clear();
require(51);
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/specs/traverse";
require.cache.clear();
require(52);
require.cache.clear();
require(53);
require.cache.clear();
require(54);
require.cache.clear();
require(55);
require.cache.clear();
require(56);
require.cache.clear();
require(57);
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/specs/trigger";
require.cache.clear();
require(58);
require.cache.clear();
require(59);
require.cache.clear();
require(60);
__dirname = "/Users/isaac.woodruff/Projects/dollar-js/test/specs";
require.cache.clear();
require(61);

// cleanup environment
__dirname = "/";

// report results
featherTest.report(global.FeatherTestBrowserCallback);


/***/},{"1":1,"8":8,"9":9,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"20":20,"21":21,"22":22,"23":23,"24":24,"25":25,"26":26,"27":27,"28":28,"29":29,"30":30,"31":31,"32":32,"33":33,"34":34,"35":35,"36":36,"37":37,"38":38,"39":39,"40":40,"41":41,"42":42,"43":43,"44":44,"45":45,"46":46,"47":47,"48":48,"49":49,"50":50,"51":51,"52":52,"53":53,"54":54,"55":55,"56":56,"57":57,"58":58,"59":59,"60":60,"61":61}],
/***/[function (require, module, exports) {


var clone = require(2);
var each = require(3);
var matchers =  require(4);
var reporter = require(7);

var _origClearTimeout = clearTimeout;
var _origClearInterval = clearInterval;
var _origSetTimeout = setTimeout;
var _origSetInterval = setInterval;

function FeatherTestRunner (options) {
    if (!this instanceof FeatherTestRunner) {
        return new FeatherTestRunner();
    }

    var root = typeof global !== 'undefined' ? global : window;
    var tab = '   ';
    var shortCircuit;
    var afterRun;
    var allParsed;
    var expectContext = {
        depth: 0,
        labels: [],
    };


    /* RESET */

    var pendingAsync;
    var pendingSync;
    var pendingCallback;
    var results = {
        passed: [],
        failed: [],
        skipped: [],
    };
    var spies = [];

    function reset () {
        pendingAsync = 0;
        pendingSync = 0;
        pendingCallback = null;
        results.passed = [];
        results.failed = [];
        results.skipped = [];
        spies = [];
    }


    /* DESCRIBES & EXPECTS */

    function describe (label, assertions) {
        var async = assertions.length > 1;

        if (async) {
            pendingAsync++;
        } else {
            pendingSync++;
        }

        // keep track of how nested we are
        expectContext.depth++;

        // preserve labels from parent describes
        expectContext.labels.push(label);

        // reset expectations
        expectContext.passedExpectations = [];
        expectContext.failedExpectations = [];
        expectContext.containsExpectations = false;

        // optional setup
        if (typeof options.beforeEach === 'function') {
            options.beforeEach();
        }


        var expect = function (actual) {
            var lineMap = getLineMap(new Error());
            var finalMatchers = matchers.get(this, options, tab, actual, lineMap, recordResult);
            finalMatchers.not = matchers.get(this, options, tab, actual, lineMap, recordResult, true);
            return finalMatchers;
        }

        var clonedExpectContext = clone(expectContext);
        var assertionArgs = [ expect.bind(clonedExpectContext) ];
        if (async) {
            clonedExpectContext.async = true;
            assertionArgs.push(describeDone.bind(clonedExpectContext));
            clonedExpectContext.timeout = _origSetTimeout(function () {
                var indent = '';
                clonedExpectContext.labels.forEach(function (label) {
                    indent += tab;
                });
                recordResult(clonedExpectContext, false, false, indent + 'Timed out! It should call done() within ' + options.timeout + 'ms');
                describeDone.apply(clonedExpectContext);
            }, options.timeout);
        }

        function cleanupContext () {
            (spies[expectContext.depth] || []).forEach(function (spy) {
                spy.obj[spy.methodName] = spy.original;
            });
            expectContext.depth--;
            expectContext.labels.pop();
        }

        try {
            assertions.apply(clonedExpectContext, assertionArgs);
        } catch (err) {
            clonedExpectContext.failedExpectations = []; // clear failed expectations to make room for the error
            recordResult(clonedExpectContext, false, false, '\n' + (err.stack || err));
            cleanupContext();
            describeDone.apply(clonedExpectContext);
            return;
        }

        cleanupContext();
        if (!async) {
            describeDone.apply(clonedExpectContext);
        }
    }

    function describeDone () {
        _origClearTimeout(this.timeout);

        if (this.async) {
            pendingAsync--;
        } else {
            pendingSync--;
        }

        if (this.containsExpectations) {
            if (this.failedExpectations.length) {
                results.failed.push(this);
                if (options.stopAfterFistFailure) {
                    shortCircuit(true);
                }
            } else if (this.passedExpectations.length) {
                results.passed.push(this);
            }
            this.containsExpectations = false;
        }

        // teardown
        if (typeof options.afterEach === 'function') {
            options.afterEach();
        }

        afterRun();
    }

    function getLineMap (err) {
        if (err.stack) {
            var line = '';
            var arr = err.stack.split('\n');

            // shift until we find "expect"
            while (line.indexOf('expect') === -1) {
                line = arr.shift();
            }

            // shift one more to get to the real line that threw
            line = arr.shift();

            // shift past "[native code]" lines (thanks Safari)
            while (line.indexOf('[native') === 0) {
                line = arr.shift();
            }

            return '@' + line.replace(/ *at |\@/, '');
        }

        return '';
    }

    function recordResult (currentTest, passed, negated, result) {
        if ((passed && !negated) || (!passed && negated)) {
            currentTest.passedExpectations.push(result);
        } else {
            currentTest.failedExpectations.push(result);
        }
        currentTest.containsExpectations = true;
    }

    function xdescribe (label) {
        results.skipped.push(label);
    }


    /* RUNNER */

    function hasPending () {
        return pendingSync > 0 || pendingAsync > 0;
    }

    shortCircuit = function (withReport) {
        if (withReport) {
            reporter.report(results, tab, options);
        }
        afterRun = function(){};
        shortCircuit = function(){};
        if (typeof pendingCallback === 'function') {
            pendingCallback();
        }
    };

    afterRun = function () {
        if (allParsed && !hasPending()) {
            reporter.report(results, tab, options);
            if (typeof pendingCallback === 'function') {
                pendingCallback();
            }
        }
    };


    /* SPIES */

    function Spy (original = function(){}, replacement) {
        function spy () {
            let args = Array.prototype.slice.call(arguments);
            spy.calls.push(args);
            if (typeof replacement === 'function') {
                return replacement.apply(this, args);
            }
        }

        spy.calls = [];
        spy.original = original;

        return spy;
    }

    Spy.on = function (obj, methodName, replacement) {
        let original = obj[methodName];
        let spy = Spy(original, replacement);

        if (original) {
            spies[expectContext.depth] = spies[expectContext.depth] || [];
            spies[expectContext.depth].push({
                obj,
                methodName,
                original,
            });

            obj[methodName] = spy;
        }

        return spy;
    };


    /* ANY */

    function Any (type) {
        this.Any = type.name;
        this.constructor = type;
    }

    Any.prototype.toString = function () {
        return 'fooooo';
    };

    function any (constructor) {
        return new Any(constructor);
    }


    /* CLOCK */

    let clock = {
        _clearTimeout: clearTimeout,
        _clearInterval: clearInterval,
        _setTimeout: setTimeout,
        _setInterval: setInterval,
        _guid: 0,
        _timer: 0,
        _delayedActions: {},

        install: function () {
            if (setTimeout.name !== 'spy') {
                spy.on(global, 'setTimeout', function (fn, delay) {
                    if (typeof fn === 'function') {
                        clock._guid++;
                        clock._delayedActions[clock._guid] = {
                            timestamp: clock._timer,
                            delay: delay || 0,
                            fn: fn,
                        };
                        return clock._guid;
                    }
                });
            }

            if (clearTimeout.name !== 'spy') {
                spy.on(global, 'clearTimeout', function (id) {
                    delete clock._delayedActions[id];
                });
            }

            if (setInterval.name !== 'spy') {
                spy.on(global, 'setInterval', function (fn, delay) {
                    if (typeof fn === 'function') {
                        clock._guid++;
                        clock._delayedActions[clock._guid] = {
                            timestamp: clock._timer,
                            delay: delay || 0,
                            fn: fn,
                            recurring: true,
                        };
                        return clock._guid;
                    }
                });
            }

            if (clearInterval.name !== 'spy') {
                spy.on(global, 'clearInterval', function (id) {
                    delete clock._delayedActions[id];
                });
            }
        },

        tick: function (amount) {
            clock._timer += amount;
            each(clock._delayedActions, function (action, id) {
                if (action) {
                    if (action.recurring) {
                        let times = Math.floor((clock._timer - action.timestamp) / action.delay);
                        for (let i = 0; i < times; i++) {
                            action.fn();
                        }
                    } else {
                        if (clock._timer - action.timestamp >= action.delay) {
                            delete clock._delayedActions[id];
                            action.fn();
                        }
                    }
                }
            });
        },

        uninstall: function () {
            clearTimeout: clock._clearTimeout;
            clearInterval: clock._clearInterval;
            setTimeout = clock._setTimeout;
            setInterval = clock._setInterval;
        },
    };


    /* PUBLIC */

    // Allow users to add new spec globals as plugins
    function addPlugin (name, plugin) {
        root[name] = plugin;
    }

    // Activate the test and listen for any describes to be executed
    function listen () {
        root.__dirname = '/';
        root.any = any;
        root.clock = clock;
        root.describe = describe;
        root.it = describe; // make it easier to switch to feather from jasmine
        root.spy = Spy;
        root.xdescribe = xdescribe;
        root.xit = xdescribe;
        reset();
    }

    // Signify that all specs have been parsed
    //   wait for any async tests to finish, then report
    function report (callback) {
        pendingCallback = callback;
        allParsed = true;
        afterRun();
    }

    return {
        addPlugin: addPlugin,
        listen: listen,
        report: report,
        reporter: reporter,
    };
}


module.exports = FeatherTestRunner;



/***/},{"2":2,"3":3,"4":4,"7":7}],
/***/[function (require, module, exports) {


var hasProp = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

function clone (thing) {
    var ret;
    var type = toString.call(thing).split(' ').pop();

    // return simple types that have length
    if (!thing || type === 'String]' || type === 'Function]' || thing === thing.window) {
        return thing;
    }

    if (type === 'Object]') {
        if (thing.nodeType) {
            throw new Error('DOM Nodes should not be cloned using this clone method');
        }

        ret = Object.create(thing);
        for (var key in thing) {
            if (hasProp.call(thing, key)) {
                if (thing !== thing[key]) { // recursion prevention
                    ret[key] = clone(thing[key]);
                }
            }
        }

    } else if (thing.length) {
        ret = [];
        for (var i = 0, len = thing.length; i < len; i++) {
            if (thing !== thing[i]) { // recursion prevention
                ret[i] = clone(thing[i]);
            }
        }

    } else {
        ret = thing;
    }

    return ret;
}

module.exports = clone;



/***/},{}],
/***/[function (require, module, exports) {


var hasProp = Object.prototype.hasOwnProperty;

function each (collection, iteratee, thisArg) {
    if (collection) {
        if (typeof collection.length !== 'undefined') {
            for (var i = 0, len = collection.length; i < len; i++) {
                if (iteratee.call(thisArg, collection[i], i, collection) === false) {
                    return;
                }
            }

        } else {
            for (var prop in collection) {
                if (hasProp.call(collection, prop)) {
                    if (iteratee.call(thisArg, collection[prop], prop, collection) === false) {
                        return;
                    }
                }
            }
        }
    }
}

module.exports = each;



/***/},{}],
/***/[function (require, module, exports) {


/**
 * Returns available matchers
 */

var anythingToString = require(5);
var each = require(3);
var extend = require(6);

var toString = Object.prototype.toString;

function _typeof (thing) {
    return toString.call(thing).split(' ').pop().slice(0, -1);
}

function toStr (thing, printType) {
    if (thing && thing.isAny){ return 'Any ' + thing.type.name; }
    var str = anythingToString.stringify(thing);
    return '"' + str + '" ' + (printType ? '{' + _typeof(thing) + '}' : '');
}

function isSet (obj) {
    return (toString.apply(obj) === '[object Set]');
}

function deepMatch (expected, actual) {
    if (expected && expected.Any) {
        return _typeof(actual) === _typeof(expected.constructor())
    }
    if (actual && actual.Any) {
        return _typeof(expected) === _typeof(actual.constructor())
    }

    if (actual === expected) {
        return true;

    } else if (typeof expected === 'object' && typeof actual === 'object') {
        var match = true;
        var actualIsEmpty = true;
        var expectedIsEmpty = true;

        each(expected, function (val, prop) {
            expectedIsEmpty = false;
            if (!deepMatch(val, actual[prop])) {
                return match = false;
            }
        });

        each(actual, function (val, prop) {
            actualIsEmpty = false;
            if (!deepMatch(val, expected[prop])) {
                return match = false;
            }
        });

        if (actualIsEmpty && expectedIsEmpty) {
            return toString.call(actual) === toString.call(expected);
        }

        return match;

    }

    return false;
}

function resultMessage (actual, matcher, expected, tab, neg, msg, lineMap, printType) {
    var _actual = _typeof(actual);
    var _expected = _typeof(expected);
    var ptype = printType && _actual !== _expected;
    return '' +
        '%%-----' + (lineMap ? '\n%%' + lineMap : '') +
        (msg ? '\n%%' + msg : '') +
        '\n%%expected\n%%' + tab + toStr(actual, ptype) +
        '\n%%' + neg + matcher +
        '\n%%' + tab + toStr(expected, ptype);
}


function get (currentTest, options, tab, actual, lineMap, recordResult, negated) {
    var neg = negated ? 'not ' : '';
    var builtInMatchers = {
        toBe: function (expected, msg) {
            var result = resultMessage(actual, 'to be', expected, tab, neg, msg, lineMap, true);
            recordResult(currentTest, deepMatch(expected, actual), negated, result);
        },
        toBeGreaterThan: function (expected, msg) {
            var result = resultMessage(actual, 'to be greater than', expected, tab, neg, msg, lineMap);
            recordResult(currentTest, actual > expected, negated, result);
        },
        toBeLessThan: function (expected, msg) {
            var result = resultMessage(actual, 'to be less than', expected, tab, neg, msg, lineMap);
            recordResult(currentTest, actual < expected, negated, result);
        },
        toContain: function (expected, msg) {
            var result = resultMessage(actual, 'to contain', expected, tab, neg, msg, lineMap);

            function contains(actual, expected) {
                if (isSet(actual)) {
                    return actual.has(expected);
                }

                if (Array.isArray(actual)) {
                    if (Array.isArray(expected)) {
                        var containsAllElements = true;
                        each(expected, function (v) {
                            if (actual.indexOf(v) === -1) {
                                return containsAllElements = false;
                            }
                        });
                        return containsAllElements;
                    } else {
                        var containsElement = false;
                        each(actual, function (v) {
                            if (v === expected) {
                                return containsElement = true;
                            }
                        });
                        return containsElement;
                    }
                }

                return !!actual && actual.indexOf(expected) >= 0;
            }

            recordResult(currentTest, contains(actual, expected), negated, result);
        },
        toEqual: function (expected, msg) {
            var result = resultMessage(actual, 'to equal', expected, tab, neg, msg, lineMap, true);
            recordResult(currentTest, deepMatch(expected, actual), negated, result);
        },
        toHaveBeenCalled: function () {
            if (!actual || actual.name !== 'spy') { throw new Error('toHaveBeenCalled requires a spy'); }
            var result = resultMessage(actual.original.name || 'anonymous', 'to have been called', 'at least once', tab, neg, null, lineMap);
            recordResult(currentTest, actual.calls.length > 0, negated, result);
        },
        toHaveBeenCalledWith: function () {
            if (!actual || actual.name !== 'spy') { throw new Error('toHaveBeenCalledWith requires a spy'); }
            var expectedArgs = Array.prototype.slice.call(arguments);
            var matchingCallFound = false;
            each(actual.calls, function (call) {
                var argsMatch = true;
                each(expectedArgs, function (arg, index) {
                    if (!deepMatch(arg, call[index])) {
                        argsMatch = false;
                    }
                });
                if (argsMatch) {
                    matchingCallFound = true;
                }
            });
            var actualMessage = (actual.original.name || 'anonymous') + ' ' + anythingToString.stringify(actual.calls);
            var result = resultMessage(actualMessage, 'to have been called with', expectedArgs, tab, neg, null, lineMap);
            recordResult(currentTest, matchingCallFound, negated, result);
        },
    };

    var customMatchers = {};
    each(options.customMatchers, function (customMatcher) {
        customMatchers[customMatcher.name] = function (expected, msg) {
            var utils = {
                deepMatch: deepMatch
            };
            var result = resultMessage(actual, customMatcher.message, expected, tab, neg, msg, lineMap, customMatcher.printType);
            recordResult(currentTest, customMatcher.matcher(expected, actual, utils), negated, result);
        };
    });

    return extend({}, builtInMatchers, customMatchers);
}

module.exports = {
    get: get
};



/***/},{"3":3,"5":5,"6":6}],
/***/[function (require, module, exports) {


/**
 * Convert an ANYTHING in JavaScript into a string
 *   Elements, Objects, Arrays, Null, etc.
 *   Be as descriptive as possible, but safely fallback no matter what
 */

function stringify (val) {
    if (val) {
        if (typeof val === 'function') {
            return 'function';

        } else if (typeof val === 'object') {
            if (Array.isArray(val)) {
                var arr = [];
                val.forEach(function (v) {
                    arr.push(stringify(v));
                });
                return '[' + arr.join(',') + ']';

            } else if (val === val.self) {
                return 'window';

            } else if (val.nodeType === 9) {
                return 'document';

            } else if (val.nodeType === 1) {
                var elem = (val.tagName || '').toLowerCase();

                if (val.id) {
                    elem += '#' + val.id;
                }

                if (val.className && typeof val.className === 'string') {
                    elem += '.' + val.className.trim().replace(/ +/g, '.');
                }

                return elem;

            } else {
                var obj = [];
                for (var x in val) {
                    if (val.hasOwnProperty(x)) {
                        obj.push(x + ':' + stringify(val[x]));
                    }
                }
                return '{' + obj.join(',') + '}';
            }
        }
    }

    return '' + val;
}

module.exports = {
    stringify: stringify
};



/***/},{}],
/***/[function (require, module, exports) {


var clone = require(2);
var each = require(3);

var arrSlice = Array.prototype.slice;

function extend () {
    var ret = arguments[0];

    each(arrSlice.call(arguments, 1), function (ext) {
        each(ext, function (val, key) {
            if (typeof val !== 'undefined') {
                ret[key] = clone(val);
            }
        });
    }, this);

    return ret;
}

module.exports = extend;



/***/},{"2":2,"3":3}],
/***/[function (require, module, exports) {


var outputHistory = '';

function report (results, tab, options) {
    options = options || {};
    tab = tab || '   ';
    outputHistory = '';

    if (results.failed.length) {
        output('\nFailed tests:');
        results.failed.forEach(function (failure) {
            var indent = '';
            output('');
            failure.labels.forEach(function (label) {
                output(indent + label);
                indent += tab;
            });
            failure.failedExpectations.forEach(function (reason) {
                output(reason, indent);
            });
        });
        output('');
        output(results.failed.length + ' tests failed!');
        if (options.exitProcessWhenFailing) {
            process.exit(1);
        }

    } else if (results.passed.length) {
        output('\nAll ' + results.passed.length + ' tests passed!');

    } else {
        output('\nNo tests ran.');
    }

    if (results.skipped.length) {
        output('\n(' + results.skipped.length + ' tests skipped)');
    }

    if (options.reporterTargetElement) {
        var targets = document.querySelectorAll(options.reporterTargetElement);
        for (var i = 0, len = targets.length; i < len; i++) {
            targets[i].innerHTML = outputHistory.trim();
        }
    }
}

function output (message, indent) {
    var msg = message.replace(/\%\%/g, indent);
    console.log(msg);
    outputHistory += '\n' + msg;
}

module.exports = {
    output: output,
    report: report
};



/***/},{}],
/***/[function (require, module, exports) {


/**
 * "External" Plugin for feather-test
 * Inside specs, can globally use `external.loadScript`
 */

module.exports = {
    _queue: [],
    _waiting: false,

    loadScript: function (absPath, onLoad) {
        let methodName = 'external.loadScript';
        if (typeof window === 'undefined') {
            throw new Error(methodName + ' is only available in browser mode');
        }
        if (typeof absPath === 'string') {
            if (absPath.charAt(0) !== '/') {
                throw new Error(methodName + ' requires an absolute path');
            }

            let target = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];

            function doLoad () {
                external._waiting = true;

                var s = document.createElement('script');
                s.type = "text/javascript";
                s.src = 'file://' + absPath;

                s.onload = function () {
                    if (typeof onLoad === 'function') {
                        onLoad();
                    }

                    let next = external._queue.shift();
                    if (next) {
                        next();
                    } else {
                        external._waiting = false;
                    }
                };

                target.appendChild(s);
            }

            if (external._waiting) {
                external._queue.push(doLoad);
            } else {
                doLoad();
            }
        }
    },

};



/***/},{}],
/***/[function (require, module, exports) {



jQuery = require(10);

$ = require(11);

origHTML = require(12);



/***/},{"10":10,"11":11,"12":12}],
/***/[function (require, module, exports) {


/*!
 * jQuery JavaScript Library v3.2.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-16T21:26Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkable types, fire native event so checked state will be right
			trigger: function() {
				if ( rcheckableType.test( this.type ) &&
					this.click && nodeName( this, "input" ) ) {

					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	}
} );

jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );



/***/},{}],
/***/[function (require, module, exports) {


/*!
 * DollarJS 1.3.11 -- a light, fast, modular, jQuery replacement
 *   Github: https://github.com/seebigs/dollar-js
 *   Released under the MIT license: https://opensource.org/licenses/MIT
 */

;(function () {


/*********************/
/*    CORE DOLLAR    */
/*********************/


var $ = function (selector, context) {
    return new $.fn.init(selector, context);
};


var undef,
    strType = 'string',
    fnType = 'function',

    win = window,

    elemProto = win.Element.prototype,

    objProto = Object.prototype,
    objToString = objProto.toString,
    objHasProp = objProto.hasOwnProperty,

    arrProto = Array.prototype,
    arrSlice = arrProto.slice,

    docConstruct = document,
    docElement = document.documentElement,

    utils;

var regExpSpacesAndBreaks = /[\s\t\r\n\f]+/g;


$.isDollar = true;

$.fn = {
    isDollar: true,
    indexOf: arrProto.indexOf,
    push: arrProto.push,
    pop: arrProto.pop,
    shift: arrProto.shift,
    unshift: arrProto.unshift,
    slice: arrProto.slice,
    splice: arrProto.splice // Makes console.log display selected elements as an Array
};

$.fn.init = function (selector, context) {

    this.length = 0;

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if (!selector) {
        return this;
    }

    if (!context) {
        // HANDLE: simple $("#id") for performance
        if ((/^#[\w-]+$/).test(selector)) {
            var idShortcut = docConstruct.getElementById(selector.substr(1));
            if (idShortcut) {
                this[0] = idShortcut;
                this.length = 1;
            }

            return this;
        }

        // HANDLE: simple $("tag") for performance
        if ((/^[a-z]+$/).test(selector)) {
            var tags = docConstruct.getElementsByTagName(selector);
            var tLen = tags.length;
            for (var i = 0; i < tLen; i++) {
                this[i] = tags[i];
            }
            this.length = tLen;

            return this;
        }
    }

    return utils.merge(this, getNodesBySelector(selector, context));
};

// Give the init function the $ prototype for later instantiation
$.fn.init.prototype = $.fn;


// combines collections/arrays into one dollar collection (with distinct values)
function collect () {
    var distinct = $();
    var i, len, item;

    utils.each(arrSlice.call(arguments), function (collection) {
        if (collection) {
            for (i = 0, len = collection.length; i < len; i++) {
                item = collection[i];
                if (distinct.indexOf(item) === -1) {
                    distinct.push(item);
                }
            }
        }
    });

    return distinct;
}

var pseudoMatchers = {

    contains: function (tag, context, pseudoPieces) {
        var content = pseudoPieces[1] && pseudoPieces[1].replace(/[\"\'\)]/g, '');
        if (content) {
            return filterNodes(getNodesBySelectorString(tag, context), function (node) {
                return ( node.textContent || node.innerText ).indexOf(content) !== -1;
            });
        }

        return [];
    },

    hidden: function (tag, context) {
        return filterNodes(getNodesBySelectorString(tag, context), function (node) {
            return node.nodeType === 1 && !( node.offsetWidth || node.offsetHeight || node.getClientRects().length );
        });
    },

    visible: function (tag, context) {
        return filterNodes(getNodesBySelectorString(tag, context), function (node) {
            return node.nodeType === 1 && !!( node.offsetWidth || node.offsetHeight || node.getClientRects().length );
        });
    },

    even: function (tag, context) {
        return arrSlice.call(context.querySelectorAll(tag + ':nth-child(even)'));
    },

    odd: function (tag, context) {
        return arrSlice.call(context.querySelectorAll(tag + ':nth-child(odd)'));
    },

    has: function (tag, context, pseudoPieces) {
        var nestedSelector = typeof pseudoPieces[1] === strType && pseudoPieces[1].replace(')', '');
        if (nestedSelector) {
            return filterNodes(getNodesBySelector(tag, context), function (node) {
                return node.nodeType === 1 && !!getNodesBySelector(nestedSelector, node).length;
            });
        }
        return [];
    },

    not: function (tag, context, pseudoPieces) {

        // set to docConstruct to include <html> & match jQuery
        if (context === docElement) {
            context = docConstruct;
        }

        // ==========================================
        // given original selector "#foo :not(bar) .baz"

        // tag = "#foo "
        var preAndPostNotSelector = tag;
        if (tag !== '*' && tag[tag.length - 1] === ' ') {
            preAndPostNotSelector = tag + '*';
        }

        // pseudoPieces = ["not", "bar) .baz"]
        var notAndPostNot = pseudoPieces[1].split(')'); // ["bar", ".baz"]
        var postNotSelector = notAndPostNot[1]; // ".baz"
        var notSelectors = (notAndPostNot[0] || '').split(','); // ["bar"]

        if (postNotSelector) {
            preAndPostNotSelector += postNotSelector; // #foo .baz
        }

        var filteredOnNotSelectors = [];
        // find all els matching #foo .baz
        var allMatchingPreAndPost = getNodesBySelectorString(preAndPostNotSelector, context);

        // filter those results for !bar
        utils.each(allMatchingPreAndPost, function (el) {

            var returnEl = true;
            utils.each(notSelectors, function (noMatchSelector) {
                if (getMatches.call(el, noMatchSelector)) { // matching bar from :not(bar)? dont return it
                    returnEl = false;
                    return false; // drop out of loop
                }
            });

            if (returnEl) {
                filteredOnNotSelectors.push(el);
            }
        });

        return filteredOnNotSelectors;
    }

};

function findWithinContextIfPresent (childrenEls, context) {
    if (context) {
        var parentEls = normalizeContext(context);
        var found = [];
        utils.each(parentEls, function (parentEl) {
            utils.each(childrenEls, function (childEl) {
                if (typeof parentEl.contains === fnType && parentEl.contains(childEl)) {
                    found.push(childEl);
                }
            });
        });
        return found;
    } else {
        return childrenEls;
    }
}

// takes any type of selector
// returns an array of matching dom nodes
function getNodesBySelector (selector, context) {

    // HANDLE: strings
    if (typeof selector === strType) {
        return getNodesBySelectorString(selector, context);

    // HANDLE: dollar instance
    } else if (selector.isDollar) {
        return findWithinContextIfPresent(selector.get(), context);

    // HANDLE: $(DOM Node)
    } else if (selector.nodeType) {
        return findWithinContextIfPresent([selector], context);

    // HANDLE: $(window)
    } else if (selector === selector.window) {
        return [selector];

    // HANDLE: $([DOM Nodes])
    } else if (selector.length) {

        var selectorEls = [];
        var item;

        for (var i = 0, len = selector.length; i < len; i++) {
            item = selector[i];
            if (utils.isElement(item)) {
                selectorEls.push(item);
            }
        }

        return findWithinContextIfPresent(selectorEls, context);

    // HANDLE: dom ready
    } else if (typeof selector === fnType) {

        if (documentReady()) {
            selector();

        } else {
            if (elemProto.addEventListener) {
                docConstruct.addEventListener('DOMContentLoaded', selector, false);

            } else {
                docConstruct.attachEvent('onreadystatechange', function () {
                    if (documentReady()) {
                        selector();
                    }
                });
            }
        }

    }

    function documentReady () {
        var state = docConstruct.readyState;
        return state === 'interactive' || state === 'complete';
    }

    return [];
}

// takes any String as selector
// returns an array of matching dom nodes
function getNodesBySelectorString (selector, context) {
    if (context) {
        var results = [];
        context = normalizeContext(context);

        if (context.length > 1) {
            for (var i = 0, len = context.length; i < len; i++) {
                utils.merge(results, getNodesBySelectorString(selector, context[i]));
            }

            return results;

        } else {
            context = context[0];
        }

    } else {
        context = docElement;
    }

    if (!context) {
        return []; // HANDLE $('valid', $());
    }

    // -------------------------------------------
    // at this point, selector must be a string
    // & context must be HTML node (or doc.docElem)
    // -------------------------------------------

    var selectorsMap = (/^\s*(?:#([\w-]+)|(\w+)|\.([\w-]+)|(<[\w\W]+>)[^>]*)\s*$/).exec(selector);
    // selectorsMap will return:
    // if id => ['#foo', 'foo', undefined, undefined, 'undefined']
    // node  => ['body', undefined, body, undefined', 'undefined']
    // class => ['.bar', undefined, undefined, 'bar', 'undefined']
    // HTML  => ['HTML', undefined, undefined, undefined,  'HTML']
    // else  => null

    if (selectorsMap) {

        // HANDLE: $('#id')
        if (selector = selectorsMap[1]) {
            var idMatch = docConstruct.getElementById(selector);
            if (idMatch && context !== idMatch && context.contains(idMatch)) {
                return [idMatch];
            }

            return [];

        // HANDLE: $('tag')
        } else if (selector = selectorsMap[2]) {
            return context.getElementsByTagName(selector);

        // HANDLE: $('.class')
        } else if (selector = selectorsMap[3]) {
            return context.getElementsByClassName(selector);

        // HANDLE: $('<div> ... </div>')
        } else if (selector = selectorsMap[4]) {
            return [htmlStringToNode(selector)];
        }

    // HANDLE: special pseudo-selectors
    } else {
        var pseudoSelector = /(.*)\:(.+)/.exec(selector);
        if (pseudoSelector) {
            var tag = pseudoSelector[1] || '*';
            var pseudoPieces = pseudoSelector[2].split('(');
            var pseudoMatcher = pseudoMatchers[pseudoPieces[0]];
            if (pseudoMatcher) {
                return pseudoMatcher(tag, context, pseudoPieces);
            }
        }
    }

    // HANDLE: all other selectors
    return arrSlice.call(context.querySelectorAll(selector));
}

// normalise browser nonsense
var getMatches = elemProto.matches ||
    elemProto.webkitMatchesSelector ||
    elemProto.mozMatchesSelector ||
    elemProto.msMatchesSelector ||
    elemProto.oMatchesSelector ||
    fallbackMatches;

function fallbackMatches (sel) {
    var allMatches = getNodesBySelectorString(sel);
    return arrProto.indexOf.call(allMatches, this) !== -1;
}

// returns true if the node matches the provided selector
// where node is a single node
// i is index of node within the calee's collection
// selector is string, dollar selection, node, or function
function nodeMatchesSelector (node, selector, i) {
    // reject no selector, doc.frags, text, docConstruct, etc.
    if (!selector || !node || node.nodeType !== 1) {
        return false;
    }

    // handle non-string selectors
    if (typeof selector !== strType) {

        // node/element
        if (selector.nodeType) {
            return node === selector;

        // function
        } else if (typeof selector === fnType) {
            return !!selector.call(node, node, i);

        // array of elements or dollar collection
        } else if (selector.length) {
            return selector.indexOf(node) !== -1;

        } else {
            return false;
        }
    }

    return getMatches.call(node, selector);
}

function filterNodes (nodes, selector) {
    var matches = [];

    for (var i = 0, len = nodes.length; i < len; i++) {
        if (nodeMatchesSelector(nodes[i], selector, i)) {
            matches.push(nodes[i]);
        }
    }

    return matches;
}

// convert a string into DOM elements
function htmlStringToNode (htmlString) {
    // thank you jQuery for the awesome regExp
    var singleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/).exec(htmlString);

    // HANDLE: '<div></div>', etc.
    if (singleTag) {
        return docConstruct.createElement(singleTag[1]);

    // HANDLE: '<div><p></p></div>', etc.
    } else {
        var disposableContainer = docConstruct.createElement('div');
        disposableContainer.innerHTML = htmlString;
        return disposableContainer.childNodes[0];
    }
}

// always returns an array of nodes to use as context
function normalizeContext (context) {
    if (typeof context === strType) {
        return getNodesBySelectorString(context);
    }

    if (context.isDollar) {
        return context.get();
    }

    // dom elements are nodeType 1, the document is nodeType 9
    if (context.nodeType === 1 || context.nodeType === 9) {
        return [context];
    }

    if (Array.isArray(context)) {
        return context;
    }

    return [docElement]; // default to the docElement, nodeType 1
}


var DATA_ATTR_NAME = 'dollar-node-id';
var DATA_NEXT_ID = 1;
var DATA_CACHE_PUBLIC = {};
var DATA_CACHE_PRIVATE = {};

function nodeSupportsAttrProp (node) {
    // don't get/set attributes or properties on text, comment and attribute nodes
    var nType = node && node.nodeType;
    return nType && nType !== 3 && nType !== 8 && nType !== 2;
}

function getSafeNodeForAttributeManipulation (elem) {
    if (elem.nodeType === 9) {
        elem = elem.documentElement;
    }
    return nodeSupportsAttrProp(elem) ? elem : undef;
}

function getAttributeSafely (elem, attr) {
    if (!elem) {
        return;
    }

    if (elem === elem.window) { // handle window
        return elem[attr];
    }

    elem = getSafeNodeForAttributeManipulation(elem);
    return elem && elem.hasAttribute(attr) ? elem.getAttribute(attr) : undef;
}

function setAttributeSafely (elem, attr, value) {
    if (elem === elem.window) { // handle window
        elem[attr] = value;
    }

    elem = getSafeNodeForAttributeManipulation(elem);
    return elem && elem.setAttribute(attr, value);
}

function removeAttributeSafely (elem, attr) {
    if (elem === elem.window) { // handle window
        elem[attr] = undef;
    }

    elem = getSafeNodeForAttributeManipulation(elem);
    return elem && elem.removeAttribute(attr);
}

function getInternalElementId (elem) {
    return Number(getAttributeSafely(elem, DATA_ATTR_NAME)) || undef;
}

function setInternalElementId (elem, dollarNodeId) {
    return setAttributeSafely(elem, DATA_ATTR_NAME, dollarNodeId);
}

function getElementData (cache, elem, key) {
    var id = getInternalElementId(elem);

    if (id) {
        if (!key) {
            return cache[id];
        }

        return cache[id] && cache[id][key];
    }
}

function setElementData (cache, elem, key, value) {
    var id = getInternalElementId(elem);

    if (!id) {
        id = DATA_NEXT_ID;
        setInternalElementId(elem, id);
        DATA_NEXT_ID++;
    }

    if (!cache[id]) {
        cache[id] = {};
    }

    cache[id][key] = value;
}

function pushElementData (cache, elem, key, value) {
    var valArr = getElementData(cache, elem, key) || [];
    valArr.push(value);
    setElementData(cache, elem, key, valArr);
}

/*
 * Helper Utilities
 * @module $.utils
 */

$.utils = utils = (function () {

    var objPrefix = '[object ';

    function isElement (thing) {
        // reject all but dom nodes & the document
        return !!thing && (thing.nodeType === 1 || thing.nodeType === 9);
    }

    function isObject (thing) {
        return objToString.call(thing) === objPrefix + 'Object]';
    }

    function each (collection, iteratee) {
        if (collection) {
            if (collection.length !== undef) {
                for (var i = 0, len = collection.length; i < len; i++) {
                    if (iteratee.call(collection[i], collection[i], i, collection) === false) {
                        return;
                    }
                }

            } else {
                for (var prop in collection) {
                    if (objHasProp.call(collection, prop)) {
                        if (iteratee.call(collection[prop], collection[prop], prop, collection) === false) {
                            return;
                        }
                    }
                }
            }
        }
    }

    function extend () {
        var ret = arguments[0];
        var assignProp = function (val, key) {
            if (val !== undef) {
                ret[key] = val;
            }
        };

        each(arrSlice.call(arguments, 1), function (ext) {
            each(ext, assignProp);
        });

        return ret;
    }

    function merge () {
        var ret = arguments[0];
        var i, len;

        each(arrSlice.call(arguments, 1), function (collection) {
            if (collection) {
                for (i = 0, len = collection.length; i < len; i++) {
                    if (ret.indexOf(collection[i]) === -1) {
                        ret.push(collection[i]);
                    }
                }
            }
        });

        return ret;
    }

    var format = {

        camelToDash: function (str) {
            return str.replace(/([A-Z])/g, '-$1').toLowerCase();
        },

        dashToCamel: function (str) {
            return str.replace(/\-(.)/g, function (all, s) {
                return s.charAt(0).toUpperCase();
            });
        }

    };



    return {

        isElement: isElement,
        isObject: isObject,

        each: each,
        extend: extend,
        merge: merge,

        format: format

    };

})();

/**
 * Find the closest ancestor that matches a given selector
 * For each selected element, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree
 * @module core
 * @param {Selector} selector A selector expression to match elements against
 * @option {Context} context The context to use while searching for matches
 * @returns DollarJS (new set)
 * @example $('p').closest('.outer')
 */

$.fn.closest = function (selector, context) {
    if (!selector) {
        return $();
    }

    var allMatches = getNodesBySelector(selector, context);
    var onlyClosest = [];
    var node;

    for (var i = 0, len = this.length; i < len; i++) {
        node = this[i];
        while (node && node !== context) {
            if (arrProto.indexOf.call(allMatches, node) !== -1) {
                onlyClosest.push(node);
                break;
            }

            node = node.parentNode;
        }
    }

    return collect(onlyClosest);
};

/**
 * Iterate over each matched element
 * Aliased as <b>.forEach()</b> for convenience
 * @module core
 * @param {Function} iteratee A function to be invoked once for each element. (element, index, collection) are passed as arguments. Within the iteratee, `this` refers to the current element.
 * @returns DollarJS (chainable)
 * @example $('p').each(function (elem) { console.log(elem); })
 * @example $('p').each(function () { console.log(this); })
 */

$.fn.each = $.fn.forEach = function (iteratee) {
    utils.each(this, iteratee);
    return this;
};

/**
 * Reduce the matched set to the one element at a specific index
 * @module core
 * @param {Integer} index Indicates the position of the element to keep. Negative values count backwards from the end of the set.
 * @returns DollarJS (reduced set)
 * @example $('p').eq(3)
 * @example $('p').eq(-1)
 */

$.fn.eq = function (index) {
    index = Array.isArray(index) ? NaN : parseInt(index, 10); // prevent parsing array of numbers

    return index >= 0 ?
        $(this[index]) :
        $(this[this.length + index]); // have to + a -index in order to subtract
};

/**
 * Reduce the matched set to the ones that match an additional selector
 * @module core
 * @param {Selector} selector A selector expression to match elements against
 * @returns DollarJS (reduced set)
 * @example $('p').filter('.foo')
 */

$.fn.filter = function (selector) {
    if (!this.length || !selector) {
        return $();
    }

    return collect(filterNodes(this, selector));
};

/**
 * Get the descendants of each element in the matched set that match a given selector
 * @module core
 * @param {Selector} selector A selector expression to match elements against
 * @returns DollarJS (new set)
 * @example $('p').find('span')
 */

$.fn.find = function (selector) {
    if (!selector || !this.length) {
        return $();
    }

    return collect(getNodesBySelector(selector, this));
};

/**
 * Return the actual element at a given index
 * If <b>index</b> is passed, return the one element at the specified index
 * If <b>index</b> is NOT passed, return a true Array of the selected elements
 * @module core
 * @option {Integer} index Indicates the position of the element to return. Negative values count backwards from the end of the set.
 * @returns Element or Array of Elements
 * @example $('p').get(3)
 * @example $('p').get(-1)
 * @example $('p').get()
 */

$.fn.get = function (index) {
    if (index === undef) {
        // Return all the elements in a clean array
        return arrSlice.call(this, 0);

    } else {
        // Return just the one element from the set
        return index < 0 ? this[index + this.length] : this[index];
    }
};

/**
 * Reverse the set of matched elements
 * @module core
 * @returns DollarJS (chainable)
 * @example $('p').reverse()
 */

$.fn.reverse = arrProto.reverse;


/***************/
/*   ANIMATE   */
/***************/

/**
 * Animate styles using CSS transitions
 * @module animate
 * @param {Object} props CSS properties and values to transition into
 * @option {Object|Number} options Object with transition options (duration, easing, delay) / transition delay as an integer
 * @option {Function} complete Callback to be executed after animation is complete
 * @returns DollarJS (chainable)
 */

$.fn.animate = function (props, options, complete) {
    if (!utils.isObject(options)) {
        options = {
            duration: options
        };
    }

    var endEvent = 'transitionend';
    this.each(function (elem, index) {
        utils.each(props, function (val, prop) {
            elem.style.transition = addTransition(elem, prop, options);
            elem.style[prop] = val;
            var afterAnimate = function (propName) {
                elem.removeEventListener(endEvent, afterAnimate, true);
                elem.style.transition = removeTransition(elem, propName);
                if (typeof complete === fnType) {
                    complete.call(elem, elem, index);
                }
            };
            elem.addEventListener(endEvent, afterAnimate, true);
        });
    });

    return this;
};

function addTransition (elem, prop, options) {
    var newStr = prop + ' ' + transitionOptionsAsString(options);
    var trans = elem.style.transition ? elem.style.transition.split(/,\s?/) : [];
    var existing = false;

    trans.forEach(function (t, i) {
        if (t.indexOf(prop + ' ') === 0) {
            trans[i] = newStr;
            existing = true;
        }
    });

    if (!existing) {
        trans.push(newStr);
    }

    return trans.join(', ');
}

function removeTransition (elem, prop) {
    var trans = elem.style.transition.split(/,\s?/);
    var without = [];

    trans.forEach(function (t) {
        if (t.indexOf(prop + ' ') !== 0) {
            without.push(t);
        }
    });

    return without.join(', ');
}

function transitionOptionsAsString (options) {
    var optsArr = [];

    optsArr.push(typeof options.duration === strType ? options.duration : ((parseInt(options.duration) || 400) + 'ms'));
    optsArr.push(options.easing || 'ease');
    optsArr.push(typeof options.delay === strType ? options.delay : ((parseInt(options.delay) || 0) + 'ms'));

    return optsArr.join(' ');
}

/**
 * Slowly fade the matched elements into view
 * @module animate
 * @option {Number} duration Length of the transition
 * @option {Function} complete Callback to be executed after animation is complete
 * @returns DollarJS (chainable)
 */

$.fn.fadeIn = function (duration, complete) {
    return this.animate({ opacity: 1 }, duration, complete);
};

/**
 * Hide the matched elements by slowly fading away
 * @module animate
 * @option {Number} duration Length of the transition
 * @option {Function} complete Callback to be executed after animation is complete
 * @returns DollarJS (chainable)
 */

$.fn.fadeOut = function (duration, complete) {
    return this.animate({ opacity: 0 }, duration, complete);
};


/****************/
/*    FILTER    */
/****************/

/**
 * Add elements that match a new selector to the current set
 * @module filter
 * @param {Selector} selector A selector expression to match elements against
 * @option {Context} context The context to use while searching for matches
 * @returns DollarJS (expanded set)
 * @example $('p').add('span')
 */

$.fn.add = function (selector, context) {
    if (!selector) {
        return this;
    }

    return collect(this, $(selector, context));
};

/**
 * Merge an Array of Elements into the current set
 * @module filter
 * @param {Array} elements An Array of Elemenets to be merged into the current set
 * @option {Array} additionalElements... Additional Arrays to be merged one after another
 * @returns DollarJS (expanded set)
 * @example $('p').concat([elem1, elem2], [elem3])
 */

$.fn.concat = function () {
    var args = arrSlice.call(arguments);
    args.unshift(this);
    return collect.apply(this, args);
};

/**
 * Reduce the set of matched elements to those that have a descendant that matches a new selector
 * @module filter
 * @param {Selector} selector A selector expression to match elements against
 * @returns DollarJS (reduced set)
 * @example $('p').has('span')
 */

$.fn.has = function (selector) {
    if (!selector) {
        return $();
    }

    return this.filter(function () {
        return !!getNodesBySelector(selector, this).length;
    });
};

/**
 * Is the current set of elements a match to a new selector?
 * Returns true if at least one of the elements in the current set matches the new selector. Returns false if otherwise.
 * @module filter
 * @param {Selector} selector A selector expression to match elements against
 * @returns true or false
 * @example $('p').is('.foo')
 */

$.fn.is = function (selector) {
    return !!(selector && this.filter(selector).length);
};

/**
 * Create a new set by calling a function on every element in the current set
 * @module filter
 * @param {Function} iteratee A function that returns an Element for the new set when passed (currentElement, index, collection)
 * @returns DollarJS (new set)
 * @example $('p').map(function(elem){ return elem.parentNode; })
 */

$.fn.map = function (iteratee) {
    if (typeof iteratee !== fnType) {
        return this;
    }

    var newSet = [];
    var newElem;

    for (var i = 0, len = this.length; i < len; i++) {
        newElem = iteratee.call(this[i], this[i], i, this);
        if (utils.isElement(newElem)) {
            newSet.push(newElem);
        } else {
            throw new Error('.map fn should return an Element, not ' + typeof newElem);
        }
    }

    return collect.call(this, newSet);
};

/**
 * Remove elements from the current set that match a new selector
 * @module filter
 * @param {Selector} selector A selector expression to match elements against
 * @returns DollarJS (reduced set)
 * @example $('p').not('.foo')
 */

$.fn.not = function (selector) {
    if (!selector) {
        return this;
    }

    var criteria;

    if (typeof selector === fnType) {
        criteria = function (node, i) {
            return !selector.call(node, i, node);
        };

    } else {
        criteria = function (node, i) {
            return !nodeMatchesSelector(node, selector, i);
        };
    }

    return collect(this.filter(criteria));
};


/****************/
/*    MUTATE    */
/****************/


/**
 * Inserts an array of contents into the DOM
 * Note: if more than one elem in dollar instance, inserted Elements will be moved instead of cloned
 */
function domInsert (contentsArr, method) {
    // Flatten nested arrays
    contentsArr = [].concat.apply([], contentsArr);

    var i, j, doInsert, content, frag, generatedNode;
    var colLen = contentsArr.length;
    var elemsLen = this.length;

    function nodeToFrag (node) {
        frag.appendChild(node);
        doInsert = true;
    }

    for (j = 0; j < elemsLen; j++) {
        doInsert = false;
        frag = docConstruct.createDocumentFragment();

        for (i = 0; i < colLen; i++) {
            content = contentsArr[i];

            if (content) {
                // content is String
                if (typeof content === strType) {
                    if(generatedNode = htmlStringToNode(content)) {
                        nodeToFrag(generatedNode);
                    }

                // content is Element
                } else if (content.nodeType === 1) {
                    nodeToFrag(content);

                // content is dollar collection
                } else if (content.isDollar) {
                    content.each(nodeToFrag);

                // content is function
                } else if (typeof content === fnType) {
                    generatedNode = content(this[j], j);

                    if (typeof generatedNode === strType) {
                        generatedNode = htmlStringToNode(generatedNode);
                    }

                    if (generatedNode) {
                        nodeToFrag(generatedNode);
                    }
                }
            }
        }

        if(doInsert) {
            method(this[j], frag);
        }
    }

    return this;
}

/**
 * Insert content after each element in the current set
 * @module mutate
 * @param {Content} content Content to be inserted. Existing nodes will be moved instead of duplicated.
 * @option {Content} content Additional args are handled the same as the first, each in turn
 * @returns DollarJS (chainable)
 * @example $('p').after('&lt;div class="new-stuff"&gt;')
 */

$.fn.after = function () {
    return domInsert.call(this, arguments, function (elem, content) {
        var parent = elem.parentNode;
        if (parent) {
            if (elem.nextSibling) {
                parent.insertBefore(content, elem.nextSibling);
            } else {
                parent.appendChild(content);
            }
        }
    });
};

/**
 * Insert content into each element in the current set (at the bottom)
 * @module mutate
 * @param {Content} content Content to be inserted. Existing nodes will be moved instead of duplicated.
 * @option {Content} content Additional args are handled the same as the first, each in turn
 * @returns DollarJS (chainable)
 * @example $('p').append('&lt;div class="new-stuff"&gt;')
 */

$.fn.append = function () {
    return domInsert.call(this, arguments, function (elem, content) {
        elem.appendChild(content);
    });
};

/**
 * Insert content before each element in the current set
 * @module mutate
 * @param {Content} content Content to be inserted. Existing nodes will be moved instead of duplicated.
 * @option {Content} content Additional args are handled the same as the first, each in turn
 * @returns DollarJS (chainable)
 * @example $('p').before('&lt;div class="new-stuff"&gt;')
 */

$.fn.before = function () {
    return domInsert.call(this, arguments, function (elem, content) {
        if (elem.parentNode) {
            elem.parentNode.insertBefore(content, elem);
        }
    });
};

/**
 * Clone each element in the current set
 * Uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode" target="_blank">cloneNode</a> with deep=true
 * @module mutate
 * @returns DollarJS (cloned set)
 * @example $('p').clone()
 */

$.fn.clone = function () {
    var elem, i, len = this.length;

    for (i = 0; i < len; i++) {
        elem = this[i];
        if (elem.nodeType === 1 || elem.nodeType === 11) {
            this[i] = elem.cloneNode(true);
        }
    }

    return this;
};

/**
 * Empty the contents of each element in the current set
 * @module mutate
 * @returns DollarJS (chainable)
 * @example $('p').empty()
 */

$.fn.empty = function () {
    var elem, i, len = this.length;

    for (i = 0; i < len; i++) {
        elem = this[i];
        if (elem.nodeType === 1) {
            elem.textContent = '';
        }
    }

    return this;
};

/**
 * Get or set the HTML contents of the current set
 * If <b>htmlString</b> is provided, this will set the contents of each element and return the current set for chaining
 * If no argument is passed, this will return the contents of the first element in the current set
 * @module mutate
 * @option {HTMLString} htmlString A string of HTML markup to be created and inserted
 * @returns HTMLString or DollarJS (chainable)
 * @example $('p').html()
 * @example $('p').html('&lt;div&gt;')
 */

$.fn.html = function (htmlString) {
    var elem, i, len = this.length,
        first = this[0];

    if (htmlString === undef) {
        if (first && first.nodeType === 1) {
            return first.innerHTML;
        }

        return undef;
    }

    try {
        for (i = 0; i < len; i++) {
            elem = this[i];
            if (elem.nodeType === 1) {
                elem.innerHTML = htmlString;
            }
        }

    } catch (e) {
        this.empty().append(htmlString);
    }

    return this;
};

/**
 * Insert content into each element in the current set (at the top)
 * @module mutate
 * @param {Content} content Content to be inserted. Existing nodes will be moved instead of duplicated.
 * @option {Content} content Additional args are handled the same as the first, each in turn
 * @returns DollarJS (chainable)
 * @example $('p').prepend('&lt;div class="new-stuff"&gt;')
 */

$.fn.prepend = function () {
    return domInsert.call(this, arguments, function (elem, content) {
        if (elem.firstChild) {
            elem.insertBefore(content, elem.firstChild);
        } else {
            elem.appendChild(content);
        }
    });
};

/**
 * Remove each element in the current set from the document
 * If a selector is provided, only remove elements that match the new selector
 * @module mutate
 * @option {Selector} selector A selector expression to match elements against
 * @returns DollarJS (chainable)
 * @example $('p').remove('.foo')
 */

$.fn.remove = function (selector) {
    var target, i, len = this.length;

    if (selector === undef) {
        for (i = 0; i < len; i++) {
            target = this[i];
            if (target.parentNode) {
                target.parentNode.removeChild(target);
            }
        }

    } else {
        for (i = 0; i < len; i++) {
            target = this[i];
            if (nodeMatchesSelector(target, selector, i) && target.parentNode) {
                target.parentNode.removeChild(target);
            }
        }
    }

    return this;
};


/*******************/
/*    READWRITE    */
/*******************/

/**
 * Get or set attributes on the current set
 * If <b>value</b> is provided, this will set the attribute on each element and return the current set for chaining
 * If <b>value</b> is not passed, this will return the value of the attribute for the first element in the current set
 * There is a difference between <a href="http://lucybain.com/blog/2014/attribute-vs-property/" target="_blank">attr vs prop</a>
 * @module readwrite
 * @param {String} name The name of the attribute
 * @option {Any} value A value to be set. Most values will be converted to a String before setting. Functions will be evaluted with (previousValue, index) and the return value will be set.
 * @returns Value or DollarJS (chainable)
 * @example $('img').attr('title')
 * @example $('img').attr('title', 'Click Me')
 * @example $('img').attr('title', function(previousValue, index){ return 'Click Me'; })
 */

$.fn.attr = function (name, value) {

    if (value === undef) {
        return getAttributeSafely(this[0], name);
    }

    this.each(function (elem, i) {
        if (nodeSupportsAttrProp(elem)) {
            if (typeof value === fnType) {
                value = value(getAttributeSafely(elem, name), i);
            }

            elem.setAttribute(name, value);
        }
    });

    return this;
};

/**
 * Store or read arbitrary data associated with the matched elements
 * If <b>key</b> and <b>value</b> are provided, this will set data for each element and return the current set for chaining
 * If only <b>key {Object}</b> is provided, this will set data for each element (as key/value pairs) and return the current set for chaining
 * If only <b>key {String}</b> is provided, this will return the data stored under the given key for the first element in the current set
 * If no arguments are passed, this will return all of the data stored for the first element in the current set
 * Note: setting data through dollar does NOT create corresponding data-attributes on the element
 * @module readwrite
 * @option {Object|String} key An Object of key/value pairs to store, or the String key from which to store/read a value
 * @option {Any} value A value to be set. Most values will be converted to a String before setting. Functions will be evaluted with (previousValue, index) and the return value will be set.
 * @returns Data or DollarJS (chainable)
 * @example $('p').data('foo', 'bar')
 * @example $('p').data({ foo: 'bar' })
 * @example $('p').data('foo', function(previousValue, index){ return 'foo'; })
 * @example $('p').data('foo')
 * @example $('p').data()
 */

$.fn.data = function (key, value) {
    if (!this.length) {
        return undef;
    }

    var elem, map = {};

    // get all data
    if (!key) {
        return utils.extend({}, getDataFromDOM(this[0]), getElementData(DATA_CACHE_PUBLIC, this[0]));
    }

    if (typeof key === strType) {

        // get one value
        if (value === undef) {
            var retrievedData = getElementData(DATA_CACHE_PUBLIC, this[0], key);
            return retrievedData === undef ? getDataFromDOM(this[0])[key] : retrievedData;
        }

        // set map with one value
        map[key] = value;

    } else if (utils.isObject(key)) {
        // set using provided object as map
        map = key;
    }

    function setDataByMap (v, k) {
        setElementData(DATA_CACHE_PUBLIC, elem, k, v);
    }

    for (var i = 0, len = this.length; i < len; i++) {
        elem = this[i];
        utils.each(map, setDataByMap);
    }

    return this;
};

function getDataFromDOM (elem) {
    // Polyfill for IE<11 and Opera Mini
    return elem && elem.dataset || (function () {
        var data = {};
        var allAttr = elem.attributes;
        var isDataAttr = /^data-[a-z_\-\d]*$/i;
        var name;

        for (var n in allAttr) {
            if (allAttr.hasOwnProperty(n)) {
                name = allAttr[n].name;
                if (isDataAttr.test(name)) {
                    name = utils.format.dashToCamel(name.substr(5));
                    data[name] = allAttr[n].value;
                }
            }
        }

        return data;
    })();
}

/**
 * Get or set properties on the current set
 * If <b>value</b> is provided, this will set the property on each element and return the current set for chaining
 * If <b>value</b> is not passed, this will return the value of the property for the first element in the current set
 * There is a difference between <a href="http://lucybain.com/blog/2014/attribute-vs-property/" target="_blank">attr vs prop</a>
 * @module readwrite
 * @param {String} name The name of the property
 * @option {Any} value A value to be set. Most values will be converted to a String before setting. Functions will be evaluted with (previousValue, index) and the return value will be set.
 * @returns Value or DollarJS (chainable)
 * @example $('input').prop('checked')
 * @example $('input').prop('checked', true)
 * @example $('input').prop('checked', function(previousValue, index){ return true; })
 */

$.fn.prop = function (name, value) {

    if (value === undef) {
        return getPropertyFromElem(this[0], name);
    }

    this.each(function (elem, i) {
        if (nodeSupportsAttrProp(elem)) {
            if (typeof value === fnType) {
                value = value(getPropertyFromElem(elem, name), i);
            }

            elem[name] = value;
        }
    });

    return this;
};

function getPropertyFromElem (elem, name) {
    return nodeSupportsAttrProp(elem) ? elem[name] : undef;
}

/**
 * Remove an attribute from each element in the current set
 * @module readwrite
 * @param {String} name The name of the attribute
 * @returns DollarJS (chainable)
 * @example $('img').removeAttr('title')
 */

$.fn.removeAttr = function (name) {
    this.each(function () {
        this.removeAttribute(name);
    });

    return this;
};

/**
 * Unset data from each element in the current set
 * If <b>key</b> is not passed, ALL data will be removed
 * @module readwrite
 * @option {String} key A key under which specific data was stored
 * @returns DollarJS (chainable)
 * @example $('p').removeData('foo')
 * @example $('p').removeData()
 */

$.fn.removeData = function (key) {
    var elem, id;

    for (var i = 0, len = this.length; i < len; i++) {
        elem = this[i];
        id = getInternalElementId(elem);

        if (key) {
            // clean dollar data
            if (id) {
                delete DATA_CACHE_PUBLIC[id][key];
            }

            // clean DOM data
            if (elem) {
                if (elem.dataset) {
                    if (elem.dataset[key]) {
                        delete elem.dataset[key];
                    }

                } else {
                    removeAttributeSafely(elem, 'data-' + utils.format.camelToDash(key));
                }
            }

        } else {
            DATA_CACHE_PUBLIC[id] = {};
        }
    }

    return this;
};

/**
 * Remove a property from each element in the current set
 * @module readwrite
 * @param {String} name The name of the property
 * @returns DollarJS (chainable)
 * @example $('img').removeProp('title')
 */

$.fn.removeProp = function (name) {
    this.each(function () {
        if (nodeSupportsAttrProp(this)) {
            delete this[name];
        }
    });

    return this;
};

/**
 * Get or set text contents on the current set
 * If <b>value</b> is provided, this will set the text contents for each element and return the current set for chaining
 * If no arguments are passed, this will return the text contents of the first element in the current set
 * @module readwrite
 * @option {Any} value A value to be set. Functions will be evaluted with (previousValue, index) and the return value will be set.
 * @returns Text or DollarJS (chainable)
 * @example $('p').text()
 * @example $('p').text('foo')
 * @example $('p').text(function(previousValue, index){ return 'foo'; })
 */

$.fn.text = function (value) {
    if (value !== undef) {
        this.each(function (elem, i) {
            if (elem.nodeType === 1 || elem.nodeType === 11 || elem.nodeType === 9) {
                if (typeof value === fnType) {
                    elem.textContent = value(elem.textContent, i);
                } else {
                    elem.textContent = value;
                }
            }
        });

        return this;
    }

    var ret = '';

    this.each(function (elem) {
        var nodeType = elem.nodeType;

        if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
            if (typeof elem.textContent === strType) {
                ret += elem.textContent;
            }

        } else if (nodeType === 3 || nodeType === 4) {
            ret += elem.nodeValue;
        }
    });

    return ret;
};

/**
 * Get or set a value on the current set
 * If <b>value</b> is provided, this will set the value for each element and return the current set for chaining
 * If no arguments are passed, this will return the value of the first element in the current set
 * @module readwrite
 * @option {Any} value A value to be set. Functions will be evaluted with (previousValue, index) and the return value will be set.
 * @returns Value or DollarJS (chainable)
 * @example $('p').val()
 * @example $('p').val('foo')
 * @example $('p').val(function(previousValue, index){ return 'foo'; })
 */

$.fn.val = function (value) {
    if (value === undef) {
        return this[0] ? this[0].value : undef;
    }

    for (var i = 0; i < this.length; i++) {
        if (this[i].nodeType !== 1) {
            break;
        }

        if (typeof value === fnType) {
            value = value.call(this[i], this[i].value, i);
        }

        this[i].value = value;
    }

    return this;
};


/***************/
/*    STYLE    */
/***************/


// get styles across various browsers
var getStyle = win.getComputedStyle !== undef ? getStyleModern : getStyleCompat;

function getStyleModern (elem, prop) {

    if (!elem || typeof prop !== strType) {
        return '';
    }

    // apparently, IE <= 11 will throw for elements in popups
    // and FF <= 30 will throw for elements in an iframe
    if (elem.ownerDocument.defaultView.opener) {
        return elem.ownerDocument.defaultView.getComputedStyle(elem, null)[prop] || '';
    }

    return win.getComputedStyle(elem, null)[prop] || elem.style[prop] || '';
}

function getStyleCompat (elem, rawProp) {
    var prop;

    rawProp = typeof rawProp === strType ? rawProp : '';
    if (!elem) {
        return '';
    }

    if (rawProp === 'float') {
        prop = 'styleFloat';

    } else {
        prop = utils.format.dashToCamel(rawProp.replace(/^-ms-/, 'ms-'));
    }

    return elem.currentStyle[prop];
}

function getNonHiddenDisplayValue (elem) {
    var disp = elem.style.display;

    if (!disp || disp === 'none') {
        disp = getElementData(DATA_CACHE_PRIVATE, elem, 'nonHiddenDisplayValue') || '';
    }

    if (!disp && elem.parentNode) {
        var tmp = docConstruct.createElement(elem.nodeName);
        elem.parentNode.appendChild(tmp);
        disp = getStyle(tmp, 'display');
        elem.parentNode.removeChild(tmp);
        setElementData(DATA_CACHE_PRIVATE, elem, 'nonHiddenDisplayValue', disp);
    }

    return disp;
}

/**
 * Add classes to each element in the current set
 * @module style
 * @param {String} names A space-separated list of classes to be added
 * @returns DollarJS (chainable)
 * @example $('p').addClass('one two three')
 */

$.fn.addClass = function (names) {
    if (!names) {
        return this;
    }

    var newClasses, oldClasses;
    var i, len = this.length;

    if (typeof names === strType) {
        newClasses = names.trim().split(' ');

        for (i = 0; i < len; i++) {
            oldClasses = this[i].className.trim().replace(regExpSpacesAndBreaks, ' ').split(' ');
            this[i].className = utils.merge([], oldClasses, newClasses).join(' ');
        }

    } else if (typeof names === fnType) {
        for (i = 0; i < len; i++) {
            newClasses = names.call(this[i], this[i].className, i).split(' ');
            oldClasses = this[i].className.trim().replace(regExpSpacesAndBreaks, ' ').split(' ');
            this[i].className = utils.merge([], oldClasses, newClasses).join(' ');
        }
    }

    return this;
};

/**
 * Get or set the style of each element in the current set
 * If <b>property</b> is a String and <b>value</b> is NOT passed, this will return the current value for that style property on the first element in the set
 * If <b>property</b> is a String and <b>value</b> is provided, this will set the value for that style property on all elements in the set
 * If <b>property</b> is an Object, styles will be set for each key:value pair on all elements in the set
 * @module style
 * @param {String|Object} property The String name of a css property, or an Object with key:value pairs
 * @option {String} value The value to be set. Numerical values should include units.
 * @returns Current style value or DollarJS (chainable)
 * @example $('p').css('color')
 * @example $('p').css('color', '#336699')
 * @example $('p').css({ color: '#336699', fontSize: '14px' })
 */

$.fn.css = function (property, value) {
    if (!property) {
        return this;
    }

    var i, len = this.length;
    var elem, map = {};

    if (typeof property === strType) {

        // get one value
        if (value === undef) {
            return getStyle(this[0], property);
        }

        // set with one value
        map[property] = value;

    } else if (utils.isObject(property)) {
        // set using provided object as map
        map = property;
    }

    function setPropertyByMap (v, k) {
        elem.style[k] = typeof v === fnType ? v.call(elem, getStyle(elem, k), i) : v;
    }

    for (i = 0; i < len; i++) {
        elem = this[i];
        utils.each(map, setPropertyByMap);
    }

    return this;
};

/**
 * Do any of the matched elements have the given class name?
 * @module style
 * @param {String} className A single class name to look for
 * @returns True or False
 * @example $('p').hasClass('foo')
 */

$.fn.hasClass = function (className) {
    if (!className) {
        return false;
    }

    // sandwich className with one space to avoid partial matches
    className = ' ' + className.trim() + ' ';

    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].nodeType === 1 && (' ' + this[i].className + ' ').replace(regExpSpacesAndBreaks, ' ').indexOf(className) !== -1) {
            return true;
        }
    }

    return false;
};

/**
 * Get the current height of the first element in the set
 * This method does not set values. Use .css() instead.
 * @module style
 * @returns Height
 * @example $('div').height()
 */

$.fn.height = function () {
    return parseFloat(this.eq(0).css('height')) || 0;
};

/**
 * Hide each element in the current set
 * This method does not support animation. Use .fadeOut() instead.
 * @module style
 * @returns DollarJS (chainable)
 * @example $('p').hide()
 */

$.fn.hide = function () {
    this.each(function () {
        this.style.display = 'none';
    });

    return this;
};

/**
 * Remove classes from each element in the current set
 * @module style
 * @param {String} names A space-separated list of classes to be removed
 * @returns DollarJS (chainable)
 * @example $('p').removeClass('one two three')
 */

$.fn.removeClass = function (names) {
    var elem, newClasses, oldClasses, doomedClasses;

    function removeDoomed (old) {
        if (doomedClasses.indexOf(old) === -1) {
            newClasses.push(old);
        }
    }

    for (var i = 0, len = this.length; i < len; i++) {
        elem = this[i];
        newClasses = [];

        // remove all
        if (!names) {
            elem.className = '';

        } else {
            if (typeof names === fnType) {
                doomedClasses = names.call(elem, elem.className, i);
            } else {
                doomedClasses = names;
            }

            if (doomedClasses.length) {
                doomedClasses = typeof doomedClasses === strType ? doomedClasses.trim().split(' ') : doomedClasses;
                oldClasses = elem.className.replace(regExpSpacesAndBreaks, ' ').split(' ');
                utils.each(oldClasses, removeDoomed);
                elem.className = newClasses.join(' ');
            }
        }
    }

    return this;
};

/**
 * Display each element in the current set
 * This method does not support animation. Use .fadeIn() instead.
 * @module style
 * @returns DollarJS (chainable)
 * @example $('p').show()
 */

$.fn.show = function () {
    this.each(function () {
        this.style.display = getNonHiddenDisplayValue(this);
        this.style.visibility = 'visible';
        this.style.opacity = 1;
    });

    return this;
};

/**
 * Get the current width of the first element in the set
 * This method does not set values. Use .css() instead.
 * @module style
 * @returns Width
 * @example $('div').width()
 */

$.fn.width = function () {
    return parseFloat(this.eq(0).css('width')) || 0;
};


/******************/
/*    TRAVERSE    */
/******************/

/**
 * Get the children of each element in the current set
 * The results will only include direct children and will not traverse any deeper descendants
 * If <b>selector</b> is provided, the results will only include children that match the selector
 * @module traverse
 * @option {Selector} selector A selector expression to match elements against
 * @returns DollarJS (new set)
 * @example $('p').children()
 * @example $('p').children('.foo')
 */

$.fn.children = function (selector) {
    var childNodes = [];

    for (var i = 0, len = this.length; i < len; i++) {
        utils.merge(childNodes, this[i].children);
    }

    return collect(selector ? $.fn.filter.call(childNodes, selector) : childNodes);
};

/**
 * Reduce the set of matched elements to the first in the set
 * This is equivalent to .eq(0)
 * @module traverse
 * @returns DollarJS (reduced set)
 * @example $('p').first()
 */

$.fn.first = function () {
    return this.eq(0);
};

/**
 * Reduce the set of matched elements to the last in the set
 * This is equivalent to .eq(-1)
 * @module traverse
 * @returns DollarJS (reduced set)
 * @example $('p').last()
 */

$.fn.last = function () {
    return this.eq(-1);
};

/**
 * Get the next sibling of each element in the current set
 * If <b>selector</b> is provided, the results will only include siblings that match the selector
 * @module traverse
 * @option {Selector} selector A selector expression to match elements against
 * @returns DollarJS (new set)
 * @example $('p').next()
 * @example $('p').next('.foo')
 */

$.fn.next = function (selector) {
    var subsequents = [],
        nextNode;

    for (var i = 0, len = this.length; i < len; i++) {
        nextNode = this[i].nextElementSibling;
        if (nextNode) {
            subsequents.push(nextNode);
        }
    }

    return collect(selector ? $.fn.filter.call(subsequents, selector) : subsequents);
};

/**
 * Get the parents of each element in the current set
 * The results will only include direct parents and will not traverse any higher ancestors
 * If <b>selector</b> is provided, the results will only include parents that match the selector
 * @module traverse
 * @option {Selector} selector A selector expression to match elements against
 * @returns DollarJS (new set)
 * @example $('p').parent()
 * @example $('p').parent('.foo')
 */

$.fn.parent = function (selector) {
    var parentElems = [],
        parent;

    for (var i = 0, len = this.length; i < len; i++) {
        parent = this[i].parentNode;

        if (parent) {
            parentElems.push(parent);
        }
    }

    return collect(selector ? $.fn.filter.call(parentElems, selector) : parentElems);
};

/**
 * Get the siblings of each element in the current set
 * If <b>selector</b> is provided, the results will only include siblings that match the selector
 * @module traverse
 * @option {Selector} selector A selector expression to match elements against
 * @returns DollarJS (new set)
 * @example $('p').siblings()
 * @example $('p').siblings('.foo')
 */

$.fn.siblings = function (selector) {
    var siblings = [],
        target;

    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].parentNode) {
            target = this[i].parentNode.firstChild;
        }

        while (target) {
            if (target !== this[i] && target.nodeType === 1) {
                siblings.push(target);
            }

            target = target.nextSibling;
        }
    }

    return collect(selector ? $.fn.filter.call(siblings, selector) : siblings);
};


/*****************/
/*    TRIGGER    */
/*****************/


var activeEventListenersKey = 'activeEventListeners';

function bindEventHandlers (events, handler) {
    if (typeof events !== strType || typeof handler !== fnType) {
        return this;
    }

    events = events.split(' ');

    var addEventListenerCompat, i, evLen;
    this.each(function () {
        addEventListenerCompat = this.addEventListener || this.attachEvent;
        for (i = 0, evLen = events.length; i < evLen; i++) {
            addEventListenerCompat.call(this, events[i], handler, false);
            pushElementData(DATA_CACHE_PRIVATE, this, activeEventListenersKey, handler);
        }
    });

    return this;
}

function unbindEventHandlers (events, handler) {
    if (typeof events !== strType) {
        return this;
    }

    events = events.split(' ');

    var i, evLen, handlers, j, hdlrLen;

    this.each(function () {
        for (i = 0, evLen = events.length; i < evLen; i++) {
            handlers = typeof handler === fnType ? [handler] : getElementData(DATA_CACHE_PRIVATE, this, activeEventListenersKey) || [];
            for (j = 0, hdlrLen = handlers.length; j < hdlrLen; j++) {
                if (this.removeEventListener) {
                    this.removeEventListener(events[i], handlers[j], false);

                } else {
                    this.detachEvent(events[i], handlers[j], false);
                }
            }
        }
    });

    return this;
}

function triggerEventsOnElements (elems, events, args) {
    var ev;
    var eventInit = {
        bubbles: true,
        cancelable: true
    };

    if (args && args.length) {
        eventInit.detail = args;
    }

    utils.each(events, function (eventName) {
        utils.each(elems, function (elem) {
            if (eventName === 'click') {
                elem.click();

            } else if (eventName === 'focus') {
                elem.focus();

            } else if (eventName === 'blur') {
                elem.blur();

            } else {
                ev = new win.CustomEvent(eventName, eventInit);
                elem.dispatchEvent(ev);
            }
        });
    });
}

function bindOrTriggerConvenience (events, handler) {
    // bind handler to event
    if (typeof handler === fnType) {
        return bindEventHandlers.call(this, events, handler);

    // trigger event
    } else {
        triggerEventsOnElements(this, events.split(' '));
        return this;
    }
}

/**
 * Handle a "click" event on any element in the current set
 * Equivalent to .on('click', handler)
 * @module trigger
 * @param {Function} handler A function to execute when an element is clicked
 * @returns DollarJS (chainable)
 * @example $('div').click(function(event){ console.log(this); })
 */

$.fn.click = function (handler) {
    return bindOrTriggerConvenience.call(this, 'click', handler);
};

/**
 * Handle a "focus" event on any element in the current set
 * Equivalent to .on('focus', handler)
 * @module trigger
 * @param {Function} handler A function to execute when an element is focused
 * @returns DollarJS (chainable)
 * @example $('input').focus(function(event){ console.log(this); })
 */

$.fn.focus = function (handler) {
    return bindOrTriggerConvenience.call(this, 'focus', handler);
};

/**
 * Handle a "blur" event on any element in the current set
 * Equivalent to .on('blur', handler)
 * @module trigger
 * @param {Function} handler A function to execute when an element is unfocused
 * @returns DollarJS (chainable)
 * @example $('input').blur(function(event){ console.log(this); })
 */

$.fn.blur = function (handler) {
    return bindOrTriggerConvenience.call(this, 'blur', handler);
};

/**
 * Handle a "change" event on any element in the current set
 * Equivalent to .on('change', handler)
 * @module trigger
 * @param {Function} handler A function to execute when an element is changed
 * @returns DollarJS (chainable)
 * @example $('input').change(function(event){ console.log(this); })
 */

$.fn.change = function (handler) {
    return bindOrTriggerConvenience.call(this, 'change', handler);
};

/**
 * Handle a "resize" event on any element in the current set
 * Equivalent to .on('resize', handler)
 * @module trigger
 * @param {Function} handler A function to execute when an element is resized
 * @returns DollarJS (chainable)
 * @example $(window).resize(function(event){ console.log(document.documentElement.clientWidth); })
 */

$.fn.resize = function (handler) {
    return bindOrTriggerConvenience.call(this, 'resize', handler);
};

/**
 * Unbind some event handler from each element in the current set
 * Aliased as <b>.unbind()</b> for compatibility
 * If no <b>handler</b> is provided, ALL handlers will be unbound from the specified events
 * @module trigger
 * @param {String} events A space-separated list of events to unbind
 * @option {Function} handler A specific function to unbind
 * @returns DollarJS (chainable)
 * @example $('p').off('click')
 * @example $('p').off('click', justOneHandler)
 */

$.fn.off = $.fn.unbind = unbindEventHandlers;

/**
 * Bind some event handler to each element in the current set
 * Aliased as <b>.bind()</b> for compatibility
 * @module trigger
 * @param {String} events A space-separated list of events to listen for
 * @param {Function} handler A function to execute when one of the events is triggered
 * @returns DollarJS (chainable)
 * @example $('p').on('click', function(event){ console.log(this); })
 * @example $('p').on('custom', function(event){ console.log(event.detail); })
 */

$.fn.on = $.fn.bind = bindEventHandlers;

/**
 * Trigger events on each element in the current set
 * Executes all handlers bound to each element in the current set corresponding to the given event names
 * @module trigger
 * @param {String} events A string-separated list of event names to be triggered
 * @option {Any} extraParameters... Additional parameters to pass along to the event handler
 * @returns DollarJS (chainable)
 * @example $('p').trigger('click')
 * @example $('p').trigger('click', 'extra', 'params')
 * @example $('p').trigger('one two three')
 */

$.fn.trigger = function (events) {
    if (typeof events !== strType) {
        return this;
    }

    events = events.split(' ');

    triggerEventsOnElements(this, events, arrSlice.call(arguments, 1));

    return this;
};


/******************/
/* IE9-11 SUPPORT */
/******************/

(function (w) {

    function CustomEventPolyfill (event, customInit) {
        customInit = customInit || {
            bubbles: false,
            cancelable: false
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, customInit.bubbles, customInit.cancelable, customInit.detail);
        return evt;
    }

    if (typeof w.CustomEvent !== fnType) {

        CustomEventPolyfill.prototype = w.Event.prototype;

        w.CustomEvent = CustomEventPolyfill;
    }

})(win);


/****************/
/*    EXPORT    */
/****************/

/**
 * Export using whatever method is best
 * module.exports
 * window.$
 */
(function () {

    var win = window;

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = $;

    // AMD loader
    } else if (typeof win.define === fnType && win.define.amd) {
        win.define(function () {
            return $;
        });

    // Global window
    } else {
        win.$ = $;
    }

}.call(this));


}.call(this));



/***/},{}],
/***/[function (require, module, exports) {


module.exports = '<script>// do nothing</script><style type="text/css">.test-class{background-color:teal;border:1px solid orange;height:50px;width:100px}.preexisting0{background:#222}.preexisting1{background:#333}#results{margin-bottom:20px;padding:20px;border-bottom:1px solid #999}</style><pre id="results"></pre><div id="slim_shady" class="willy sel-id sel-id-node sel-id-class sel-class"></div><div class="willy wonka sel-class sel-class-node sel-class-dual"><a href="#" class="sel-elem">HYPERLINK</a><p id="first_paragraph"><span class="sel-descendant sel-child"><span class="sel-descendant"><em></em></span></span></p><ul><li class="sel-first-child sel-odd"></li><li class="sel-nth-2 sel-even"></li><li class="sel-nth-3n sel-odd"></li><li class="sel-even"></li><li class="sel-odd"></li><li class="sel-nth-3n sel-even"></li><li class="sel-odd"></li><li class="sel-last-child sel-even"></li></ul><div><p class="prev"></p><p class="sel-prev-sibling sel-prev-next"></p><p class="sel-prev-sibling"></p></div><div><span class="sel-empty"></span></div><div id="headings"><h2 class="sel-attr-not-equals"></h2><h2 foo="bar" class="sel-attr sel-attr-equals"></h2><h3 foo="babarba" class="sel-attr-contains"></h3><h4 foo="bar-ba" class="sel-attr-contains-prefix sel-attr-starts-with"></h4><h4 foo="ba bar ba" class="sel-attr-contains-word"></h4><h4 foo="barba" class="sel-attr-starts-with"></h4><h4 foo="babar" class="sel-attr-ends-with"></h4></div><button class="sel-visible"></button> <button class="sel-hidden" style="display:none">Can You See Me?</button> <button class="sel-visible sel-disabled" disabled="disabled"></button> <input class="sel-checked" type="checkbox" checked="checked"><div id="multiple1" class="sel-multiple"></div><div id="multiple2" class="sel-multiple"></div><span id="good" class="sel-good sel-empty"></span><section id="first_section"><article id="top_list" class="top-list"><li class="list-item sel-in-context-node sel-in-context-id sel-in-context-class sel-in-context-child sel-first-child sel-odd"></li><ul class="list"><li class="list-item sel-in-context-node sel-in-context-id sel-in-context-class sel-in-context-child sel-first-child sel-odd"></li><li id="find_me" class="list-item sel-in-context-node sel-in-context-id sel-in-context-class sel-in-context-child sel-even sel-nth-2"></li><li class="list-item find_me sel-in-context-node sel-in-context-id sel-in-context-class sel-in-context-child sel-last-child sel-nth-3n sel-odd"></li></ul></article><div><ul class="list"><li class="list-item sel-in-context-div sel-first-child sel-odd"></li><li class="list-item sel-in-context-div sel-even sel-nth-2"></li><li class="list-item find_me sel-in-context-div sel-last-child sel-nth-3n sel-odd"></li></ul></div><div class="nested-list-container"><ul class="list"><li class="list-item sel-in-context-div sel-first-child sel-odd has-nested"><ul class="inner-list"><li class="list-item sel-in-context-div sel-first-child sel-odd"></li><li class="list-item sel-in-context-div sel-even sel-nth-2"></li><li class="list-item sel-in-context-div sel-nth-3n sel-odd"></li><li class="list-item sel-in-context-div sel-even"></li><li class="list-item sel-in-context-div sel-odd"></li><li class="list-item find_me sel-in-context-div sel-even sel-last-child sel-nth-3n has-nested"><span id="nested" class="nested sel-empty"></span></li></ul></li><li class="list-item sel-in-context-div sel-even sel-nth-2"><ul class="inner-list"></ul></li><li class="list-item sel-in-context-div sel-last-child sel-nth-3n sel-odd"></li></ul></div></section><section id="middle_section"></section><section id="last_section"><div class="test-class"></div><span class="test-class sel-empty"></span><div class="find_me"></div></section><div id="mutate"><div class="mutate"><span>one</span></div><div class="mutate"><span>two</span></div><div class="mutate"><span>three</span></div></div><div id="readwrite"><img id="image" src="" alt="fakeroo" title="My Fake Image"> <input id="cbox" type="checkbox" value="onoff" disabled="disabled"> <input id="tbox" type="text" value="momma"></div><div id="data_daddy" data-how-bad="to the bone"><span class="sel-empty"></span></div><div id="data_baby" data-how-slobbery="to the bib" dollar-node-id="999"><span class="sel-empty"></span></div><div class="styles preexisting0" style="padding:33px" width="33"></div><div class="styles preexisting1" style="padding:22px" width="22"></div><div id="triggers"><label><input type="checkbox" id="cbox01" class="trigger"> Label</label><label class="trigger"><input type="checkbox" id="cbox02"> Label</label></div><div id="pseudo_sel_not">foo<div class="container"><div class="inner"></div><div class="target"><span class="click_tracker click_tracking_target_two">click tracking target</span></div></div><div class="datepicker"><span>first span</span> <span>second span</span> <span>third span <span class="click_tracker click_tracking_target_one">click tracking target</span></span></div><input type="text" class="foo"> <input type="text" class="bar"></div></div>';



/***/},{}],
/***/[function (require, module, exports) {



SELECTORS = {

    ignored: {
        'undefined': void 0,
        'empty string': '',
        'null': null,
        'false': false,
        'true': true,
        'Number': 456,
        'Array': [1,2,3],
        'Object': { abc: 123 }
    },

    nomatch: [
        'bad',
        '#bad',
        '.bad',
        ' #bad',
        ' #bad '
    ],

    matchJQueryAndDom: {
        '#good': '.sel-good',
        ' #good': '.sel-good',
        ' #good ': '.sel-good',
        '#slim_shady': '.sel-id',
        'div#slim_shady': '.sel-id-node',
        '#slim_shady.willy': '.sel-id-class',
        '.willy': '.sel-class',
        'div.wonka': '.sel-class-node',
        '.willy.wonka': '.sel-class-dual',
        'a': '.sel-elem',
        'p span': '.sel-descendant',
        'p > span': '.sel-child',
        'li:first-child': '.sel-first-child',
        'li:last-child': '.sel-last-child',
        'li:nth-child(2)': '.sel-nth-2',
        'li:nth-child(3n)': '.sel-nth-3n',
        'li:nth-child(even)': '.sel-even',
        'p.prev + p': '.sel-prev-next',
        'p.prev ~ p': '.sel-prev-sibling',
        'span:empty': '.sel-empty',
        'h2[foo]': '.sel-attr',
        'h2[foo="bar"]': '.sel-attr-equals',
        'h3[foo*="bar"]': '.sel-attr-contains',
        'h4[foo|="bar"]': '.sel-attr-contains-prefix',
        'h4[foo~="bar"]': '.sel-attr-contains-word',
        'h4[foo^="bar"]': '.sel-attr-starts-with',
        'h4[foo$="bar"]': '.sel-attr-ends-with',
        'button:disabled': '.sel-disabled',
        // 'button:hidden': '.sel-hidden', // node-as-browser needs to fix this
        // 'button:visible': '.sel-visible', // node-as-browser needs to fix this
        'a:contains("HYPER")': '.sel-elem',
        'input:checked': '.sel-checked',
        '#multiple1, #multiple2': '.sel-multiple',
        'li:has(#nested)': '.has-nested',
        
        '#pseudo_sel_not :not(div.inner, div.target) + input': '#pseudo_sel_not input',
        '#pseudo_sel_not :not(.datepicker *) > .click_tracking_target_two': false,
        '#pseudo_sel_not :not(.datepicker *) > .click_tracking_target_one': false,
        '#pseudo_sel_not :not(.container *) #pseudo_sel_not .click_tracker': false,
        '#pseudo_sel_not div:not(#pseudo_sel_not .container, #pseudo_sel_not .inner)': '#pseudo_sel_not .target, #pseudo_sel_not .datepicker',
        '#pseudo_sel_not input:not(input.foo)': '#pseudo_sel_not input.bar',
        '#pseudo_sel_not :not(.container *)': false,
        '#pseudo_sel_not :not(#pseudo_sel_not .container, #pseudo_sel_not .inner)': false,
        ':not(#pseudo_sel_not)': false
    },

    matchDom: {
        'li:odd': '.sel-odd'
    },

    unsupported: {
        'h2[foo!="bar"]': '.sel-attr-not-equals'
    },

    contextSelector: '.list-item',
    context: {
        'article': '.sel-in-context-node',
        'section article': '.sel-in-context-child',
        '#top_list': '.sel-in-context-id',
        '.top-list': '.sel-in-context-class'
    }

};



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe("utils.each", function () {
        var arr = [1, 2, 3];
        var obj = { abc: 123, def: 456 };

        describe("when given undefined", function () {
            var called = false;
            function cb () {
                called = true;
            }
            it("does not call the callback", function (expect) {
                $.utils.each(void 0, cb);
                expect(called).toBe(false);
            });
        });

        describe("when given an empty array", function () {
            var called = false;
            function cb () {
                called = true;
            }
            it("does not call the callback", function (expect) {
                $.utils.each([], cb);
                expect(called).toBe(false);
            });
        });

        describe("when given an array with length", function () {
            it("iterates the array", function (expect) {
                var actual = [],
                    expected = [
                        { ndx: 0, val: 1, col: arr },
                        { ndx: 1, val: 2, col: arr },
                        { ndx: 2, val: 3, col: arr }
                    ];
                $.utils.each(arr, function(v, k, c) {
                    actual.push({ ndx: k, val: v, col: c });
                });
                expect(actual).toEqual(expected);
            });
        });

        describe("when given an NodeList", function () {
            it("iterates the NodeList", function (expect) {
                var nl = document.querySelectorAll('body'),
                    actual = [],
                    expected = [
                        { ndx: 0, val: nl[0], col: nl }
                    ];
                $.utils.each(nl, function(v, k, c) {
                    actual.push({ ndx: k, val: v, col: c });
                });
                expect(actual).toEqual(expected);
            });
        });

        describe("when given an arguments object", function () {
            it("iterates the arguments", function (expect) {
                var each = $.utils.each;
                var actual = [];
                var expected;

                function someFn () {
                    expected = [
                        { ndx: 0, val: arguments[0], col: arguments },
                        { ndx: 1, val: arguments[1], col: arguments }
                    ];

                    each(arguments, function(v, k, c) {
                        actual.push({ ndx: k, val: v, col: c });
                    });
                }

                someFn('arg1', 'arg2');
                expect(actual).toEqual(expected);
            });
        });

        describe("when given an object", function () {
            it("iterates the object", function (expect) {
                var actual = [],
                    expected = [
                        { key: 'abc', val: 123, col: obj },
                        { key: 'def', val: 456, col: obj }
                    ];
                $.utils.each(obj, function(v, k, c) {
                    actual.push({ key: k, val: v, col: c });
                });
                expect(actual).toEqual(expected);
            });
        });

        describe("when given an object with length (jquery)", function () {
            it("iterates the object as it would an array", function (expect) {
                var jq = $('body'),
                    actual = [],
                    expected = [
                        { key: 0, val: jq.get(0), col: jq }
                    ];
                $.utils.each(jq, function(v, k, c) {
                    actual.push({ key: k, val: v, col: c });
                });
                expect(actual).toEqual(expected);
            });
        });

        describe("when an iteratee returns false", function () {
            it("drops out of the loop", function (expect) {
                var lastVal;
                $.utils.each(arr, function(v) {
                    lastVal = v;
                    return false;
                });
                expect(lastVal).toBe(1);
            });
        });
    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe("utils.extend", function () {

        describe("when given two objects", function () {

            it("combines properties from both into one object", function (expect) {
                expect($.utils.extend({ bat: 'man' }, { super: 'man' })).toEqual({ bat: 'man', super: 'man' });
            });

            it("modifies the first object directly", function (expect) {
                var obj = { bat: 'man' };
                $.utils.extend(obj, { super: 'man' });
                $.utils.extend(obj, { sand: 'man' });
                expect(obj).toEqual({ bat: 'man', super: 'man', sand: 'man' });
            });

            it("overwrites the first with the second", function (expect) {
                expect($.utils.extend({ bat: 'man' }, { bat: 'girl' })).toEqual({ bat: 'girl' });
            });

        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


describe("utils", function () {

    describe("isElement", function () {

        it("handles undefined", function (expect) {
            expect($.utils.isElement()).toBe(false);
        });

        it("returns false for non-elements", function (expect) {
            expect($.utils.isElement(window)).toBe(false);
        });

        it("returns true for elements", function (expect) {
            expect($.utils.isElement(document.getElementById('slim_shady'))).toBe(true);
        });

    });

});



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".closest", function () {

        var contextSelector = SELECTORS.contextSelector;

        describe("handles all types of selectors", function () {

            var emptyDollar = $();

            it("handles no selector", function (expect) {
                expect($(contextSelector).closest()).toEqual(emptyDollar);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as selector", function (expect) {
                    expect($(contextSelector).closest(sel)).toEqual(emptyDollar);
                });
            });

            it("handles dollar instance as selector", function (expect) {
                expect($(contextSelector).closest($('article')).get()).toEqual($('article').get());
            });

            it("handles Node as selector", function (expect) {
                expect($(contextSelector).closest(document)[0]).toEqual(document);
            });

            it("handles Element as selector", function (expect) {
                var elem = document.getElementById('top_list');
                expect($(contextSelector).closest(elem)[0]).toEqual(elem);
            });

        });

        describe("finds closest elements", function () {
            jQuery.each(SELECTORS.context, function (sel) {
                it("matches '" + sel + "' as selector", function (expect) {
                    expect($(contextSelector).closest(sel)).toMatchElements('#top_list');
                });
            });
        });

        describe("finds within context", function () {
            jQuery.each(SELECTORS.context, function (context) {
                it("within '" + context + "' as context", function (expect) {
                    expect($(contextSelector).closest('ul', context)).toMatchElements(jQuery('#top_list ul'));
                });
            });
        });

        describe("handles all types of context", function () {

            var emptyDollar = $();

            jQuery.each(SELECTORS.ignored, function (name, context) {
                it("handles " + name + " as context", function (expect) {
                    expect($(contextSelector).closest(context)).toEqual(emptyDollar);
                });
            });

            it("handles dollar instance as context", function (expect) {
                expect($(contextSelector).closest($('article')).get()).toEqual($('article').get());
            });

            it("handles Node as context", function (expect) {
                expect($(contextSelector).closest(document)[0]).toEqual(document);
            });

            it("handles Element as context", function (expect) {
                var elem = document.getElementById('top_list');
                expect($(contextSelector).closest(elem)[0]).toEqual(elem);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($(contextSelector).closest('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".each", function () {

        describe("iterates over each element in a dollar instance", function () {

            it("executes the correct number of times", function (expect) {
                var times = 0;
                $('section').each(function () { times++; });
                expect(times).toBe(3);
            });

            it("drops out when return false", function (expect) {
                var times = 0;
                $('section').each(function () { times++; return false; });
                expect(times).toBe(1);
            });

            it("passes the correct args to iteratee", function (expect) {
                var args = [];
                $('#slim_shady').each(function (elem, index) {
                    args.push(this);
                    args.push(elem);
                    args.push(index);
                });
                expect(args).toEqual([
                    document.getElementById('slim_shady'),
                    document.getElementById('slim_shady'),
                    0
                ]);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('.wonka').each(function () {}).isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".eq", function () {

        describe("handles all types of selectors", function () {

            var emptyDollar = $();

            var elem = document.getElementById('slim_shady');

            it("handles no selector", function (expect) {
                expect($('section').eq()).toEqual(emptyDollar);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as selector", function (expect) {
                    expect($('section').eq(sel)).toEqual(emptyDollar);
                });
            });

            it("handles dollar instance as selector", function (expect) {
                expect($('section').eq($('a'))).toEqual(emptyDollar);
            });

            it("handles Element as selector", function (expect) {
                expect($('section').eq(elem)).toEqual(emptyDollar);
            });

            it("handles function as selector", function (expect) {
                expect($('section').eq(function () {})).toEqual(emptyDollar);
            });

        });

        describe("returns the matched element at a given index", function () {

            it("gets a zero index", function (expect) {
                expect($('section').eq(0)).toMatchElements('#first_section');
                expect($('section').eq('0')).toMatchElements('#first_section');
            });

            it("gets a positive index", function (expect) {
                expect($('section').eq(1)).toMatchElements('#middle_section');
                expect($('section').eq('1')).toMatchElements('#middle_section');
            });

            it("gets a negative index", function (expect) {
                expect($('section').eq(-1)).toMatchElements('#last_section');
                expect($('section').eq('-1')).toMatchElements('#last_section');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('section').eq(0).isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".filter", function () {

        describe("handles all types of selectors", function () {

            var emptyDollar = $();

            it("handles no selector", function (expect) {
                expect($('*').filter()).toEqual(emptyDollar);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as selector", function (expect) {
                    expect($('*').filter(sel)).toEqual(emptyDollar);
                });
            });

            it("handles dollar instance as selector", function (expect) {
                expect($('*').filter($('a')).get()).toEqual($('a').get());
            });

            it("handles Element as selector", function (expect) {
                var elem = document.getElementById('slim_shady');
                expect($('*').filter(elem)[0]).toEqual(elem);
            });

            it("handles function as selector", function (expect) {
                var elem = document.getElementById('slim_shady');
                expect($('*').filter(function (elem, i) {
                    return elem.id === 'slim_shady';
                })).toMatchElements('#slim_shady');
            });

        });

        describe("avoids accidental matches", function () {
            jQuery.each(SELECTORS.nomatch, function (i, sel) {
                it("does not match '" + sel + "'", function (expect) {
                    expect($('*').filter(sel).length).toBe(0);
                });
            });
        });

        describe("matches our DOM", function () {
            jQuery.each(SELECTORS.matchJQuery, function (sel, match) {
                it("matches '" + sel + "'", function (expect) {
                    expect($('*').filter(sel)).toMatchElements(match);
                });
            });
        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('*').filter('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".find", function () {

        var $b = $(document.getElementsByTagName('body')[0]);

        describe("handles all types of selectors", function () {

            var emptyDollar = $();

            it("handles no selector", function (expect) {
                expect($b.find()).toEqual(emptyDollar);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as selector", function (expect) {
                    expect($b.find(sel)).toEqual(emptyDollar);
                });
            });

            it("handles dollar instance as selector", function (expect) {
                expect($b.find($('a')).get()).toEqual($('a').get());
            });

            describe('finding within parent found with string selector', function () {

                it('searches within a string parent for string child', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $(parent).find(children);
                    var jQueryFound = jQuery(parent).find(children);

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a string parent for $children', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $(parent).find($(children));
                    var jQueryFound = jQuery(parent).find(jQuery(children));

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a string parent for single node child', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $(parent).find(document.getElementsByClassName(children)[0]);
                    var jQueryFound = jQuery(parent).find(document.getElementsByClassName(children)[0]);

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a string parent for many node children', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $(parent).find(document.getElementsByClassName(children));
                    var jQueryFound = jQuery(parent).find(document.getElementsByClassName(children));

                    expect($found).toMatchElements(jQueryFound);
                });
            });

            describe('finding within a parent found with $', function () {

                it('searches within a $parent for string children', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $($(parent)).find(children);
                    var jQueryFound = jQuery(jQuery(parent)).find(children);

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a $parent for $children', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $($(parent)).find($(children));
                    var jQueryFound = jQuery(jQuery(parent)).find(jQuery(children));

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a $parent for single node child', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $($(parent)).find(document.getElementsByClassName(children)[0]);
                    var jQueryFound = jQuery(jQuery(parent)).find(document.getElementsByClassName(children)[0]);

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a $parent for multiple node children', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $($(parent)).find(document.getElementsByClassName(children));
                    var jQueryFound = jQuery(jQuery(parent)).find(document.getElementsByClassName(children));

                    expect($found).toMatchElements(jQueryFound);
                });
            });

            describe('finding within a single parent node', function () {

                it('searches within a single node parent for string children', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $(document.getElementById(parent)).find(children);
                    var jQueryFound = jQuery(document.getElementById(parent)).find(children);

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a single node parent for $children', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $(document.getElementById(parent)).find($(children));
                    var jQueryFound = jQuery(document.getElementById(parent)).find(jQuery(children));

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a single node parent for single node child', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $(document.getElementById(parent)).find(document.getElementsByClassName(children)[0]);
                    var jQueryFound = jQuery(document.getElementById(parent)).find(document.getElementsByClassName(children)[0]);

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within a single node parent for multiple node children', function (expect) {

                    var parent = '#first_section';
                    var children = '.find_me';

                    var $found = $(document.getElementById(parent)).find(document.getElementsByClassName(children));
                    var jQueryFound = jQuery(document.getElementById(parent)).find(document.getElementsByClassName(children));

                    expect($found).toMatchElements(jQueryFound);
                });
            });

            describe('finding within multiple node parents', function () {

                it('searches within multiple node parents for string children', function (expect) {

                    var parent = 'section';
                    var children = '.find_me';

                    var $found = $(document.getElementsByTagName(parent)).find(children);
                    var jQueryFound = jQuery(document.getElementsByTagName(parent)).find(children);

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within multiple node parents for $children', function (expect) {

                    var parent = 'section';
                    var children = '.find_me';

                    var $found = $(document.getElementsByTagName(parent)).find($(children));
                    var jQueryFound = jQuery(document.getElementsByTagName(parent)).find(jQuery(children));

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within multiple node parents for a single node child', function (expect) {

                    var parent = 'section';
                    var children = '.find_me';

                    var $found = $(document.getElementsByTagName(parent)).find(document.getElementsByClassName(children)[0]);
                    var jQueryFound = jQuery(document.getElementsByTagName(parent)).find(document.getElementsByClassName(children)[0]);

                    expect($found).toMatchElements(jQueryFound);
                });

                it('searches within multiple node parents for multiple node children', function (expect) {

                    var parent = 'section';
                    var children = '.find_me';

                    var $found = $(document.getElementsByTagName(parent)).find(document.getElementsByClassName(children));
                    var jQueryFound = jQuery(document.getElementsByTagName(parent)).find(document.getElementsByClassName(children));

                    expect($found).toMatchElements(jQueryFound);
                });
            });
        });

        describe("only finds children", function () {

            it("matches children", function (expect) {
                expect($('#top_list').find(SELECTORS.contextSelector)).toMatchElements('.sel-in-context-id');
            });

        });

        describe("avoids accidental matches", function () {
            jQuery.each(SELECTORS.nomatch, function (i, sel) {
                it("does not match '" + sel + "'", function (expect) {
                    expect($b.find(sel).length).toBe(0);
                });
            });
        });

        describe("matches our DOM", function () {
            jQuery.each(SELECTORS.matchJQuery, function (sel, match) {
                it("matches '" + sel + "'", function (expect) {
                    expect($b.find(sel)).toMatchElements(match);
                });
            });
        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($b.find('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".add", function () {

        it("merges results into current set", function (expect) {
            expect($('#first_section').add('#middle_section').add('#last_section')).toMatchElements('section');
        });

        it("is chainable", function (expect) {
            expect($('#first_section').add('foo').isDollar).toBe(true);
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".concat", function () {

        it("merges results into current set", function (expect) {
            var e1 = document.getElementById('middle_section');
            var e2 = document.getElementById('last_section');
            expect($('#first_section').concat([e1, e2], [e2])).toMatchElements('section');
        });

        it("is chainable", function (expect) {
            expect($('#first_section').concat([]).isDollar).toBe(true);
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".has", function () {

        var emptyDollar = $();
        var $b = $('body');

        describe("handles all types of selectors", function () {

            it("handles no selector", function (expect) {
                expect($b.has()).toEqual(emptyDollar);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as selector", function (expect) {
                    expect($b.has(sel)).toEqual(emptyDollar);
                });
            });

            it("handles Element as selector", function (expect) {
                var elem = document.getElementById('slim_shady');
                expect($b.has(elem).get()).toEqual($b.get());
            });

            it("handles function as selector", function (expect) {
                expect($b.has(function () {})).toEqual(emptyDollar);
            });

        });

        describe("avoids accidental matches", function () {
            it("body does not have '#bad'", function (expect) {
                expect($b.has('#bad')).toEqual(emptyDollar);
            });
        });

        describe("matches valid selectors", function () {
            jQuery.each(SELECTORS.matchJQuery, function (sel, match) {
                it("body has " + sel, function (expect) {
                    expect($b.has(sel).get()).toEqual($b.get());
                });
            });
        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($b.has('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".is", function () {

        describe("handles all types of selectors", function () {

            it("handles no selector", function (expect) {
                expect($('#slim_shady').is()).toBe(false);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as selector", function (expect) {
                    expect($('#slim_shady').is(sel)).toBe(false);
                });
            });

            it("handles dollar instance as selector", function (expect) {
                expect($('#slim_shady').is($('div'))).toBe(true);
            });

            it("handles Element as selector", function (expect) {
                var elem = document.getElementById('slim_shady');
                expect($('#slim_shady').is(elem)).toBe(true);
            });

            it("handles function as selector", function (expect) {
                var elem = document.getElementById('slim_shady');
                expect($('#slim_shady').is(function () {
                    return this === elem;
                })).toBe(true);
            });

        });

        describe("avoids accidental matches", function () {
            it("div is not body", function (expect) {
                expect($('#slim_shady').is('body')).toBe(false);
            });
        });

        describe("matches valid selectors", function () {
            jQuery.each(SELECTORS.matchJQuery, function (sel, match) {
                it("at least one " + match + " is " + sel, function (expect) {
                    expect($(match).is(sel)).toBe(true);
                });
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".map", function () {

        it("repopulates current set", function (expect) {
            var newSet = $('p span').map(function (el) {
                return el.parentNode;
            });
            expect(newSet.get()).toEqual(jQuery('#first_paragraph').add('span.sel-child').get());
        });

        it("is chainable", function (expect) {
            expect($('#first_section').map(function(el){ return el; }).isDollar).toBe(true);
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".not", function () {

        var contextSelector = SELECTORS.contextSelector;

        describe("handles all types of selectors", function () {

            var elem = document.getElementById('top_list');

            it("handles no selector", function (expect) {
                expect($(contextSelector).not()).toMatchElements($(contextSelector));
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as selector", function (expect) {
                    expect($(contextSelector).not(sel)).toMatchElements($(contextSelector));
                });
            });

            it("handles dollar instance as selector", function (expect) {
                expect($(contextSelector).not($('.top-list'))).toMatchElements(jQuery(contextSelector).not(jQuery('.top-list')));
            });

            it("handles Element as selector", function (expect) {
                expect($(contextSelector).not(elem)).toMatchElements(jQuery(contextSelector).not(elem));
            });

            it("handles Array of Elements as selector", function (expect) {
                expect($(contextSelector).not([elem, elem, elem])).toMatchElements(jQuery(contextSelector).not([elem, elem, elem]));
            });

            it("handles function as selector", function (expect) {
                var fnTest = function () { return this.id === 'top_list'; };
                expect($(contextSelector).not(fnTest)).toMatchElements(jQuery(contextSelector).not(fnTest));
            });

        });

        describe("avoids accidental drops", function () {
            it("should keep all elements if nothing is matched", function (expect) {
                expect($(contextSelector).get()).toEqual($(contextSelector).not('#bad').get());
            });
        });

        describe("drops valid matches", function () {
            var emptyDollar = $();
            jQuery.each(SELECTORS.matchJQuery, function (sel, match) {
                it("drops " + sel, function (expect) {
                    expect($(match).not(sel)).toEqual(emptyDollar);
                });
            });
        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($(contextSelector).not('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".after", function () {

        describe("handles all types of contents", function () {

            it("handles no content", function (expect) {
                $('.mutate').after();
                expect(jQuery('div', '#mutate').length).toBe(3);
                expect(jQuery('span', '#mutate').length).toBe(3);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as content", function (expect) {
                    $('.mutate').after(sel);
                    expect(jQuery('div', '#mutate').length).toBe(3);
                    expect(jQuery('span', '#mutate').length).toBe(3);
                });
            });

            it("handles Element as content", function (expect) {
                var elem = document.createElement('div');
                elem.className = 'newAfter';
                $('#mutate').after(elem);
                expect(jQuery('.newAfter').get()).toEqual([elem]);
            });

            it("handles dollar instance as content", function (expect) {
                $('#mutate').after($('<div class="newAfter">'));
                expect(jQuery('.newAfter').length).toBe(1);
            });

            it("handles function as content", function (expect) {
                $('.mutate').after(function () {
                    return '<div class="newAfter"></div>';
                });
                expect(jQuery('.newAfter').length).toBe(3);
            });

            it("handles Array as content", function (expect) {
                var elem = document.createElement('div');
                elem.className = 'newAfter';
                var creator = function () {
                    return '<div class="newAfter"></div>';
                };
                $('#mutate').after([elem, creator]);
                expect(jQuery('.newAfter').length).toEqual(2);
            });

        });

        describe("inserts new content after", function () {

            it("adds content after each", function (expect) {
                $('section').after('<div class="newAfter">');
                expect(jQuery('section').next()).toMatchElements('.newAfter');
            });

            it("takes multiple args", function (expect) {
                $('section').after('<div class="newAfter">', '<a class="newAfter">', '<span class="newAfter">');
                expect(jQuery('.newAfter').length).toBe(9);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('.wonka').after('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".append", function () {

        describe("handles all types of contents", function () {

            it("handles no content", function (expect) {
                $('.mutate').append();
                expect(jQuery('div', '#mutate').length).toBe(3);
                expect(jQuery('span', '#mutate').length).toBe(3);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as content", function (expect) {
                    $('.mutate').append(sel);
                    expect(jQuery('div', '#mutate').length).toBe(3);
                    expect(jQuery('span', '#mutate').length).toBe(3);
                });
            });

            it("handles HTMLString (single tag) as content", function (expect) {
                expect(jQuery('h1', '#mutate').length).toBe(0);
                $('#mutate').append('<h1></h1>');
                expect(jQuery('h1', '#mutate').length).toBe(1);
            });

            it("handles HTMLString (multi tag) as content", function (expect) {
                expect(jQuery('h1', '#mutate').length).toBe(0);
                $('#mutate').append('<div><h1></h1></div>');
                expect(jQuery('div h1', '#mutate').length).toBe(1);
            });

            it("handles Element as content", function (expect) {
                var elem = document.createElement('div');
                elem.className = 'newAppend';
                $('#mutate').append(elem);
                expect(jQuery('.newAppend').get()).toEqual([elem]);
            });

            it("handles dollar instance as content", function (expect) {
                $('#mutate').append($('<div class="newAppend">'));
                expect(jQuery('.newAppend').length).toBe(1);
            });

            it("handles function as content", function (expect) {
                $('.mutate').append(function () {
                    return '<div class="newAppend"></div>';
                });
                expect(jQuery('.newAppend').length).toBe(3);
            });

            it("handles Array as content", function (expect) {
                var elem = document.createElement('div');
                elem.className = 'newAppend';
                var creator = function () {
                    return '<div class="newAppend"></div>';
                };
                $('#mutate').after([elem, creator]);
                expect(jQuery('.newAppend').length).toEqual(2);
            });

        });

        describe("inserts new content at bottom", function () {

            it("adds content at bottom of each", function (expect) {
                $('.mutate').append('<span class="newAppend">');
                expect(jQuery('.newAppend').length).toBe(3);
                expect(jQuery('span', '#mutate').length).toBe(6);
                expect(jQuery('*', '.mutate')[1].className).toBe('newAppend');
            });

            it("takes multiple args", function (expect) {
                $('.mutate').append('<div class="newAppend">', '<a class="newAppend">', '<span class="newAppend">');
                expect(jQuery('.newAppend').length).toBe(9);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('.wonka').append('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".before", function () {

        describe("handles all types of contents", function () {

            it("handles no content", function (expect) {
                $('.mutate').before();
                expect(jQuery('div', '#mutate').length).toBe(3);
                expect(jQuery('span', '#mutate').length).toBe(3);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as content", function (expect) {
                    $('.mutate').before(sel);
                    expect(jQuery('div', '#mutate').length).toBe(3);
                    expect(jQuery('span', '#mutate').length).toBe(3);
                });
            });

            it("handles Element as content", function (expect) {
                var elem = document.createElement('div');
                elem.className = 'newBefore';
                $('#mutate').before(elem);
                expect(jQuery('.newBefore').get()).toEqual([elem]);
            });

            it("handles dollar instance as content", function (expect) {
                $('#mutate').before($('<div class="newBefore">'));
                expect(jQuery('.newBefore').length).toBe(1);
            });

            it("handles function as content", function (expect) {
                $('.mutate').before(function () {
                    return '<div class="newBefore"></div>';
                });
                expect(jQuery('.newBefore').length).toBe(3);
            });

            it("handles Array as content", function (expect) {
                var elem = document.createElement('div');
                elem.className = 'newBefore';
                var creator = function () {
                    return '<div class="newBefore"></div>';
                };
                $('#mutate').after([elem, creator]);
                expect(jQuery('.newBefore').length).toEqual(2);
            });

        });

        describe("inserts new content before", function () {

            it("adds content before each", function (expect) {
                $('section').before('<div class="newBefore">');
                expect(jQuery('section').prev()).toMatchElements('.newBefore');
            });

            it("takes multiple args", function (expect) {
                $('section').before('<div class="newBefore">', '<a class="newBefore">', '<span class="newBefore">');
                expect(jQuery('.newBefore').length).toBe(9);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('.wonka').before('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".clone", function () {

        describe("creates copies of elements", function () {

            it("clones each in collection", function (expect) {
                $('#mutate').append($('.mutate').clone());
                expect(jQuery('.mutate').length).toBe(6);
            });

            it("does not alter the element being cloned", function (expect) {
                var m = document.getElementsByClassName('mutate')[0];
                $('.mutate').clone().html('newStuff');
                expect(m.innerHTML).not.toBe('newStuff');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#mutate').clone().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".empty", function () {

        describe("empties all elements", function () {

            it("clears contents of each", function (expect) {
                $('.mutate').empty();
                var els = jQuery('.mutate').get();
                els.forEach(function(el) {
                    expect(el.innerHTML).toBe('');
                });
            });

            it("clears child nodes", function (expect) {
                $('.mutate').empty();
                var els = jQuery('.mutate').get();
                els.forEach(function(el) {
                    expect(el.childNodes.length).toBe(0);
                });
            });

            it("does not alter the element itself", function (expect) {
                var el = document.getElementById('mutate');
                $('#mutate').empty();
                expect(el).toBe(document.getElementById('mutate'));
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#mutate').empty().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".html", function () {

        describe("handles all types of contents", function () {

            it("gets current contents when no arguments", function (expect) {
                var cur = document.getElementById('mutate').innerHTML;
                expect($('#mutate').html()).toBe(cur);
            });

            it("clears current contents when passed empty string", function (expect) {
                $('#mutate').html('');
                expect(document.getElementById('mutate').innerHTML).toBe('');
            });

            it("handles function as contents", function (expect) {
                $('.mutate').html(function () {
                    return '<div class="newAppend"></div>';
                });
                expect(jQuery('.newAppend').length).toBe(3);
            });

        });

        describe("inserts new html content", function () {

            it("replaces existing content with new", function (expect) {
                $('.mutate').html('<span class="newAppend">');
                expect(jQuery('.newAppend').length).toBe(3);
                expect(jQuery('span', '#mutate').length).toBe(3);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('.wonka').html('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".prepend", function () {

        describe("handles all types of contents", function () {

            it("handles no content", function (expect) {
                $('.mutate').prepend();
                expect(jQuery('div', '#mutate').length).toBe(3);
                expect(jQuery('span', '#mutate').length).toBe(3);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as content", function (expect) {
                    $('.mutate').prepend(sel);
                    expect(jQuery('div', '#mutate').length).toBe(3);
                    expect(jQuery('span', '#mutate').length).toBe(3);
                });
            });

            it("handles HTMLString (single tag) as content", function (expect) {
                expect(jQuery('h1', '#mutate').length).toBe(0);
                $('#mutate').append('<h1></h1>');
                expect(jQuery('h1', '#mutate').length).toBe(1);
            });

            it("handles HTMLString (multi tag) as content", function (expect) {
                expect(jQuery('h1', '#mutate').length).toBe(0);
                $('#mutate').append('<div><h1></h1></div>');
                expect(jQuery('div h1', '#mutate').length).toBe(1);
            });

            it("handles Element as content", function (expect) {
                var elem = document.createElement('div');
                elem.className = 'newPrepend';
                $('#mutate').prepend(elem);
                expect(jQuery('.newPrepend').get()).toEqual([elem]);
            });

            it("handles dollar instance as content", function (expect) {
                $('#mutate').prepend($('<div class="newPrepend">'));
                expect(jQuery('.newPrepend').length).toBe(1);
            });

            it("handles function as content", function (expect) {
                $('.mutate').prepend(function () {
                    return '<div class="newPrepend"></div>';
                });
                expect(jQuery('.newPrepend').length).toBe(3);
            });

            it("handles Array as content", function (expect) {
                var elem = document.createElement('div');
                elem.className = 'newPrepend';
                var creator = function () {
                    return '<div class="newPrepend"></div>';
                };
                $('#mutate').after([elem, creator]);
                expect(jQuery('.newPrepend').length).toEqual(2);
            });

        });

        describe("inserts new content at top", function () {

            it("adds content at top of each", function (expect) {
                $('.mutate').prepend('<span class="newPrepend">');
                expect(jQuery('.newPrepend').length).toBe(3);
                expect(jQuery('span', '#mutate').length).toBe(6);
                expect(jQuery('*', '.mutate')[0].className).toBe('newPrepend');
            });

            it("takes multiple args", function (expect) {
                $('.mutate').prepend('<div class="newPrepend">', '<a class="newPrepend">', '<span class="newPrepend">');
                expect(jQuery('.newPrepend').length).toBe(9);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('.wonka').prepend('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".remove", function () {

        describe("deletes elements from the DOM", function () {

            it("removes each in collection", function (expect) {
                $('.mutate').remove();
                expect(jQuery('.mutate').length).toBe(0);
            });

            it("removes child nodes too", function (expect) {
                $('#mutate').remove();
                expect(jQuery('.mutate').length).toBe(0);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#mutate').remove().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".attr", function () {

        describe("handles all types of arguments", function () {

            it("gets attributes from the DOM", function (expect) {
                expect($('#image').attr('alt')).toBe('fakeroo');
            });

            it("sets attributes within dollar", function (expect) {
                $('#image').attr('flash', 'thunder');
                expect($('#image').attr('flash')).toBe('thunder');
            });

            it("returns undefined when no attribute is set", function (expect) {
                expect($('#image').attr('yomomma')).toBe(void 0);
            });

            it("handles function as attribute", function (expect) {
                $('#image').attr('alt', function (oldVal, i) {
                    return 'now' + i + oldVal;
                });
                expect($('#image').attr('alt')).toBe('now0fakeroo');
            });

            it("fails gracefully when there are no matches", function (expect) {
                expect($('bad').attr('irrelevant')).toBe(void 0);
            });

            it('isnt vulnerable to jQuery 3.0.0 infinite loop on mixedCase attr getting bug', function (expect) {
                // https://nvd.nist.gov/vuln/detail/CVE-2016-10707
                expect($('<div></div>').attr('requiRed')).toBe(undefined);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function (expect) {
                expect($('#image').attr('foo','bar').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".data", function () {

        describe("gets element data", function () {

            it("DOM element has a dollar-node-id but DATA_CACHE_PUBLIC is undefined", function (expect) {
                // This happens when DATA_CACHE_PRIVATE has been used already
                expect($('#data_baby').data('howSlobbery')).toBe('to the bib');
            });

            it("pre-existing data from the DOM", function (expect) {
                expect($('#data_daddy').data('howBad')).toBe('to the bone');
            });

            it("set by dollar", function (expect) {
                $('#data_daddy').data('rides', ['harley','tbird']);
                expect($('#data_daddy').data('rides')).toEqual(['harley','tbird']);
            });

            it("all data at once", function (expect) {
                $('#data_daddy').data('rides', ['harley','tbird']);
                expect($('#data_daddy').data()).toEqual({
                    howBad: 'to the bone',
                    rides: ['harley','tbird']
                });
            });

            it("returns undefined when no data is set", function (expect) {
                expect($('#data_daddy').data('yomomma')).toBe(void 0);
            });

            it('returns falsy data', function (expect) {
                $('#data_daddy').data('foo', 0);
                expect($('#data_daddy').data('foo')).toBe(0);
            });

        });

        describe("sets element data", function () {

            it("one key at a time", function (expect) {
                $('#data_daddy span').data('coolCat', true);
                expect($('#data_daddy span').data()).toEqual({ coolCat: true });
            });

            it("many at a time", function (expect) {
                $('#data_daddy span').data({
                    face: 'scruff',
                    voice: 'gruff'
                });
                expect($('#data_daddy span').data()).toEqual({
                    face: 'scruff',
                    voice: 'gruff'
                });
            });

            it("with complex data types", function (expect) {
                $('#data_daddy').data('fn', function () {});
                expect(typeof $('#data_daddy').data('fn')).toBe('function');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function (expect) {
                expect($('#data_daddy').data('foo','bar').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".prop", function () {

        describe("handles all types of arguments", function () {

            it("gets a property when it exists", function (expect) {
                // pre-existing
                expect($('#cbox').prop('disabled')).toBe(true);
                // set by dollar
                $('#cbox').prop('checked', true);
                expect($('#cbox').prop('checked')).toBe(true);
            });

            it("returns undefined when no property is set", function (expect) {
                expect($('#cbox').prop('yomomma')).toBe(void 0);
            });

            it("handles function as property", function (expect) {
                $('#cbox').prop('value', function (oldVal, i) {
                    return 'now' + i + oldVal;
                });
                expect($('#cbox').prop('value')).toBe('now0onoff');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function (expect) {
                expect($('#cbox').prop('foo','bar').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".removeAttr", function () {

        describe("removes one attribute", function () {

            it("removes the specified attribute", function (expect) {
                $('#image').removeAttr('alt');
                expect($('#image').attr('alt')).toBe(void 0);
            });

            it("does not affect other attributes", function (expect) {
                $('#image').removeAttr('alt');
                expect($('#image').attr('title')).not.toBe(void 0);
            });

            it("handles when an attribute does not exist", function (expect) {
                expect($('#image').attr('nonsense')).toBe(void 0);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#image').removeAttr('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".removeData", function () {

        describe("remove element data", function () {

            it("pre-existing data from the DOM", function (expect) {
                $('#data_daddy').removeData('howBad');
                expect($('#data_daddy').data()).toEqual({});
            });

            it("set by dollar", function (expect) {
                $('#data_daddy').data('rides', ['harley','tbird']);
                $('#data_daddy').removeData('rides');
                expect($('#data_daddy').data('rides')).toBe(void 0);
            });

            it("all data at once", function (expect) {
                $('#data_daddy span').data('face', 'scruff');
                $('#data_daddy span').data('voice', 'gruff');
                $('#data_daddy span').removeData();
                expect($('#data_daddy span').data()).toEqual({});
            });

            it("does not remove the wrong data", function (expect) {
                $('#data_daddy').data('sick', 'shades');
                $('#data_daddy').removeData('yomomma');
                expect($('#data_daddy').data()).toEqual({
                    howBad: 'to the bone',
                    sick: 'shades'
                });
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function (expect) {
                expect($('#data_daddy').removeData('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".removeProp", function () {

        describe("removes one property", function () {

            it("removes the specified property", function (expect) {
                $('#cbox').prop('flash', 'thunder').removeProp('flash');
                expect($('#cbox').prop('flash')).toBe(void 0);
            });

            it("does not affect other properties", function (expect) {
                $('#cbox').removeProp('flash');
                expect($('#cbox').prop('value')).not.toBe(void 0);
            });

            it("handles when an property does not exist", function (expect) {
                $('#cbox').prop('flash', 'thunder');
                expect($('#cbox').prop('nonsense')).toBe(void 0);
                expect($('#cbox').prop('flash')).toBe('thunder');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#cbox').removeProp('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".text", function () {

        describe("handles all types of arguments", function () {

            it("returns text when no args provided", function (expect) {
                // for one element
                expect($('.sel-hidden').text()).toBe('Can You See Me?');
                // combined across child nodes
                expect($('#mutate').text()).toBe(jQuery('#mutate').text());
            });

            it("sets text", function (expect) {
                $('#slim_shady').text('please stand up');
                expect(document.getElementById('slim_shady').innerHTML).toBe('please stand up');
            });

            it("handles function as insertion", function (expect) {
                $('.sel-hidden').text(function (oldVal, i) {
                    return 'now' + i + oldVal;
                });
                expect($('.sel-hidden').text()).toBe('now0Can You See Me?');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function (expect) {
                expect($('.wonka').text('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".val", function () {

        describe("handles all types of arguments", function () {

            it("returns value when no args provided", function (expect) {
                // for one element
                expect($('#tbox').val()).toBe('momma');
                // returns the first of many
                expect($('input', '#readwrite').val()).toBe('onoff');

                expect($().val()).toBe(jQuery().val());
            });

            it("sets values", function (expect) {
                $('#tbox').val('poppa');
                expect(document.getElementById('tbox').value).toBe('poppa');
            });

            it("handles function as insertion", function (expect) {
                $('#tbox').val(function (oldVal, i) {
                    return 'now' + i + oldVal;
                });
                expect(document.getElementById('tbox').value).toBe('now0momma');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function (expect) {
                expect($('.wonka').val('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".addClass", function () {

        describe("adds the specified classes", function () {

            it("does not alter existing class names", function (expect) {
                $('.styles').addClass();
                $('.styles').each(function (el, i) {
                    expect(el.className).toBe('styles preexisting' + i);
                });
            });

            it("adds classes when passed a String", function (expect) {
                $('.styles').addClass('one two three');
                $('.styles').each(function (el, i) {
                    expect(el.className).toBe('styles preexisting' + i + ' one two three');
                });
            });

            it("adds classes when passed a function", function (expect) {
                $('.styles').addClass(function (oldVal, i) {
                    return 'now' + i + oldVal;
                });
                $('.styles').each(function (el, i) {
                    expect(el.className).toBe('styles preexisting' + i + ' now' + i + 'styles');
                });
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function (expect) {
                expect($('.styles').addClass('foo').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".css", function () {

        describe("handles all types of arguments", function () {

            it("gets style properties", function (expect) {
                expect($('.styles').css('backgroundColor')).toBe('rgb(34, 34, 34)');
            });

            it("sets one property", function (expect) {
                $('.styles').css('fontSize', '22px');
                expect($('.styles').css('fontSize')).toBe('22px');
            });

            it("sets multiple properties", function (expect) {
                $('.styles').css({
                    fontSize: '22px',
                    borderRadius: '5px'
                });
                expect($('.styles').css('fontSize')).toBe('22px');
                expect($('.styles').css('borderRadius')).toBe('5px');
            });

            it("returns empty string or default value when no property is set", function (expect) {
                var unstyled = $('.styles').css('border');
                expect(unstyled === '' || unstyled === '0px none rgb(0, 0, 0)').toBe(true);
            });

            it("handles function as a value", function (expect) {
                $('.styles').css('padding', function (oldVal, i) {
                    return (parseInt(oldVal) + i + 1) + 'px';
                });
                expect($('.styles').css('padding')).toBe('34px');
            });

            it('gracefully noOps on getting css from empty dollar collections', function(expect) {

                var errThrownOnGet = false;
                try {
                    $().css('display');
                } catch (e) {
                    errThrownOnGet = true;
                }
                expect(errThrownOnGet).toBe(false);
            });

            it('gracefully noOps on setting css on empty dollar collections', function(expect) {

                var errThrownOnSet = false;
                try {
                    $().css('display', 'block');
                } catch (e) {
                    errThrownOnSet = true;
                }
                expect(errThrownOnSet).toBe(false);
            });
        });

        describe("is chainable", function () {
            it("returns dollar instance (when setting)", function (expect) {
                expect($('.styles').css('foo','bar').isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".hasClass", function () {

        describe("finds the specified classes", function () {

            it("does not alter existing class names", function (expect) {
                $('.styles').hasClass();
                $('.styles').each(function (el, i) {
                    expect(el.className).toBe('styles preexisting' + i);
                });
            });

            it("returns true when styles have been added", function (expect) {
                $('.styles').addClass('one two three');
                expect($('.styles').hasClass('two')).toBe(true);
            });

            it("returns false when no match is found", function (expect) {
                expect($('.styles').hasClass('two')).toBe(false);
            });

            it("avoids partial matches", function (expect) {
                $('.styles').addClass('one twothree');
                expect($('.styles').hasClass('two')).toBe(false);
            });

        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".height", function () {

        describe("returns the computed height of the first matched element", function () {

            it("returns the correct numerical height without units", function (expect) {
                jQuery('.mutate').css({ height: '222px' });
                expect($('.mutate').height()).toBe(222);
            });

        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".hide", function () {

        function isHidden(el) {
            return window.getComputedStyle(el).display === 'none';
        }

        describe("hides all elements in collection", function () {

            it("adds the correct styling", function (expect) {
                $('.styles').each(function (el, i) {
                    expect(isHidden(el)).toBe(false);
                });
                $('.styles').hide();
                $('.styles').each(function (el, i) {
                    expect(isHidden(el)).toBe(true);
                });
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('.styles').hide().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".removeClass", function () {

        describe("removes the specified classes", function () {

            it("removes all classes when no value is passed", function (expect) {
                $('.styles').removeClass();
                $('.styles').each(function (el, i) {
                    expect(el.className).toBe('');
                });
            });

            it("removes classes when String is passed", function (expect) {
                $('.styles').addClass('one two three');
                $('.styles').removeClass('two');
                $('.styles').each(function (el, i) {
                    expect(el.className).not.toBe('');
                    expect(el.className.indexOf(' two ')).toBe(-1);
                });
            });

            it("removes classes when Array is passed", function (expect) {
                $('.styles').addClass('one two three four');
                $('.styles').removeClass(['two','three']);
                $('.styles').each(function (el, i) {
                    expect(el.className).not.toBe('');
                    expect(el.className.indexOf(' two ')).toBe(-1);
                    expect(el.className.indexOf(' three ')).toBe(-1);
                });
            });

            it("removes classes when Function is passed", function (expect) {
                $('.styles').addClass('one two three');
                $('.styles').removeClass(function (old, i) {
                    return 'preexisting' + i;
                });
                $('.styles').each(function (el, i) {
                    expect(el.className).toBe('styles one two three');
                });
            });

            it("avoids partial matches", function (expect) {
                $('.styles').addClass('one twothree');
                $('.styles').removeClass('two');
                $('.styles').each(function (el, i) {
                    expect(el.className.indexOf('one twothree')).not.toBe(-1);
                });
            });

        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".show", function () {

        function isHidden(el) {
            return window.getComputedStyle(el).display === 'none';
        }

        describe("shows all elements in collection", function () {

            it("adds the correct styling", function (expect) {
                $('.sel-hidden').each(function (el, i) {
                    expect(isHidden(el)).toBe(true);
                });
                $('.sel-hidden').show();
                $('.sel-hidden').each(function (el, i) {
                    expect(isHidden(el)).toBe(false);
                });
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('.styles').show().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".width", function () {

        describe("returns the computed width of the first matched element", function () {

            it("returns the correct numerical width without units", function (expect) {
                jQuery('.mutate').css({ width: '333px' });
                expect($('.mutate').width()).toBe(333);
            });

        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".children", function () {

        describe("finds child nodes of the matched elements", function () {

            it("finds them all", function (expect) {
                expect($('#mutate').children()).toMatchElements('.mutate');
            });

            it("filters them by selector", function (expect) {
                expect($('#first_section').children('article')).toMatchElements('#top_list');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').children().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".first", function () {

        describe("reduce to the first element in the collection", function () {

            it("there can be only one", function (expect) {
                expect($('section').first()).toMatchElements('#first_section');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').first().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".last", function () {

        describe("reduce to the last element in the collection", function () {

            it("there can be only one", function (expect) {
                expect($('section').last()).toMatchElements('#last_section');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').last().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".next", function () {

        var emptyDollar = $();

        describe("find the next sibling in the DOM", function () {

            it("gets the next node", function (expect) {
                expect($('#first_section').next()).toMatchElements('#middle_section');
                expect($('#first_section').next().next()).toMatchElements('#last_section');
            });

            it("empties when it runs out of siblings", function (expect) {
                expect($('.mutate').next().next().next()).toEqual(emptyDollar);
            });

            it("filters by selector", function (expect) {
                expect($('#first_section').next()).toMatchElements('#middle_section');
                expect($('#first_section').next('.bad')).toEqual(emptyDollar);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').next().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".parent", function () {

        var emptyDollar = $();

        describe("find the parent of each matched element", function () {

            it("gets the parent node", function (expect) {
                var $p = $('.sel-descendant').parent();
                expect($p[0].nodeName).toBe('P');
                expect($p[1].className).toBe('sel-descendant sel-child');
            });

            it("empties when it runs out of siblings", function (expect) {
                expect($('body').parent().parent().parent()).toEqual(emptyDollar);
            });

            it("filters by selector", function (expect) {
                expect($('.list-item').parent('#top_list')).toMatchElements('#top_list');
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').parent().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".siblings", function () {

        describe("finds sibling nodes of the matched elements", function () {

            it("finds them all", function (expect) {
                expect($('h2').siblings().length).toBe(jQuery('#headings').children().length);
            });

            it("filters them by selector", function (expect) {
                expect($('h2').siblings('h3')).toMatchElements(jQuery('h3', '#headings'));
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').siblings().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".off", function () {

        describe("removes an event listener", function () {

            it("clears all previously-bound event listeners", function (expect) {
                var clicked = false;
                $('#slim_shady').click(function () {
                    clicked = true;
                });
                $('#slim_shady').off('click');
                $('#slim_shady').click();
                expect(clicked).toBe(false);
            });

            it("clears one previously-bound event listener", function (expect) {
                var clicked1 = false;
                var clicked2 = false;

                function clickOne () {
                    clicked1 = true;
                }

                function clickTwo () {
                    clicked2 = true;
                }

                $('#slim_shady').on('click', clickOne);
                $('#slim_shady').on('click', clickTwo);

                $('#slim_shady').off('click', clickOne);

                $('#slim_shady').click();
                expect(clicked1).toBe(false);
                expect(clicked2).toBe(true);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').off('foo', function () {}).isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".on", function () {

        describe("binds a native event listener", function () {

            it("hears when a native event is triggered", function (expect) {
                var clicked = false;
                $('#slim_shady').on('click', function (e) {
                    if (e.target.id === 'slim_shady') {
                        clicked = true;
                    }
                });
                $('#slim_shady').click();
                expect(clicked).toBe(true);
            });

        });

        describe("binds a custom event listener", function () {

            it("hears when a custom event is triggered", function (expect) {
                var clicked = false;
                $('#slim_shady').on('goTime', function (e) {
                    if (e.target.id === 'slim_shady') {
                        clicked = true;
                    }
                });
                $('#slim_shady').trigger('goTime');
                expect(clicked).toBe(true);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').on('foo', function () {}).isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe(".trigger", function () {

        describe("firing an event", function () {

            it("triggers native events", function (expect) {
                $('.trigger').click();
                expect(document.getElementById('cbox01').checked).toBe(true);
                expect(document.getElementById('cbox02').checked).toBe(true);
            });

            it("triggers a previously-bound event listener for a native event name", function (expect) {
                var clicked = 0;
                $('#slim_shady').on('click', function () {
                    clicked++;
                });
                $('#slim_shady').trigger('click');
                $('#slim_shady').trigger('click');
                expect(clicked).toBe(2);
            });

            it("triggers a previously-bound event listener for a custom event name", function (expect) {
                var clicked = 0;
                $('#slim_shady').on('goTime', function () {
                    clicked++;
                });
                $('#slim_shady').trigger('goTime');
                $('#slim_shady').trigger('goTime');
                expect(clicked).toBe(2);
            });

            it("passes arguments to the handler", function (expect) {
                var foundArgs = false;
                $('#slim_shady').on('goTime', function (e) {
                    if (e.detail[0] === 'arg1' && e.detail[0] === 'arg1') {
                        foundArgs = true;
                    }
                });
                $('#slim_shady').trigger('goTime', 'arg1', 'arg2');
                expect(foundArgs).toBe(true);
            });

            it("can trigger multiple space-separated events", function (expect) {
                var clicked = 0;
                $('#slim_shady').on('one two three', function () {
                    clicked++;
                });
                $('#slim_shady').trigger('one two three');
                expect(clicked).toBe(3);
            });

        });

        describe("is chainable", function () {
            it("returns dollar instance", function (expect) {
                expect($('#slim_shady').trigger().isDollar).toBe(true);
            });
        });

    });

})();



/***/},{}],
/***/[function (require, module, exports) {


(function () {

    describe("$DOLLAR", function () {

        describe("handles all types of selectors", function () {

            var emptyDollar = $();

            it("handles no selector (ignored)", function (expect) {
                expect(emptyDollar.length).toBe(0);
                expect(emptyDollar.get()).toEqual([]);
            });

            jQuery.each(SELECTORS.ignored, function (name, sel) {
                it("handles " + name + " as selector (ignored)", function (expect) {
                    expect($(sel)).toEqual(emptyDollar);
                });
            });

            it("handles dollar instance as selector", function (expect) {
                expect($($('a'))).toEqual($('a'));
            });

            it("handles HTMLString as selector (creates nodes)", function (expect) {
                // jQuery includes linebreaks as text nodes when passing HTMLStrings
                // not sure if we want to do this. kind of seems unnecessary? especially
                // since textNodes can't be jQueried...

                var created = $('<div class="created"><p></p></div>')[0];
                expect(created.nodeName).toEqual('DIV');
                expect(created.className).toEqual('created');
                expect(created.childNodes[0].nodeName).toEqual('P');
            });

            it("handles Window as selector", function (expect) {
                expect($(window)[0]).toEqual(window);
            });

            it("handles Node as selector", function (expect) {
                expect($(document)[0]).toEqual(document);
            });

            it("handles NodeList as selector", function (expect) {
                expect($(document.body.childNodes)[0]).toEqual(document.body.childNodes[0]);
            });

            it("handles Element as selector", function (expect) {
                var elem = document.getElementById('slim_shady');
                expect($(elem)[0]).toEqual(elem);
            });

            it("handles Array of Elements as selector", function (expect) {
                var elem = document.getElementById('slim_shady');
                expect($([elem, elem, elem])[0]).toEqual(elem);
            });

            it("handles function as selector (invokes when documentReady)", function (expect, done) {
                $(function () {
                    expect(true).toBe(true);
                    done();
                });
            });

            it('always returns an instance of Dollar', function (expect) {

                jQuery.each(SELECTORS.ignored, function (name, sel) {
                    it('returns an instance of $dollar', function (expect) {
                        expect($(sel).isDollar).toBe(true);
                    });
                });
                jQuery.each(SELECTORS.nomatch, function (i, sel) {
                    it('returns an instance of $dollar', function (expect) {
                        expect($(sel).isDollar).toBe(true);
                    });
                });
                jQuery.each(SELECTORS.matchJQueryAndDom, function (sel) {
                    it('returns an instance of $dollar', function (expect) {
                        expect($(sel).isDollar).toBe(true);
                    });
                });
                jQuery.each(SELECTORS.matchDom, function (sel) {
                    it('returns an instance of $dollar', function (expect) {
                        expect($(sel).isDollar).toBe(true);
                    });
                });
            });
        });

        describe("avoids accidental matches", function () {
            jQuery.each(SELECTORS.nomatch, function (i, sel) {
                it("does not match '" + sel + "'", function (expect) {
                    expect($(sel).length).toBe(0);
                });
            });
        });

        describe("mimics jQuery", function () {
            jQuery.each(SELECTORS.matchJQueryAndDom, function (sel) {
                it("matches '" + sel + "'", function (expect) {
                    expect($(sel)).toMatchElements(jQuery(sel));
                });
            });
        });

        describe("matches our DOM", function () {
            jQuery.each(SELECTORS.matchJQueryAndDom, function (sel, match) {
                if (sel && match) {
                    it("matches '" + sel + "'", function (expect) {
                        expect($(sel)).toMatchElements(match);
                    });
                }
            });
            jQuery.each(SELECTORS.matchDom, function (sel, match) {
                it("matches '" + sel + "'", function (expect) {
                    expect($(sel)).toMatchElements(match);
                });
            });
        });

        describe("matches within context", function () {

            var contextSelector = SELECTORS.contextSelector;

            jQuery.each(SELECTORS.context, function (context, match) {
                it("within '" + context + "'", function (expect) {
                    expect($(contextSelector, context)).toMatchElements(match);
                });
            });

            it("within window", function (expect) {
                expect($(contextSelector, window)).toMatchElements(contextSelector);
            });

            it("within document", function (expect) {
                expect($(contextSelector, document)).toMatchElements(contextSelector);
            });

            it("within an Element", function (expect) {
                var elem = document.getElementById('top_list');
                expect($(contextSelector, elem)).toMatchElements(jQuery(contextSelector, elem));
            });

            it("within an Array", function (expect) {
                expect($(contextSelector, [1,2,3])).toMatchElements($(contextSelector));
                expect($(contextSelector, $('section').get())).toMatchElements(jQuery(contextSelector, jQuery('section').get()));
            });

            it("within an Object", function (expect) {
                expect($(contextSelector, { abc: 123 })).toMatchElements($(contextSelector));
            });

            it("within a dollar instance", function (expect) {
                expect($(contextSelector, $('section'))).toMatchElements(jQuery(contextSelector, jQuery('section')));
            });

            it('within an empty dollar instance', function(expect) {
                expect($(contextSelector, $())).toMatchElements(jQuery(contextSelector, jQuery()));
            });

        });

        describe("has a length property", function () {

            it("with zero items", function (expect) {
                expect($().length).toBe(0);
            });

            it("with one item", function (expect) {
                expect($('#slim_shady').length).toBe(1);
            });

            it("with many items", function (expect) {
                expect($('p').length > 1).toBe(true);
            });

        });

        describe("has forEach method", function () {

            it("iterates over the set", function (expect) {
                var times = 0;
                $('section').each(function () { times++; });
                expect(times).toBe(3);
            });

        });

        describe("can get using array notation", function () {

            it("return one item", function (expect) {
                expect($('p')[2].nodeName).toBe('P');
            });

        });

        describe("can get using .get()", function () {

            it("return one item", function (expect) {
                expect($('p').get(2).nodeName).toBe('P');
            });

            it("return all items", function (expect) {
                var all = $('p').get();
                expect(Array.isArray(all)).toBe(true);
                expect(all.length).not.toBe(0);
            });

        });

    });

})();



/***/},{}]
/**/]);
function require(modules, as) {
    var cache = {};
    var mocks = {};

    function __require_lookup (id) {
        function __require_in_module (relpath) {
            var packedId = modules[id][1][relpath];
            if (!packedId) throw 'Missing ' + relpath;
            return mocks[packedId] || __require_lookup(packedId);
        }

        __require_in_module.as = as;

        function _bundl_mock (relpath, mock) {
            var packedId = modules[id][1][relpath];
            mocks[packedId] = mock;
        }

        _bundl_mock.stopAll = function () {
            cache = {};
            mocks = {};
        };

        __require_in_module.cache = {
            mock: _bundl_mock,
            clear: function () {
                cache = {};
            }
        };
        
        if(!cache[id]) {
            var m = cache[id] = {exports:{}};
            modules[id][0].call(m.exports, __require_in_module, m, m.exports, modules);
        }

        return cache[id] ? cache[id].exports : {};
    }

    __require_lookup(0);
}
})(typeof global !== "undefined" ? global : window, window, document, 
// This shim is included because the `process` global is used in your bundle
{
    argv: [],
    browser: true,
    cwd: function(){ return '/'; },
    env: {},
    exit: function (code) {
        if (typeof process === 'object' && typeof process.exit === 'function') {
            process.exit(code);
        } else {
            throw new Error('process.exit ' + code);
        }
    },
    nextTick: function () {
        var args = [].slice.call(arguments);
        var callback = args.shift();
        setTimeout(function(){ callback.apply(null, args); }, 0);
    },
    version: '',
    versions: {}
});
