/**
 * IntentMedia's custom jQuery replacement
 * @class $
 */

;(function(){
/*
 * Basic $ components
 * @module $
 */

var $ = function (selector, context) {
    return new $.fn.init(selector, context);
};

$.fn = $.prototype = {
    constructor: $,

    selector: '',

    length: 0,

    splice: Array.prototype.splice,

    isDollar: true,

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function (num) {

        var res = [];

        return (num || num === 0) ?

            // Return just the one element from the set
            (num < 0 ? this[num + this.length] : this[num]) :

            // Return all the elements in a clean array
            Array.prototype.push.apply(res, this), res;
            // https://jsperf.com/appending-to-an-array-push-apply-vs-loop/14
            // slice.call is much slower than push.apply for DOM elements
    }
};

// Ops/sec  ~ 6/13/15
// selector - dollar   -   jQuery
// id         1,318,890    1,493,964
// tag        316,465      234,686
// class      344,837      242,628
// pseudo     21,448       23,246

// http://jsperf.com/intent-media-dollarjs-vs-jquery-init
var init = $.fn.init = function (selector, context) {

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if (!selector) {
        return this;
    }

    context = context || document;

    // HANDLE: strings
    if (typeof selector === 'string') {

        this.selector = selector;
        this.context = context;
        return merge(this, $.fn.findBySelector(selector, context));

    // HANDLE: $(DOM Element)
    } else if (selector.nodeType) {

        this.context = this[0] = selector;
        this.length = 1;
        return this;

    // HANDLE: dollar instance
    } else if (selector.isDollar) {

        this.selector = selector.selector;
        this.context = selector.context;
        return merge(this, selector.get());

    // HANDLE: dom ready
    } else if (typeof selector === 'function') {
        if (document.readyState === 'complete') {
            setTimeout(domReady);
        } else {
            $.fn.on.call(document, 'DOMContentLoaded', domReady);
        }
    }

    function domReady () {
        if ($.domReadyFnInvoked) {
            return;
        }

        $.domReadyFnInvoked = true;
        selector($);
    }
};

// Ops/sec  ~ 6/13/15
// selector - dollar   -   Sizzle
// id         3,773k       984k
// tag        487k         447k
// class      484k         423k
// complex    56k          50k
$.fn.findBySelector = function (selector, context) {

    // get selector as string
    selector = selector.isDollar ? selector.selector : selector;

    // exit early for improper selectors
    if (!selector || typeof selector !== 'string') {
        return [];
    }

    // normalize context to node or document
    context = context || (this.isDollar && this[0]) || (this.nodeType && this) || document;

    // exit early for improper context
    if (context.nodeType !== 1 && context.nodeType !== 9) {
        return [];
    }

    var push = Array.prototype.push,
        results = [];

    var selectorsMap = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/.exec(selector);
    // selectorsMap will return:
    // if id => ['#foo', 'foo', undefined, undefined]
    // node  => ['body', undefined, body, undefined']
    // class => ['.bar', undefined, undefined, 'bar']
    // else  => null

    if (selectorsMap) {

        // HANDLE: $('#id')
        if (selector = selectorsMap[1]) {
            var result = document.getElementById(selector);
            if (context !== result && context.contains(result)) {
                results.push(result);
            }

        // HANDLE: $('tag')
        } else if (selector = selectorsMap[2]) {
            push.apply(results, context.getElementsByTagName(selector));

        // HANDLE: $('.class')
        } else if (selector = selectorsMap[3]) {
            // push.apply(results, context.getElementsByClassName(selector));

            // ie8 polyfill
            push.apply(results, polyfillGetClass(context, selector));
        }

    // HANDLE: pseudo-selectors, chained classes, etc.
    } else {
        push.apply(results, context.querySelectorAll(selector));
    }

    // HANDLE: $('#id') returns null
    return results[0] ? results : [];

    function polyfillGetClass (con, sel) { // wtf IE, this is so hacky
        return con.getElementsByClassName ?
            con.getElementsByClassName(sel) :
            con.querySelectorAll('.' + sel);
    }
};

$.fn.matchesSelector = function (selector) {

    // get element
    var node = this.isDollar ? this[0] : this;

    // take only DOM nodes,
    // reject doc.frags, text, document, etc.
    if (node.nodeType !== 1) {
        return false;
    }

    // stringify selector
    if (selector.isDollar) {
        selector = selector.selector;
    }

    // normalise browser nonsense
    var matches = node.matches || node.webkitMatchesSelector || node.mozMatchesSelector || node.msMatchesSelector;

    // return matches.call(node, selector);

    // IE8 polyfill
    return matches ?
        matches.call(node, selector) :
        polyfillMatches(selector);

    function polyfillMatches (sel) {
        var allMatches = document.querySelectorAll(sel);
        return Array.prototype.indexOf.call(allMatches, node) > -1;
    }
};

function merge (first, second) {
    var len = +second.length,
        j = 0,
        i = first.length;

    for (; j < len; j++) {
        first[i++] = second[j];
    }

    first.length = i;

    return first;
};

function unique (jumbled) {

    var jumbled = jumbled,
        iterable = Object(jumbled),
        distinct = [];

    if (!iterable.length) {
        return jumbled;
    }

    for (var i = 0, len = iterable.length; i < len; i++) {
        if (distinct.indexOf(iterable[i]) === -1) {
            distinct.push(iterable[i]);
        }
    }

    return distinct;
};


// Give the init function the $ prototype for later instantiation
init.prototype = $.fn;

/*
 * Submodules to add...
 *
 * CORE
 * - init(), [], .length, get(), DOMContentLoaded handler
 * - events = .on() / .bind(), .off() / .unbind()
 * - selectors = .find(), .closest()
 * - filters = .filter(), unique(), .each()
 *
 * FILTERS
 * - .is(), .not(), .has()
 * - .add()
 *
 * DOM
 * - traversal = .has(), .parent(), .children(), .siblings(), .first(), .last(), .next()
 * - reading = .val(), .text(), .attr(), .prop()
 *
 * Styles
 * - .css()
 * - .hasClass()
 * - .addClass(), .removeClass()
 * - .show(), .hide()
 *
 * Data
 * - .data(), .removeData()
 *
 * Triggers
 * - .focus(), .blur(), .change(), .click(), .resize(), .trigger()
 *
 * Mutation
 * - .empty(), .remove()
 * - .append(), after(), .html(), .prepend(), before()
 *
 * Animation
 * (use css transform if possible)
 *
 */

/////////////////////////////////////

/* BASE
 * - selectors = .find(), .closest()
 * - filters = .filter(), .unique(), .eq()
 * - events = .on()
 */
$.fn.on = $.fn.bind = function (types, handler) {

    if (!types || typeof handler !== 'function') {
        return this;
    }

    // normalize context to [element]
    // separate events
    var context = this.isDollar ? this.get() : this.length ? this : [this],
        events = types.split(' ');

    for (var i = 0, len = context.length; i < len; i++) {
        for (var j = 0, eventLen = events.length; j < eventLen; j++) {
            addEventListener(context[i], events[j], handler);
        }
    }

    return this;

    function addEventListener (context, event, callback) {
        if (Element.prototype.addEventListener) {
            context.addEventListener(event, callback, false);
        } else {
            // IE8 Polyfill
            if (event === 'DOMContentLoaded') {
                var event = new Event();
                event.srcElement = window;
                addEventPolyfillWrapper(event);
            } else {
                context.attachEvent('on' + event, callback);
            }
        }

        function addEventPolyfillWrapper (e) {
            e.target = e.srcElement;
            e.currentTarget = context;
            if (callback.handleEvent) {
                callback.handleEvent(e);
            } else {
                // FIXIT: wat is var listener?
                // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
                
                // listener.call(context, e);
            }
        }
    }
};

$.fn.off = $.fn.unbind = function (types, handler) {

    if (!types || typeof handler !== 'function') {
        return this;
    }

    // normalize context to [element]
    // separate events
    var context = this.isDollar ? this.get() : this.length ? this : [this],
        events = types.split(' ');

    for (var i = 0, len = context.length; i < len; i++) {
        for (var j = 0, eventLen = events.length; j < eventLen; j++) {
            removeEventListener(context[i], events[j], handler);
        }
    }

    return this;

    function removeEventListener(context, event, callback) {
        if (Element.prototype.removeEventListener) {
            context.removeEventListener(event, callback, false);
        } else {
            // The person who wrote this polyfill was on meth:
            // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
            
            // TODO: write a human readable polyfill for IE8
            console.error('IE8 polyfill at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener')
        }
    }
};

// Ops/sec  ~  6/13/15
// dollar   -   jQuery
// 116,602      48,145
$.fn.find = function (selector) {

    if (!selector || !this.length) {
        return merge($(), []);
    }

    var matches = [];

    // normalize selector to string or node
    // selector = selector.isDollar ? selector.selector : selector;

    if (this.length > 1) {
        var allMatches = $(selector);

        var i = 0,
            collectionLen = this.length;

        var j = 0,
            targetLen = allMatches.length;

        for (; i < collectionLen; i++) {
            for (; j < targetLen; j++) {
                if (this[i] !== allMatches[j] && this[i].contains(allMatches[j])) {
                    matches.push(allMatches[j]);
                }
            }
        }
    } else {
        if (isDomNode(selector)) {
            if (this[0] !== selector && this[0].contains(selector)) {
                matches.push(selector);
            }
        } else {
            matches = $.fn.findBySelector.call(this, selector);
        }
    }

    return merge($(), matches.length > 1 ? unique(matches) : matches);
};

function isDomNode(node) {
    return node.nodeType === 1 || node.nodeType === 9;
}

// Ops/sec  ~  6/13/15
// dollar   -   jQuery
// 205,279      81,851
$.fn.closest = function (selector, context) {

    if (!selector) {
        return merge($(), []);
    }

    var matches = [];
    // if is dollar or node, re-wrap the selector in the context
    var foundBySelector = (selector.isDollar || selector.nodeType) && $(selector, context);

    for (var i = 0, len = this.length; i < len; i++) {
        var node = this[i];
        while (node && node !== context) {

            var nodeMatchesSelector = foundBySelector ?
                Array.prototype.indexOf.call(foundBySelector, node) !== -1 :
                this.matchesSelector.call(node, selector, context);

            if (nodeMatchesSelector) {
                matches.push(node);
                break;
            }

            node = node.parentNode;
        }
    }

    return merge($(), unique(matches));
};

// Ops/sec  ~  6/13/15
// dollar   -   jQuery   -  type
// 115,512      67,194      string
// 221,728      145,560     fn
$.fn.filter = function (criteria) {

    if (!this.length) {
        return merge($(), []);
    }

    if (!criteria) {
        return merge($(), []);
    }

    var filterFn;

    // HANDLE: function
    if (typeof criteria === 'function') {

        filterFn = criteria;

    // HANDLE: 'selector' || node
    } else if (typeof criteria === 'string' || criteria.isDollar) {

        filterFn = function () {
            return $.fn.matchesSelector.call(this, criteria);
        };

    } else {

        return this;
    }

    var result = [];

    for (var i = 0, len = this.length; i < len; i++) {
        if (filterFn.call(this[i], i, this[i])) {
            result.push(this[i]);
        }
    }

    return merge($(), result.length > 1 ? unique(result) : result);
};

$.fn.eq = function (index) {
    if (this[index]) {
        return $(this[index]);
    }
};

function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

function isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function isFunction (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
}

function trim (string) {
    return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/*
 * Styles
 * - .css()
 * - .hasClass()
 * - .addClass(), .removeClass()
 */

// TODO: make sure setting with numbers works.
// currently faster than jQuery - no metrics yet.
$.fn.css = function (property, value) {

    if (!property) {
        return this;
    }

    var i = 0,
        len;

    if (!value) { // getting CSS or setting with object

        if (isObject(property)) { // set CSS with object

            for (len = this.length; i < len; i++) {
                for (var key in property) {
                    if (property.hasOwnProperty(key)) {
                        this[i].style[key] = property[key];
                    }
                }
            }

            return this;

        } else { // get CSS of first elem in collection with string or array of properties
            var result = {};

            if (typeof property === 'string') {
                return getStyle(this[0], property);
            } else if (isArray(property)) {
                for (len = property.length; i < len; i++) {
                    result[property[i]] = getStyle(this[0], property[i]);
                }
                return result;
            } else {
                return this; // is this fail safe necessary? should we error if improper params are passed?
            }
        }

    } else { // set string CSS property with string/num value or return from function

        if (isFunction(value)) {
            for (len = this.length; i < len; i++) {
                this[i].style[property] = value.call(this[0], i, getStyle(this[i], property)); // fn gets elem as this and params (index, current style) 
            }
        } else {
            for (len = this.length; i < len; i++) {
                this[i].style[property] = value;
            }
        }

        return this;
    }

    // IE8 POLYFILL:
    function getStyle (elem, prop) {
        // while setting CSS can be done with either camel-cased or dash-separated properties
        // getting computed CSS properties is persnickety about formatting

        if (typeof window.getComputedStyle === 'undefined') { // IE8 POLYFILL
            prop = prop === 'float' ? 
                'styleFloat' : 
                prop.replace(/^-ms-/, 'ms-').replace(/-([a-z])/gi, function (all, letter) { // insure that property is camel cased
                    return letter.toUpperCase();
                });
            return elem.currentStyle[prop];
        } else {
            prop = prop.replace(/[A-Z]/g, function (match) { // insure the property is dash-separated
                return '-' + match.toLowerCase();
            });
            return window.getComputedStyle(elem, null).getPropertyValue(prop);
        }
    }
};

$.fn.hasClass = function (className) {
    // ripped nearly word for word from jQuery. Thanks, open source world.
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].nodeType === 1 && (' ' + this[i].className + ' ').replace(/[\t\r\n\f]/g, ' ').indexOf(className) >= 0) {
            return true;
        }
    }

    return false;
};

$.fn.addClass = function (value) {

    if (!value) {
        return merge($(), this);
    }

    var i = 0,
        len = this.length;

    if (typeof value === 'string') {

        var newClasses = trim(value).split(' ');

        for (; i < len; i++) {
            var classes = (' ' + this[i].className + ' ').replace(/[\t\r\n\f]+/g, ' '),
                addedNewClasses = false;

            for (var j = 0, classLen = newClasses.length; j < classLen; j++) {
                if (classes.indexOf(newClasses[j]) < 0) {
                    classes += newClasses[j] + ' ';
                    addedNewClasses = true;
                }
            }

            if (addedNewClasses) {
                this[i].className = classes;
            }
        }

        return this;

    } else if (isFunction(value)) {

        var result = [];

        for (; i < len; i++) {
            // have to pass node recusively in an array so it registers in the add class loop
            result.push($.fn.addClass.call([this[i]], value.call(this, i, this[i].className))[0]);
        }

        return merge($(), result);
    }
};

$.fn.removeClass = function (value) {

    if (!value) {
        return merge($(), this);
    }

    var i = 0,
        len = this.length;

    if (typeof value === 'string') {

        var doomedClasses = ' ' + value + ' ';

        for (; i < len; i++) {
            var classes = this[i].className.replace(/[\s\t\r\n\f]+/, ' ').split(' '),
                classLen = classes.length;

            for (var j = 0; j < classLen; j++) {
                var idx = doomedClasses.indexOf(classes[j]);
                if (idx !== -1) {
                    classes.splice(idx, 1);
                }
            }

            if (classes.length !== classLen) {
                this[i].className = classes.join(' ');
            }
        } 

        return this;

    } else if (isFunction(value)) {

        var result = [];

        for (; i < len; i++) {
            // have to pass node recusively in an array so it registers in the add class loop
            result.push($.fn.removeClass.call([this[i]], value.call(this, i, this[i].className))[0]);
        }

        return merge($(), result);
    }
};

$.fn.show = function (options, onComplete) {

};

$.fn.hide = function (options, onComplete) {

};

/**
 * DOM
 * - traversal = .has(), .parent(), .children(), .siblings(), .first(), .last(), .next()
 * - reading = .val(), .text(), .attr(), .prop()
 *
 * @module DOM
 *
 * http://jsperf.com/intent-media-dollar-vs-jquery-dom
 *
 */

// traversal
$.fn.has = function (selector) {

    if (!selector) {
        return merge($(), []);
    }

    selector = selector.isDollar ? selector.selector : selector;

    // fetch node containing selector match
    return this.filter(function () {
        return !!unique($.fn.findBySelector.call(this, selector)).length;
    });
};

$.fn.parent = function () {
    var parentElems = [];

    for (var i = 0; i < this.length; i++) {
        var parent = this[i].parentNode;
        if (parent) {
            parentElems.push(parent);
        }
    }

    return merge($(), unique(parentElems));
};

$.fn.children = function (selector) {

    var childNodes = [],
        push = Array.prototype.push;

    var i = 0,
        len = this.length;

    // jQuery doesn't support passing a jQ instance to this fn,
    // not sure why since
    // selector = selector.isDollar ? selector.selector : selector
    // would work nicely here
    
    if (typeof selector === 'string') {
        for (; i < len; i++) {
            var children = this[i].children;
            push.apply(childNodes, $.fn.filter.call(children, selector));
        }
    } else {
        for (; i < len; i++) {
            push.apply(childNodes, this[i].children);
        }
    }

    return merge($(), unique(childNodes));
};

// .siblings(), .first(), .last(), .next()

$.fn.siblings = function (selector) {

    var target,
        siblings = [];

    var i = 0,
        len = this.length;


    for (; i < len; i++) {
        target = this[i].parentNode;
        target = target && target.firstChild;

        if (typeof selector === 'string') {
            while (target) {
                if (target.nodeType === 1 && target !== this[i] && $.fn.matchesSelector.call(target, selector)) {
                    siblings.push(target);
                }
                target = target.nextSibling;
            }
        } else {
            while (target) {
                if (target.nodeType === 1 && target !== this[i]) {
                    siblings.push(target);
                }
                target = target.nextSibling;
            }
        }
    }

    return merge($(), siblings.length <= 1 ? siblings : unique(siblings));
};

// reading

$.fn.val = function (insertion) {

    if (!insertion) {
        return this[0].value;
    }

    var value = '';

    if (typeof insertion === 'string') {
        value = insertion;
    } else if (typeof insertion === 'number') {
        value += insertion; // coerce to string
    }

    for (var i = 0; i < this.length; i++) {

        if (this[i].nodeType !== 1) {
            break;
        }

        if (typeof insertion === 'function') {
            value = insertion.call(this[i], i, this[i].value) || '';
        }

        this[i].value = value;
    }

    return this;
};

$.fn.text = function (insertion) {

};

$.fn.attr = function (attributeName, value) {

};



// functions deemed too obscure for DollarJs :(

// // Ops/sec  ~  6/13/15
// // dollar   -   jQuery
// // 143k         13k
// $.fn.add = function (selector, context) {
//     if (!selector) {
//         return this;
//     }

//     var addNodes = $.fn.findBySelector(selector, context);
//     return $.merge(this, $.fn.unique(addNodes));
// };

// // Ops/sec  ~  6/13/15
// // dollar   -   jQuery
// // 120k         45k
// $.fn.not = function (selector) {

//     if (!selector) {
//         return this;
//     }

//     var criteria;

//     if (typeof selector === 'function') {

//         criteria = (function (idx, node) {
//             return !selector.call(node, idx, node);
//         });
//     } else {

//         selector.isDollar ? selector.selector : selector;
//         criteria = (function () {
//             return !$.fn.matchesSelector.call(this, selector);
//         });
//     }

//     return $.merge($(), $.fn.unique(this.filter(criteria)));
// };

// // Ops/sec  ~  6/13/15
// // dollar   -   jQuery
// // 122k         73k
// $.fn.is = function (selector) {
//     if (!selector) {
//         return false;
//     }

//     return !!this.filter(selector).length;
// };
/**
 * Export using whatever method is best
 * module.exports
 * window.$
 */

(function () {

    var win = window;

    // AMD loader
    if (typeof win.define === 'function' && define.amd) {
        win.define(function () {
            return $;
        });

    // Node.js
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = $;

    // Global window
    } else {
        win.$ = $;
    }

}.call(this));

}.call(this));