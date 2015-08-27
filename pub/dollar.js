/**
 * IntentMedia's custom jQuery replacement
 * @class $
 */

;(function(){
/*
 * Basic $ init and constructor
 * @module $
 */

var $ = function (selector, context) {
    return new $.fn.init(selector, context);
};

/* jshint ignore:start */
var undef,
    utils,
    strType = 'string',
    objProto = Object.prototype,
    objToString = objProto.toString,
    objHasProp = objProto.hasOwnProperty,
    arrProto = Array.prototype,
    arrPush = arrProto.push,
    arrSlice = arrProto.slice;
/* jshint ignore:end */

$.fn = $.prototype = {
    constructor: $,

    selector: '',

    length: 0,

    isDollar: true,

    // Hack to make console.log display selected elements as an Array
    splice: arrProto.splice,

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function (num) {
        return num === undef ?
            // Return all the elements in a clean array
            arrSlice.call(this, 0) :
            // Return just the one element from the set
            (num < 0 ? this[num + this.length] : this[num]);
    }
};

// http://jsperf.com/intent-media-dollarjs-vs-jquery-init
$.fn.init = function (selector, context) {

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if (!selector) {
        return this;
    }

    context = context || document;

    // HANDLE: strings
    if (typeof selector === 'string') {

        this.selector = selector;
        this.context = context;
        return utils.merge(this, $.fn.findBySelector(selector, context));

    // HANDLE: $(DOM Element)
    } else if (selector.nodeType) {

        this.context = this[0] = selector;
        this.length = 1;
        return this;

    // HANDLE: dollar instance
    } else if (selector.isDollar) {

        this.selector = selector.selector;
        this.context = selector.context;
        return utils.merge(this, selector.get());

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

// Give the init function the $ prototype for later instantiation
$.fn.init.prototype = $.fn;



/* Internals for matching a collection of selected elements */

$.fn.findBySelector = function (selector, context) {

    if (selector.nodeType) {
        return selector === context ? [] : [selector];
    }

    // get selector as string
    selector = selector.isDollar ? selector.selector : selector;

    // exit early for improper selectors
    if (!selector || typeof selector !== strType) {
        return [];
    }

    // normalize context to node or document
    context = context || (this.isDollar && this[0]) || (this.nodeType && this) || document;

    // exit early for improper context
    if (context.nodeType !== 1 && context.nodeType !== 9) {
        return [];
    }

    var results = [];

    // thank you to Sizzle for the awesome RegExp
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
            arrPush.apply(results, context.getElementsByTagName(selector));

        // HANDLE: $('.class')
        } else if (selector = selectorsMap[3]) {
            // arrPush.apply(results, context.getElementsByClassName(selector));

            // ie8 polyfill
            arrPush.apply(results, polyfillGetClass(context, selector));
        }

    // HANDLE: pseudo-selectors, chained classes, etc.
    } else {
        arrPush.apply(results, context.querySelectorAll(selector));
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
    if (typeof selector !== 'string' && selector.isDollar) {
        selector = selector.selector;
    // HANDLE: selector is a node
    } else if (utils.isDomNode(selector)) {
        return this === selector;
    }

    // normalise browser nonsense
    var matches = node.matches || node.webkitMatchesSelector || node.mozMatchesSelector || node.msMatchesSelector;

    // return matches.call(node, selector);

    // IE8 polyfill
    return matches ?
        matches.call(node, selector) :
        polyfillMatches(selector);

    function polyfillMatches (sel) {
        // var allMatches = document.querySelectorAll(sel);
        var allMatches = $.fn.findBySelector(sel);
        return Array.prototype.indexOf.call(allMatches, node) !== -1;
    }
};




/*
 * Submodules to add...
 *
 * INIT
 * + .init(), [], .length, .get()
 * +  DOMContentLoaded
 *
 * FN
 * + .each()
 * - .on() / .bind()
 * - .off() / .unbind()
 * + .find()
 * + .closest()
 * + .filter()
 * + .eq()
 *
 * FILTER
 * - .is()
 * - .not()
 * - .has()
 * - .add()
 *
 * TRAVERSE
 * + .parent()
 * + .children()
 * + .siblings()
 * + .first()
 * + .last()
 * + .next()
 *
 * READWRITE
 * + .val()
 * + .text()
 * + .attr()
 * + .removeAttr()
 * + .prop()
 * + .removeProp()
 * + .data()
 * + .removeData()
 *
 * STYLE
 * + .css()
 * + .hasClass()
 * + .addClass()
 * + .removeClass()
 * - .show()
 * - .hide()
 *
 * TRIGGER
 * - .trigger()
 * - .focus()
 * - .blur()
 * - .change()
 * - .click()
 * - .resize()
 *
 * MUTATE
 * - .empty()
 * - .remove()
 * - .html()
 * - .append()
 * - .prepend()
 * - .after()
 * - .before()
 * - .clone()
 *
 * ANIMATE
 * (use css transform if possible)
 *
 */

/*
 * Helper Utilities
 * @module $
 */

utils = {

    isArray: function (arr) {
        return objToString.call(arr) === '[object Array]';
    },

    isObject: function (obj) {
        return objToString.call(obj) === '[object Object]';
    },

    isFunction: function (fn) {
        return objToString.call(fn) === '[object Function]';
    },

    isDomNode: function (node) {
        return node.nodeType === 1 || node.nodeType === 9;
    },

    trim: String.prototype.trim || function (string) {
        return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    },

    each: function (collection, iteratee, thisArg) {
        if (this.isArray(collection)) {
            var i, len;
            for (i = 0, len = collection.length; i < len; i++) {
                iteratee.call(thisArg || collection[i], collection[i], i, collection);
            }

        } else {
            for (var prop in collection) {
                if (objHasProp.call(collection, prop)) {
                    iteratee.call(thisArg || collection[prop], collection[prop], prop, collection);
                }
            }
        }
    },

    extend: function () {
        var ret = arguments[0],
            args = arrSlice.call(arguments, 1),
            assignProp = function (val, key) {
                ret[key] = val;
            };

        for (var i = 0, argsLen = args.length; i < argsLen; i++) {
            this.each(args[i], assignProp);
        }

        return ret;
    },

    merge: function (first, second) {
        var len = +second.length,
            j = 0,
            i = first.length;

        for (; j < len; j++) {
            first[i++] = second[j];
        }

        first.length = i;

        return first;
    },

    unique: function (jumbled) {
        var iterable = Object(jumbled),
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
    }

};

/*
 * Extend $ instances/selections
 * @module $
 */

$.fn.each = function (iteratee) {
    utils.each(this.get(), iteratee);
};

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
            addEventListenerPolyfill(context[i], events[j], handler);
        }
    }

    return this;

    function addEventListenerPolyfill (context, event, callback) {
        if (Element.prototype.addEventListener) {
            context.addEventListener(event, callback, false);
        } else {
            // IE8 Polyfill
            if (event === 'DOMContentLoaded') {
                var ev = new Event();
                ev.srcElement = window;
                addEventPolyfillWrapper(ev);
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
                console.log('what should happen here?');
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
            removeEventListenerPolyfill(context[i], events[j], handler);
        }
    }

    return this;

    function removeEventListenerPolyfill(context, event, callback) {
        if (Element.prototype.removeEventListener) {
            context.removeEventListener(event, callback, false);
        } else {
            // The person who wrote this polyfill was on meth:
            // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener

            // TODO: write a human readable polyfill for IE8
            console.error('IE8 polyfill at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener');
        }
    }
};

$.fn.find = function (selector) {

    if (!selector || !this.length) {
        return utils.merge($(), []);
    }

    var matches = [];

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
        if (utils.isDomNode(selector)) {
            if (this[0] !== selector && this[0].contains(selector)) {
                matches.push(selector);
            }
        } else {
            matches = $.fn.findBySelector.call(this, selector);
        }
    }

    return utils.merge($(), matches.length > 1 ? utils.unique(matches) : matches);
};

$.fn.closest = function (selector, context) {

    if (!selector) {
        return utils.merge($(), []);
    }

    var matches = [];
    // if is dollar or node, re-wrap the selector in the context
    var foundBySelector = (selector.isDollar || selector.nodeType) && $(selector, context);

    this.each(function (node) {
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
    });

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

    return utils.merge($(), utils.unique(matches));
};



$.fn.filter = function (criteria, collection) {

    collection = collection || this;

    if (!collection.length || !criteria) {
        return utils.merge($(), []);
    }

    var filterFn;

    // HANDLE: function
    if (utils.isFunction(criteria)) {

        filterFn = criteria;

    // HANDLE: 'selector' || dollar instance || node
    } else if (typeof criteria === strType || criteria.isDollar || utils.isDomNode(criteria)) {

        filterFn = function () {
            return $.fn.matchesSelector.call(this, criteria);
        };

    } else {
        return collection;
    }

    var result = [],
        i = 0,
        len = collection.length;

    for (; i < len; i++) {
        if (filterFn.call(collection[i], i, collection[i])) {
            result.push(collection[i]);
        }
    }

    return utils.merge($(), result.length > 1 ? utils.unique(result) : result);
};

$.fn.eq = function (index) {
    if (this[index]) {
        return $(this[index]);
    }
};

$.fn.is = function (selector) {
    return !!selector && !!this.filter(selector).length;
};

$.fn.not = function (selector) {
    if (!selector) {
        return this;
    }

    var criteria,
        excluded;

    if (utils.isFunction(selector)) {
        criteria = function (idx, node) {
            return !selector.call(node, idx, node);
        };
    } else {
        criteria = function () {
            return !$.fn.matchesSelector.call(this, selector);
        };
    }

    excluded = this.filter(criteria);

    return utils.merge($(), excluded.length === 1 ? excluded : utils.unique(excluded));
};

$.fn.add = function (selector, context) {
    return !!selector && utils.unique(utils.merge(this, $(selector, context)));
};

$.fn.has = function (selector) {
    if (!selector) {
        return utils.merge($(), []);
    }

    // fetch node containing selector match
    return this.filter(function () {
        return !!utils.unique($.fn.findBySelector(selector, this)).length;
    });
};

/*
 * TRAVERSE
 */

/**
 * NOTE:
 * As a heads up, for all of these DOM traversal
 * functions, jQuery does not support passing nodes
 * or jQuery instances as selectors. In the case of
 * a non-string selector, jQuery will return the
 * same results as would have been returned with no
 * selector.
 *
 * This is an inconsistent approach with the rest of
 * jQuery though since find, closest, filter, and a
 * host of other DOM traversal functions take nodes
 * and jQuery instances as valid selectors.
 *
 * jQuery can keep its inconsistencies. We should
 * accept a constant suite of parameters.
 *
 */

$.fn.parent = function () {
    var parentElems = [];

    for (var i = 0; i < this.length; i++) {
        var parent = this[i].parentNode;
        if (parent) {
            parentElems.push(parent);
        }
    }

    return utils.merge($(), utils.unique(parentElems));
};

$.fn.children = function (selector) {
    var childNodes = [],
        arrPush = [].push;

    var i = 0,
        len = this.length;

    if (selector) {
        for (; i < len; i++) {
            var children = this[i].children;
            arrPush.apply(childNodes, $.fn.filter.call(children, selector));
        }
    } else {
        for (; i < len; i++) {
            arrPush.apply(childNodes, this[i].children);
        }
    }

    return utils.merge($(), utils.unique(childNodes));
};

$.fn.siblings = function (selector) {
    var target,
        siblings = [];

    var i = 0,
        len = this.length;


    for (; i < len; i++) {
        target = this[i].parentNode;
        target = target && target.firstChild;

        if (selector) {
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

    return utils.merge($(), siblings.length > 1 ? utils.unique(siblings) : siblings);
};

$.fn.first = function () {
    return this.eq(0);
};

$.fn.last = function () {
    return this.eq(this.length - 1);
};

$.fn.next = function (selector) {
    var i = 0,
        len = this.length,
        subsequents = [],
        nextNode;

    for (; i < len; i++) {
        // TODO: IE8 polyfill
        nextNode = this[i].nextElementSibling; // won't work for IE8
        if (nextNode && (selector ? $.fn.matchesSelector.call(nextNode, selector) : true)) {
            subsequents.push(nextNode);
        }
    }

    return utils.merge($(), subsequents.length > 1 ? utils.unique(subsequents) : subsequents);
};

/**
 * READWRITE
 */

// text and values

$.fn.val = function (insertion) {
    if (insertion === undef) {
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
    if (insertion !== undef) {
        this.each(function () {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                this.textContent = insertion;
            }
        });

        return this;
    }

    var ret = '';

    this.each(function () {
        var _this = this,
            nodeType = _this.nodeType;

        if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
            if (typeof _this.textContent === 'string') {
                ret += _this.textContent;
            } else {
                // Traverse its children
                for (_this = _this.firstChild; _this; _this = _this.nextSibling) {
                    ret += this.text(_this);
                }
            }
        } else if (nodeType === 3 || nodeType === 4) {
            ret += _this.nodeValue;
        }
    });

    return ret;
};


// Attributes and Properties

function nodeSupportsAttrProp (node) {
    // don't get/set attributes or properties on text, comment and attribute nodes
    var nType = node && node.nodeType;
    return nType && nType !== 3 && nType !== 8 && nType !== 2;
}

$.fn.attr = function (attr, value) {
    if (value === undef) {
        var elem = this[0];
        return (!nodeSupportsAttrProp(elem) || !elem.hasAttribute(attr)) ? undef : (elem.getAttribute(attr) || attr);
    }

    this.each(function () {
        if (nodeSupportsAttrProp(this)) {
            this.setAttribute(attr, value);
        }
    });

    return this;
};

$.fn.removeAttr = function (attr) {
    this.each(function () {
        this.removeAttribute(attr);
    });

    return this;
};

$.fn.prop = function (prop, value) {
    if (value === undef) {
        var elem = this[0];
        return !nodeSupportsAttrProp(elem) ? undef : elem[prop];
    }

    this.each(function () {
        if (nodeSupportsAttrProp(this)) {
            this[prop] = value;
        }
    });

    return this;
};

$.fn.removeProp = function (prop) {
    this.each(function () {
        if (nodeSupportsAttrProp(this)) {
            delete this[prop];
        }
    });

    return this;
};


// .data(), .removeData()

var DOLLAR_DATA_CACHE = [null], // start ids at 1 for truthyness
    DOLLAR_ATTR_ID = 'dollar-id';

function getInternalElementId (elem) {
    return parseInt(elem.getAttribute(DOLLAR_ATTR_ID));
}

function setInternalElementId (elem, referenceId) {
    return elem.setAttribute(DOLLAR_ATTR_ID, referenceId);
}

// currently doesn't support passing an object to set
$.fn.data = function (key, value) {
    if (!this.length) {
        return undef;
    }

    var id = getInternalElementId(this[0]),
        fromDOM = this[0] && this[0].dataset || {};

    if (!key) {
        return utils.extend({}, fromDOM, DOLLAR_DATA_CACHE[id]);
    }

    if (value === undef) {
        return id && DOLLAR_DATA_CACHE[id][key] || fromDOM[key];
    }

    var i = 0,
        len = this.length,
        cachedElemData = {},
        uniqueElemId;

    for (; i < len; i++) {
        uniqueElemId = getInternalElementId(this[i]);
        if (uniqueElemId) {
            DOLLAR_DATA_CACHE[uniqueElemId][key] = value;
        } else {
            cachedElemData = {};
            cachedElemData[key] = value;
            uniqueElemId = DOLLAR_DATA_CACHE.push(cachedElemData) - 1;
            setInternalElementId(this[i], uniqueElemId);
        }
    }

    return this;
};

$.fn.removeData = function (key) {
    var i = 0,
        len = this.length,
        id;

    for (; i < len; i++) {
        id = getInternalElementId(this[i]);

        if (key) {
            if (id) {
                delete DOLLAR_DATA_CACHE[id][key];
            }

        } else {
            DOLLAR_DATA_CACHE[id] = {};
        }
    }
};

/*
 * STYLE
 */

// TODO: make sure setting with numbers works.
$.fn.css = function (property, value) {

    // jQuery craps out when given falsy properties
    if (!property) {
        return this;
    }

    var i = 0,
        len;

    if (value === undef) { // getting CSS or setting with object

        if (utils.isObject(property)) { // set CSS with object

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
            } else if (utils.isArray(property)) {
                for (len = property.length; i < len; i++) {
                    result[property[i]] = getStyle(this[0], property[i]);
                }

                return result;
            } else {
                return this; // is this fail safe necessary? should we error if improper params are passed?
            }
        }

    } else { // set string CSS property with string/num value or return from function

        if (utils.isFunction(value)) {
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
        return utils.merge($(), this);
    }

    var i = 0,
        len = this.length;

    if (typeof value === 'string') {

        var newClasses = utils.trim(value).split(' ');

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

    } else if (utils.isFunction(value)) {

        var result = [];

        for (; i < len; i++) {
            // have to pass node recusively in an array so it registers in the add class loop
            result.push($.fn.addClass.call([this[i]], value.call(this, i, this[i].className))[0]);
        }

        return utils.merge($(), result);
    }
};

$.fn.removeClass = function (value) {

    if (!value) {
        return utils.merge($(), this);
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

    } else if (utils.isFunction(value)) {

        var result = [];

        for (; i < len; i++) {
            // have to pass node recusively in an array so it registers in the add class loop
            result.push($.fn.removeClass.call([this[i]], value.call(this, i, this[i].className))[0]);
        }

        return utils.merge($(), result);
    }
};

// $.fn.show = function (options, onComplete) {
//
// };
//
// $.fn.hide = function (options, onComplete) {
//
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