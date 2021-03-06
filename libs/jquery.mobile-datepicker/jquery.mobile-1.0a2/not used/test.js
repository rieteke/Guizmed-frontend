﻿
/*!
* jQuery JavaScript Library v1.4.4
* http://jquery.com/
*
* Copyright 2010, John Resig
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* Includes Sizzle.js
* http://sizzlejs.com/
* Copyright 2010, The Dojo Foundation
* Released under the MIT, BSD, and GPL Licenses.
*
* Date: Thu Nov 11 19:04:53 2010 -0500
*/
(function (window, undefined) {

    // Use the correct document accordingly with window argument (sandbox)
    var document = window.document;
    var jQuery = (function () {

        // Define a local copy of jQuery
        var jQuery = function (selector, context) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init(selector, context);
        },

        // Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

        // Map over the $ in case of overwrite
	_$ = window.$,

        // A central reference to the root jQuery(document)
	rootjQuery,

        // A simple way to check for HTML strings or ID strings
        // (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

        // Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

        // Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,
	rwhite = /\s/,

        // Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

        // Check for non-word characters
	rnonword = /\W/,

        // Check for digits
	rdigit = /\d/,

        // Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

        // JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

        // Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

        // Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

        // For matching the engine and version of the browser
	browserMatch,

        // Has the ready events already been bound?
	readyBound = false,

        // The functions to execute on DOM ready
	readyList = [],

        // The ready event handler
	DOMContentLoaded,

        // Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

        // [[Class]] -> type pairs
	class2type = {};

        jQuery.fn = jQuery.prototype = {
            init: function (selector, context) {
                var match, elem, ret, doc;

                // Handle $(""), $(null), or $(undefined)
                if (!selector) {
                    return this;
                }

                // Handle $(DOMElement)
                if (selector.nodeType) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }

                // The body element only exists once, optimize finding it
                if (selector === "body" && !context && document.body) {
                    this.context = document;
                    this[0] = document.body;
                    this.selector = "body";
                    this.length = 1;
                    return this;
                }

                // Handle HTML strings
                if (typeof selector === "string") {
                    // Are we dealing with HTML string or an ID?
                    match = quickExpr.exec(selector);

                    // Verify a match, and that no context was specified for #id
                    if (match && (match[1] || !context)) {

                        // HANDLE: $(html) -> $(array)
                        if (match[1]) {
                            doc = (context ? context.ownerDocument || context : document);

                            // If a single string is passed in and it's a single tag
                            // just do a createElement and skip the rest
                            ret = rsingleTag.exec(selector);

                            if (ret) {
                                if (jQuery.isPlainObject(context)) {
                                    selector = [document.createElement(ret[1])];
                                    jQuery.fn.attr.call(selector, context, true);

                                } else {
                                    selector = [doc.createElement(ret[1])];
                                }

                            } else {
                                ret = jQuery.buildFragment([match[1]], [doc]);
                                selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
                            }

                            return jQuery.merge(this, selector);

                            // HANDLE: $("#id")
                        } else {
                            elem = document.getElementById(match[2]);

                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if (elem && elem.parentNode) {
                                // Handle the case where IE and Opera return items
                                // by name instead of ID
                                if (elem.id !== match[2]) {
                                    return rootjQuery.find(selector);
                                }

                                // Otherwise, we inject the element directly into the jQuery object
                                this.length = 1;
                                this[0] = elem;
                            }

                            this.context = document;
                            this.selector = selector;
                            return this;
                        }

                        // HANDLE: $("TAG")
                    } else if (!context && !rnonword.test(selector)) {
                        this.selector = selector;
                        this.context = document;
                        selector = document.getElementsByTagName(selector);
                        return jQuery.merge(this, selector);

                        // HANDLE: $(expr, $(...))
                    } else if (!context || context.jquery) {
                        return (context || rootjQuery).find(selector);

                        // HANDLE: $(expr, context)
                        // (which is just equivalent to: $(context).find(expr)
                    } else {
                        return jQuery(context).find(selector);
                    }

                    // HANDLE: $(function)
                    // Shortcut for document ready
                } else if (jQuery.isFunction(selector)) {
                    return rootjQuery.ready(selector);
                }

                if (selector.selector !== undefined) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return jQuery.makeArray(selector, this);
            },

            // Start with an empty selector
            selector: "",

            // The current version of jQuery being used
            jquery: "1.4.4",

            // The default length of a jQuery object is 0
            length: 0,

            // The number of elements contained in the matched element set
            size: function () {
                return this.length;
            },

            toArray: function () {
                return slice.call(this, 0);
            },

            // Get the Nth element in the matched element set OR
            // Get the whole matched element set as a clean array
            get: function (num) {
                return num == null ?

                // Return a 'clean' array
			this.toArray() :

                // Return just the object
			(num < 0 ? this.slice(num)[0] : this[num]);
            },

            // Take an array of elements and push it onto the stack
            // (returning the new matched element set)
            pushStack: function (elems, name, selector) {
                // Build a new jQuery matched element set
                var ret = jQuery();

                if (jQuery.isArray(elems)) {
                    push.apply(ret, elems);

                } else {
                    jQuery.merge(ret, elems);
                }

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;

                ret.context = this.context;

                if (name === "find") {
                    ret.selector = this.selector + (this.selector ? " " : "") + selector;
                } else if (name) {
                    ret.selector = this.selector + "." + name + "(" + selector + ")";
                }

                // Return the newly-formed element set
                return ret;
            },

            // Execute a callback for every element in the matched set.
            // (You can seed the arguments with an array of args, but this is
            // only used internally.)
            each: function (callback, args) {
                return jQuery.each(this, callback, args);
            },

            ready: function (fn) {
                // Attach the listeners
                jQuery.bindReady();

                // If the DOM is already ready
                if (jQuery.isReady) {
                    // Execute the function immediately
                    fn.call(document, jQuery);

                    // Otherwise, remember the function for later
                } else if (readyList) {
                    // Add the function to the wait list
                    readyList.push(fn);
                }

                return this;
            },

            eq: function (i) {
                return i === -1 ?
			this.slice(i) :
			this.slice(i, +i + 1);
            },

            first: function () {
                return this.eq(0);
            },

            last: function () {
                return this.eq(-1);
            },

            slice: function () {
                return this.pushStack(slice.apply(this, arguments),
			"slice", slice.call(arguments).join(","));
            },

            map: function (callback) {
                return this.pushStack(jQuery.map(this, function (elem, i) {
                    return callback.call(elem, i, elem);
                }));
            },

            end: function () {
                return this.prevObject || jQuery(null);
            },

            // For internal use only.
            // Behaves like an Array's method, not like a jQuery method.
            push: push,
            sort: [].sort,
            splice: [].splice
        };

        // Give the init function the jQuery prototype for later instantiation
        jQuery.fn.init.prototype = jQuery.fn;

        jQuery.extend = jQuery.fn.extend = function () {
            var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !jQuery.isFunction(target)) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if (length === i) {
                target = this;
                --i;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];

                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = jQuery.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        jQuery.extend({
            noConflict: function (deep) {
                window.$ = _$;

                if (deep) {
                    window.jQuery = _jQuery;
                }

                return jQuery;
            },

            // Is the DOM ready to be used? Set to true once it occurs.
            isReady: false,

            // A counter to track how many items to wait for before
            // the ready event fires. See #6781
            readyWait: 1,

            // Handle when the DOM is ready
            ready: function (wait) {
                // A third-party is pushing the ready event forwards
                if (wait === true) {
                    jQuery.readyWait--;
                }

                // Make sure that the DOM is not already loaded
                if (!jQuery.readyWait || (wait !== true && !jQuery.isReady)) {
                    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                    if (!document.body) {
                        return setTimeout(jQuery.ready, 1);
                    }

                    // Remember that the DOM is ready
                    jQuery.isReady = true;

                    // If a normal DOM Ready event fired, decrement, and wait if need be
                    if (wait !== true && --jQuery.readyWait > 0) {
                        return;
                    }

                    // If there are functions bound, to execute
                    if (readyList) {
                        // Execute all of them
                        var fn,
					i = 0,
					ready = readyList;

                        // Reset the list of functions
                        readyList = null;

                        while ((fn = ready[i++])) {
                            fn.call(document, jQuery);
                        }

                        // Trigger any bound ready events
                        if (jQuery.fn.trigger) {
                            jQuery(document).trigger("ready").unbind("ready");
                        }
                    }
                }
            },

            bindReady: function () {
                if (readyBound) {
                    return;
                }

                readyBound = true;

                // Catch cases where $(document).ready() is called after the
                // browser event has already occurred.
                if (document.readyState === "complete") {
                    // Handle it asynchronously to allow scripts the opportunity to delay ready
                    return setTimeout(jQuery.ready, 1);
                }

                // Mozilla, Opera and webkit nightlies currently support this event
                if (document.addEventListener) {
                    // Use the handy event callback
                    document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

                    // A fallback to window.onload, that will always work
                    window.addEventListener("load", jQuery.ready, false);

                    // If IE event model is used
                } else if (document.attachEvent) {
                    // ensure firing before onload,
                    // maybe late but safe also for iframes
                    document.attachEvent("onreadystatechange", DOMContentLoaded);

                    // A fallback to window.onload, that will always work
                    window.attachEvent("onload", jQuery.ready);

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var toplevel = false;

                    try {
                        toplevel = window.frameElement == null;
                    } catch (e) { }

                    if (document.documentElement.doScroll && toplevel) {
                        doScrollCheck();
                    }
                }
            },

            // See test/unit/core.js for details concerning isFunction.
            // Since version 1.3, DOM methods and functions like alert
            // aren't supported. They return false on IE (#2968).
            isFunction: function (obj) {
                return jQuery.type(obj) === "function";
            },

            isArray: Array.isArray || function (obj) {
                return jQuery.type(obj) === "array";
            },

            // A crude way of determining if an object is a window
            isWindow: function (obj) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            },

            isNaN: function (obj) {
                return obj == null || !rdigit.test(obj) || isNaN(obj);
            },

            type: function (obj) {
                return obj == null ?
			String(obj) :
			class2type[toString.call(obj)] || "object";
            },

            isPlainObject: function (obj) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                    return false;
                }

                // Not own constructor property must be Object
                if (obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for (key in obj) { }

                return key === undefined || hasOwn.call(obj, key);
            },

            isEmptyObject: function (obj) {
                for (var name in obj) {
                    return false;
                }
                return true;
            },

            error: function (msg) {
                throw msg;
            },

            parseJSON: function (data) {
                if (typeof data !== "string" || !data) {
                    return null;
                }

                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim(data);

                // Make sure the incoming data is actual JSON
                // Logic borrowed from http://json.org/json2.js
                if (rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, ""))) {

                    // Try to use the native JSON parser first
                    return window.JSON && window.JSON.parse ?
				window.JSON.parse(data) :
				(new Function("return " + data))();

                } else {
                    jQuery.error("Invalid JSON: " + data);
                }
            },

            noop: function () { },

            // Evalulates a script in a global context
            globalEval: function (data) {
                if (data && rnotwhite.test(data)) {
                    // Inspired by code by Andrea Giammarchi
                    // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                    var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

                    script.type = "text/javascript";

                    if (jQuery.support.scriptEval) {
                        script.appendChild(document.createTextNode(data));
                    } else {
                        script.text = data;
                    }

                    // Use insertBefore instead of appendChild to circumvent an IE6 bug.
                    // This arises when a base node is used (#2709).
                    head.insertBefore(script, head.firstChild);
                    head.removeChild(script);
                }
            },

            nodeName: function (elem, name) {
                return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
            },

            // args is for internal usage only
            each: function (object, callback, args) {
                var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

                if (args) {
                    if (isObj) {
                        for (name in object) {
                            if (callback.apply(object[name], args) === false) {
                                break;
                            }
                        }
                    } else {
                        for (; i < length; ) {
                            if (callback.apply(object[i++], args) === false) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if (isObj) {
                        for (name in object) {
                            if (callback.call(object[name], name, object[name]) === false) {
                                break;
                            }
                        }
                    } else {
                        for (var value = object[0];
					i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
                    }
                }

                return object;
            },

            // Use native String.trim function wherever possible
            trim: trim ?
		function (text) {
		    return text == null ?
				"" :
				trim.call(text);
		} :

            // Otherwise use our own trimming functionality
		function (text) {
		    return text == null ?
				"" :
				text.toString().replace(trimLeft, "").replace(trimRight, "");
		},

            // results is for internal usage only
            makeArray: function (array, results) {
                var ret = results || [];

                if (array != null) {
                    // The window, strings (and functions) also have 'length'
                    // The extra typeof function check is to prevent crashes
                    // in Safari 2 (See: #3039)
                    // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                    var type = jQuery.type(array);

                    if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array)) {
                        push.call(ret, array);
                    } else {
                        jQuery.merge(ret, array);
                    }
                }

                return ret;
            },

            inArray: function (elem, array) {
                if (array.indexOf) {
                    return array.indexOf(elem);
                }

                for (var i = 0, length = array.length; i < length; i++) {
                    if (array[i] === elem) {
                        return i;
                    }
                }

                return -1;
            },

            merge: function (first, second) {
                var i = first.length,
			j = 0;

                if (typeof second.length === "number") {
                    for (var l = second.length; j < l; j++) {
                        first[i++] = second[j];
                    }

                } else {
                    while (second[j] !== undefined) {
                        first[i++] = second[j++];
                    }
                }

                first.length = i;

                return first;
            },

            grep: function (elems, callback, inv) {
                var ret = [], retVal;
                inv = !!inv;

                // Go through the array, only saving the items
                // that pass the validator function
                for (var i = 0, length = elems.length; i < length; i++) {
                    retVal = !!callback(elems[i], i);
                    if (inv !== retVal) {
                        ret.push(elems[i]);
                    }
                }

                return ret;
            },

            // arg is for internal usage only
            map: function (elems, callback, arg) {
                var ret = [], value;

                // Go through the array, translating each of the items to their
                // new value (or values).
                for (var i = 0, length = elems.length; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret[ret.length] = value;
                    }
                }

                return ret.concat.apply([], ret);
            },

            // A global GUID counter for objects
            guid: 1,

            proxy: function (fn, proxy, thisObject) {
                if (arguments.length === 2) {
                    if (typeof proxy === "string") {
                        thisObject = fn;
                        fn = thisObject[proxy];
                        proxy = undefined;

                    } else if (proxy && !jQuery.isFunction(proxy)) {
                        thisObject = proxy;
                        proxy = undefined;
                    }
                }

                if (!proxy && fn) {
                    proxy = function () {
                        return fn.apply(thisObject || this, arguments);
                    };
                }

                // Set the guid of unique handler to the same of original handler, so it can be removed
                if (fn) {
                    proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
                }

                // So proxy can be declared as an argument
                return proxy;
            },

            // Mutifunctional method to get and set values to a collection
            // The value/s can be optionally by executed if its a function
            access: function (elems, key, value, exec, fn, pass) {
                var length = elems.length;

                // Setting many attributes
                if (typeof key === "object") {
                    for (var k in key) {
                        jQuery.access(elems, k, key[k], exec, fn, value);
                    }
                    return elems;
                }

                // Setting one attribute
                if (value !== undefined) {
                    // Optionally, function values get executed if exec is true
                    exec = !pass && exec && jQuery.isFunction(value);

                    for (var i = 0; i < length; i++) {
                        fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
                    }

                    return elems;
                }

                // Getting an attribute
                return length ? fn(elems[0], key) : undefined;
            },

            now: function () {
                return (new Date()).getTime();
            },

            // Use of jQuery.browser is frowned upon.
            // More details: http://docs.jquery.com/Utilities/jQuery.browser
            uaMatch: function (ua) {
                ua = ua.toLowerCase();

                var match = rwebkit.exec(ua) ||
			ropera.exec(ua) ||
			rmsie.exec(ua) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec(ua) ||
			[];

                return { browser: match[1] || "", version: match[2] || "0" };
            },

            browser: {}
        });

        // Populate the class2type map
        jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        browserMatch = jQuery.uaMatch(userAgent);
        if (browserMatch.browser) {
            jQuery.browser[browserMatch.browser] = true;
            jQuery.browser.version = browserMatch.version;
        }

        // Deprecated, use jQuery.browser.webkit instead
        if (jQuery.browser.webkit) {
            jQuery.browser.safari = true;
        }

        if (indexOf) {
            jQuery.inArray = function (elem, array) {
                return indexOf.call(array, elem);
            };
        }

        // Verify that \s matches non-breaking spaces
        // (IE fails on this test)
        if (!rwhite.test("\xA0")) {
            trimLeft = /^[\s\xA0]+/;
            trimRight = /[\s\xA0]+$/;
        }

        // All jQuery objects should point back to these
        rootjQuery = jQuery(document);

        // Cleanup functions for the document ready method
        if (document.addEventListener) {
            DOMContentLoaded = function () {
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                jQuery.ready();
            };

        } else if (document.attachEvent) {
            DOMContentLoaded = function () {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", DOMContentLoaded);
                    jQuery.ready();
                }
            };
        }

        // The DOM ready check for Internet Explorer
        function doScrollCheck() {
            if (jQuery.isReady) {
                return;
            }

            try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
            } catch (e) {
                setTimeout(doScrollCheck, 1);
                return;
            }

            // and execute any waiting functions
            jQuery.ready();
        }

        // Expose jQuery to the global object
        return (window.jQuery = window.$ = jQuery);

    })();


    (function () {

        jQuery.support = {};

        var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + jQuery.now();

        div.style.display = "none";
        div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

        var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild(document.createElement("option"));

        // Can't get basic test support
        if (!all || !all.length || !a) {
            return;
        }

        jQuery.support = {
            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: div.firstChild.nodeType === 3,

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName("tbody").length,

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName("link").length,

            // Get the style information from getAttribute
            // (IE uses .cssText insted)
            style: /red/.test(a.getAttribute("style")),

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: a.getAttribute("href") === "/a",

            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.55$/.test(a.style.opacity),

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,

            // Make sure that if no value is specified for a checkbox
            // that it defaults to "on".
            // (WebKit defaults to "" instead)
            checkOn: div.getElementsByTagName("input")[0].value === "on",

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: opt.selected,

            // Will be defined later
            deleteExpando: true,
            optDisabled: false,
            checkClone: false,
            scriptEval: false,
            noCloneEvent: true,
            boxModel: null,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableHiddenOffsets: true
        };

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as diabled)
        select.disabled = true;
        jQuery.support.optDisabled = !opt.disabled;

        script.type = "text/javascript";
        try {
            script.appendChild(document.createTextNode("window." + id + "=1;"));
        } catch (e) { }

        root.insertBefore(script, root.firstChild);

        // Make sure that the execution of code works by injecting a script
        // tag with appendChild/createTextNode
        // (IE doesn't support this, fails, and uses .text instead)
        if (window[id]) {
            jQuery.support.scriptEval = true;
            delete window[id];
        }

        // Test to see if it's possible to delete an expando from an element
        // Fails in Internet Explorer
        try {
            delete script.test;

        } catch (e) {
            jQuery.support.deleteExpando = false;
        }

        root.removeChild(script);

        if (div.attachEvent && div.fireEvent) {
            div.attachEvent("onclick", function click() {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                jQuery.support.noCloneEvent = false;
                div.detachEvent("onclick", click);
            });
            div.cloneNode(true).fireEvent("onclick");
        }

        div = document.createElement("div");
        div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

        var fragment = document.createDocumentFragment();
        fragment.appendChild(div.firstChild);

        // WebKit doesn't clone checked state correctly in fragments
        jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

        // Figure out if the W3C box model works as expected
        // document.body must exist before we can do this
        jQuery(function () {
            var div = document.createElement("div");
            div.style.width = div.style.paddingLeft = "1px";

            document.body.appendChild(div);
            jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

            if ("zoom" in div.style) {
                // Check if natively block-level elements act like inline-block
                // elements when setting their display to 'inline' and giving
                // them layout
                // (IE < 8 does this)
                div.style.display = "inline";
                div.style.zoom = 1;
                jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

                // Check if elements with layout shrink-wrap their children
                // (IE 6 does this)
                div.style.display = "";
                div.innerHTML = "<div style='width:4px;'></div>";
                jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
            }

            div.innerHTML = "<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";
            var tds = div.getElementsByTagName("td");

            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            // (only IE 8 fails this test)
            jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

            tds[0].style.display = "";
            tds[1].style.display = "none";

            // Check if empty table cells still have offsetWidth/Height
            // (IE < 8 fail this test)
            jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
            div.innerHTML = "";

            document.body.removeChild(div).style.display = "none";
            div = tds = null;
        });

        // Technique from Juriy Zaytsev
        // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
        var eventSupported = function (eventName) {
            var el = document.createElement("div");
            eventName = "on" + eventName;

            var isSupported = (eventName in el);
            if (!isSupported) {
                el.setAttribute(eventName, "return;");
                isSupported = typeof el[eventName] === "function";
            }
            el = null;

            return isSupported;
        };

        jQuery.support.submitBubbles = eventSupported("submit");
        jQuery.support.changeBubbles = eventSupported("change");

        // release memory in IE
        root = script = div = all = a = null;
    })();



    var windowData = {},
	rbrace = /^(?:\{.*\}|\[.*\])$/;

    jQuery.extend({
        cache: {},

        // Please use with caution
        uuid: 0,

        // Unique for each copy of jQuery on the page	
        expando: "jQuery" + jQuery.now(),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        data: function (elem, name, data) {
            if (!jQuery.acceptData(elem)) {
                return;
            }

            elem = elem == window ?
			windowData :
			elem;

            var isNode = elem.nodeType,
			id = isNode ? elem[jQuery.expando] : null,
			cache = jQuery.cache, thisCache;

            if (isNode && !id && typeof name === "string" && data === undefined) {
                return;
            }

            // Get the data from the object directly
            if (!isNode) {
                cache = elem;

                // Compute a unique ID for the element
            } else if (!id) {
                elem[jQuery.expando] = id = ++jQuery.uuid;
            }

            // Avoid generating a new cache unless none exists and we
            // want to manipulate it.
            if (typeof name === "object") {
                if (isNode) {
                    cache[id] = jQuery.extend(cache[id], name);

                } else {
                    jQuery.extend(cache, name);
                }

            } else if (isNode && !cache[id]) {
                cache[id] = {};
            }

            thisCache = isNode ? cache[id] : cache;

            // Prevent overriding the named cache with undefined values
            if (data !== undefined) {
                thisCache[name] = data;
            }

            return typeof name === "string" ? thisCache[name] : thisCache;
        },

        removeData: function (elem, name) {
            if (!jQuery.acceptData(elem)) {
                return;
            }

            elem = elem == window ?
			windowData :
			elem;

            var isNode = elem.nodeType,
			id = isNode ? elem[jQuery.expando] : elem,
			cache = jQuery.cache,
			thisCache = isNode ? cache[id] : id;

            // If we want to remove a specific section of the element's data
            if (name) {
                if (thisCache) {
                    // Remove the section of cache data
                    delete thisCache[name];

                    // If we've removed all the data, remove the element's cache
                    if (isNode && jQuery.isEmptyObject(thisCache)) {
                        jQuery.removeData(elem);
                    }
                }

                // Otherwise, we want to remove all of the element's data
            } else {
                if (isNode && jQuery.support.deleteExpando) {
                    delete elem[jQuery.expando];

                } else if (elem.removeAttribute) {
                    elem.removeAttribute(jQuery.expando);

                    // Completely remove the data cache
                } else if (isNode) {
                    delete cache[id];

                    // Remove all fields from the object
                } else {
                    for (var n in elem) {
                        delete elem[n];
                    }
                }
            }
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function (elem) {
            if (elem.nodeName) {
                var match = jQuery.noData[elem.nodeName.toLowerCase()];

                if (match) {
                    return !(match === true || elem.getAttribute("classid") !== match);
                }
            }

            return true;
        }
    });

    jQuery.fn.extend({
        data: function (key, value) {
            var data = null;

            if (typeof key === "undefined") {
                if (this.length) {
                    var attr = this[0].attributes, name;
                    data = jQuery.data(this[0]);

                    for (var i = 0, l = attr.length; i < l; i++) {
                        name = attr[i].name;

                        if (name.indexOf("data-") === 0) {
                            name = name.substr(5);
                            dataAttr(this[0], name, data[name]);
                        }
                    }
                }

                return data;

            } else if (typeof key === "object") {
                return this.each(function () {
                    jQuery.data(this, key);
                });
            }

            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";

            if (value === undefined) {
                data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

                // Try to fetch any internally stored data first
                if (data === undefined && this.length) {
                    data = jQuery.data(this[0], key);
                    data = dataAttr(this[0], key, data);
                }

                return data === undefined && parts[1] ?
				this.data(parts[0]) :
				data;

            } else {
                return this.each(function () {
                    var $this = jQuery(this),
					args = [parts[0], value];

                    $this.triggerHandler("setData" + parts[1] + "!", args);
                    jQuery.data(this, key, value);
                    $this.triggerHandler("changeData" + parts[1] + "!", args);
                });
            }
        },

        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key);
            });
        }
    });

    function dataAttr(elem, key, data) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if (data === undefined && elem.nodeType === 1) {
            data = elem.getAttribute("data-" + key);

            if (typeof data === "string") {
                try {
                    data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN(data) ? parseFloat(data) :
					rbrace.test(data) ? jQuery.parseJSON(data) :
					data;
                } catch (e) { }

                // Make sure we set the data so it isn't changed later
                jQuery.data(elem, key, data);

            } else {
                data = undefined;
            }
        }

        return data;
    }




    jQuery.extend({
        queue: function (elem, type, data) {
            if (!elem) {
                return;
            }

            type = (type || "fx") + "queue";
            var q = jQuery.data(elem, type);

            // Speed up dequeue by getting out quickly if this is just a lookup
            if (!data) {
                return q || [];
            }

            if (!q || jQuery.isArray(data)) {
                q = jQuery.data(elem, type, jQuery.makeArray(data));

            } else {
                q.push(data);
            }

            return q;
        },

        dequeue: function (elem, type) {
            type = type || "fx";

            var queue = jQuery.queue(elem, type),
			fn = queue.shift();

            // If the fx queue is dequeued, always remove the progress sentinel
            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function () {
                    jQuery.dequeue(elem, type);
                });
            }
        }
    });

    jQuery.fn.extend({
        queue: function (type, data) {
            if (typeof type !== "string") {
                data = type;
                type = "fx";
            }

            if (data === undefined) {
                return jQuery.queue(this[0], type);
            }
            return this.each(function (i) {
                var queue = jQuery.queue(this, type, data);

                if (type === "fx" && queue[0] !== "inprogress") {
                    jQuery.dequeue(this, type);
                }
            });
        },
        dequeue: function (type) {
            return this.each(function () {
                jQuery.dequeue(this, type);
            });
        },

        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function (time, type) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";

            return this.queue(type, function () {
                var elem = this;
                setTimeout(function () {
                    jQuery.dequeue(elem, type);
                }, time);
            });
        },

        clearQueue: function (type) {
            return this.queue(type || "fx", []);
        }
    });




    var rclass = /[\n\t]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

    jQuery.props = {
        "for": "htmlFor",
        "class": "className",
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        colspan: "colSpan",
        tabindex: "tabIndex",
        usemap: "useMap",
        frameborder: "frameBorder"
    };

    jQuery.fn.extend({
        attr: function (name, value) {
            return jQuery.access(this, name, value, true, jQuery.attr);
        },

        removeAttr: function (name, fn) {
            return this.each(function () {
                jQuery.attr(this, name, "");
                if (this.nodeType === 1) {
                    this.removeAttribute(name);
                }
            });
        },

        addClass: function (value) {
            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self.addClass(value.call(this, i, self.attr("class")));
                });
            }

            if (value && typeof value === "string") {
                var classNames = (value || "").split(rspaces);

                for (var i = 0, l = this.length; i < l; i++) {
                    var elem = this[i];

                    if (elem.nodeType === 1) {
                        if (!elem.className) {
                            elem.className = value;

                        } else {
                            var className = " " + elem.className + " ",
							setClass = elem.className;

                            for (var c = 0, cl = classNames.length; c < cl; c++) {
                                if (className.indexOf(" " + classNames[c] + " ") < 0) {
                                    setClass += " " + classNames[c];
                                }
                            }
                            elem.className = jQuery.trim(setClass);
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function (value) {
            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self.removeClass(value.call(this, i, self.attr("class")));
                });
            }

            if ((value && typeof value === "string") || value === undefined) {
                var classNames = (value || "").split(rspaces);

                for (var i = 0, l = this.length; i < l; i++) {
                    var elem = this[i];

                    if (elem.nodeType === 1 && elem.className) {
                        if (value) {
                            var className = (" " + elem.className + " ").replace(rclass, " ");
                            for (var c = 0, cl = classNames.length; c < cl; c++) {
                                className = className.replace(" " + classNames[c] + " ", " ");
                            }
                            elem.className = jQuery.trim(className);

                        } else {
                            elem.className = "";
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function (value, stateVal) {
            var type = typeof value,
			isBool = typeof stateVal === "boolean";

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self.toggleClass(value.call(this, i, self.attr("class"), stateVal), stateVal);
                });
            }

            return this.each(function () {
                if (type === "string") {
                    // toggle individual class names
                    var className,
					i = 0,
					self = jQuery(this),
					state = stateVal,
					classNames = value.split(rspaces);

                    while ((className = classNames[i++])) {
                        // check each className given, space seperated list
                        state = isBool ? state : !self.hasClass(className);
                        self[state ? "addClass" : "removeClass"](className);
                    }

                } else if (type === "undefined" || type === "boolean") {
                    if (this.className) {
                        // store className if set
                        jQuery.data(this, "__className__", this.className);
                    }

                    // toggle whole className
                    this.className = this.className || value === false ? "" : jQuery.data(this, "__className__") || "";
                }
            });
        },

        hasClass: function (selector) {
            var className = " " + selector + " ";
            for (var i = 0, l = this.length; i < l; i++) {
                if ((" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1) {
                    return true;
                }
            }

            return false;
        },

        val: function (value) {
            if (!arguments.length) {
                var elem = this[0];

                if (elem) {
                    if (jQuery.nodeName(elem, "option")) {
                        // attributes.value is undefined in Blackberry 4.7 but
                        // uses .value. See #6932
                        var val = elem.attributes.value;
                        return !val || val.specified ? elem.value : elem.text;
                    }

                    // We need to handle select boxes special
                    if (jQuery.nodeName(elem, "select")) {
                        var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

                        // Nothing was selected
                        if (index < 0) {
                            return null;
                        }

                        // Loop through all the selected options
                        for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
                            var option = options[i];

                            // Don't return options that are disabled or in a disabled optgroup
                            if (option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

                                // Get the specific value for the option
                                value = jQuery(option).val();

                                // We don't need an array for one selects
                                if (one) {
                                    return value;
                                }

                                // Multi-Selects return an array
                                values.push(value);
                            }
                        }

                        return values;
                    }

                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    if (rradiocheck.test(elem.type) && !jQuery.support.checkOn) {
                        return elem.getAttribute("value") === null ? "on" : elem.value;
                    }


                    // Everything else, we just grab the value
                    return (elem.value || "").replace(rreturn, "");

                }

                return undefined;
            }

            var isFunction = jQuery.isFunction(value);

            return this.each(function (i) {
                var self = jQuery(this), val = value;

                if (this.nodeType !== 1) {
                    return;
                }

                if (isFunction) {
                    val = value.call(this, i, self.val());
                }

                // Treat null/undefined as ""; convert numbers to string
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function (value) {
                        return value == null ? "" : value + "";
                    });
                }

                if (jQuery.isArray(val) && rradiocheck.test(this.type)) {
                    this.checked = jQuery.inArray(self.val(), val) >= 0;

                } else if (jQuery.nodeName(this, "select")) {
                    var values = jQuery.makeArray(val);

                    jQuery("option", this).each(function () {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
                    });

                    if (!values.length) {
                        this.selectedIndex = -1;
                    }

                } else {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },

        attr: function (elem, name, value, pass) {
            // don't set attributes on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8) {
                return undefined;
            }

            if (pass && name in jQuery.attrFn) {
                return jQuery(elem)[name](value);
            }

            var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc(elem),
            // Whether we are setting (or getting)
			set = value !== undefined;

            // Try to normalize/fix the name
            name = notxml && jQuery.props[name] || name;

            // These attributes require special treatment
            var special = rspecialurl.test(name);

            // Safari mis-reports the default selected property of an option
            // Accessing the parent's selectedIndex property fixes it
            if (name === "selected" && !jQuery.support.optSelected) {
                var parent = elem.parentNode;
                if (parent) {
                    parent.selectedIndex;

                    // Make sure that it also works with optgroups, see #5701
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
            }

            // If applicable, access the attribute via the DOM 0 way
            // 'in' checks fail in Blackberry 4.7 #6931
            if ((name in elem || elem[name] !== undefined) && notxml && !special) {
                if (set) {
                    // We can't allow the type property to be changed (since it causes problems in IE)
                    if (name === "type" && rtype.test(elem.nodeName) && elem.parentNode) {
                        jQuery.error("type property can't be changed");
                    }

                    if (value === null) {
                        if (elem.nodeType === 1) {
                            elem.removeAttribute(name);
                        }

                    } else {
                        elem[name] = value;
                    }
                }

                // browsers index elements by id/name on forms, give priority to attributes.
                if (jQuery.nodeName(elem, "form") && elem.getAttributeNode(name)) {
                    return elem.getAttributeNode(name).nodeValue;
                }

                // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                if (name === "tabIndex") {
                    var attributeNode = elem.getAttributeNode("tabIndex");

                    return attributeNode && attributeNode.specified ?
					attributeNode.value :
					rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
						0 :
						undefined;
                }

                return elem[name];
            }

            if (!jQuery.support.style && notxml && name === "style") {
                if (set) {
                    elem.style.cssText = "" + value;
                }

                return elem.style.cssText;
            }

            if (set) {
                // convert the value to a string (all browsers do this but IE) see #1070
                elem.setAttribute(name, "" + value);
            }

            // Ensure that missing attributes return undefined
            // Blackberry 4.7 returns "" from getAttribute #6938
            if (!elem.attributes[name] && (elem.hasAttribute && !elem.hasAttribute(name))) {
                return undefined;
            }

            var attr = !jQuery.support.hrefNormalized && notxml && special ?
            // Some attributes require a special call on IE
				elem.getAttribute(name, 2) :
				elem.getAttribute(name);

            // Non-existent attributes return null, we normalize to undefined
            return attr === null ? undefined : attr;
        }
    });




    var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function (nm) {
	    return nm.replace(rescape, "\\$&");
	},
	focusCounts = { focusin: 0, focusout: 0 };

    /*
    * A number of helper functions used for managing events.
    * Many of the ideas behind this code originated from
    * Dean Edwards' addEvent library.
    */
    jQuery.event = {

        // Bind an event to an element
        // Original by Dean Edwards
        add: function (elem, types, handler, data) {
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            // For whatever reason, IE has trouble passing the window object
            // around, causing it to be cloned in the process
            if (jQuery.isWindow(elem) && (elem !== window && !elem.frameElement)) {
                elem = window;
            }

            if (handler === false) {
                handler = returnFalse;
            } else if (!handler) {
                // Fixes bug #7229. Fix recommended by jdalton
                return;
            }

            var handleObjIn, handleObj;

            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
            }

            // Make sure that the function being executed has a unique ID
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure
            var elemData = jQuery.data(elem);

            // If no elemData is found then we must be trying to bind to one of the
            // banned noData elements
            if (!elemData) {
                return;
            }

            // Use a key less likely to result in collisions for plain JS objects.
            // Fixes bug #7150.
            var eventKey = elem.nodeType ? "events" : "__events__",
			events = elemData[eventKey],
			eventHandle = elemData.handle;

            if (typeof events === "function") {
                // On plain objects events is a fn that holds the the data
                // which prevents this data from being JSON serialized
                // the function does not need to be called, it just contains the data
                eventHandle = events.handle;
                events = events.events;

            } else if (!events) {
                if (!elem.nodeType) {
                    // On plain objects, create a fn that acts as the holder
                    // of the values to avoid JSON serialization of event data
                    elemData[eventKey] = elemData = function () { };
                }

                elemData.events = events = {};
            }

            if (!eventHandle) {
                elemData.handle = eventHandle = function () {
                    // Handle the second event of a trigger and when
                    // an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply(eventHandle.elem, arguments) :
					undefined;
                };
            }

            // Add elem as a property of the handle function
            // This is to prevent a memory leak with non-native events in IE.
            eventHandle.elem = elem;

            // Handle multiple events separated by a space
            // jQuery(...).bind("mouseover mouseout", fn);
            types = types.split(" ");

            var type, i = 0, namespaces;

            while ((type = types[i++])) {
                handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

                // Namespaced event handlers
                if (type.indexOf(".") > -1) {
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    handleObj.namespace = namespaces.slice(0).sort().join(".");

                } else {
                    namespaces = [];
                    handleObj.namespace = "";
                }

                handleObj.type = type;
                if (!handleObj.guid) {
                    handleObj.guid = handler.guid;
                }

                // Get the current list of functions bound to this event
                var handlers = events[type],
				special = jQuery.event.special[type] || {};

                // Init the event handler queue
                if (!handlers) {
                    handlers = events[type] = [];

                    // Check for a special event handler
                    // Only use addEventListener/attachEvent if the special
                    // events handler returns false
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        // Bind the global event handler to the element
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);

                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }

                if (special.add) {
                    special.add.call(elem, handleObj);

                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add the function to the element's handler list
                handlers.push(handleObj);

                // Keep track of which events have been used, for global triggering
                jQuery.event.global[type] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        global: {},

        // Detach an event or set of events from an element
        remove: function (elem, types, handler, pos) {
            // don't do events on text and comment nodes
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }

            if (handler === false) {
                handler = returnFalse;
            }

            var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			eventKey = elem.nodeType ? "events" : "__events__",
			elemData = jQuery.data(elem),
			events = elemData && elemData[eventKey];

            if (!elemData || !events) {
                return;
            }

            if (typeof events === "function") {
                elemData = events;
                events = events.events;
            }

            // types is actually an event object here
            if (types && types.type) {
                handler = types.handler;
                types = types.type;
            }

            // Unbind all events for the element
            if (!types || typeof types === "string" && types.charAt(0) === ".") {
                types = types || "";

                for (type in events) {
                    jQuery.event.remove(elem, type + types);
                }

                return;
            }

            // Handle multiple events separated by a space
            // jQuery(...).unbind("mouseover mouseout", fn);
            types = types.split(" ");

            while ((type = types[i++])) {
                origType = type;
                handleObj = null;
                all = type.indexOf(".") < 0;
                namespaces = [];

                if (!all) {
                    // Namespaced event handlers
                    namespaces = type.split(".");
                    type = namespaces.shift();

                    namespace = new RegExp("(^|\\.)" +
					jQuery.map(namespaces.slice(0).sort(), fcleanup).join("\\.(?:.*\\.)?") + "(\\.|$)");
                }

                eventType = events[type];

                if (!eventType) {
                    continue;
                }

                if (!handler) {
                    for (j = 0; j < eventType.length; j++) {
                        handleObj = eventType[j];

                        if (all || namespace.test(handleObj.namespace)) {
                            jQuery.event.remove(elem, origType, handleObj.handler, j);
                            eventType.splice(j--, 1);
                        }
                    }

                    continue;
                }

                special = jQuery.event.special[type] || {};

                for (j = pos || 0; j < eventType.length; j++) {
                    handleObj = eventType[j];

                    if (handler.guid === handleObj.guid) {
                        // remove the given handler for the given type
                        if (all || namespace.test(handleObj.namespace)) {
                            if (pos == null) {
                                eventType.splice(j--, 1);
                            }

                            if (special.remove) {
                                special.remove.call(elem, handleObj);
                            }
                        }

                        if (pos != null) {
                            break;
                        }
                    }
                }

                // remove generic event handler if no more handlers exist
                if (eventType.length === 0 || pos != null && eventType.length === 1) {
                    if (!special.teardown || special.teardown.call(elem, namespaces) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }

                    ret = null;
                    delete events[type];
                }
            }

            // Remove the expando if it's no longer used
            if (jQuery.isEmptyObject(events)) {
                var handle = elemData.handle;
                if (handle) {
                    handle.elem = null;
                }

                delete elemData.events;
                delete elemData.handle;

                if (typeof elemData === "function") {
                    jQuery.removeData(elem, eventKey);

                } else if (jQuery.isEmptyObject(elemData)) {
                    jQuery.removeData(elem);
                }
            }
        },

        // bubbling is internal
        trigger: function (event, data, elem /*, bubbling */) {
            // Event object or event type
            var type = event.type || event,
			bubbling = arguments[3];

            if (!bubbling) {
                event = typeof event === "object" ?
                // jQuery.Event object
				event[jQuery.expando] ? event :
                // Object literal
				jQuery.extend(jQuery.Event(type), event) :
                // Just the event type (string)
				jQuery.Event(type);

                if (type.indexOf("!") >= 0) {
                    event.type = type = type.slice(0, -1);
                    event.exclusive = true;
                }

                // Handle a global trigger
                if (!elem) {
                    // Don't bubble custom events when global (to avoid too much overhead)
                    event.stopPropagation();

                    // Only trigger if we've ever bound an event for it
                    if (jQuery.event.global[type]) {
                        jQuery.each(jQuery.cache, function () {
                            if (this.events && this.events[type]) {
                                jQuery.event.trigger(event, data, this.handle.elem);
                            }
                        });
                    }
                }

                // Handle triggering a single element

                // don't do events on text and comment nodes
                if (!elem || elem.nodeType === 3 || elem.nodeType === 8) {
                    return undefined;
                }

                // Clean up in case it is reused
                event.result = undefined;
                event.target = elem;

                // Clone the incoming data, if any
                data = jQuery.makeArray(data);
                data.unshift(event);
            }

            event.currentTarget = elem;

            // Trigger the event, it is assumed that "handle" is a function
            var handle = elem.nodeType ?
			jQuery.data(elem, "handle") :
			(jQuery.data(elem, "__events__") || {}).handle;

            if (handle) {
                handle.apply(elem, data);
            }

            var parent = elem.parentNode || elem.ownerDocument;

            // Trigger an inline bound script
            try {
                if (!(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()])) {
                    if (elem["on" + type] && elem["on" + type].apply(elem, data) === false) {
                        event.result = false;
                        event.preventDefault();
                    }
                }

                // prevent IE from throwing an error for some elements with some event types, see #3533
            } catch (inlineError) { }

            if (!event.isPropagationStopped() && parent) {
                jQuery.event.trigger(event, data, parent, true);

            } else if (!event.isDefaultPrevented()) {
                var old,
				target = event.target,
				targetType = type.replace(rnamespaces, ""),
				isClick = jQuery.nodeName(target, "a") && targetType === "click",
				special = jQuery.event.special[targetType] || {};

                if ((!special._default || special._default.call(elem, event) === false) &&
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()])) {

                    try {
                        if (target[targetType]) {
                            // Make sure that we don't accidentally re-trigger the onFOO events
                            old = target["on" + targetType];

                            if (old) {
                                target["on" + targetType] = null;
                            }

                            jQuery.event.triggered = true;
                            target[targetType]();
                        }

                        // prevent IE from throwing an error for some elements with some event types, see #3533
                    } catch (triggerError) { }

                    if (old) {
                        target["on" + targetType] = old;
                    }

                    jQuery.event.triggered = false;
                }
            }
        },

        handle: function (event) {
            var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray(arguments);

            event = args[0] = jQuery.event.fix(event || window.event);
            event.currentTarget = this;

            // Namespaced event handlers
            all = event.type.indexOf(".") < 0 && !event.exclusive;

            if (!all) {
                namespaces = event.type.split(".");
                event.type = namespaces.shift();
                namespace_sort = namespaces.slice(0).sort();
                namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
            }

            event.namespace = event.namespace || namespace_sort.join(".");

            events = jQuery.data(this, this.nodeType ? "events" : "__events__");

            if (typeof events === "function") {
                events = events.events;
            }

            handlers = (events || {})[event.type];

            if (events && handlers) {
                // Clone the handlers to prevent manipulation
                handlers = handlers.slice(0);

                for (var j = 0, l = handlers.length; j < l; j++) {
                    var handleObj = handlers[j];

                    // Filter the functions by class
                    if (all || namespace_re.test(handleObj.namespace)) {
                        // Pass in a reference to the handler function itself
                        // So that we can later remove it
                        event.handler = handleObj.handler;
                        event.data = handleObj.data;
                        event.handleObj = handleObj;

                        var ret = handleObj.handler.apply(this, args);

                        if (ret !== undefined) {
                            event.result = ret;
                            if (ret === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }

                        if (event.isImmediatePropagationStopped()) {
                            break;
                        }
                    }
                }
            }

            return event.result;
        },

        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

        fix: function (event) {
            if (event[jQuery.expando]) {
                return event;
            }

            // store a copy of the original event object
            // and "clone" to set read-only properties
            var originalEvent = event;
            event = jQuery.Event(originalEvent);

            for (var i = this.props.length, prop; i; ) {
                prop = this.props[--i];
                event[prop] = originalEvent[prop];
            }

            // Fix target property, if necessary
            if (!event.target) {
                // Fixes #1925 where srcElement might not be defined either
                event.target = event.srcElement || document;
            }

            // check if target is a textnode (safari)
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }

            // Add relatedTarget, if necessary
            if (!event.relatedTarget && event.fromElement) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
            }

            // Calculate pageX/Y if missing and clientX/Y available
            if (event.pageX == null && event.clientX != null) {
                var doc = document.documentElement,
				body = document.body;

                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
            }

            // Add which for key events
            if (event.which == null && (event.charCode != null || event.keyCode != null)) {
                event.which = event.charCode != null ? event.charCode : event.keyCode;
            }

            // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if (!event.metaKey && event.ctrlKey) {
                event.metaKey = event.ctrlKey;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if (!event.which && event.button !== undefined) {
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
            }

            return event;
        },

        // Deprecated, use jQuery.guid instead
        guid: 1E8,

        // Deprecated, use jQuery.proxy instead
        proxy: jQuery.proxy,

        special: {
            ready: {
                // Make sure the ready event is setup
                setup: jQuery.bindReady,
                teardown: jQuery.noop
            },

            live: {
                add: function (handleObj) {
                    jQuery.event.add(this,
					liveConvert(handleObj.origType, handleObj.selector),
					jQuery.extend({}, handleObj, { handler: liveHandler, guid: handleObj.handler.guid }));
                },

                remove: function (handleObj) {
                    jQuery.event.remove(this, liveConvert(handleObj.origType, handleObj.selector), handleObj);
                }
            },

            beforeunload: {
                setup: function (data, namespaces, eventHandle) {
                    // We only want to do this special case on windows
                    if (jQuery.isWindow(this)) {
                        this.onbeforeunload = eventHandle;
                    }
                },

                teardown: function (namespaces, eventHandle) {
                    if (this.onbeforeunload === eventHandle) {
                        this.onbeforeunload = null;
                    }
                }
            }
        }
    };

    jQuery.removeEvent = document.removeEventListener ?
	function (elem, type, handle) {
	    if (elem.removeEventListener) {
	        elem.removeEventListener(type, handle, false);
	    }
	} :
	function (elem, type, handle) {
	    if (elem.detachEvent) {
	        elem.detachEvent("on" + type, handle);
	    }
	};

    jQuery.Event = function (src) {
        // Allow instantiation without the 'new' keyword
        if (!this.preventDefault) {
            return new jQuery.Event(src);
        }

        // Event object
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            // Event type
        } else {
            this.type = src;
        }

        // timeStamp is buggy for some events on Firefox(#3843)
        // So we won't rely on the native value
        this.timeStamp = jQuery.now();

        // Mark it as fixed
        this[jQuery.expando] = true;
    };

    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        preventDefault: function () {
            this.isDefaultPrevented = returnTrue;

            var e = this.originalEvent;
            if (!e) {
                return;
            }

            // if preventDefault exists run it on the original event
            if (e.preventDefault) {
                e.preventDefault();

                // otherwise set the returnValue property of the original event to false (IE)
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function () {
            this.isPropagationStopped = returnTrue;

            var e = this.originalEvent;
            if (!e) {
                return;
            }
            // if stopPropagation exists run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };

    // Checks if an event happened on an element within another element
    // Used in jQuery.event.special.mouseenter and mouseleave handlers
    var withinElement = function (event) {
        // Check if mouse(over|out) are still within the same parent element
        var parent = event.relatedTarget;

        // Firefox sometimes assigns relatedTarget a XUL element
        // which we cannot access the parentNode property of
        try {
            // Traverse up the tree
            while (parent && parent !== this) {
                parent = parent.parentNode;
            }

            if (parent !== this) {
                // set the correct event type
                event.type = event.data;

                // handle event if we actually just moused on to a non sub-element
                jQuery.event.handle.apply(this, arguments);
            }

            // assuming we've left the element since we most likely mousedover a xul element
        } catch (e) { }
    },

    // In case of event delegation, we only need to rename the event.type,
    // liveHandler will take care of the rest.
delegate = function (event) {
    event.type = event.data;
    jQuery.event.handle.apply(this, arguments);
};

    // Create mouseenter and mouseleave events
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function (orig, fix) {
        jQuery.event.special[orig] = {
            setup: function (data) {
                jQuery.event.add(this, fix, data && data.selector ? delegate : withinElement, orig);
            },
            teardown: function (data) {
                jQuery.event.remove(this, fix, data && data.selector ? delegate : withinElement);
            }
        };
    });

    // submit delegation
    if (!jQuery.support.submitBubbles) {

        jQuery.event.special.submit = {
            setup: function (data, namespaces) {
                if (this.nodeName.toLowerCase() !== "form") {
                    jQuery.event.add(this, "click.specialSubmit", function (e) {
                        var elem = e.target,
						type = elem.type;

                        if ((type === "submit" || type === "image") && jQuery(elem).closest("form").length) {
                            e.liveFired = undefined;
                            return trigger("submit", this, arguments);
                        }
                    });

                    jQuery.event.add(this, "keypress.specialSubmit", function (e) {
                        var elem = e.target,
						type = elem.type;

                        if ((type === "text" || type === "password") && jQuery(elem).closest("form").length && e.keyCode === 13) {
                            e.liveFired = undefined;
                            return trigger("submit", this, arguments);
                        }
                    });

                } else {
                    return false;
                }
            },

            teardown: function (namespaces) {
                jQuery.event.remove(this, ".specialSubmit");
            }
        };

    }

    // change delegation, happens here so we have bind.
    if (!jQuery.support.changeBubbles) {

        var changeFilters,

	getVal = function (elem) {
	    var type = elem.type, val = elem.value;

	    if (type === "radio" || type === "checkbox") {
	        val = elem.checked;

	    } else if (type === "select-multiple") {
	        val = elem.selectedIndex > -1 ?
				jQuery.map(elem.options, function (elem) {
				    return elem.selected;
				}).join("-") :
				"";

	    } else if (elem.nodeName.toLowerCase() === "select") {
	        val = elem.selectedIndex;
	    }

	    return val;
	},

	testChange = function testChange(e) {
	    var elem = e.target, data, val;

	    if (!rformElems.test(elem.nodeName) || elem.readOnly) {
	        return;
	    }

	    data = jQuery.data(elem, "_change_data");
	    val = getVal(elem);

	    // the current data will be also retrieved by beforeactivate
	    if (e.type !== "focusout" || elem.type !== "radio") {
	        jQuery.data(elem, "_change_data", val);
	    }

	    if (data === undefined || val === data) {
	        return;
	    }

	    if (data != null || val) {
	        e.type = "change";
	        e.liveFired = undefined;
	        return jQuery.event.trigger(e, arguments[1], elem);
	    }
	};

        jQuery.event.special.change = {
            filters: {
                focusout: testChange,

                beforedeactivate: testChange,

                click: function (e) {
                    var elem = e.target, type = elem.type;

                    if (type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select") {
                        return testChange.call(this, e);
                    }
                },

                // Change has to be called before submit
                // Keydown will be called before keypress, which is used in submit-event delegation
                keydown: function (e) {
                    var elem = e.target, type = elem.type;

                    if ((e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple") {
                        return testChange.call(this, e);
                    }
                },

                // Beforeactivate happens also before the previous element is blurred
                // with this event you can't trigger a change event, but you can store
                // information
                beforeactivate: function (e) {
                    var elem = e.target;
                    jQuery.data(elem, "_change_data", getVal(elem));
                }
            },

            setup: function (data, namespaces) {
                if (this.type === "file") {
                    return false;
                }

                for (var type in changeFilters) {
                    jQuery.event.add(this, type + ".specialChange", changeFilters[type]);
                }

                return rformElems.test(this.nodeName);
            },

            teardown: function (namespaces) {
                jQuery.event.remove(this, ".specialChange");

                return rformElems.test(this.nodeName);
            }
        };

        changeFilters = jQuery.event.special.change.filters;

        // Handle when the input is .focus()'d
        changeFilters.focus = changeFilters.beforeactivate;
    }

    function trigger(type, elem, args) {
        args[0].type = type;
        return jQuery.event.handle.apply(elem, args);
    }

    // Create "bubbling" focus and blur events
    if (document.addEventListener) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {
            jQuery.event.special[fix] = {
                setup: function () {
                    if (focusCounts[fix]++ === 0) {
                        document.addEventListener(orig, handler, true);
                    }
                },
                teardown: function () {
                    if (--focusCounts[fix] === 0) {
                        document.removeEventListener(orig, handler, true);
                    }
                }
            };

            function handler(e) {
                e = jQuery.event.fix(e);
                e.type = fix;
                return jQuery.event.trigger(e, null, e.target);
            }
        });
    }

    jQuery.each(["bind", "one"], function (i, name) {
        jQuery.fn[name] = function (type, data, fn) {
            // Handle object literals
            if (typeof type === "object") {
                for (var key in type) {
                    this[name](key, data, type[key], fn);
                }
                return this;
            }

            if (jQuery.isFunction(data) || data === false) {
                fn = data;
                data = undefined;
            }

            var handler = name === "one" ? jQuery.proxy(fn, function (event) {
                jQuery(this).unbind(event, handler);
                return fn.apply(this, arguments);
            }) : fn;

            if (type === "unload" && name !== "one") {
                this.one(type, data, fn);

            } else {
                for (var i = 0, l = this.length; i < l; i++) {
                    jQuery.event.add(this[i], type, handler, data);
                }
            }

            return this;
        };
    });

    jQuery.fn.extend({
        unbind: function (type, fn) {
            // Handle object literals
            if (typeof type === "object" && !type.preventDefault) {
                for (var key in type) {
                    this.unbind(key, type[key]);
                }

            } else {
                for (var i = 0, l = this.length; i < l; i++) {
                    jQuery.event.remove(this[i], type, fn);
                }
            }

            return this;
        },

        delegate: function (selector, types, data, fn) {
            return this.live(types, data, fn, selector);
        },

        undelegate: function (selector, types, fn) {
            if (arguments.length === 0) {
                return this.unbind("live");

            } else {
                return this.die(types, null, fn, selector);
            }
        },

        trigger: function (type, data) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this);
            });
        },

        triggerHandler: function (type, data) {
            if (this[0]) {
                var event = jQuery.Event(type);
                event.preventDefault();
                event.stopPropagation();
                jQuery.event.trigger(event, data, this[0]);
                return event.result;
            }
        },

        toggle: function (fn) {
            // Save reference to arguments for access in closure
            var args = arguments,
			i = 1;

            // link all the functions, so any of them can unbind this click handler
            while (i < args.length) {
                jQuery.proxy(fn, args[i++]);
            }

            return this.click(jQuery.proxy(fn, function (event) {
                // Figure out which function to execute
                var lastToggle = (jQuery.data(this, "lastToggle" + fn.guid) || 0) % i;
                jQuery.data(this, "lastToggle" + fn.guid, lastToggle + 1);

                // Make sure that clicks stop
                event.preventDefault();

                // and execute the function
                return args[lastToggle].apply(this, arguments) || false;
            }));
        },

        hover: function (fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });

    var liveMap = {
        focus: "focusin",
        blur: "focusout",
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };

    jQuery.each(["live", "die"], function (i, name) {
        jQuery.fn[name] = function (types, data, fn, origSelector /* Internal Use Only */) {
            var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery(this.context);

            if (typeof types === "object" && !types.preventDefault) {
                for (var key in types) {
                    context[name](key, data, types[key], selector);
                }

                return this;
            }

            if (jQuery.isFunction(data)) {
                fn = data;
                data = undefined;
            }

            types = (types || "").split(" ");

            while ((type = types[i++]) != null) {
                match = rnamespaces.exec(type);
                namespaces = "";

                if (match) {
                    namespaces = match[0];
                    type = type.replace(rnamespaces, "");
                }

                if (type === "hover") {
                    types.push("mouseenter" + namespaces, "mouseleave" + namespaces);
                    continue;
                }

                preType = type;

                if (type === "focus" || type === "blur") {
                    types.push(liveMap[type] + namespaces);
                    type = type + namespaces;

                } else {
                    type = (liveMap[type] || type) + namespaces;
                }

                if (name === "live") {
                    // bind live handler
                    for (var j = 0, l = context.length; j < l; j++) {
                        jQuery.event.add(context[j], "live." + liveConvert(type, selector),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType });
                    }

                } else {
                    // unbind live handler
                    context.unbind("live." + liveConvert(type, selector), fn);
                }
            }

            return this;
        };
    });

    function liveHandler(event) {
        var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery.data(this, this.nodeType ? "events" : "__events__");

        if (typeof events === "function") {
            events = events.events;
        }

        // Make sure we avoid non-left-click bubbling in Firefox (#3861)
        if (event.liveFired === this || !events || !events.live || event.button && event.type === "click") {
            return;
        }

        if (event.namespace) {
            namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
        }

        event.liveFired = this;

        var live = events.live.slice(0);

        for (j = 0; j < live.length; j++) {
            handleObj = live[j];

            if (handleObj.origType.replace(rnamespaces, "") === event.type) {
                selectors.push(handleObj.selector);

            } else {
                live.splice(j--, 1);
            }
        }

        match = jQuery(event.target).closest(selectors, event.currentTarget);

        for (i = 0, l = match.length; i < l; i++) {
            close = match[i];

            for (j = 0; j < live.length; j++) {
                handleObj = live[j];

                if (close.selector === handleObj.selector && (!namespace || namespace.test(handleObj.namespace))) {
                    elem = close.elem;
                    related = null;

                    // Those two events require additional checking
                    if (handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave") {
                        event.type = handleObj.preType;
                        related = jQuery(event.relatedTarget).closest(handleObj.selector)[0];
                    }

                    if (!related || related !== elem) {
                        elems.push({ elem: elem, handleObj: handleObj, level: close.level });
                    }
                }
            }
        }

        for (i = 0, l = elems.length; i < l; i++) {
            match = elems[i];

            if (maxLevel && match.level > maxLevel) {
                break;
            }

            event.currentTarget = match.elem;
            event.data = match.handleObj.data;
            event.handleObj = match.handleObj;

            ret = match.handleObj.origHandler.apply(match.elem, arguments);

            if (ret === false || event.isPropagationStopped()) {
                maxLevel = match.level;

                if (ret === false) {
                    stop = false;
                }
                if (event.isImmediatePropagationStopped()) {
                    break;
                }
            }
        }

        return stop;
    }

    function liveConvert(type, selector) {
        return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
    }

    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function (i, name) {

	    // Handle event binding
	    jQuery.fn[name] = function (data, fn) {
	        if (fn == null) {
	            fn = data;
	            data = null;
	        }

	        return arguments.length > 0 ?
			this.bind(name, data, fn) :
			this.trigger(name);
	    };

	    if (jQuery.attrFn) {
	        jQuery.attrFn[name] = true;
	    }
	});

    // Prevent memory leaks in IE
    // Window isn't included so as not to unbind existing unload events
    // More info:
    //  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
    if (window.attachEvent && !window.addEventListener) {
        jQuery(window).bind("unload", function () {
            for (var id in jQuery.cache) {
                if (jQuery.cache[id].handle) {
                    // Try/Catch is to handle iframes being unloaded, see #4280
                    try {
                        jQuery.event.remove(jQuery.cache[id].handle.elem);
                    } catch (e) { }
                }
            }
        });
    }


    /*!
    * Sizzle CSS Selector Engine - v1.0
    *  Copyright 2009, The Dojo Foundation
    *  Released under the MIT, BSD, and GPL Licenses.
    *  More information: http://sizzlejs.com/
    */
    (function () {

        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

        // Here we check if the JavaScript engine is using some sort of
        // optimization where it does not always call our comparision
        // function. If that is the case, discard the hasDuplicate value.
        //   Thus far that includes Google Chrome.
        [0, 0].sort(function () {
            baseHasDuplicate = false;
            return 0;
        });

        var Sizzle = function (selector, context, results, seed) {
            results = results || [];
            context = context || document;

            var origContext = context;

            if (context.nodeType !== 1 && context.nodeType !== 9) {
                return [];
            }

            if (!selector || typeof selector !== "string") {
                return results;
            }

            var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML(context),
		parts = [],
		soFar = selector;

            // Reset the position of the chunker regexp (start from head)
            do {
                chunker.exec("");
                m = chunker.exec(soFar);

                if (m) {
                    soFar = m[3];

                    parts.push(m[1]);

                    if (m[2]) {
                        extra = m[3];
                        break;
                    }
                }
            } while (m);

            if (parts.length > 1 && origPOS.exec(selector)) {

                if (parts.length === 2 && Expr.relative[parts[0]]) {
                    set = posProcess(parts[0] + parts[1], context);

                } else {
                    set = Expr.relative[parts[0]] ?
				[context] :
				Sizzle(parts.shift(), context);

                    while (parts.length) {
                        selector = parts.shift();

                        if (Expr.relative[selector]) {
                            selector += parts.shift();
                        }

                        set = posProcess(selector, set);
                    }
                }

            } else {
                // Take a shortcut and set the context if the root selector is an ID
                // (but not if it'll be faster if the inner selector is an ID)
                if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {

                    ret = Sizzle.find(parts.shift(), context, contextXML);
                    context = ret.expr ?
				Sizzle.filter(ret.expr, ret.set)[0] :
				ret.set[0];
                }

                if (context) {
                    ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed)} :
				Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);

                    set = ret.expr ?
				Sizzle.filter(ret.expr, ret.set) :
				ret.set;

                    if (parts.length > 0) {
                        checkSet = makeArray(set);

                    } else {
                        prune = false;
                    }

                    while (parts.length) {
                        cur = parts.pop();
                        pop = cur;

                        if (!Expr.relative[cur]) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }

                        if (pop == null) {
                            pop = context;
                        }

                        Expr.relative[cur](checkSet, pop, contextXML);
                    }

                } else {
                    checkSet = parts = [];
                }
            }

            if (!checkSet) {
                checkSet = set;
            }

            if (!checkSet) {
                Sizzle.error(cur || selector);
            }

            if (toString.call(checkSet) === "[object Array]") {
                if (!prune) {
                    results.push.apply(results, checkSet);

                } else if (context && context.nodeType === 1) {
                    for (i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                            results.push(set[i]);
                        }
                    }

                } else {
                    for (i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && checkSet[i].nodeType === 1) {
                            results.push(set[i]);
                        }
                    }
                }

            } else {
                makeArray(checkSet, results);
            }

            if (extra) {
                Sizzle(extra, origContext, results, seed);
                Sizzle.uniqueSort(results);
            }

            return results;
        };

        Sizzle.uniqueSort = function (results) {
            if (sortOrder) {
                hasDuplicate = baseHasDuplicate;
                results.sort(sortOrder);

                if (hasDuplicate) {
                    for (var i = 1; i < results.length; i++) {
                        if (results[i] === results[i - 1]) {
                            results.splice(i--, 1);
                        }
                    }
                }
            }

            return results;
        };

        Sizzle.matches = function (expr, set) {
            return Sizzle(expr, null, null, set);
        };

        Sizzle.matchesSelector = function (node, expr) {
            return Sizzle(expr, null, null, [node]).length > 0;
        };

        Sizzle.find = function (expr, context, isXML) {
            var set;

            if (!expr) {
                return [];
            }

            for (var i = 0, l = Expr.order.length; i < l; i++) {
                var match,
			type = Expr.order[i];

                if ((match = Expr.leftMatch[type].exec(expr))) {
                    var left = match[1];
                    match.splice(1, 1);

                    if (left.substr(left.length - 1) !== "\\") {
                        match[1] = (match[1] || "").replace(/\\/g, "");
                        set = Expr.find[type](match, context, isXML);

                        if (set != null) {
                            expr = expr.replace(Expr.match[type], "");
                            break;
                        }
                    }
                }
            }

            if (!set) {
                set = context.getElementsByTagName("*");
            }

            return { set: set, expr: expr };
        };

        Sizzle.filter = function (expr, set, inplace, not) {
            var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

            while (expr && set.length) {
                for (var type in Expr.filter) {
                    if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                        var found, item,
					filter = Expr.filter[type],
					left = match[1];

                        anyFound = false;

                        match.splice(1, 1);

                        if (left.substr(left.length - 1) === "\\") {
                            continue;
                        }

                        if (curLoop === result) {
                            result = [];
                        }

                        if (Expr.preFilter[type]) {
                            match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

                            if (!match) {
                                anyFound = found = true;

                            } else if (match === true) {
                                continue;
                            }
                        }

                        if (match) {
                            for (var i = 0; (item = curLoop[i]) != null; i++) {
                                if (item) {
                                    found = filter(item, match, i, curLoop);
                                    var pass = not ^ !!found;

                                    if (inplace && found != null) {
                                        if (pass) {
                                            anyFound = true;

                                        } else {
                                            curLoop[i] = false;
                                        }

                                    } else if (pass) {
                                        result.push(item);
                                        anyFound = true;
                                    }
                                }
                            }
                        }

                        if (found !== undefined) {
                            if (!inplace) {
                                curLoop = result;
                            }

                            expr = expr.replace(Expr.match[type], "");

                            if (!anyFound) {
                                return [];
                            }

                            break;
                        }
                    }
                }

                // Improper expression
                if (expr === old) {
                    if (anyFound == null) {
                        Sizzle.error(expr);

                    } else {
                        break;
                    }
                }

                old = expr;
            }

            return curLoop;
        };

        Sizzle.error = function (msg) {
            throw "Syntax error, unrecognized expression: " + msg;
        };

        var Expr = Sizzle.selectors = {
            order: ["ID", "NAME", "TAG"],

            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },

            leftMatch: {},

            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },

            attrHandle: {
                href: function (elem) {
                    return elem.getAttribute("href");
                }
            },

            relative: {
                "+": function (checkSet, part) {
                    var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

                    if (isTag) {
                        part = part.toLowerCase();
                    }

                    for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                        if ((elem = checkSet[i])) {
                            while ((elem = elem.previousSibling) && elem.nodeType !== 1) { }

                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
                        }
                    }

                    if (isPartStrNotTag) {
                        Sizzle.filter(part, checkSet, true);
                    }
                },

                ">": function (checkSet, part) {
                    var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

                    if (isPartStr && !/\W/.test(part)) {
                        part = part.toLowerCase();

                        for (; i < l; i++) {
                            elem = checkSet[i];

                            if (elem) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }

                    } else {
                        for (; i < l; i++) {
                            elem = checkSet[i];

                            if (elem) {
                                checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
                            }
                        }

                        if (isPartStr) {
                            Sizzle.filter(part, checkSet, true);
                        }
                    }
                },

                "": function (checkSet, part, isXML) {
                    var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

                    if (typeof part === "string" && !/\W/.test(part)) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
                },

                "~": function (checkSet, part, isXML) {
                    var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

                    if (typeof part === "string" && !/\W/.test(part)) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
                }
            },

            find: {
                ID: function (match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                },

                NAME: function (match, context) {
                    if (typeof context.getElementsByName !== "undefined") {
                        var ret = [],
					results = context.getElementsByName(match[1]);

                        for (var i = 0, l = results.length; i < l; i++) {
                            if (results[i].getAttribute("name") === match[1]) {
                                ret.push(results[i]);
                            }
                        }

                        return ret.length === 0 ? null : ret;
                    }
                },

                TAG: function (match, context) {
                    return context.getElementsByTagName(match[1]);
                }
            },
            preFilter: {
                CLASS: function (match, curLoop, inplace, result, not, isXML) {
                    match = " " + match[1].replace(/\\/g, "") + " ";

                    if (isXML) {
                        return match;
                    }

                    for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
                        if (elem) {
                            if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0)) {
                                if (!inplace) {
                                    result.push(elem);
                                }

                            } else if (inplace) {
                                curLoop[i] = false;
                            }
                        }
                    }

                    return false;
                },

                ID: function (match) {
                    return match[1].replace(/\\/g, "");
                },

                TAG: function (match, curLoop) {
                    return match[1].toLowerCase();
                },

                CHILD: function (match) {
                    if (match[1] === "nth") {
                        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                        var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

                        // calculate the numbers (first)n+(last) including if they are negative
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0;
                    }

                    // TODO: Move to normal caching system
                    match[0] = done++;

                    return match;
                },

                ATTR: function (match, curLoop, inplace, result, not, isXML) {
                    var name = match[1].replace(/\\/g, "");

                    if (!isXML && Expr.attrMap[name]) {
                        match[1] = Expr.attrMap[name];
                    }

                    if (match[2] === "~=") {
                        match[4] = " " + match[4] + " ";
                    }

                    return match;
                },

                PSEUDO: function (match, curLoop, inplace, result, not) {
                    if (match[1] === "not") {
                        // If we're dealing with a complex expression, or a simple one
                        if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                            match[3] = Sizzle(match[3], null, null, curLoop);

                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                            if (!inplace) {
                                result.push.apply(result, ret);
                            }

                            return false;
                        }

                    } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                        return true;
                    }

                    return match;
                },

                POS: function (match) {
                    match.unshift(true);

                    return match;
                }
            },

            filters: {
                enabled: function (elem) {
                    return elem.disabled === false && elem.type !== "hidden";
                },

                disabled: function (elem) {
                    return elem.disabled === true;
                },

                checked: function (elem) {
                    return elem.checked === true;
                },

                selected: function (elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    elem.parentNode.selectedIndex;

                    return elem.selected === true;
                },

                parent: function (elem) {
                    return !!elem.firstChild;
                },

                empty: function (elem) {
                    return !elem.firstChild;
                },

                has: function (elem, i, match) {
                    return !!Sizzle(match[3], elem).length;
                },

                header: function (elem) {
                    return (/h\d/i).test(elem.nodeName);
                },

                text: function (elem) {
                    return "text" === elem.type;
                },
                radio: function (elem) {
                    return "radio" === elem.type;
                },

                checkbox: function (elem) {
                    return "checkbox" === elem.type;
                },

                file: function (elem) {
                    return "file" === elem.type;
                },
                password: function (elem) {
                    return "password" === elem.type;
                },

                submit: function (elem) {
                    return "submit" === elem.type;
                },

                image: function (elem) {
                    return "image" === elem.type;
                },

                reset: function (elem) {
                    return "reset" === elem.type;
                },

                button: function (elem) {
                    return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
                },

                input: function (elem) {
                    return (/input|select|textarea|button/i).test(elem.nodeName);
                }
            },
            setFilters: {
                first: function (elem, i) {
                    return i === 0;
                },

                last: function (elem, i, match, array) {
                    return i === array.length - 1;
                },

                even: function (elem, i) {
                    return i % 2 === 0;
                },

                odd: function (elem, i) {
                    return i % 2 === 1;
                },

                lt: function (elem, i, match) {
                    return i < match[3] - 0;
                },

                gt: function (elem, i, match) {
                    return i > match[3] - 0;
                },

                nth: function (elem, i, match) {
                    return match[3] - 0 === i;
                },

                eq: function (elem, i, match) {
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function (elem, match, i, array) {
                    var name = match[1],
				filter = Expr.filters[name];

                    if (filter) {
                        return filter(elem, i, match, array);

                    } else if (name === "contains") {
                        return (elem.textContent || elem.innerText || Sizzle.getText([elem]) || "").indexOf(match[3]) >= 0;

                    } else if (name === "not") {
                        var not = match[3];

                        for (var j = 0, l = not.length; j < l; j++) {
                            if (not[j] === elem) {
                                return false;
                            }
                        }

                        return true;

                    } else {
                        Sizzle.error("Syntax error, unrecognized expression: " + name);
                    }
                },

                CHILD: function (elem, match) {
                    var type = match[1],
				node = elem;

                    switch (type) {
                        case "only":
                        case "first":
                            while ((node = node.previousSibling)) {
                                if (node.nodeType === 1) {
                                    return false;
                                }
                            }

                            if (type === "first") {
                                return true;
                            }

                            node = elem;

                        case "last":
                            while ((node = node.nextSibling)) {
                                if (node.nodeType === 1) {
                                    return false;
                                }
                            }

                            return true;

                        case "nth":
                            var first = match[2],
						last = match[3];

                            if (first === 1 && last === 0) {
                                return true;
                            }

                            var doneName = match[0],
						parent = elem.parentNode;

                            if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                                var count = 0;

                                for (node = parent.firstChild; node; node = node.nextSibling) {
                                    if (node.nodeType === 1) {
                                        node.nodeIndex = ++count;
                                    }
                                }

                                parent.sizcache = doneName;
                            }

                            var diff = elem.nodeIndex - last;

                            if (first === 0) {
                                return diff === 0;

                            } else {
                                return (diff % first === 0 && diff / first >= 0);
                            }
                    }
                },

                ID: function (elem, match) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },

                TAG: function (elem, match) {
                    return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
                },

                CLASS: function (elem, match) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf(match) > -1;
                },

                ATTR: function (elem, match) {
                    var name = match[1],
				result = Expr.attrHandle[name] ?
					Expr.attrHandle[name](elem) :
					elem[name] != null ?
						elem[name] :
						elem.getAttribute(name),
				value = result + "",
				type = match[2],
				check = match[4];

                    return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
                },

                POS: function (elem, match, i, array) {
                    var name = match[2],
				filter = Expr.setFilters[name];

                    if (filter) {
                        return filter(elem, i, match, array);
                    }
                }
            }
        };

        var origPOS = Expr.match.POS,
	fescape = function (all, num) {
	    return "\\" + (num - 0 + 1);
	};

        for (var type in Expr.match) {
            Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
            Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
        }

        var makeArray = function (array, results) {
            array = Array.prototype.slice.call(array, 0);

            if (results) {
                results.push.apply(results, array);
                return results;
            }

            return array;
        };

        // Perform a simple check to determine if the browser is capable of
        // converting a NodeList to an array using builtin methods.
        // Also verifies that the returned array holds DOM nodes
        // (which is not the case in the Blackberry browser)
        try {
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;

            // Provide a fallback method if it does not work
        } catch (e) {
            makeArray = function (array, results) {
                var i = 0,
			ret = results || [];

                if (toString.call(array) === "[object Array]") {
                    Array.prototype.push.apply(ret, array);

                } else {
                    if (typeof array.length === "number") {
                        for (var l = array.length; i < l; i++) {
                            ret.push(array[i]);
                        }

                    } else {
                        for (; array[i]; i++) {
                            ret.push(array[i]);
                        }
                    }
                }

                return ret;
            };
        }

        var sortOrder, siblingCheck;

        if (document.documentElement.compareDocumentPosition) {
            sortOrder = function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                    return a.compareDocumentPosition ? -1 : 1;
                }

                return a.compareDocumentPosition(b) & 4 ? -1 : 1;
            };

        } else {
            sortOrder = function (a, b) {
                var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

                // The nodes are identical, we can exit early
                if (a === b) {
                    hasDuplicate = true;
                    return 0;

                    // If the nodes are siblings (or identical) we can do a quick check
                } else if (aup === bup) {
                    return siblingCheck(a, b);

                    // If no parents were found then the nodes are disconnected
                } else if (!aup) {
                    return -1;

                } else if (!bup) {
                    return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while (cur) {
                    ap.unshift(cur);
                    cur = cur.parentNode;
                }

                cur = bup;

                while (cur) {
                    bp.unshift(cur);
                    cur = cur.parentNode;
                }

                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for (var i = 0; i < al && i < bl; i++) {
                    if (ap[i] !== bp[i]) {
                        return siblingCheck(ap[i], bp[i]);
                    }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ?
			siblingCheck(a, bp[i], -1) :
			siblingCheck(ap[i], b, 1);
            };

            siblingCheck = function (a, b, ret) {
                if (a === b) {
                    return ret;
                }

                var cur = a.nextSibling;

                while (cur) {
                    if (cur === b) {
                        return -1;
                    }

                    cur = cur.nextSibling;
                }

                return 1;
            };
        }

        // Utility function for retreiving the text value of an array of DOM nodes
        Sizzle.getText = function (elems) {
            var ret = "", elem;

            for (var i = 0; elems[i]; i++) {
                elem = elems[i];

                // Get the text from text nodes and CDATA nodes
                if (elem.nodeType === 3 || elem.nodeType === 4) {
                    ret += elem.nodeValue;

                    // Traverse everything else, except comment nodes
                } else if (elem.nodeType !== 8) {
                    ret += Sizzle.getText(elem.childNodes);
                }
            }

            return ret;
        };

        // Check to see if the browser returns elements by name when
        // querying by getElementById (and provide a workaround)
        (function () {
            // We're going to inject a fake input element with a specified name
            var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

            form.innerHTML = "<a name='" + id + "'/>";

            // Inject it into the root element, check its status, and remove it quickly
            root.insertBefore(form, root.firstChild);

            // The workaround has to do additional checks after a getElementById
            // Which slows things down for other browsers (hence the branching)
            if (document.getElementById(id)) {
                Expr.find.ID = function (match, context, isXML) {
                    if (typeof context.getElementById !== "undefined" && !isXML) {
                        var m = context.getElementById(match[1]);

                        return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
                    }
                };

                Expr.filter.ID = function (elem, match) {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }

            root.removeChild(form);

            // release memory in IE
            root = form = null;
        })();

        (function () {
            // Check to see if the browser returns only elements
            // when doing getElementsByTagName("*")

            // Create a fake element
            var div = document.createElement("div");
            div.appendChild(document.createComment(""));

            // Make sure no comments are found
            if (div.getElementsByTagName("*").length > 0) {
                Expr.find.TAG = function (match, context) {
                    var results = context.getElementsByTagName(match[1]);

                    // Filter out possible comments
                    if (match[1] === "*") {
                        var tmp = [];

                        for (var i = 0; results[i]; i++) {
                            if (results[i].nodeType === 1) {
                                tmp.push(results[i]);
                            }
                        }

                        results = tmp;
                    }

                    return results;
                };
            }

            // Check to see if an attribute returns normalized href attributes
            div.innerHTML = "<a href='#'></a>";

            if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#") {

                Expr.attrHandle.href = function (elem) {
                    return elem.getAttribute("href", 2);
                };
            }

            // release memory in IE
            div = null;
        })();

        if (document.querySelectorAll) {
            (function () {
                var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

                div.innerHTML = "<p class='TEST'></p>";

                // Safari can't handle uppercase or unicode characters when
                // in quirks mode.
                if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                    return;
                }

                Sizzle = function (query, context, extra, seed) {
                    context = context || document;

                    // Make sure that attribute selectors are quoted
                    query = query.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

                    // Only use querySelectorAll on non-XML documents
                    // (ID selectors don't work in non-HTML documents)
                    if (!seed && !Sizzle.isXML(context)) {
                        if (context.nodeType === 9) {
                            try {
                                return makeArray(context.querySelectorAll(query), extra);
                            } catch (qsaError) { }

                            // qSA works strangely on Element-rooted queries
                            // We can work around this by specifying an extra ID on the root
                            // and working up from there (Thanks to Andrew Dupont for the technique)
                            // IE 8 doesn't work on object elements
                        } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                            var old = context.getAttribute("id"),
						nid = old || id;

                            if (!old) {
                                context.setAttribute("id", nid);
                            }

                            try {
                                return makeArray(context.querySelectorAll("#" + nid + " " + query), extra);

                            } catch (pseudoError) {
                            } finally {
                                if (!old) {
                                    context.removeAttribute("id");
                                }
                            }
                        }
                    }

                    return oldSizzle(query, context, extra, seed);
                };

                for (var prop in oldSizzle) {
                    Sizzle[prop] = oldSizzle[prop];
                }

                // release memory in IE
                div = null;
            })();
        }

        (function () {
            var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
		pseudoWorks = false;

            try {
                // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call(document.documentElement, "[test!='']:sizzle");

            } catch (pseudoError) {
                pseudoWorks = true;
            }

            if (matches) {
                Sizzle.matchesSelector = function (node, expr) {
                    // Make sure that attribute selectors are quoted
                    expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

                    if (!Sizzle.isXML(node)) {
                        try {
                            if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                                return matches.call(node, expr);
                            }
                        } catch (e) { }
                    }

                    return Sizzle(expr, null, null, [node]).length > 0;
                };
            }
        })();

        (function () {
            var div = document.createElement("div");

            div.innerHTML = "<div class='test e'></div><div class='test'></div>";

            // Opera can't find a second classname (in 9.6)
            // Also, make sure that getElementsByClassName actually exists
            if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
                return;
            }

            // Safari caches class attributes, doesn't catch changes (in 3.2)
            div.lastChild.className = "e";

            if (div.getElementsByClassName("e").length === 1) {
                return;
            }

            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function (match, context, isXML) {
                if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                    return context.getElementsByClassName(match[1]);
                }
            };

            // release memory in IE
            div = null;
        })();

        function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];

                if (elem) {
                    var match = false;

                    elem = elem[dir];

                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if (elem.nodeType === 1 && !isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }

                        if (elem.nodeName.toLowerCase() === cur) {
                            match = elem;
                            break;
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; i < l; i++) {
                var elem = checkSet[i];

                if (elem) {
                    var match = false;

                    elem = elem[dir];

                    while (elem) {
                        if (elem.sizcache === doneName) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if (elem.nodeType === 1) {
                            if (!isXML) {
                                elem.sizcache = doneName;
                                elem.sizset = i;
                            }

                            if (typeof cur !== "string") {
                                if (elem === cur) {
                                    match = true;
                                    break;
                                }

                            } else if (Sizzle.filter(cur, [elem]).length > 0) {
                                match = elem;
                                break;
                            }
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        if (document.documentElement.contains) {
            Sizzle.contains = function (a, b) {
                return a !== b && (a.contains ? a.contains(b) : true);
            };

        } else if (document.documentElement.compareDocumentPosition) {
            Sizzle.contains = function (a, b) {
                return !!(a.compareDocumentPosition(b) & 16);
            };

        } else {
            Sizzle.contains = function () {
                return false;
            };
        }

        Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833) 
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        var posProcess = function (selector, context) {
            var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

            // Position selectors must be done after the filter
            // And so must :not(positional) so we move all PSEUDOs to the end
            while ((match = Expr.match.PSEUDO.exec(selector))) {
                later += match[0];
                selector = selector.replace(Expr.match.PSEUDO, "");
            }

            selector = Expr.relative[selector] ? selector + "*" : selector;

            for (var i = 0, l = root.length; i < l; i++) {
                Sizzle(selector, root[i], tmpSet);
            }

            return Sizzle.filter(later, tmpSet);
        };

        // EXPOSE
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })();


    var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    // Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS;

    jQuery.fn.extend({
        find: function (selector) {
            var ret = this.pushStack("", "find", selector),
			length = 0;

            for (var i = 0, l = this.length; i < l; i++) {
                length = ret.length;
                jQuery.find(selector, this[i], ret);

                if (i > 0) {
                    // Make sure that the results are unique
                    for (var n = length; n < ret.length; n++) {
                        for (var r = 0; r < length; r++) {
                            if (ret[r] === ret[n]) {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        has: function (target) {
            var targets = jQuery(target);
            return this.filter(function () {
                for (var i = 0, l = targets.length; i < l; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },

        not: function (selector) {
            return this.pushStack(winnow(this, selector, false), "not", selector);
        },

        filter: function (selector) {
            return this.pushStack(winnow(this, selector, true), "filter", selector);
        },

        is: function (selector) {
            return !!selector && jQuery.filter(selector, this).length > 0;
        },

        closest: function (selectors, context) {
            var ret = [], i, l, cur = this[0];

            if (jQuery.isArray(selectors)) {
                var match, selector,
				matches = {},
				level = 1;

                if (cur && selectors.length) {
                    for (i = 0, l = selectors.length; i < l; i++) {
                        selector = selectors[i];

                        if (!matches[selector]) {
                            matches[selector] = jQuery.expr.match.POS.test(selector) ?
							jQuery(selector, context || this.context) :
							selector;
                        }
                    }

                    while (cur && cur.ownerDocument && cur !== context) {
                        for (selector in matches) {
                            match = matches[selector];

                            if (match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match)) {
                                ret.push({ selector: selector, elem: cur, level: level });
                            }
                        }

                        cur = cur.parentNode;
                        level++;
                    }
                }

                return ret;
            }

            var pos = POS.test(selectors) ?
			jQuery(selectors, context || this.context) : null;

            for (i = 0, l = this.length; i < l; i++) {
                cur = this[i];

                while (cur) {
                    if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                        ret.push(cur);
                        break;

                    } else {
                        cur = cur.parentNode;
                        if (!cur || !cur.ownerDocument || cur === context) {
                            break;
                        }
                    }
                }
            }

            ret = ret.length > 1 ? jQuery.unique(ret) : ret;

            return this.pushStack(ret, "closest", selectors);
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function (elem) {
            if (!elem || typeof elem === "string") {
                return jQuery.inArray(this[0],
                // If it receives a string, the selector is used
                // If it receives nothing, the siblings are used
				elem ? jQuery(elem) : this.parent().children());
            }
            // Locate the position of the desired element
            return jQuery.inArray(
            // If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this);
        },

        add: function (selector, context) {
            var set = typeof selector === "string" ?
				jQuery(selector, context || this.context) :
				jQuery.makeArray(selector),
			all = jQuery.merge(this.get(), set);

            return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ?
			all :
			jQuery.unique(all));
        },

        andSelf: function () {
            return this.add(this.prevObject);
        }
    });

    // A painfully simple check to see if an element is disconnected
    // from a document (should be improved, where feasible).
    function isDisconnected(node) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    }

    jQuery.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return jQuery.nth(elem, 2, "nextSibling");
        },
        prev: function (elem) {
            return jQuery.nth(elem, 2, "previousSibling");
        },
        nextAll: function (elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return jQuery.sibling(elem.parentNode.firstChild, elem);
        },
        children: function (elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function (elem) {
            return jQuery.nodeName(elem, "iframe") ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray(elem.childNodes);
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var ret = jQuery.map(this, fn, until);

            if (!runtil.test(name)) {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                ret = jQuery.filter(selector, ret);
            }

            ret = this.length > 1 ? jQuery.unique(ret) : ret;

            if ((this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name)) {
                ret = ret.reverse();
            }

            return this.pushStack(ret, name, slice.call(arguments).join(","));
        };
    });

    jQuery.extend({
        filter: function (expr, elems, not) {
            if (not) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] :
			jQuery.find.matches(expr, elems);
        },

        dir: function (elem, dir, until) {
            var matched = [],
			cur = elem[dir];

            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },

        nth: function (cur, result, dir, elem) {
            result = result || 1;
            var num = 0;

            for (; cur; cur = cur[dir]) {
                if (cur.nodeType === 1 && ++num === result) {
                    break;
                }
            }

            return cur;
        },

        sibling: function (n, elem) {
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }

            return r;
        }
    });

    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, keep) {
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function (elem, i) {
                var retVal = !!qualifier.call(elem, i, elem);
                return retVal === keep;
            });

        } else if (qualifier.nodeType) {
            return jQuery.grep(elements, function (elem, i) {
                return (elem === qualifier) === keep;
            });

        } else if (typeof qualifier === "string") {
            var filtered = jQuery.grep(elements, function (elem) {
                return elem.nodeType === 1;
            });

            if (isSimple.test(qualifier)) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter(qualifier, filtered);
            }
        }

        return jQuery.grep(elements, function (elem, i) {
            return (jQuery.inArray(elem, qualifier) >= 0) === keep;
        });
    }




    var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
    // checked="checked" or checked (html5)
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	raction = /\=([^="'>\s]+\/)>/g,
	wrapMap = {
	    option: [1, "<select multiple='multiple'>", "</select>"],
	    legend: [1, "<fieldset>", "</fieldset>"],
	    thead: [1, "<table>", "</table>"],
	    tr: [2, "<table><tbody>", "</tbody></table>"],
	    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
	    col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
	    area: [1, "<map>", "</map>"],
	    _default: [0, "", ""]
	};

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    // IE can't serialize <link> and <script> tags normally
    if (!jQuery.support.htmlSerialize) {
        wrapMap._default = [1, "div<div>", "</div>"];
    }

    jQuery.fn.extend({
        text: function (text) {
            if (jQuery.isFunction(text)) {
                return this.each(function (i) {
                    var self = jQuery(this);

                    self.text(text.call(this, i, self.text()));
                });
            }

            if (typeof text !== "object" && text !== undefined) {
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
            }

            return jQuery.text(this);
        },

        wrapAll: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }

            if (this[0]) {
                // The elements to wrap the target around
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }

                wrap.map(function () {
                    var elem = this;

                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append(this);
            }

            return this;
        },

        wrapInner: function (html) {
            if (jQuery.isFunction(html)) {
                return this.each(function (i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }

            return this.each(function () {
                var self = jQuery(this),
				contents = self.contents();

                if (contents.length) {
                    contents.wrapAll(html);

                } else {
                    self.append(html);
                }
            });
        },

        wrap: function (html) {
            return this.each(function () {
                jQuery(this).wrapAll(html);
            });
        },

        unwrap: function () {
            return this.parent().each(function () {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        },

        append: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType === 1) {
                    this.appendChild(elem);
                }
            });
        },

        prepend: function () {
            return this.domManip(arguments, true, function (elem) {
                if (this.nodeType === 1) {
                    this.insertBefore(elem, this.firstChild);
                }
            });
        },

        before: function () {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, false, function (elem) {
                    this.parentNode.insertBefore(elem, this);
                });
            } else if (arguments.length) {
                var set = jQuery(arguments[0]);
                set.push.apply(set, this.toArray());
                return this.pushStack(set, "before", arguments);
            }
        },

        after: function () {
            if (this[0] && this[0].parentNode) {
                return this.domManip(arguments, false, function (elem) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                });
            } else if (arguments.length) {
                var set = this.pushStack(this, "after", arguments);
                set.push.apply(set, jQuery(arguments[0]).toArray());
                return set;
            }
        },

        // keepData is for internal use only--do not document
        remove: function (selector, keepData) {
            for (var i = 0, elem; (elem = this[i]) != null; i++) {
                if (!selector || jQuery.filter(selector, [elem]).length) {
                    if (!keepData && elem.nodeType === 1) {
                        jQuery.cleanData(elem.getElementsByTagName("*"));
                        jQuery.cleanData([elem]);
                    }

                    if (elem.parentNode) {
                        elem.parentNode.removeChild(elem);
                    }
                }
            }

            return this;
        },

        empty: function () {
            for (var i = 0, elem; (elem = this[i]) != null; i++) {
                // Remove element nodes and prevent memory leaks
                if (elem.nodeType === 1) {
                    jQuery.cleanData(elem.getElementsByTagName("*"));
                }

                // Remove any remaining nodes
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
            }

            return this;
        },

        clone: function (events) {
            // Do the clone
            var ret = this.map(function () {
                if (!jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this)) {
                    // IE copies events bound via attachEvent when
                    // using cloneNode. Calling detachEvent on the
                    // clone will also remove the events from the orignal
                    // In order to get around this, we use innerHTML.
                    // Unfortunately, this means some modifications to
                    // attributes in IE that are actually only stored
                    // as properties will not be copied (such as the
                    // the name attribute on an input).
                    var html = this.outerHTML,
					ownerDocument = this.ownerDocument;

                    if (!html) {
                        var div = ownerDocument.createElement("div");
                        div.appendChild(this.cloneNode(true));
                        html = div.innerHTML;
                    }

                    return jQuery.clean([html.replace(rinlinejQuery, "")
                    // Handle the case in IE 8 where action=/test/> self-closes a tag
					.replace(raction, '="$1">')
					.replace(rleadingWhitespace, "")], ownerDocument)[0];
                } else {
                    return this.cloneNode(true);
                }
            });

            // Copy the events from the original to the clone
            if (events === true) {
                cloneCopyEvent(this, ret);
                cloneCopyEvent(this.find("*"), ret.find("*"));
            }

            // Return the cloned set
            return ret;
        },

        html: function (value) {
            if (value === undefined) {
                return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

                // See if we can take a shortcut and just use innerHTML
            } else if (typeof value === "string" && !rnocache.test(value) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
			!wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

                value = value.replace(rxhtmlTag, "<$1></$2>");

                try {
                    for (var i = 0, l = this.length; i < l; i++) {
                        // Remove element nodes and prevent memory leaks
                        if (this[i].nodeType === 1) {
                            jQuery.cleanData(this[i].getElementsByTagName("*"));
                            this[i].innerHTML = value;
                        }
                    }

                    // If using innerHTML throws an exception, use the fallback method
                } catch (e) {
                    this.empty().append(value);
                }

            } else if (jQuery.isFunction(value)) {
                this.each(function (i) {
                    var self = jQuery(this);

                    self.html(value.call(this, i, self.html()));
                });

            } else {
                this.empty().append(value);
            }

            return this;
        },

        replaceWith: function (value) {
            if (this[0] && this[0].parentNode) {
                // Make sure that the elements are removed from the DOM before they are inserted
                // this can help fix replacing a parent with child elements
                if (jQuery.isFunction(value)) {
                    return this.each(function (i) {
                        var self = jQuery(this), old = self.html();
                        self.replaceWith(value.call(this, i, old));
                    });
                }

                if (typeof value !== "string") {
                    value = jQuery(value).detach();
                }

                return this.each(function () {
                    var next = this.nextSibling,
					parent = this.parentNode;

                    jQuery(this).remove();

                    if (next) {
                        jQuery(next).before(value);
                    } else {
                        jQuery(parent).append(value);
                    }
                });
            } else {
                return this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value);
            }
        },

        detach: function (selector) {
            return this.remove(selector, true);
        },

        domManip: function (args, table, callback) {
            var results, first, fragment, parent,
			value = args[0],
			scripts = [];

            // We can't cloneNode fragments that contain checked, in WebKit
            if (!jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test(value)) {
                return this.each(function () {
                    jQuery(this).domManip(args, table, callback, true);
                });
            }

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    args[0] = value.call(this, i, table ? self.html() : undefined);
                    self.domManip(args, table, callback);
                });
            }

            if (this[0]) {
                parent = value && value.parentNode;

                // If we're in a fragment, just use that instead of building a new one
                if (jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length) {
                    results = { fragment: parent };

                } else {
                    results = jQuery.buildFragment(args, this, scripts);
                }

                fragment = results.fragment;

                if (fragment.childNodes.length === 1) {
                    first = fragment = fragment.firstChild;
                } else {
                    first = fragment.firstChild;
                }

                if (first) {
                    table = table && jQuery.nodeName(first, "tr");

                    for (var i = 0, l = this.length; i < l; i++) {
                        callback.call(
						table ?
							root(this[i], first) :
							this[i],
						i > 0 || results.cacheable || this.length > 1 ?
							fragment.cloneNode(true) :
							fragment
					);
                    }
                }

                if (scripts.length) {
                    jQuery.each(scripts, evalScript);
                }
            }

            return this;
        }
    });

    function root(elem, cur) {
        return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
    }

    function cloneCopyEvent(orig, ret) {
        var i = 0;

        ret.each(function () {
            if (this.nodeName !== (orig[i] && orig[i].nodeName)) {
                return;
            }

            var oldData = jQuery.data(orig[i++]),
			curData = jQuery.data(this, oldData),
			events = oldData && oldData.events;

            if (events) {
                delete curData.handle;
                curData.events = {};

                for (var type in events) {
                    for (var handler in events[type]) {
                        jQuery.event.add(this, type, events[type][handler], events[type][handler].data);
                    }
                }
            }
        });
    }

    jQuery.buildFragment = function (args, nodes, scripts) {
        var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

        // Only cache "small" (1/2 KB) strings that are associated with the main document
        // Cloning options loses the selected state, so don't cache them
        // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
        // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
        if (args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		!rnocache.test(args[0]) && (jQuery.support.checkClone || !rchecked.test(args[0]))) {

            cacheable = true;
            cacheresults = jQuery.fragments[args[0]];
            if (cacheresults) {
                if (cacheresults !== 1) {
                    fragment = cacheresults;
                }
            }
        }

        if (!fragment) {
            fragment = doc.createDocumentFragment();
            jQuery.clean(args, doc, fragment, scripts);
        }

        if (cacheable) {
            jQuery.fragments[args[0]] = cacheresults ? fragment : 1;
        }

        return { fragment: fragment, cacheable: cacheable };
    };

    jQuery.fragments = {};

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function (selector) {
            var ret = [],
			insert = jQuery(selector),
			parent = this.length === 1 && this[0].parentNode;

            if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
                insert[original](this[0]);
                return this;

            } else {
                for (var i = 0, l = insert.length; i < l; i++) {
                    var elems = (i > 0 ? this.clone(true) : this).get();
                    jQuery(insert[i])[original](elems);
                    ret = ret.concat(elems);
                }

                return this.pushStack(ret, name, insert.selector);
            }
        };
    });

    jQuery.extend({
        clean: function (elems, context, fragment, scripts) {
            context = context || document;

            // !context.createElement fails in IE with an error but returns typeof 'object'
            if (typeof context.createElement === "undefined") {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            }

            var ret = [];

            for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                if (typeof elem === "number") {
                    elem += "";
                }

                if (!elem) {
                    continue;
                }

                // Convert html string into DOM nodes
                if (typeof elem === "string" && !rhtml.test(elem)) {
                    elem = context.createTextNode(elem);

                } else if (typeof elem === "string") {
                    // Fix "XHTML"-style tags in all browsers
                    elem = elem.replace(rxhtmlTag, "<$1></$2>");

                    // Trim whitespace, otherwise indexOf won't work as expected
                    var tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[tag] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

                    // Go to html and back, then peel off extra wrappers
                    div.innerHTML = wrap[1] + elem + wrap[2];

                    // Move to the right depth
                    while (depth--) {
                        div = div.lastChild;
                    }

                    // Remove IE's autoinserted <tbody> from table fragments
                    if (!jQuery.support.tbody) {

                        // String was a <table>, *may* have spurious <tbody>
                        var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

                        // String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

                        for (var j = tbody.length - 1; j >= 0; --j) {
                            if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
                                tbody[j].parentNode.removeChild(tbody[j]);
                            }
                        }

                    }

                    // IE completely kills leading whitespace when innerHTML is used
                    if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                        div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                    }

                    elem = div.childNodes;
                }

                if (elem.nodeType) {
                    ret.push(elem);
                } else {
                    ret = jQuery.merge(ret, elem);
                }
            }

            if (fragment) {
                for (i = 0; ret[i]; i++) {
                    if (scripts && jQuery.nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
                        scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);

                    } else {
                        if (ret[i].nodeType === 1) {
                            ret.splice.apply(ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))));
                        }
                        fragment.appendChild(ret[i]);
                    }
                }
            }

            return ret;
        },

        cleanData: function (elems) {
            var data, id, cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

            for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
                    continue;
                }

                id = elem[jQuery.expando];

                if (id) {
                    data = cache[id];

                    if (data && data.events) {
                        for (var type in data.events) {
                            if (special[type]) {
                                jQuery.event.remove(elem, type);

                            } else {
                                jQuery.removeEvent(elem, type, data.handle);
                            }
                        }
                    }

                    if (deleteExpando) {
                        delete elem[jQuery.expando];

                    } else if (elem.removeAttribute) {
                        elem.removeAttribute(jQuery.expando);
                    }

                    delete cache[id];
                }
            }
        }
    });

    function evalScript(i, elem) {
        if (elem.src) {
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            });
        } else {
            jQuery.globalEval(elem.text || elem.textContent || elem.innerHTML || "");
        }

        if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
    }




    var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = ["Left", "Right"],
	cssHeight = ["Top", "Bottom"],
	curCSS,

	getComputedStyle,
	currentStyle,

	fcamelCase = function (all, letter) {
	    return letter.toUpperCase();
	};

    jQuery.fn.css = function (name, value) {
        // Setting 'undefined' is a no-op
        if (arguments.length === 2 && value === undefined) {
            return this;
        }

        return jQuery.access(this, name, value, true, function (elem, name, value) {
            return value !== undefined ?
			jQuery.style(elem, name, value) :
			jQuery.css(elem, name);
        });
    };

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function (elem, computed) {
                    if (computed) {
                        // We should always get a number back from opacity
                        var ret = curCSS(elem, "opacity", "opacity");
                        return ret === "" ? "1" : ret;

                    } else {
                        return elem.style.opacity;
                    }
                }
            }
        },

        // Exclude the following css properties to add px
        cssNumber: {
            "zIndex": true,
            "fontWeight": true,
            "opacity": true,
            "zoom": true,
            "lineHeight": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function (elem, name, value, extra) {
            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, origName = jQuery.camelCase(name),
			style = elem.style, hooks = jQuery.cssHooks[origName];

            name = jQuery.cssProps[origName] || origName;

            // Check if we're setting a value
            if (value !== undefined) {
                // Make sure that NaN and null values aren't set. See: #7116
                if (typeof value === "number" && isNaN(value) || value == null) {
                    return;
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if (typeof value === "number" && !jQuery.cssNumber[origName]) {
                    value += "px";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value)) !== undefined) {
                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[name] = value;
                    } catch (e) { }
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[name];
            }
        },

        css: function (elem, name, extra) {
            // Make sure that we're working with the right name
            var ret, origName = jQuery.camelCase(name),
			hooks = jQuery.cssHooks[origName];

            name = jQuery.cssProps[origName] || origName;

            // If a hook was provided get the computed value from there
            if (hooks && "get" in hooks && (ret = hooks.get(elem, true, extra)) !== undefined) {
                return ret;

                // Otherwise, if a way to get the computed value exists, use that
            } else if (curCSS) {
                return curCSS(elem, name, origName);
            }
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function (elem, options, callback) {
            var old = {};

            // Remember the old values, and insert the new ones
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }

            callback.call(elem);

            // Revert the old values
            for (name in options) {
                elem.style[name] = old[name];
            }
        },

        camelCase: function (string) {
            return string.replace(rdashAlpha, fcamelCase);
        }
    });

    // DEPRECATED, Use jQuery.css() instead
    jQuery.curCSS = jQuery.css;

    jQuery.each(["height", "width"], function (i, name) {
        jQuery.cssHooks[name] = {
            get: function (elem, computed, extra) {
                var val;

                if (computed) {
                    if (elem.offsetWidth !== 0) {
                        val = getWH(elem, name, extra);

                    } else {
                        jQuery.swap(elem, cssShow, function () {
                            val = getWH(elem, name, extra);
                        });
                    }

                    if (val <= 0) {
                        val = curCSS(elem, name, name);

                        if (val === "0px" && currentStyle) {
                            val = currentStyle(elem, name, name);
                        }

                        if (val != null) {
                            // Should return "auto" instead of 0, use 0 for
                            // temporary backwards-compat
                            return val === "" || val === "auto" ? "0px" : val;
                        }
                    }

                    if (val < 0 || val == null) {
                        val = elem.style[name];

                        // Should return "auto" instead of 0, use 0 for
                        // temporary backwards-compat
                        return val === "" || val === "auto" ? "0px" : val;
                    }

                    return typeof val === "string" ? val : val + "px";
                }
            },

            set: function (elem, value) {
                if (rnumpx.test(value)) {
                    // ignore negative width and height values #1599
                    value = parseFloat(value);

                    if (value >= 0) {
                        return value + "px";
                    }

                } else {
                    return value;
                }
            }
        };
    });

    if (!jQuery.support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function (elem, computed) {
                // IE uses filters for opacity
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				computed ? "1" : "";
            },

            set: function (elem, value) {
                var style = elem.style;

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // Set the alpha filter to set the opacity
                var opacity = jQuery.isNaN(value) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = style.filter || "";

                style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				style.filter + ' ' + opacity;
            }
        };
    }

    if (document.defaultView && document.defaultView.getComputedStyle) {
        getComputedStyle = function (elem, newName, name) {
            var ret, defaultView, computedStyle;

            name = name.replace(rupper, "-$1").toLowerCase();

            if (!(defaultView = elem.ownerDocument.defaultView)) {
                return undefined;
            }

            if ((computedStyle = defaultView.getComputedStyle(elem, null))) {
                ret = computedStyle.getPropertyValue(name);
                if (ret === "" && !jQuery.contains(elem.ownerDocument.documentElement, elem)) {
                    ret = jQuery.style(elem, name);
                }
            }

            return ret;
        };
    }

    if (document.documentElement.currentStyle) {
        currentStyle = function (elem, name) {
            var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[name],
			style = elem.style;

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            if (!rnumpx.test(ret) && rnum.test(ret)) {
                // Remember the original values
                left = style.left;
                rsLeft = elem.runtimeStyle.left;

                // Put in the new values to get a computed value out
                elem.runtimeStyle.left = elem.currentStyle.left;
                style.left = name === "fontSize" ? "1em" : (ret || 0);
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                elem.runtimeStyle.left = rsLeft;
            }

            return ret === "" ? "auto" : ret;
        };
    }

    curCSS = getComputedStyle || currentStyle;

    function getWH(elem, name, extra) {
        var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

        if (extra === "border") {
            return val;
        }

        jQuery.each(which, function () {
            if (!extra) {
                val -= parseFloat(jQuery.css(elem, "padding" + this)) || 0;
            }

            if (extra === "margin") {
                val += parseFloat(jQuery.css(elem, "margin" + this)) || 0;

            } else {
                val -= parseFloat(jQuery.css(elem, "border" + this + "Width")) || 0;
            }
        });

        return val;
    }

    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.hidden = function (elem) {
            var width = elem.offsetWidth,
			height = elem.offsetHeight;

            return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css(elem, "display")) === "none");
        };

        jQuery.expr.filters.visible = function (elem) {
            return !jQuery.expr.filters.hidden(elem);
        };
    }




    var jsc = jQuery.now(),
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rnoContent = /^(?:GET|HEAD)$/,
	rbracket = /\[\]$/,
	jsre = /\=\?(&|$)/,
	rquery = /\?/,
	rts = /([?&])_=[^&]*/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,
	rhash = /#.*$/,

    // Keep a copy of the old load method
	_load = jQuery.fn.load;

    jQuery.fn.extend({
        load: function (url, params, callback) {
            if (typeof url !== "string" && _load) {
                return _load.apply(this, arguments);

                // Don't do a request if no elements are being requested
            } else if (!this.length) {
                return this;
            }

            var off = url.indexOf(" ");
            if (off >= 0) {
                var selector = url.slice(off, url.length);
                url = url.slice(0, off);
            }

            // Default to a GET request
            var type = "GET";

            // If the second parameter was provided
            if (params) {
                // If it's a function
                if (jQuery.isFunction(params)) {
                    // We assume that it's the callback
                    callback = params;
                    params = null;

                    // Otherwise, build a param string
                } else if (typeof params === "object") {
                    params = jQuery.param(params, jQuery.ajaxSettings.traditional);
                    type = "POST";
                }
            }

            var self = this;

            // Request the remote document
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                complete: function (res, status) {
                    // If successful, inject the HTML into all the matched elements
                    if (status === "success" || status === "notmodified") {
                        // See if a selector was specified
                        self.html(selector ?
                        // Create a dummy div to hold the results
						jQuery("<div>")
                        // inject the contents of the document in, removing the scripts
                        // to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

                        // Locate the specified elements
							.find(selector) :

                        // If not, just inject the full result
						res.responseText);
                    }

                    if (callback) {
                        self.each(callback, [res.responseText, status, res]);
                    }
                }
            });

            return this;
        },

        serialize: function () {
            return jQuery.param(this.serializeArray());
        },

        serializeArray: function () {
            return this.map(function () {
                return this.elements ? jQuery.makeArray(this.elements) : this;
            })
		.filter(function () {
		    return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function (i, elem) {
		    var val = jQuery(this).val();

		    return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map(val, function (val, i) {
					    return { name: elem.name, value: val };
					}) :
					{ name: elem.name, value: val };
		}).get();
        }
    });

    // Attach a bunch of functions for handling common AJAX events
    jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (i, o) {
        jQuery.fn[o] = function (f) {
            return this.bind(o, f);
        };
    });

    jQuery.extend({
        get: function (url, data, callback, type) {
            // shift arguments if data argument was omited
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = null;
            }

            return jQuery.ajax({
                type: "GET",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

        getScript: function (url, callback) {
            return jQuery.get(url, null, callback, "script");
        },

        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },

        post: function (url, data, callback, type) {
            // shift arguments if data argument was omited
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = {};
            }

            return jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        },

        ajaxSetup: function (settings) {
            jQuery.extend(jQuery.ajaxSettings, settings);
        },

        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            /*
            timeout: 0,
            data: null,
            username: null,
            password: null,
            traditional: false,
            */
            // This function can be overriden by calling jQuery.ajaxSetup
            xhr: function () {
                return new window.XMLHttpRequest();
            },
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },

        ajax: function (origSettings) {
            var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings),
			jsonp, status, data, type = s.type.toUpperCase(), noContent = rnoContent.test(type);

            s.url = s.url.replace(rhash, "");

            // Use original (not extended) context object if it was provided
            s.context = origSettings && origSettings.context != null ? origSettings.context : s;

            // convert data if not already a string
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }

            // Handle JSONP Parameter Callbacks
            if (s.dataType === "jsonp") {
                if (type === "GET") {
                    if (!jsre.test(s.url)) {
                        s.url += (rquery.test(s.url) ? "&" : "?") + (s.jsonp || "callback") + "=?";
                    }
                } else if (!s.data || !jsre.test(s.data)) {
                    s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
                }
                s.dataType = "json";
            }

            // Build temporary JSONP function
            if (s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url))) {
                jsonp = s.jsonpCallback || ("jsonp" + jsc++);

                // Replace the =? sequence both in the query string and the data
                if (s.data) {
                    s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
                }

                s.url = s.url.replace(jsre, "=" + jsonp + "$1");

                // We need to make sure
                // that a JSONP style response is executed properly
                s.dataType = "script";

                // Handle JSONP-style loading
                var customJsonp = window[jsonp];

                window[jsonp] = function (tmp) {
                    if (jQuery.isFunction(customJsonp)) {
                        customJsonp(tmp);

                    } else {
                        // Garbage collect
                        window[jsonp] = undefined;

                        try {
                            delete window[jsonp];
                        } catch (jsonpError) { }
                    }

                    data = tmp;
                    jQuery.handleSuccess(s, xhr, status, data);
                    jQuery.handleComplete(s, xhr, status, data);

                    if (head) {
                        head.removeChild(script);
                    }
                };
            }

            if (s.dataType === "script" && s.cache === null) {
                s.cache = false;
            }

            if (s.cache === false && noContent) {
                var ts = jQuery.now();

                // try replacing _= if it is there
                var ret = s.url.replace(rts, "$1_=" + ts);

                // if nothing was replaced, add timestamp to the end
                s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
            }

            // If data is available, append data to url for GET/HEAD requests
            if (s.data && noContent) {
                s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
            }

            // Watch for a new set of requests
            if (s.global && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }

            // Matches an absolute URL, and saves the domain
            var parts = rurl.exec(s.url),
			remote = parts && (parts[1] && parts[1].toLowerCase() !== location.protocol || parts[2].toLowerCase() !== location.host);

            // If we're requesting a remote document
            // and trying to load JSON or Script with a GET
            if (s.dataType === "script" && type === "GET" && remote) {
                var head = document.getElementsByTagName("head")[0] || document.documentElement;
                var script = document.createElement("script");
                if (s.scriptCharset) {
                    script.charset = s.scriptCharset;
                }
                script.src = s.url;

                // Handle Script loading
                if (!jsonp) {
                    var done = false;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function () {
                        if (!done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete")) {
                            done = true;
                            jQuery.handleSuccess(s, xhr, status, data);
                            jQuery.handleComplete(s, xhr, status, data);

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;
                            if (head && script.parentNode) {
                                head.removeChild(script);
                            }
                        }
                    };
                }

                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                // This arises when a base node is used (#2709 and #4378).
                head.insertBefore(script, head.firstChild);

                // We handle everything using the script element injection
                return undefined;
            }

            var requestDone = false;

            // Create the request object
            var xhr = s.xhr();

            if (!xhr) {
                return;
            }

            // Open the socket
            // Passing null username, generates a login popup on Opera (#2865)
            if (s.username) {
                xhr.open(type, s.url, s.async, s.username, s.password);
            } else {
                xhr.open(type, s.url, s.async);
            }

            // Need an extra try/catch for cross domain requests in Firefox 3
            try {
                // Set content-type if data specified and content-body is valid for this type
                if ((s.data != null && !noContent) || (origSettings && origSettings.contentType)) {
                    xhr.setRequestHeader("Content-Type", s.contentType);
                }

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if (s.ifModified) {
                    if (jQuery.lastModified[s.url]) {
                        xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
                    }

                    if (jQuery.etag[s.url]) {
                        xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
                    }
                }

                // Set header so the called script knows that it's an XMLHttpRequest
                // Only send the header if it's not a remote XHR
                if (!remote) {
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                }

                // Set the Accepts header for the server, depending on the dataType
                xhr.setRequestHeader("Accept", s.dataType && s.accepts[s.dataType] ?
				s.accepts[s.dataType] + ", */*; q=0.01" :
				s.accepts._default);
            } catch (headerError) { }

            // Allow custom headers/mimetypes and early abort
            if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
                // Handle the global AJAX counter
                if (s.global && jQuery.active-- === 1) {
                    jQuery.event.trigger("ajaxStop");
                }

                // close opended socket
                xhr.abort();
                return false;
            }

            if (s.global) {
                jQuery.triggerGlobal(s, "ajaxSend", [xhr, s]);
            }

            // Wait for a response to come back
            var onreadystatechange = xhr.onreadystatechange = function (isTimeout) {
                // The request was aborted
                if (!xhr || xhr.readyState === 0 || isTimeout === "abort") {
                    // Opera doesn't call onreadystatechange before this point
                    // so we simulate the call
                    if (!requestDone) {
                        jQuery.handleComplete(s, xhr, status, data);
                    }

                    requestDone = true;
                    if (xhr) {
                        xhr.onreadystatechange = jQuery.noop;
                    }

                    // The transfer is complete and the data is available, or the request timed out
                } else if (!requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout")) {
                    requestDone = true;
                    xhr.onreadystatechange = jQuery.noop;

                    status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess(xhr) ?
						"error" :
						s.ifModified && jQuery.httpNotModified(xhr, s.url) ?
							"notmodified" :
							"success";

                    var errMsg;

                    if (status === "success") {
                        // Watch for, and catch, XML document parse errors
                        try {
                            // process the data (runs the xml through httpData regardless of callback)
                            data = jQuery.httpData(xhr, s.dataType, s);
                        } catch (parserError) {
                            status = "parsererror";
                            errMsg = parserError;
                        }
                    }

                    // Make sure that the request was successful or notmodified
                    if (status === "success" || status === "notmodified") {
                        // JSONP handles its own success callback
                        if (!jsonp) {
                            jQuery.handleSuccess(s, xhr, status, data);
                        }
                    } else {
                        jQuery.handleError(s, xhr, status, errMsg);
                    }

                    // Fire the complete handlers
                    if (!jsonp) {
                        jQuery.handleComplete(s, xhr, status, data);
                    }

                    if (isTimeout === "timeout") {
                        xhr.abort();
                    }

                    // Stop memory leaks
                    if (s.async) {
                        xhr = null;
                    }
                }
            };

            // Override the abort handler, if we can (IE 6 doesn't allow it, but that's OK)
            // Opera doesn't fire onreadystatechange at all on abort
            try {
                var oldAbort = xhr.abort;
                xhr.abort = function () {
                    if (xhr) {
                        // oldAbort has no call property in IE7 so
                        // just do it this way, which works in all
                        // browsers
                        Function.prototype.call.call(oldAbort, xhr);
                    }

                    onreadystatechange("abort");
                };
            } catch (abortError) { }

            // Timeout checker
            if (s.async && s.timeout > 0) {
                setTimeout(function () {
                    // Check to see if the request is still happening
                    if (xhr && !requestDone) {
                        onreadystatechange("timeout");
                    }
                }, s.timeout);
            }

            // Send the data
            try {
                xhr.send(noContent || s.data == null ? null : s.data);

            } catch (sendError) {
                jQuery.handleError(s, xhr, null, sendError);

                // Fire the complete handlers
                jQuery.handleComplete(s, xhr, status, data);
            }

            // firefox 1.5 doesn't fire statechange for sync requests
            if (!s.async) {
                onreadystatechange();
            }

            // return XMLHttpRequest to allow aborting the request etc.
            return xhr;
        },

        // Serialize an array of form elements or a set of
        // key/values into a query string
        param: function (a, traditional) {
            var s = [],
			add = function (key, value) {
			    // If value is a function, invoke it and return its value
			    value = jQuery.isFunction(value) ? value() : value;
			    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};

            // Set traditional to true for jQuery <= 1.3.2 behavior.
            if (traditional === undefined) {
                traditional = jQuery.ajaxSettings.traditional;
            }

            // If an array was passed in, assume that it is an array of form elements.
            if (jQuery.isArray(a) || a.jquery) {
                // Serialize the form elements
                jQuery.each(a, function () {
                    add(this.name, this.value);
                });

            } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                for (var prefix in a) {
                    buildParams(prefix, a[prefix], traditional, add);
                }
            }

            // Return the resulting serialization
            return s.join("&").replace(r20, "+");
        }
    });

    function buildParams(prefix, obj, traditional, add) {
        if (jQuery.isArray(obj) && obj.length) {
            // Serialize array item.
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(prefix, v);

                } else {
                    // If array item is non-scalar (array or object), encode its
                    // numeric index to resolve deserialization ambiguity issues.
                    // Note that rack (as of 1.0.0) can't currently deserialize
                    // nested arrays properly, and attempting to do so may cause
                    // a server error. Possible fixes are to modify rack's
                    // deserialization algorithm or to provide an option or flag
                    // to force array serialization to be shallow.
                    buildParams(prefix + "[" + (typeof v === "object" || jQuery.isArray(v) ? i : "") + "]", v, traditional, add);
                }
            });

        } else if (!traditional && obj != null && typeof obj === "object") {
            if (jQuery.isEmptyObject(obj)) {
                add(prefix, "");

                // Serialize object item.
            } else {
                jQuery.each(obj, function (k, v) {
                    buildParams(prefix + "[" + k + "]", v, traditional, add);
                });
            }

        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }

    // This is still on the jQuery object... for now
    // Want to move this to jQuery.ajax some day
    jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},

        handleError: function (s, xhr, status, e) {
            // If a local callback was specified, fire it
            if (s.error) {
                s.error.call(s.context, xhr, status, e);
            }

            // Fire the global callback
            if (s.global) {
                jQuery.triggerGlobal(s, "ajaxError", [xhr, s, e]);
            }
        },

        handleSuccess: function (s, xhr, status, data) {
            // If a local callback was specified, fire it and pass it the data
            if (s.success) {
                s.success.call(s.context, data, status, xhr);
            }

            // Fire the global callback
            if (s.global) {
                jQuery.triggerGlobal(s, "ajaxSuccess", [xhr, s]);
            }
        },

        handleComplete: function (s, xhr, status) {
            // Process result
            if (s.complete) {
                s.complete.call(s.context, xhr, status);
            }

            // The request was completed
            if (s.global) {
                jQuery.triggerGlobal(s, "ajaxComplete", [xhr, s]);
            }

            // Handle the global AJAX counter
            if (s.global && jQuery.active-- === 1) {
                jQuery.event.trigger("ajaxStop");
            }
        },

        triggerGlobal: function (s, type, args) {
            (s.context && s.context.url == null ? jQuery(s.context) : jQuery.event).trigger(type, args);
        },

        // Determines if an XMLHttpRequest was successful or not
        httpSuccess: function (xhr) {
            try {
                // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
                return !xhr.status && location.protocol === "file:" ||
				xhr.status >= 200 && xhr.status < 300 ||
				xhr.status === 304 || xhr.status === 1223;
            } catch (e) { }

            return false;
        },

        // Determines if an XMLHttpRequest returns NotModified
        httpNotModified: function (xhr, url) {
            var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

            if (lastModified) {
                jQuery.lastModified[url] = lastModified;
            }

            if (etag) {
                jQuery.etag[url] = etag;
            }

            return xhr.status === 304;
        },

        httpData: function (xhr, type, s) {
            var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === "parsererror") {
                jQuery.error("parsererror");
            }

            // Allow a pre-filtering function to sanitize the response
            // s is checked to keep backwards compatibility
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }

            // The filter can actually parse the response
            if (typeof data === "string") {
                // Get the JavaScript object, if JSON is used.
                if (type === "json" || !type && ct.indexOf("json") >= 0) {
                    data = jQuery.parseJSON(data);

                    // If the type is "script", eval it in global context
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    jQuery.globalEval(data);
                }
            }

            return data;
        }

    });

    /*
    * Create the request object; Microsoft failed to properly
    * implement the XMLHttpRequest in IE7 (can't request local files),
    * so we use the ActiveXObject when it is available
    * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
    * we need a fallback.
    */
    if (window.ActiveXObject) {
        jQuery.ajaxSettings.xhr = function () {
            if (window.location.protocol !== "file:") {
                try {
                    return new window.XMLHttpRequest();
                } catch (xhrError) { }
            }

            try {
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            } catch (activeError) { }
        };
    }

    // Does this browser support XHR requests?
    jQuery.support.ajax = !!jQuery.ajaxSettings.xhr();




    var elemdisplay = {},
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)(.*)$/,
	timerId,
	fxAttrs = [
    // height animations
		["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
    // width animations
		["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
    // opacity animations
		["opacity"]
	];

    jQuery.fn.extend({
        show: function (speed, easing, callback) {
            var elem, display;

            if (speed || speed === 0) {
                return this.animate(genFx("show", 3), speed, easing, callback);

            } else {
                for (var i = 0, j = this.length; i < j; i++) {
                    elem = this[i];
                    display = elem.style.display;

                    // Reset the inline display of this element to learn if it is
                    // being hidden by cascaded rules or not
                    if (!jQuery.data(elem, "olddisplay") && display === "none") {
                        display = elem.style.display = "";
                    }

                    // Set elements which have been overridden with display: none
                    // in a stylesheet to whatever the default browser style is
                    // for such an element
                    if (display === "" && jQuery.css(elem, "display") === "none") {
                        jQuery.data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                    }
                }

                // Set the display of most of the elements in a second loop
                // to avoid the constant reflow
                for (i = 0; i < j; i++) {
                    elem = this[i];
                    display = elem.style.display;

                    if (display === "" || display === "none") {
                        elem.style.display = jQuery.data(elem, "olddisplay") || "";
                    }
                }

                return this;
            }
        },

        hide: function (speed, easing, callback) {
            if (speed || speed === 0) {
                return this.animate(genFx("hide", 3), speed, easing, callback);

            } else {
                for (var i = 0, j = this.length; i < j; i++) {
                    var display = jQuery.css(this[i], "display");

                    if (display !== "none") {
                        jQuery.data(this[i], "olddisplay", display);
                    }
                }

                // Set the display of the elements in a second loop
                // to avoid the constant reflow
                for (i = 0; i < j; i++) {
                    this[i].style.display = "none";
                }

                return this;
            }
        },

        // Save the old toggle function
        _toggle: jQuery.fn.toggle,

        toggle: function (fn, fn2, callback) {
            var bool = typeof fn === "boolean";

            if (jQuery.isFunction(fn) && jQuery.isFunction(fn2)) {
                this._toggle.apply(this, arguments);

            } else if (fn == null || bool) {
                this.each(function () {
                    var state = bool ? fn : jQuery(this).is(":hidden");
                    jQuery(this)[state ? "show" : "hide"]();
                });

            } else {
                this.animate(genFx("toggle", 3), fn, fn2, callback);
            }

            return this;
        },

        fadeTo: function (speed, to, easing, callback) {
            return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({ opacity: to }, speed, easing, callback);
        },

        animate: function (prop, speed, easing, callback) {
            var optall = jQuery.speed(speed, easing, callback);

            if (jQuery.isEmptyObject(prop)) {
                return this.each(optall.complete);
            }

            return this[optall.queue === false ? "each" : "queue"](function () {
                // XXX 'this' does not always have a nodeName when running the
                // test suite

                var opt = jQuery.extend({}, optall), p,
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				self = this;

                for (p in prop) {
                    var name = jQuery.camelCase(p);

                    if (p !== name) {
                        prop[name] = prop[p];
                        delete prop[p];
                        p = name;
                    }

                    if (prop[p] === "hide" && hidden || prop[p] === "show" && !hidden) {
                        return opt.complete.call(this);
                    }

                    if (isElement && (p === "height" || p === "width")) {
                        // Make sure that nothing sneaks out
                        // Record all 3 overflow attributes because IE does not
                        // change the overflow attribute when overflowX and
                        // overflowY are set to the same value
                        opt.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];

                        // Set display property to inline-block for height/width
                        // animations on inline elements that are having width/height
                        // animated
                        if (jQuery.css(this, "display") === "inline" &&
							jQuery.css(this, "float") === "none") {
                            if (!jQuery.support.inlineBlockNeedsLayout) {
                                this.style.display = "inline-block";

                            } else {
                                var display = defaultDisplay(this.nodeName);

                                // inline-level elements accept inline-block;
                                // block-level elements need to be inline with layout
                                if (display === "inline") {
                                    this.style.display = "inline-block";

                                } else {
                                    this.style.display = "inline";
                                    this.style.zoom = 1;
                                }
                            }
                        }
                    }

                    if (jQuery.isArray(prop[p])) {
                        // Create (if needed) and add to specialEasing
                        (opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
                        prop[p] = prop[p][0];
                    }
                }

                if (opt.overflow != null) {
                    this.style.overflow = "hidden";
                }

                opt.curAnim = jQuery.extend({}, prop);

                jQuery.each(prop, function (name, val) {
                    var e = new jQuery.fx(self, opt, name);

                    if (rfxtypes.test(val)) {
                        e[val === "toggle" ? hidden ? "show" : "hide" : val](prop);

                    } else {
                        var parts = rfxnum.exec(val),
						start = e.cur() || 0;

                        if (parts) {
                            var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

                            // We need to compute starting value
                            if (unit !== "px") {
                                jQuery.style(self, name, (end || 1) + unit);
                                start = ((end || 1) / e.cur()) * start;
                                jQuery.style(self, name, start + unit);
                            }

                            // If a +=/-= token was provided, we're doing a relative animation
                            if (parts[1]) {
                                end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
                            }

                            e.custom(start, end, unit);

                        } else {
                            e.custom(start, val, "");
                        }
                    }
                });

                // For JS strict compliance
                return true;
            });
        },

        stop: function (clearQueue, gotoEnd) {
            var timers = jQuery.timers;

            if (clearQueue) {
                this.queue([]);
            }

            this.each(function () {
                // go in reverse order so anything added to the queue during the loop is ignored
                for (var i = timers.length - 1; i >= 0; i--) {
                    if (timers[i].elem === this) {
                        if (gotoEnd) {
                            // force the next step to be the last
                            timers[i](true);
                        }

                        timers.splice(i, 1);
                    }
                }
            });

            // start the next in the queue if the last step wasn't forced
            if (!gotoEnd) {
                this.dequeue();
            }

            return this;
        }

    });

    function genFx(type, num) {
        var obj = {};

        jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function () {
            obj[this] = type;
        });

        return obj;
    }

    // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show", 1),
        slideUp: genFx("hide", 1),
        slideToggle: genFx("toggle", 1),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function (name, props) {
        jQuery.fn[name] = function (speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });

    jQuery.extend({
        speed: function (speed, easing, fn) {
            var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
                complete: fn || !fn && easing ||
				jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };

            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

            // Queueing
            opt.old = opt.complete;
            opt.complete = function () {
                if (opt.queue !== false) {
                    jQuery(this).dequeue();
                }
                if (jQuery.isFunction(opt.old)) {
                    opt.old.call(this);
                }
            };

            return opt;
        },

        easing: {
            linear: function (p, n, firstNum, diff) {
                return firstNum + diff * p;
            },
            swing: function (p, n, firstNum, diff) {
                return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum;
            }
        },

        timers: [],

        fx: function (elem, options, prop) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;

            if (!options.orig) {
                options.orig = {};
            }
        }

    });

    jQuery.fx.prototype = {
        // Simple function for setting a style value
        update: function () {
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }

            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
        },

        // Get the current size
        cur: function () {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
                return this.elem[this.prop];
            }

            var r = parseFloat(jQuery.css(this.elem, this.prop));
            return r && r > -10000 ? r : 0;
        },

        // Start an animation from one number to another
        custom: function (from, to, unit) {
            var self = this,
			fx = jQuery.fx;

            this.startTime = jQuery.now();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;

            function t(gotoEnd) {
                return self.step(gotoEnd);
            }

            t.elem = this.elem;

            if (t() && jQuery.timers.push(t) && !timerId) {
                timerId = setInterval(fx.tick, fx.interval);
            }
        },

        // Simple 'show' function
        show: function () {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
            this.options.show = true;

            // Begin the animation
            // Make sure that we start at a small width/height to avoid any
            // flash of content
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

            // Start by showing the element
            jQuery(this.elem).show();
        },

        // Simple 'hide' function
        hide: function () {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
            this.options.hide = true;

            // Begin the animation
            this.custom(this.cur(), 0);
        },

        // Each step of an animation
        step: function (gotoEnd) {
            var t = jQuery.now(), done = true;

            if (gotoEnd || t >= this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();

                this.options.curAnim[this.prop] = true;

                for (var i in this.options.curAnim) {
                    if (this.options.curAnim[i] !== true) {
                        done = false;
                    }
                }

                if (done) {
                    // Reset the overflow
                    if (this.options.overflow != null && !jQuery.support.shrinkWrapBlocks) {
                        var elem = this.elem,
						options = this.options;

                        jQuery.each(["", "X", "Y"], function (index, value) {
                            elem.style["overflow" + value] = options.overflow[index];
                        });
                    }

                    // Hide the element if the "hide" operation was done
                    if (this.options.hide) {
                        jQuery(this.elem).hide();
                    }

                    // Reset the properties, if the item has been hidden or shown
                    if (this.options.hide || this.options.show) {
                        for (var p in this.options.curAnim) {
                            jQuery.style(this.elem, p, this.options.orig[p]);
                        }
                    }

                    // Execute the complete function
                    this.options.complete.call(this.elem);
                }

                return false;

            } else {
                var n = t - this.startTime;
                this.state = n / this.options.duration;

                // Perform the easing function, defaults to swing
                var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
                var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
                this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);

                // Perform the next step of the animation
                this.update();
            }

            return true;
        }
    };

    jQuery.extend(jQuery.fx, {
        tick: function () {
            var timers = jQuery.timers;

            for (var i = 0; i < timers.length; i++) {
                if (!timers[i]()) {
                    timers.splice(i--, 1);
                }
            }

            if (!timers.length) {
                jQuery.fx.stop();
            }
        },

        interval: 13,

        stop: function () {
            clearInterval(timerId);
            timerId = null;
        },

        speeds: {
            slow: 600,
            fast: 200,
            // Default speed
            _default: 400
        },

        step: {
            opacity: function (fx) {
                jQuery.style(fx.elem, "opacity", fx.now);
            },

            _default: function (fx) {
                if (fx.elem.style && fx.elem.style[fx.prop] != null) {
                    fx.elem.style[fx.prop] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
                } else {
                    fx.elem[fx.prop] = fx.now;
                }
            }
        }
    });

    if (jQuery.expr && jQuery.expr.filters) {
        jQuery.expr.filters.animated = function (elem) {
            return jQuery.grep(jQuery.timers, function (fn) {
                return elem === fn.elem;
            }).length;
        };
    }

    function defaultDisplay(nodeName) {
        if (!elemdisplay[nodeName]) {
            var elem = jQuery("<" + nodeName + ">").appendTo("body"),
			display = elem.css("display");

            elem.remove();

            if (display === "none" || display === "") {
                display = "block";
            }

            elemdisplay[nodeName] = display;
        }

        return elemdisplay[nodeName];
    }




    var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

    if ("getBoundingClientRect" in document.documentElement) {
        jQuery.fn.offset = function (options) {
            var elem = this[0], box;

            if (options) {
                return this.each(function (i) {
                    jQuery.offset.setOffset(this, options, i);
                });
            }

            if (!elem || !elem.ownerDocument) {
                return null;
            }

            if (elem === elem.ownerDocument.body) {
                return jQuery.offset.bodyOffset(elem);
            }

            try {
                box = elem.getBoundingClientRect();
            } catch (e) { }

            var doc = elem.ownerDocument,
			docElem = doc.documentElement;

            // Make sure we're not dealing with a disconnected DOM node
            if (!box || !jQuery.contains(docElem, elem)) {
                return box || { top: 0, left: 0 };
            }

            var body = doc.body,
			win = getWindow(doc),
			clientTop = docElem.clientTop || body.clientTop || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop),
			scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft),
			top = box.top + scrollTop - clientTop,
			left = box.left + scrollLeft - clientLeft;

            return { top: top, left: left };
        };

    } else {
        jQuery.fn.offset = function (options) {
            var elem = this[0];

            if (options) {
                return this.each(function (i) {
                    jQuery.offset.setOffset(this, options, i);
                });
            }

            if (!elem || !elem.ownerDocument) {
                return null;
            }

            if (elem === elem.ownerDocument.body) {
                return jQuery.offset.bodyOffset(elem);
            }

            jQuery.offset.initialize();

            var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

            while ((elem = elem.parentNode) && elem !== body && elem !== docElem) {
                if (jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed") {
                    break;
                }

                computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
                top -= elem.scrollTop;
                left -= elem.scrollLeft;

                if (elem === offsetParent) {
                    top += elem.offsetTop;
                    left += elem.offsetLeft;

                    if (jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
                        top += parseFloat(computedStyle.borderTopWidth) || 0;
                        left += parseFloat(computedStyle.borderLeftWidth) || 0;
                    }

                    prevOffsetParent = offsetParent;
                    offsetParent = elem.offsetParent;
                }

                if (jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
                    top += parseFloat(computedStyle.borderTopWidth) || 0;
                    left += parseFloat(computedStyle.borderLeftWidth) || 0;
                }

                prevComputedStyle = computedStyle;
            }

            if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
                top += body.offsetTop;
                left += body.offsetLeft;
            }

            if (jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed") {
                top += Math.max(docElem.scrollTop, body.scrollTop);
                left += Math.max(docElem.scrollLeft, body.scrollLeft);
            }

            return { top: top, left: left };
        };
    }

    jQuery.offset = {
        initialize: function () {
            var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat(jQuery.css(body, "marginTop")) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

            jQuery.extend(container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" });

            container.innerHTML = html;
            body.insertBefore(container, body.firstChild);
            innerDiv = container.firstChild;
            checkDiv = innerDiv.firstChild;
            td = innerDiv.nextSibling.firstChild.firstChild;

            this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
            this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

            checkDiv.style.position = "fixed";
            checkDiv.style.top = "20px";

            // safari subtracts parent border width here which is 5px
            this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
            checkDiv.style.position = checkDiv.style.top = "";

            innerDiv.style.overflow = "hidden";
            innerDiv.style.position = "relative";

            this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

            this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

            body.removeChild(container);
            body = container = innerDiv = checkDiv = table = td = null;
            jQuery.offset.initialize = jQuery.noop;
        },

        bodyOffset: function (body) {
            var top = body.offsetTop,
			left = body.offsetLeft;

            jQuery.offset.initialize();

            if (jQuery.offset.doesNotIncludeMarginInBodyOffset) {
                top += parseFloat(jQuery.css(body, "marginTop")) || 0;
                left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
            }

            return { top: top, left: left };
        },

        setOffset: function (elem, options, i) {
            var position = jQuery.css(elem, "position");

            // set position first, in-case top/left are set even on static elem
            if (position === "static") {
                elem.style.position = "relative";
            }

            var curElem = jQuery(elem),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css(elem, "top"),
			curCSSLeft = jQuery.css(elem, "left"),
			calculatePosition = (position === "absolute" && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1),
			props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is absolute
            if (calculatePosition) {
                curPosition = curElem.position();
            }

            curTop = calculatePosition ? curPosition.top : parseInt(curCSSTop, 10) || 0;
            curLeft = calculatePosition ? curPosition.left : parseInt(curCSSLeft, 10) || 0;

            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };


    jQuery.fn.extend({
        position: function () {
            if (!this[0]) {
                return null;
            }

            var elem = this[0],

            // Get *real* offsetParent
		offsetParent = this.offsetParent(),

            // Get correct offsets
		offset = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0} : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
            offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;

            // Add offsetParent borders
            parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;

            // Subtract the two offsets
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        offsetParent: function () {
            return this.map(function () {
                var offsetParent = this.offsetParent || document.body;
                while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent;
            });
        }
    });


    // Create scrollLeft and scrollTop methods
    jQuery.each(["Left", "Top"], function (i, name) {
        var method = "scroll" + name;

        jQuery.fn[method] = function (val) {
            var elem = this[0], win;

            if (!elem) {
                return null;
            }

            if (val !== undefined) {
                // Set the scroll offset
                return this.each(function () {
                    win = getWindow(this);

                    if (win) {
                        win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					);

                    } else {
                        this[method] = val;
                    }
                });
            } else {
                win = getWindow(elem);

                // Return the scroll offset
                return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
				jQuery.support.boxModel && win.document.documentElement[method] ||
					win.document.body[method] :
				elem[method];
            }
        };
    });

    function getWindow(elem) {
        return jQuery.isWindow(elem) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
    }




    // Create innerHeight, innerWidth, outerHeight and outerWidth methods
    jQuery.each(["Height", "Width"], function (i, name) {

        var type = name.toLowerCase();

        // innerHeight and innerWidth
        jQuery.fn["inner" + name] = function () {
            return this[0] ?
			parseFloat(jQuery.css(this[0], type, "padding")) :
			null;
        };

        // outerHeight and outerWidth
        jQuery.fn["outer" + name] = function (margin) {
            return this[0] ?
			parseFloat(jQuery.css(this[0], type, margin ? "margin" : "border")) :
			null;
        };

        jQuery.fn[type] = function (size) {
            // Get window width or height
            var elem = this[0];
            if (!elem) {
                return size == null ? null : this;
            }

            if (jQuery.isFunction(size)) {
                return this.each(function (i) {
                    var self = jQuery(this);
                    self[type](size.call(this, i, self[type]()));
                });
            }

            if (jQuery.isWindow(elem)) {
                // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
                return elem.document.compatMode === "CSS1Compat" && elem.document.documentElement["client" + name] ||
				elem.document.body["client" + name];

                // Get document width or height
            } else if (elem.nodeType === 9) {
                // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
                return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

                // Get or set width or height on the element
            } else if (size === undefined) {
                var orig = jQuery.css(elem, type),
				ret = parseFloat(orig);

                return jQuery.isNaN(ret) ? orig : ret;

                // Set the width or height on the element (default to pixels if value is unitless)
            } else {
                return this.css(type, typeof size === "string" ? size : size + "px");
            }
        };

    });


})(window);


/*!
* jQuery UI Widget @VERSION
*
* Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* http://docs.jquery.com/UI/Widget
*/
(function ($, undefined) {

    // jQuery 1.4+
    if ($.cleanData) {
        var _cleanData = $.cleanData;
        $.cleanData = function (elems) {
            for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                $(elem).triggerHandler("remove");
            }
            _cleanData(elems);
        };
    } else {
        var _remove = $.fn.remove;
        $.fn.remove = function (selector, keepData) {
            return this.each(function () {
                if (!keepData) {
                    if (!selector || $.filter(selector, [this]).length) {
                        $("*", this).add([this]).each(function () {
                            $(this).triggerHandler("remove");
                        });
                    }
                }
                return _remove.call($(this), selector, keepData);
            });
        };
    }

    $.widget = function (name, base, prototype) {
        var namespace = name.split(".")[0],
		fullName;
        name = name.split(".")[1];
        fullName = namespace + "-" + name;

        if (!prototype) {
            prototype = base;
            base = $.Widget;
        }

        // create selector for plugin
        $.expr[":"][fullName] = function (elem) {
            return !!$.data(elem, name);
        };

        $[namespace] = $[namespace] || {};
        $[namespace][name] = function (options, element) {
            // allow instantiation without initializing for simple inheritance
            if (arguments.length) {
                this._createWidget(options, element);
            }
        };

        var basePrototype = new base();
        // we need to make the options hash a property directly on the new instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        //	$.each( basePrototype, function( key, val ) {
        //		if ( $.isPlainObject(val) ) {
        //			basePrototype[ key ] = $.extend( {}, val );
        //		}
        //	});
        basePrototype.options = $.extend(true, {}, basePrototype.options);
        $[namespace][name].prototype = $.extend(true, basePrototype, {
            namespace: namespace,
            widgetName: name,
            widgetEventPrefix: $[namespace][name].prototype.widgetEventPrefix || name,
            widgetBaseClass: fullName
        }, prototype);

        $.widget.bridge(name, $[namespace][name]);
    };

    $.widget.bridge = function (name, object) {
        $.fn[name] = function (options) {
            var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call(arguments, 1),
			returnValue = this;

            // allow multiple hashes to be passed on init
            options = !isMethodCall && args.length ?
			$.extend.apply(null, [true, options].concat(args)) :
			options;

            // prevent calls to internal methods
            if (isMethodCall && options.charAt(0) === "_") {
                return returnValue;
            }

            if (isMethodCall) {
                this.each(function () {
                    var instance = $.data(this, name);
                    if (!instance) {
                        throw "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'";
                    }
                    if (!$.isFunction(instance[options])) {
                        throw "no such method '" + options + "' for " + name + " widget instance";
                    }
                    var methodValue = instance[options].apply(instance, args);
                    if (methodValue !== instance && methodValue !== undefined) {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function () {
                    var instance = $.data(this, name);
                    if (instance) {
                        instance.option(options || {})._init();
                    } else {
                        $.data(this, name, new object(options, this));
                    }
                });
            }

            return returnValue;
        };
    };

    $.Widget = function (options, element) {
        // allow instantiation without initializing for simple inheritance
        if (arguments.length) {
            this._createWidget(options, element);
        }
    };

    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function (options, element) {
            // $.widget.bridge stores the plugin instance, but we do it anyway
            // so that it's stored even before the _create function runs
            $.data(element, this.widgetName, this);
            this.element = $(element);
            this.options = $.extend(true, {},
			this.options,
			this._getCreateOptions(),
			options);

            var self = this;
            this.element.bind("remove." + this.widgetName, function () {
                self.destroy();
            });

            this._create();
            this._trigger("create");
            this._init();
        },
        _getCreateOptions: function () {
            var options = {};
            if ($.metadata) {
                options = $.metadata.get(element)[this.widgetName];
            }
            return options;
        },
        _create: function () { },
        _init: function () { },

        destroy: function () {
            this.element
			.unbind("." + this.widgetName)
			.removeData(this.widgetName);
            this.widget()
			.unbind("." + this.widgetName)
			.removeAttr("aria-disabled")
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled");
        },

        widget: function () {
            return this.element;
        },

        option: function (key, value) {
            var options = key;

            if (arguments.length === 0) {
                // don't return a reference to the internal hash
                return $.extend({}, this.options);
            }

            if (typeof key === "string") {
                if (value === undefined) {
                    return this.options[key];
                }
                options = {};
                options[key] = value;
            }

            this._setOptions(options);

            return this;
        },
        _setOptions: function (options) {
            var self = this;
            $.each(options, function (key, value) {
                self._setOption(key, value);
            });

            return this;
        },
        _setOption: function (key, value) {
            this.options[key] = value;

            if (key === "disabled") {
                this.widget()
				[value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled")
				.attr("aria-disabled", value);
            }

            return this;
        },

        enable: function () {
            return this._setOption("disabled", false);
        },
        disable: function () {
            return this._setOption("disabled", true);
        },

        _trigger: function (type, event, data) {
            var callback = this.options[type];

            event = $.Event(event);
            event.type = (type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type).toLowerCase();
            data = data || {};

            // copy original event properties over to the new event
            // this would happen if we could call $.event.fix instead of $.Event
            // but we don't have a way to force an event to be fixed multiple times
            if (event.originalEvent) {
                for (var i = $.event.props.length, prop; i; ) {
                    prop = $.event.props[--i];
                    event[prop] = event.originalEvent[prop];
                }
            }

            this.element.trigger(event, data);

            return !($.isFunction(callback) &&
			callback.call(this.element[0], event, data) === false ||
			event.isDefaultPrevented());
        }
    };

})(jQuery);


/*
* jQuery Mobile Framework : widget factory extentions for mobile
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {

    $.widget("mobile.widget", {
        _getCreateOptions: function () {
            var elem = this.element,
			options = {};
            $.each(this.options, function (option) {
                var value = elem.data(option.replace(/[A-Z]/g, function (c) {
                    return "-" + c.toLowerCase();
                }));
                if (value !== undefined) {
                    options[option] = value;
                }
            });
            return options;
        }
    });

})(jQuery);


/*
* jQuery Mobile Framework : resolution and CSS media query related helpers and behavior
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {

    var $window = $(window),
	$html = $("html"),

    //media-query-like width breakpoints, which are translated to classes on the html element
	resolutionBreakpoints = [320, 480, 768, 1024];


    /* $.mobile.media method: pass a CSS media type or query and get a bool return
    note: this feature relies on actual media query support for media queries, though types will work most anywhere
    examples:
    $.mobile.media('screen') //>> tests for screen media type
    $.mobile.media('screen and (min-width: 480px)') //>> tests for screen media type with window width > 480px
    $.mobile.media('@media screen and (-webkit-min-device-pixel-ratio: 2)') //>> tests for webkit 2x pixel ratio (iPhone 4)
    */
    $.mobile.media = (function () {
        // TODO: use window.matchMedia once at least one UA implements it
        var cache = {},
		testDiv = $("<div id='jquery-mediatest'>"),
		fakeBody = $("<body>").append(testDiv);

        return function (query) {
            if (!(query in cache)) {
                var styleBlock = $("<style type='text/css'>" +
				"@media " + query + "{#jquery-mediatest{position:absolute;}}" +
				"</style>");
                $html.prepend(fakeBody).prepend(styleBlock);
                cache[query] = testDiv.css("position") === "absolute";
                fakeBody.add(styleBlock).remove();
            }
            return cache[query];
        };
    })();

    /*
    private function for adding/removing breakpoint classes to HTML element for faux media-query support
    It does not require media query support, instead using JS to detect screen width > cross-browser support
    This function is called on orientationchange, resize, and mobileinit, and is bound via the 'htmlclass' event namespace
    */
    function detectResolutionBreakpoints() {
        var currWidth = $window.width(),
		minPrefix = "min-width-",
		maxPrefix = "max-width-",
		minBreakpoints = [],
		maxBreakpoints = [],
		unit = "px",
		breakpointClasses;

        $html.removeClass(minPrefix + resolutionBreakpoints.join(unit + " " + minPrefix) + unit + " " +
		maxPrefix + resolutionBreakpoints.join(unit + " " + maxPrefix) + unit);

        $.each(resolutionBreakpoints, function (i, breakPoint) {
            if (currWidth >= breakPoint) {
                minBreakpoints.push(minPrefix + breakPoint + unit);
            }
            if (currWidth <= breakPoint) {
                maxBreakpoints.push(maxPrefix + breakPoint + unit);
            }
        });

        if (minBreakpoints.length) { breakpointClasses = minBreakpoints.join(" "); }
        if (maxBreakpoints.length) { breakpointClasses += " " + maxBreakpoints.join(" "); }

        $html.addClass(breakpointClasses);
    };

    /* $.mobile.addResolutionBreakpoints method:
    pass either a number or an array of numbers and they'll be added to the min/max breakpoint classes
    Examples:
    $.mobile.addResolutionBreakpoints( 500 );
    $.mobile.addResolutionBreakpoints( [500, 1200] );
    */
    $.mobile.addResolutionBreakpoints = function (newbps) {
        if ($.type(newbps) === "array") {
            resolutionBreakpoints = resolutionBreakpoints.concat(newbps);
        }
        else {
            resolutionBreakpoints.push(newbps);
        }
        resolutionBreakpoints.sort(function (a, b) { return a - b; });
        detectResolutionBreakpoints();
    };

    /* 	on mobileinit, add classes to HTML element
    and set handlers to update those on orientationchange and resize*/
    $(document).bind("mobileinit.htmlclass", function () {
        /* bind to orientationchange and resize
        to add classes to HTML element for min/max breakpoints and orientation */
        $window.bind("orientationchange.htmlclass resize.htmlclass", function (event) {
            //add orientation class to HTML element on flip/resize.
            if (event.orientation) {
                $html.removeClass("portrait landscape").addClass(event.orientation);
            }
            //add classes to HTML element for min/max breakpoints
            detectResolutionBreakpoints();
        });

        //trigger event manually
        $window.trigger("orientationchange.htmlclass");
    });

})(jQuery);

/*
* jQuery Mobile Framework : support tests
* Copyright (c) jQuery Project
* Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
* Note: Code is in draft form and is subject to change 
*/
(function ($, undefined) {



    var fakeBody = $("<body>").prependTo("html"),
	fbCSS = fakeBody[0].style,
	vendors = ['webkit', 'moz', 'o'],
	webos = window.palmGetResource || window.PalmServiceBridge, //only used to rule out scrollTop 
	bb = window.blackberry; //only used to rule out box shadow, as it's filled opaque on BB

    //thx Modernizr
    function propExists(prop) {
        var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
		props = (prop + ' ' + vendors.join(uc_prop + ' ') + uc_prop).split(' ');
        for (var v in props) {
            if (fbCSS[v] !== undefined) {
                return true;
            }
        }
    };

    //test for dynamic-updating base tag support (allows us to avoid href,src attr rewriting)
    function baseTagTest() {
        var fauxBase = location.protocol + '//' + location.host + location.pathname + "ui-dir/",
		base = $("<base>", { "href": fauxBase }).appendTo("head"),
		link = $("<a href='testurl'></a>").prependTo(fakeBody),
		rebase = link[0].href;
        base[0].href = location.pathname;
        base.remove();
        return rebase.indexOf(fauxBase) === 0;
    };

    $.extend($.support, {
        orientation: "orientation" in window,
        touch: "ontouchend" in document,
        cssTransitions: "WebKitTransitionEvent" in window,
        pushState: !!history.pushState,
        mediaquery: $.mobile.media('only all'),
        cssPseudoElement: !!propExists('content'),
        boxShadow: !!propExists('boxShadow') && !bb,
        scrollTop: ("pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in fakeBody[0]) && !webos,
        dynamicBaseTag: baseTagTest()
    });

    fakeBody.remove();

    //for ruling out shadows via css
    if (!$.support.boxShadow) { $('html').addClass('ui-mobile-nosupport-boxshadow'); }

})(jQuery);

/*
* jQuery Mobile Framework : events
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {

    // add new event shortcuts
    $.each("touchstart touchmove touchend orientationchange tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function (i, name) {
        $.fn[name] = function (fn) {
            return fn ? this.bind(name, fn) : this.trigger(name);
        };
        $.attrFn[name] = true;
    });

    var supportTouch = $.support.touch,
	scrollEvent = "touchmove scroll",
	touchStartEvent = supportTouch ? "touchstart" : "mousedown",
	touchStopEvent = supportTouch ? "touchend" : "mouseup",
	touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

    // also handles scrollstop
    $.event.special.scrollstart = {
        enabled: true,

        setup: function () {
            var thisObject = this,
			$this = $(thisObject),
			scrolling,
			timer;

            function trigger(event, state) {
                scrolling = state;
                var originalType = event.type;
                event.type = scrolling ? "scrollstart" : "scrollstop";
                $.event.handle.call(thisObject, event);
                event.type = originalType;
            }

            // iPhone triggers scroll after a small delay; use touchmove instead
            $this.bind(scrollEvent, function (event) {
                if (!$.event.special.scrollstart.enabled) {
                    return;
                }

                if (!scrolling) {
                    trigger(event, true);
                }

                clearTimeout(timer);
                timer = setTimeout(function () {
                    trigger(event, false);
                }, 50);
            });
        }
    };

    // also handles taphold
    $.event.special.tap = {
        setup: function () {
            var thisObject = this,
			$this = $(thisObject);

            $this
			.bind(touchStartEvent, function (event) {
			    if (event.which && event.which !== 1) {
			        return;
			    }

			    var moved = false,
					touching = true,
					origPos = [event.pageX, event.pageY],
					originalType,
					timer;

			    function moveHandler() {
			        if ((Math.abs(origPos[0] - event.pageX) > 10) ||
					    (Math.abs(origPos[1] - event.pageY) > 10)) {
			            moved = true;
			        }
			    }

			    timer = setTimeout(function () {
			        if (touching && !moved) {
			            originalType = event.type;
			            event.type = "taphold";
			            $.event.handle.call(thisObject, event);
			            event.type = originalType;
			        }
			    }, 750);

			    $this
					.one(touchMoveEvent, moveHandler)
					.one(touchStopEvent, function (event) {
					    $this.unbind(touchMoveEvent, moveHandler);
					    clearTimeout(timer);
					    touching = false;

					    if (!moved) {
					        originalType = event.type;
					        event.type = "tap";
					        $.event.handle.call(thisObject, event);
					        event.type = originalType;
					    }
					});
			});
        }
    };

    // also handles swipeleft, swiperight
    $.event.special.swipe = {
        setup: function () {
            var thisObject = this,
			$this = $(thisObject);

            $this
			.bind(touchStartEvent, function (event) {
			    var data = event.originalEvent.touches ?
						event.originalEvent.touches[0] :
						event,
					start = {
					    time: (new Date).getTime(),
					    coords: [data.pageX, data.pageY],
					    origin: $(event.target)
					},
					stop;

			    function moveHandler(event) {
			        if (!start) {
			            return;
			        }

			        var data = event.originalEvent.touches ?
							event.originalEvent.touches[0] :
							event;
			        stop = {
			            time: (new Date).getTime(),
			            coords: [data.pageX, data.pageY]
			        };

			        // prevent scrolling
			        if (Math.abs(start.coords[0] - stop.coords[0]) > 10) {
			            event.preventDefault();
			        }
			    }

			    $this
					.bind(touchMoveEvent, moveHandler)
					.one(touchStopEvent, function (event) {
					    $this.unbind(touchMoveEvent, moveHandler);
					    if (start && stop) {
					        if (stop.time - start.time < 1000 &&
									Math.abs(start.coords[0] - stop.coords[0]) > 30 &&
									Math.abs(start.coords[1] - stop.coords[1]) < 75) {
					            start.origin
								.trigger("swipe")
								.trigger(start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight");
					        }
					    }
					    start = stop = undefined;
					});
			});
        }
    };

    (function ($) {
        // "Cowboy" Ben Alman

        var win = $(window),
		special_event,
		get_orientation,
		last_orientation;

        $.event.special.orientationchange = special_event = {
            setup: function () {
                // If the event is supported natively, return false so that jQuery
                // will bind to the event using DOM methods.
                if ($.support.orientation) { return false; }

                // Get the current orientation to avoid initial double-triggering.
                last_orientation = get_orientation();

                // Because the orientationchange event doesn't exist, simulate the
                // event by testing window dimensions on resize.
                win.bind("resize", handler);
            },
            teardown: function () {
                // If the event is not supported natively, return false so that
                // jQuery will unbind the event using DOM methods.
                if ($.support.orientation) { return false; }

                // Because the orientationchange event doesn't exist, unbind the
                // resize event handler.
                win.unbind("resize", handler);
            },
            add: function (handleObj) {
                // Save a reference to the bound event handler.
                var old_handler = handleObj.handler;

                handleObj.handler = function (event) {
                    // Modify event object, adding the .orientation property.
                    event.orientation = get_orientation();

                    // Call the originally-bound event handler and return its result.
                    return old_handler.apply(this, arguments);
                };
            }
        };

        // If the event is not supported natively, this handler will be bound to
        // the window resize event to simulate the orientationchange event.
        function handler() {
            // Get the current orientation.
            var orientation = get_orientation();

            if (orientation !== last_orientation) {
                // The orientation has changed, so trigger the orientationchange event.
                last_orientation = orientation;
                win.trigger("orientationchange");
            }
        };

        // Get the current page orientation. This method is exposed publicly, should it
        // be needed, as jQuery.event.special.orientationchange.orientation()
        special_event.orientation = get_orientation = function () {
            var elem = document.documentElement;
            return elem && elem.clientWidth / elem.clientHeight < 1.1 ? "portrait" : "landscape";
        };

    })(jQuery);

    $.each({
        scrollstop: "scrollstart",
        taphold: "tap",
        swipeleft: "swipe",
        swiperight: "swipe"
    }, function (event, sourceEvent) {
        $.event.special[event] = {
            setup: function () {
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})(jQuery);


/*!
* jQuery hashchange event - v1.3 - 7/21/2010
* http://benalman.com/projects/jquery-hashchange-plugin/
* 
* Copyright (c) 2010 "Cowboy" Ben Alman
* Dual licensed under the MIT and GPL licenses.
* http://benalman.com/about/license/
*/

// Script: jQuery hashchange event
//
// *Version: 1.3, Last updated: 7/21/2010*
// 
// Project Home - http://benalman.com/projects/jquery-hashchange-plugin/
// GitHub       - http://github.com/cowboy/jquery-hashchange/
// Source       - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.js
// (Minified)   - http://github.com/cowboy/jquery-hashchange/raw/master/jquery.ba-hashchange.min.js (0.8kb gzipped)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// These working examples, complete with fully commented code, illustrate a few
// ways in which this plugin can be used.
// 
// hashchange event - http://benalman.com/code/projects/jquery-hashchange/examples/hashchange/
// document.domain - http://benalman.com/code/projects/jquery-hashchange/examples/document_domain/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.2.6, 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-4, Chrome 5-6, Safari 3.2-5,
//                   Opera 9.6-10.60, iPhone 3.1, Android 1.6-2.2, BlackBerry 4.6-5.
// Unit Tests      - http://benalman.com/code/projects/jquery-hashchange/unit/
// 
// About: Known issues
// 
// While this jQuery hashchange event implementation is quite stable and
// robust, there are a few unfortunate browser bugs surrounding expected
// hashchange event-based behaviors, independent of any JavaScript
// window.onhashchange abstraction. See the following examples for more
// information:
// 
// Chrome: Back Button - http://benalman.com/code/projects/jquery-hashchange/examples/bug-chrome-back-button/
// Firefox: Remote XMLHttpRequest - http://benalman.com/code/projects/jquery-hashchange/examples/bug-firefox-remote-xhr/
// WebKit: Back Button in an Iframe - http://benalman.com/code/projects/jquery-hashchange/examples/bug-webkit-hash-iframe/
// Safari: Back Button from a different domain - http://benalman.com/code/projects/jquery-hashchange/examples/bug-safari-back-from-diff-domain/
// 
// Also note that should a browser natively support the window.onhashchange 
// event, but not report that it does, the fallback polling loop will be used.
// 
// About: Release History
// 
// 1.3   - (7/21/2010) Reorganized IE6/7 Iframe code to make it more
//         "removable" for mobile-only development. Added IE6/7 document.title
//         support. Attempted to make Iframe as hidden as possible by using
//         techniques from http://www.paciellogroup.com/blog/?p=604. Added 
//         support for the "shortcut" format $(window).hashchange( fn ) and
//         $(window).hashchange() like jQuery provides for built-in events.
//         Renamed jQuery.hashchangeDelay to <jQuery.fn.hashchange.delay> and
//         lowered its default value to 50. Added <jQuery.fn.hashchange.domain>
//         and <jQuery.fn.hashchange.src> properties plus document-domain.html
//         file to address access denied issues when setting document.domain in
//         IE6/7.
// 1.2   - (2/11/2010) Fixed a bug where coming back to a page using this plugin
//         from a page on another domain would cause an error in Safari 4. Also,
//         IE6/7 Iframe is now inserted after the body (this actually works),
//         which prevents the page from scrolling when the event is first bound.
//         Event can also now be bound before DOM ready, but it won't be usable
//         before then in IE6/7.
// 1.1   - (1/21/2010) Incorporated document.documentMode test to fix IE8 bug
//         where browser version is incorrectly reported as 8.0, despite
//         inclusion of the X-UA-Compatible IE=EmulateIE7 meta tag.
// 1.0   - (1/9/2010) Initial Release. Broke out the jQuery BBQ event.special
//         window.onhashchange functionality into a separate plugin for users
//         who want just the basic event & back button support, without all the
//         extra awesomeness that BBQ provides. This plugin will be included as
//         part of jQuery BBQ, but also be available separately.

(function ($, window, undefined) {
    '$:nomunge'; // Used by YUI compressor.

    // Reused string.
    var str_hashchange = 'hashchange',

    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,

    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && (doc_mode === undefined || doc_mode > 7);

    // Get location.hash (or what you'd expect location.hash to be) sans any
    // leading #. Thanks for making this necessary, Firefox!
    function get_fragment(url) {
        url = url || location.href;
        return '#' + url.replace(/^[^#]*#?(.*)$/, '$1');
    };

    // Method: jQuery.fn.hashchange
    // 
    // Bind a handler to the window.onhashchange event or trigger all bound
    // window.onhashchange event handlers. This behavior is consistent with
    // jQuery's built-in event handlers.
    // 
    // Usage:
    // 
    // > jQuery(window).hashchange( [ handler ] );
    // 
    // Arguments:
    // 
    //  handler - (Function) Optional handler to be bound to the hashchange
    //    event. This is a "shortcut" for the more verbose form:
    //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
    //    all bound window.onhashchange event handlers will be triggered. This
    //    is a shortcut for the more verbose
    //    jQuery(window).trigger( 'hashchange' ). These forms are described in
    //    the <hashchange event> section.
    // 
    // Returns:
    // 
    //  (jQuery) The initial jQuery collection of elements.

    // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
    // $(elem).hashchange() for triggering, like jQuery does for built-in events.
    $.fn[str_hashchange] = function (fn) {
        return fn ? this.bind(str_hashchange, fn) : this.trigger(str_hashchange);
    };

    // Property: jQuery.fn.hashchange.delay
    // 
    // The numeric interval (in milliseconds) at which the <hashchange event>
    // polling loop executes. Defaults to 50.

    // Property: jQuery.fn.hashchange.domain
    // 
    // If you're setting document.domain in your JavaScript, and you want hash
    // history to work in IE6/7, not only must this property be set, but you must
    // also set document.domain BEFORE jQuery is loaded into the page. This
    // property is only applicable if you are supporting IE6/7 (or IE8 operating
    // in "IE7 compatibility" mode).
    // 
    // In addition, the <jQuery.fn.hashchange.src> property must be set to the
    // path of the included "document-domain.html" file, which can be renamed or
    // modified if necessary (note that the document.domain specified must be the
    // same in both your main JavaScript as well as in this file).
    // 
    // Usage:
    // 
    // jQuery.fn.hashchange.domain = document.domain;

    // Property: jQuery.fn.hashchange.src
    // 
    // If, for some reason, you need to specify an Iframe src file (for example,
    // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
    // do so using this property. Note that when using this property, history
    // won't be recorded in IE6/7 until the Iframe src file loads. This property
    // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
    // compatibility" mode).
    // 
    // Usage:
    // 
    // jQuery.fn.hashchange.src = 'path/to/file.html';

    $.fn[str_hashchange].delay = 50;
    /*
    $.fn[ str_hashchange ].domain = null;
    $.fn[ str_hashchange ].src = null;
    */

    // Event: hashchange event
    // 
    // Fired when location.hash changes. In browsers that support it, the native
    // HTML5 window.onhashchange event is used, otherwise a polling loop is
    // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
    // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
    // compatibility" mode), a hidden Iframe is created to allow the back button
    // and hash-based history to work.
    // 
    // Usage as described in <jQuery.fn.hashchange>:
    // 
    // > // Bind an event handler.
    // > jQuery(window).hashchange( function(e) {
    // >   var hash = location.hash;
    // >   ...
    // > });
    // > 
    // > // Manually trigger the event handler.
    // > jQuery(window).hashchange();
    // 
    // A more verbose usage that allows for event namespacing:
    // 
    // > // Bind an event handler.
    // > jQuery(window).bind( 'hashchange', function(e) {
    // >   var hash = location.hash;
    // >   ...
    // > });
    // > 
    // > // Manually trigger the event handler.
    // > jQuery(window).trigger( 'hashchange' );
    // 
    // Additional Notes:
    // 
    // * The polling loop and Iframe are not created until at least one handler
    //   is actually bound to the 'hashchange' event.
    // * If you need the bound handler(s) to execute immediately, in cases where
    //   a location.hash exists on page load, via bookmark or page refresh for
    //   example, use jQuery(window).hashchange() or the more verbose 
    //   jQuery(window).trigger( 'hashchange' ).
    // * The event can be bound before DOM ready, but since it won't be usable
    //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
    //   to bind it inside a DOM ready handler.

    // Override existing $.event.special.hashchange methods (allowing this plugin
    // to be defined after jQuery BBQ in BBQ's source code).
    special[str_hashchange] = $.extend(special[str_hashchange], {

        // Called only when the first 'hashchange' event is bound to window.
        setup: function () {
            // If window.onhashchange is supported natively, there's nothing to do..
            if (supports_onhashchange) { return false; }

            // Otherwise, we need to create our own. And we don't want to call this
            // until the user binds to the event, just in case they never do, since it
            // will create a polling loop and possibly even a hidden Iframe.
            $(fake_onhashchange.start);
        },

        // Called only when the last 'hashchange' event is unbound from window.
        teardown: function () {
            // If window.onhashchange is supported natively, there's nothing to do..
            if (supports_onhashchange) { return false; }

            // Otherwise, we need to stop ours (if possible).
            $(fake_onhashchange.stop);
        }

    });

    // fake_onhashchange does all the work of triggering the window.onhashchange
    // event for browsers that don't natively support it, including creating a
    // polling loop to watch for hash changes and in IE 6/7 creating a hidden
    // Iframe to enable back and forward.
    fake_onhashchange = (function () {
        var self = {},
      timeout_id,

        // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),

      fn_retval = function (val) { return val; },
      history_set = fn_retval,
      history_get = fn_retval;

        // Start the polling loop.
        self.start = function () {
            timeout_id || poll();
        };

        // Stop the polling loop.
        self.stop = function () {
            timeout_id && clearTimeout(timeout_id);
            timeout_id = undefined;
        };

        // This polling loop checks every $.fn.hashchange.delay milliseconds to see
        // if location.hash has changed, and triggers the 'hashchange' event on
        // window when necessary.
        function poll() {
            var hash = get_fragment(),
        history_hash = history_get(last_hash);

            if (hash !== last_hash) {
                history_set(last_hash = hash, history_hash);

                $(window).trigger(str_hashchange);

            } else if (history_hash !== last_hash) {
                location.href = location.href.replace(/#.*/, '') + history_hash;
            }

            timeout_id = setTimeout(poll, $.fn[str_hashchange].delay);
        };

        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
        // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        $.browser.msie && !supports_onhashchange && (function () {
            // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
            // when running in "IE7 compatibility" mode.

            var iframe,
        iframe_src;

            // When the event is bound and polling starts in IE 6/7, create a hidden
            // Iframe for history handling.
            self.start = function () {
                if (!iframe) {
                    iframe_src = $.fn[str_hashchange].src;
                    iframe_src = iframe_src && iframe_src + get_fragment();

                    // Create hidden Iframe. Attempt to make Iframe as hidden as possible
                    // by using techniques from http://www.paciellogroup.com/blog/?p=604.
                    iframe = $('<iframe tabindex="-1" title="empty"/>').hide()

                    // When Iframe has completely loaded, initialize the history and
                    // start polling.
            .one('load', function () {
                iframe_src || history_set(get_fragment());
                poll();
            })

                    // Load Iframe src if specified, otherwise nothing.
            .attr('src', iframe_src || 'javascript:0')

                    // Append Iframe after the end of the body to prevent unnecessary
                    // initial page scrolling (yes, this works).
            .insertAfter('body')[0].contentWindow;

                    // Whenever `document.title` changes, update the Iframe's title to
                    // prettify the back/next history menu entries. Since IE sometimes
                    // errors with "Unspecified error" the very first time this is set
                    // (yes, very useful) wrap this with a try/catch block.
                    doc.onpropertychange = function () {
                        try {
                            if (event.propertyName === 'title') {
                                iframe.document.title = doc.title;
                            }
                        } catch (e) { }
                    };

                }
            };

            // Override the "stop" method since an IE6/7 Iframe was created. Even
            // if there are no longer any bound event handlers, the polling loop
            // is still necessary for back/next to work at all!
            self.stop = fn_retval;

            // Get history by looking at the hidden Iframe's location.hash.
            history_get = function () {
                return get_fragment(iframe.location.href);
            };

            // Set a new history item by opening and then closing the Iframe
            // document, *then* setting its location.hash. If document.domain has
            // been set, update that as well.
            history_set = function (hash, history_hash) {
                var iframe_doc = iframe.document,
          domain = $.fn[str_hashchange].domain;

                if (hash !== history_hash) {
                    // Update Iframe with any initial `document.title` that might be set.
                    iframe_doc.title = doc.title;

                    // Opening the Iframe's document after it has been closed is what
                    // actually adds a history entry.
                    iframe_doc.open();

                    // Set document.domain for the Iframe document as well, if necessary.
                    domain && iframe_doc.write('<script>document.domain="' + domain + '"</script>');

                    iframe_doc.close();

                    // Update the Iframe's hash, for great justice.
                    iframe.location.hash = hash;
                }
            };

        })();
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        return self;
    })();

})(jQuery, this);


/*!
* jQuery Mobile v@VERSION
* http://jquerymobile.com/
*
* Copyright 2010, jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

(function ($, window, undefined) {

    //jQuery.mobile configurable options
    $.extend($.mobile, {

        //define the url parameter used for referencing widget-generated sub-pages. 
        //Translates to to example.html&ui-page=subpageIdentifier
        //hash segment before &ui-page= is used to make Ajax request
        subPageUrlKey: 'ui-page',

        //anchor links with a data-rel, or pages with a data-role, that match these selectors will be untrackable in history 
        //(no change in URL, not bookmarkable)
        nonHistorySelectors: 'dialog',

        //class assigned to page currently in view, and during transitions
        activePageClass: 'ui-page-active',

        //class used for "active" button state, from CSS framework
        activeBtnClass: 'ui-btn-active',

        //automatically handle link clicks through Ajax, when possible
        ajaxLinksEnabled: true,

        //automatically handle form submissions through Ajax, when possible
        ajaxFormsEnabled: true,

        //set default transition - 'none' for no transitions
        defaultTransition: 'slide',

        //show loading message during Ajax requests
        //if false, message will not appear, but loading classes will still be toggled on html el
        loadingMessage: "loading",

        //configure meta viewport tag's content attr:
        metaViewportContent: "width=device-width, minimum-scale=1, maximum-scale=1",

        //support conditions that must be met in order to proceed
        gradeA: function () {
            return $.support.mediaquery;
        }
    });


    //trigger mobileinit event - useful hook for configuring $.mobile settings before they're used
    $(window.document).trigger('mobileinit');


    //support conditions	
    //if device support condition(s) aren't met, leave things as they are -> a basic, usable experience,
    //otherwise, proceed with the enhancements
    if (!$.mobile.gradeA()) {
        return;
    }


    //define vars for interal use
    var $window = $(window),
		$html = $('html'),
		$head = $('head'),

    //loading div which appears during Ajax requests
    //will not appear if $.mobile.loadingMessage is false
		$loader = $.mobile.loadingMessage ?
			$('<div class="ui-loader ui-body-a ui-corner-all">' +
						'<span class="ui-icon ui-icon-loading spin"></span>' +
						'<h1>' + $.mobile.loadingMessage + '</h1>' +
					'</div>')
			: undefined;


    //add mobile, initial load "rendering" classes to docEl
    $html.addClass('ui-mobile ui-mobile-rendering');


    //define & prepend meta viewport tag, if content is defined	
    $.mobile.metaViewportContent ? $("<meta>", { name: "viewport", content: $.mobile.metaViewportContent }).prependTo($head) : undefined;


    //expose some core utilities
    $.extend($.mobile, {

        // turn on/off page loading message.
        pageLoading: function (done) {
            if (done) {
                $html.removeClass("ui-loading");
            } else {
                if ($.mobile.loadingMessage) {
                    $loader.appendTo($.mobile.pageContainer).css({ top: $(window).scrollTop() + 75 });
                }
                $html.addClass("ui-loading");
            }
        },

        //scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
        silentScroll: function (ypos) {
            // prevent scrollstart and scrollstop events
            $.event.special.scrollstart.enabled = false;
            setTimeout(function () {
                window.scrollTo(0, ypos || 0);
            }, 20);
            setTimeout(function () {
                $.event.special.scrollstart.enabled = true;
            }, 150);
        }
    });


    //dom-ready inits
    $(function () {

        //find present pages		
        var $pages = $("[data-role='page']");

        $pages.each(function () {
            $(this).attr('data-url', $(this).attr('id'));
        });

        //set up active page
        $.mobile.startPage = $.mobile.activePage = $pages.first();

        //set page container
        $.mobile.pageContainer = $.mobile.startPage.parent().addClass('ui-mobile-viewport');

        //cue page loading message
        $.mobile.pageLoading();

        //initialize all pages present
        $pages.page();

        //trigger a new hashchange, hash or not
        $window.trigger("hashchange", [true]);

        //remove rendering class
        $html.removeClass('ui-mobile-rendering');
    });


    //window load event	
    //hide iOS browser chrome on load
    $window.load($.mobile.silentScroll);

})(jQuery, this);


/*
* jQuery Mobile Framework : core utilities for auto ajax navigation, base tag mgmt,
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {

    //define vars for interal use
    var $window = $(window),
		$html = $('html'),
		$head = $('head'),

    //url path helpers for use in relative url management
		path = {

		    //get path from current hash, or from a file path
		    get: function (newPath) {
		        if (newPath == undefined) {
		            newPath = location.hash;
		        }
		        newPath = newPath.replace(/#/, '').split('/');
		        if (newPath.length) {
		            var lastSegment = newPath[newPath.length - 1];
		            if (lastSegment.indexOf('.') > -1 || lastSegment == '') {
		                newPath.pop();
		            }
		        }
		        return newPath.join('/') + (newPath.length ? '/' : '');
		    },

		    //return the substring of a filepath before the sub-page key, for making a server request
		    getFilePath: function (path) {
		        var splitkey = '&' + $.mobile.subPageUrlKey;
		        return path && path.indexOf(splitkey) > -1 ? path.split(splitkey)[0] : path;
		    },

		    set: function (path, disableListening) {
		        if (disableListening) { hashListener = false; }
		        location.hash = path;
		    },

		    //location pathname from intial directory request
		    origin: '',

		    setOrigin: function () {
		        path.origin = path.get(location.protocol + '//' + location.host + location.pathname);
		    }
		},

    //base element management, defined depending on dynamic base tag support
		base = $.support.dynamicBaseTag ? {

		    //define base element, for use in routing asset urls that are referenced in Ajax-requested markup
		    element: $("<base>", { href: path.origin }).prependTo($head),

		    //set the generated BASE element's href attribute to a new page's base path
		    set: function (href) {
		        base.element.attr('href', path.origin + path.get(href));
		    },

		    //set the generated BASE element's href attribute to a new page's base path
		    reset: function () {
		        base.element.attr('href', path.origin);
		    }

		} : undefined,


    //will be defined when a link is clicked and given an active class
		$activeClickedLink = null,

    //array of pages that are visited during a single page load
    //length will grow as pages are visited, and shrink as "back" link/button is clicked
    //each item has a url (string matches ID), and transition (saved for reuse when "back" link/button is clicked)
		urlStack = [{
		    url: location.hash.replace(/^#/, ""),
		    transition: undefined
		}],

    //define first selector to receive focus when a page is shown
		focusable = "[tabindex],a,button:visible,select:visible,input",

    //contains role for next page, if defined on clicked link via data-rel
		nextPageRole = null,

    //enable/disable hashchange event listener
    //toggled internally when location.hash is updated to match the url of a successful page load
		hashListener = true;

    //set location pathname from intial directory request
    path.setOrigin();

    /*
    internal utility functions
    --------------------------------------*/


    //direct focus to the page title, or otherwise first focusable element
    function reFocus(page) {
        var pageTitle = page.find(".ui-title:eq(0)");
        if (pageTitle.length) {
            pageTitle.focus();
        }
        else {
            page.find(focusable).eq(0).focus();
        }
    };

    //remove active classes after page transition or error
    function removeActiveLinkClass(forceRemoval) {
        if (!!$activeClickedLink && (!$activeClickedLink.closest('.ui-page-active').length || forceRemoval)) {
            $activeClickedLink.removeClass($.mobile.activeBtnClass);
        }
        $activeClickedLink = null;
    };


    //animation complete callback
    $.fn.animationComplete = function (callback) {
        if ($.support.cssTransitions) {
            return $(this).one('webkitAnimationEnd', callback);
        }
        else {
            callback();
        }
    };



    /* exposed $.mobile methods	 */

    //update location.hash, with or without triggering hashchange event
    $.mobile.updateHash = path.set;

    //url stack, useful when plugins need to be aware of previous pages viewed
    $.mobile.urlStack = urlStack;

    // changepage function
    $.mobile.changePage = function (to, transition, back, changeHash) {

        //from is always the currently viewed page
        var toIsArray = $.type(to) === "array",
			from = toIsArray ? to[0] : $.mobile.activePage,
			to = toIsArray ? to[1] : to,
			url = fileUrl = $.type(to) === "string" ? to.replace(/^#/, "") : null,
			data = undefined,
			type = 'get',
			isFormRequest = false,
			duplicateCachedPage = null,
			back = (back !== undefined) ? back : (urlStack.length > 1 && urlStack[urlStack.length - 2].url === url),
			transition = (transition !== undefined) ? transition : $.mobile.defaultTransition;


        //If we are trying to transition to the same page that we are currently on ignore the request.
        if (urlStack.length > 1 && url === urlStack[urlStack.length - 1].url && !toIsArray) {
            return;
        }


        if ($.type(to) === "object" && to.url) {
            url = to.url,
			data = to.data,
			type = to.type,
			isFormRequest = true;
            //make get requests bookmarkable
            if (data && type == 'get') {
                url += "?" + data;
                data = undefined;
            }
        }




        //reset base to pathname for new request
        if (base) { base.reset(); }

        //kill the keyboard
        $(window.document.activeElement).add(':focus').blur();

        // if the new href is the same as the previous one
        if (back) {
            var pop = urlStack.pop();
            if (pop) {
                transition = pop.transition;
            }
        } else {
            urlStack.push({ url: url, transition: transition });
        }

        //function for transitioning between two existing pages
        function transitionPages() {

            //get current scroll distance
            var currScroll = $window.scrollTop(),
					perspectiveTransitions = ["flip"],
          pageContainerClasses = [];

            //set as data for returning to that spot
            from.data('lastScroll', currScroll);

            //trigger before show/hide events
            from.data("page")._trigger("beforehide", { nextPage: to });
            to.data("page")._trigger("beforeshow", { prevPage: from });

            function loadComplete() {
                $.mobile.pageLoading(true);

                reFocus(to);

                if (changeHash !== false && url) {
                    path.set(url, (back !== true));
                }
                removeActiveLinkClass();

                //if there's a duplicateCachedPage, remove it from the DOM now that it's hidden
                if (duplicateCachedPage != null) {
                    duplicateCachedPage.remove();
                }

                //jump to top or prev scroll, if set
                $.mobile.silentScroll(to.data('lastScroll'));

                //trigger show/hide events, allow preventing focus change through return false
                from.data("page")._trigger("hide", null, { nextPage: to });
                if (to.data("page")._trigger("show", null, { prevPage: from }) !== false) {
                    $.mobile.activePage = to;
                }
            };

            function addContainerClass(className) {
                $.mobile.pageContainer.addClass(className);
                pageContainerClasses.push(className);
            };

            function removeContainerClasses() {
                $.mobile
					.pageContainer
					.removeClass(pageContainerClasses.join(" "));

                pageContainerClasses = [];
            };

            if (transition && (transition !== 'none')) {
                if (perspectiveTransitions.indexOf(transition) >= 0) {
                    addContainerClass('ui-mobile-viewport-perspective');
                }

                addContainerClass('ui-mobile-viewport-transitioning');

                // animate in / out
                from.addClass(transition + " out " + (back ? "reverse" : ""));
                to.addClass($.mobile.activePageClass + " " + transition +
					" in " + (back ? "reverse" : ""));

                // callback - remove classes, etc
                to.animationComplete(function () {
                    from.add(to).removeClass("out in reverse " + transition);
                    from.removeClass($.mobile.activePageClass);
                    loadComplete();
                    removeContainerClasses();
                });
            }
            else {
                from.removeClass($.mobile.activePageClass);
                to.addClass($.mobile.activePageClass);
                loadComplete();
            }
        };

        //shared page enhancements
        function enhancePage() {

            //set next page role, if defined
            if (nextPageRole || to.data('role') == 'dialog') {
                changeHash = false;
                if (nextPageRole) {
                    to.attr("data-role", nextPageRole);
                    nextPageRole = null;
                }
            }

            //run page plugin
            to.page();
        };

        //if url is a string
        if (url) {
            to = $("[data-url='" + url + "']");
            fileUrl = path.getFilePath(url);
        }
        else { //find base url of element, if avail
            var toID = to.attr('data-url'),
				toIDfileurl = path.getFilePath(toID);

            if (toID != toIDfileurl) {
                fileUrl = toIDfileurl;
            }
        }

        // find the "to" page, either locally existing in the dom or by creating it through ajax
        if (to.length && !isFormRequest) {
            if (fileUrl && base) {
                base.set(fileUrl);
            }
            enhancePage();
            transitionPages();
        } else {

            //if to exists in DOM, save a reference to it in duplicateCachedPage for removal after page change
            if (to.length) {
                duplicateCachedPage = to;
            }

            $.mobile.pageLoading();

            $.ajax({
                url: fileUrl,
                type: type,
                data: data,
                success: function (html) {
                    if (base) { base.set(fileUrl); }

                    var all = $("<div></div>");
                    //workaround to allow scripts to execute when included in page divs
                    all.get(0).innerHTML = html;
                    to = all.find('[data-role="page"], [data-role="dialog"]').first();

                    //rewrite src and href attrs to use a base url
                    if (!$.support.dynamicBaseTag) {
                        var newPath = path.get(fileUrl);
                        to.find('[src],link[href]').each(function () {
                            var thisAttr = $(this).is('[href]') ? 'href' : 'src',
								thisUrl = $(this).attr(thisAttr);

                            //if full path exists and is same, chop it - helps IE out
                            thisUrl.replace(location.protocol + '//' + location.host + location.pathname, '');

                            if (!/^(\w+:|#|\/)/.test(thisUrl)) {
                                $(this).attr(thisAttr, newPath + thisUrl);
                            }
                        });
                    }

                    to
						.attr("data-url", fileUrl)
						.appendTo($.mobile.pageContainer);

                    enhancePage();
                    transitionPages();
                },
                error: function () {
                    $.mobile.pageLoading(true);
                    removeActiveLinkClass(true);
                    base.set(path.get());
                    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>Error Loading Page</h1></div>")
						.css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
						.appendTo($.mobile.pageContainer)
						.delay(800)
						.fadeOut(400, function () {
						    $(this).remove();
						});
                }
            });
        }

    };


    /* Event Bindings - hashchange, submit, and click */

    //bind to form submit events, handle with Ajax
    $('form').live('submit', function (event) {
        if (!$.mobile.ajaxFormsEnabled) { return; }

        var type = $(this).attr("method"),
			url = $(this).attr("action").replace(location.protocol + "//" + location.host, "");

        //external submits use regular HTTP
        if (/^(:?\w+:)/.test(url)) {
            return;
        }

        //if it's a relative href, prefix href with base url
        if (url.indexOf('/') && url.indexOf('#') !== 0) {
            url = path.get() + url;
        }

        $.mobile.changePage({
            url: url,
            type: type,
            data: $(this).serialize()
        },
			undefined,
			undefined,
			true
		);
        event.preventDefault();
    });


    //click routing - direct to HTTP or Ajax, accordingly
    $("a").live("click", function (event) {

        if (!$.mobile.ajaxLinksEnabled) { return; }
        var $this = $(this),
        //get href, remove same-domain protocol and host
			href = $this.attr("href").replace(location.protocol + "//" + location.host, ""),
        //if target attr is specified, it's external, and we mimic _blank... for now
			target = $this.is("[target]"),
        //if it still starts with a protocol, it's external, or could be :mailto, etc
			external = target || /^(:?\w+:)/.test(href) || $this.is("[rel=external]");

        if (href === '#') {
            //for links created purely for interaction - ignore
            return false;
        }

        $activeClickedLink = $this.closest(".ui-btn").addClass($.mobile.activeBtnClass);

        if (external || !$.mobile.ajaxLinksEnabled) {
            //remove active link class if external
            removeActiveLinkClass(true);

            //deliberately redirect, in case click was triggered
            if (target) {
                window.open(href);
            }
            else {
                location.href = href;
            }
        }
        else {
            //use ajax
            var transition = $this.data("transition"),
				back = $this.data("back");

            nextPageRole = $this.attr("data-rel");

            //if it's a relative href, prefix href with base url
            if (href.indexOf('/') && href.indexOf('#') !== 0) {
                href = path.get() + href;
            }

            href.replace(/^#/, '');

            $.mobile.changePage(href, transition, back);
        }
        event.preventDefault();
    });



    //hashchange event handler
    $window.bind("hashchange", function (e, triggered) {
        if (!hashListener) {
            hashListener = true;
            return;
        }

        if ($(".ui-page-active").is("[data-role=" + $.mobile.nonHistorySelectors + "]")) {
            return;
        }

        var to = location.hash,
			transition = triggered ? false : undefined;

        //if to is defined, use it
        if (to) {
            $.mobile.changePage(to, transition, undefined, false);
        }
        //there's no hash, the active page is not the start page, and it's not manually triggered hashchange
        //we probably backed out to the first page visited
        else if ($.mobile.activePage.length && $.mobile.startPage[0] !== $.mobile.activePage[0] && !triggered) {
            $.mobile.changePage($.mobile.startPage, transition, true, false);
        }
        //probably the first page - show it
        else {
            $.mobile.startPage.trigger("pagebeforeshow", { prevPage: $('') });
            $.mobile.startPage.addClass($.mobile.activePageClass);
            $.mobile.pageLoading(true);

            if ($.mobile.startPage.trigger("pageshow", { prevPage: $('') }) !== false) {
                reFocus($.mobile.startPage);
            }
        }
    });
})(jQuery);

/*
* jQuery Mobile Framework : "page" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {

    $.widget("mobile.page", $.mobile.widget, {
        options: {
            backBtnText: "Back",
            addBackBtn: true,
            degradeInputs: {
                color: false,
                date: false,
                datetime: false,
                "datetime-local": false,
                email: false,
                month: false,
                number: false,
                range: "number",
                search: true,
                tel: false,
                time: false,
                url: false,
                week: false
            },
            keepNative: null
        },

        _create: function () {
            var $elem = this.element,
			o = this.options;

            this.keepNative = "[data-role='none'], [data-role='nojs']" + (o.keepNative ? ", " + o.keepNative : "");

            if (this._trigger("beforeCreate") === false) {
                return;
            }

            //some of the form elements currently rely on the presence of ui-page and ui-content
            // classes so we'll handle page and content roles outside of the main role processing
            // loop below.
            $elem.find("[data-role='page'], [data-role='content']").andSelf().each(function () {
                $(this).addClass("ui-" + $(this).data("role"));
            });

            $elem.find("[data-role='nojs']").addClass("ui-nojs");

            this._enchanceControls();

            // pre-find data els
            var $dataEls = $elem.find("[data-role]").andSelf().each(function () {
                var $this = $(this),
				role = $this.data("role"),
				theme = $this.data("theme");

                //apply theming and markup modifications to page,header,content,footer
                if (role === "header" || role === "footer") {
                    $this.addClass("ui-bar-" + (theme || $this.parent('[data-role=page]').data("theme") || "a"));

                    // add ARIA role
                    $this.attr("role", role === "header" ? "banner" : "contentinfo");

                    //right,left buttons
                    var $headeranchors = $this.children("a"),
					leftbtn = $headeranchors.hasClass("ui-btn-left"),
					rightbtn = $headeranchors.hasClass("ui-btn-right");

                    if (!leftbtn) {
                        leftbtn = $headeranchors.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length;
                    }

                    if (!rightbtn) {
                        rightbtn = $headeranchors.eq(1).addClass("ui-btn-right").length;
                    }

                    // auto-add back btn on pages beyond first view
                    if (o.addBackBtn && role === "header" &&
						($.mobile.urlStack.length > 1 || $(".ui-page").length > 1) &&
						!leftbtn && !$this.data("noBackBtn")) {

                        $("<a href='#' class='ui-btn-left' data-icon='arrow-l'>" + o.backBtnText + "</a>")
						.click(function () {
						    history.back();
						    return false;
						})
						.prependTo($this);
                    }

                    //page title
                    $this.children("h1, h2, h3, h4, h5, h6")
					.addClass("ui-title")
                    //regardless of h element number in src, it becomes h1 for the enhanced page
					.attr({ "tabindex": "0", "role": "heading", "aria-level": "1" });

                } else if (role === "content") {
                    if (theme) {
                        $this.addClass("ui-body-" + theme);
                    }

                    // add ARIA role
                    $this.attr("role", "main");

                } else if (role === "page") {
                    $this.addClass("ui-body-" + (theme || "c"));
                }

                switch (role) {
                    case "header":
                    case "footer":
                    case "page":
                    case "content":
                        $this.addClass("ui-" + role);
                        break;
                    case "collapsible":
                    case "fieldcontain":
                    case "navbar":
                    case "listview":
                    case "dialog":
                        $this[role]();
                        break;
                }
            });

            //links in bars, or those with data-role become buttons
            $elem.find("[data-role='button'], .ui-bar > a, .ui-header > a, .ui-footer > a")
			.not(".ui-btn")
			.not(this.keepNative)
			.buttonMarkup();

            $elem
			.find("[data-role='controlgroup']")
			.controlgroup();

            //links within content areas
            $elem.find("a:not(.ui-btn):not(.ui-link-inherit)")
			.not(this.keepNative)
			.addClass("ui-link");

            //fix toolbars
            $elem.fixHeaderFooter();
        },

        _enchanceControls: function () {
            var o = this.options;

            // degrade inputs to avoid poorly implemented native functionality
            this.element.find("input").not(this.keepNative).each(function () {
                var type = this.getAttribute("type"),
				optType = o.degradeInputs[type] || "text";

                if (o.degradeInputs[type]) {
                    $(this).replaceWith(
					$("<div>").html($(this).clone()).html()
						.replace(/type="([a-zA-Z]+)"/, "type=" + optType + " data-type='$1'"));
                }
            });

            // enchance form controls
            this.element
			.find("[type='radio'], [type='checkbox']")
			.not(this.keepNative)
			.checkboxradio();

            this.element
			.find("button, [type='button'], [type='submit'], [type='reset'], [type='image']")
			.not(this.keepNative)
			.button();

            this.element
			.find("input, textarea")
			.not("[type='radio'], [type='checkbox'], button, [type='button'], [type='submit'], [type='reset'], [type='image']")
			.not(this.keepNative)
			.textinput();

            this.element
			.find("input, select")
			.not(this.keepNative)
			.filter("[data-role='slider'], [data-type='range']")
			.slider();

            this.element
			.find("select:not([data-role='slider'])")
			.not(this.keepNative)
			.selectmenu();
        }
    });

})(jQuery);


/*
* jQuery UI Position @VERSION
*
* Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* http://docs.jquery.com/UI/Position
*/
(function ($, undefined) {

    $.ui = $.ui || {};

    var horizontalPositions = /left|center|right/,
	verticalPositions = /top|center|bottom/,
	center = "center",
	_position = $.fn.position,
	_offset = $.fn.offset;

    $.fn.position = function (options) {
        if (!options || !options.of) {
            return _position.apply(this, arguments);
        }

        // make a copy, we don't want to modify arguments
        options = $.extend({}, options);

        var target = $(options.of),
		targetElem = target[0],
		collision = (options.collision || "flip").split(" "),
		offset = options.offset ? options.offset.split(" ") : [0, 0],
		targetWidth,
		targetHeight,
		basePosition;

        if (targetElem.nodeType === 9) {
            targetWidth = target.width();
            targetHeight = target.height();
            basePosition = { top: 0, left: 0 };
            // TODO: use $.isWindow() in 1.9
        } else if (targetElem.setTimeout) {
            targetWidth = target.width();
            targetHeight = target.height();
            basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
        } else if (targetElem.preventDefault) {
            // force left top to allow flipping
            options.at = "left top";
            targetWidth = targetHeight = 0;
            basePosition = { top: options.of.pageY, left: options.of.pageX };
        } else {
            targetWidth = target.outerWidth();
            targetHeight = target.outerHeight();
            basePosition = target.offset();
        }

        // force my and at to have valid horizontal and veritcal positions
        // if a value is missing or invalid, it will be converted to center 
        $.each(["my", "at"], function () {
            var pos = (options[this] || "").split(" ");
            if (pos.length === 1) {
                pos = horizontalPositions.test(pos[0]) ?
				pos.concat([center]) :
				verticalPositions.test(pos[0]) ?
					[center].concat(pos) :
					[center, center];
            }
            pos[0] = horizontalPositions.test(pos[0]) ? pos[0] : center;
            pos[1] = verticalPositions.test(pos[1]) ? pos[1] : center;
            options[this] = pos;
        });

        // normalize collision option
        if (collision.length === 1) {
            collision[1] = collision[0];
        }

        // normalize offset option
        offset[0] = parseInt(offset[0], 10) || 0;
        if (offset.length === 1) {
            offset[1] = offset[0];
        }
        offset[1] = parseInt(offset[1], 10) || 0;

        if (options.at[0] === "right") {
            basePosition.left += targetWidth;
        } else if (options.at[0] === center) {
            basePosition.left += targetWidth / 2;
        }

        if (options.at[1] === "bottom") {
            basePosition.top += targetHeight;
        } else if (options.at[1] === center) {
            basePosition.top += targetHeight / 2;
        }

        basePosition.left += offset[0];
        basePosition.top += offset[1];

        return this.each(function () {
            var elem = $(this),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseInt($.curCSS(this, "marginLeft", true)) || 0,
			marginTop = parseInt($.curCSS(this, "marginTop", true)) || 0,
			collisionWidth = elemWidth + marginLeft +
				parseInt($.curCSS(this, "marginRight", true)) || 0,
			collisionHeight = elemHeight + marginTop +
				parseInt($.curCSS(this, "marginBottom", true)) || 0,
			position = $.extend({}, basePosition),
			collisionPosition;

            if (options.my[0] === "right") {
                position.left -= elemWidth;
            } else if (options.my[0] === center) {
                position.left -= elemWidth / 2;
            }

            if (options.my[1] === "bottom") {
                position.top -= elemHeight;
            } else if (options.my[1] === center) {
                position.top -= elemHeight / 2;
            }

            // prevent fractions (see #5280)
            position.left = parseInt(position.left);
            position.top = parseInt(position.top);

            collisionPosition = {
                left: position.left - marginLeft,
                top: position.top - marginTop
            };

            $.each(["left", "top"], function (i, dir) {
                if ($.ui.position[collision[i]]) {
                    $.ui.position[collision[i]][dir](position, {
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        elemWidth: elemWidth,
                        elemHeight: elemHeight,
                        collisionPosition: collisionPosition,
                        collisionWidth: collisionWidth,
                        collisionHeight: collisionHeight,
                        offset: offset,
                        my: options.my,
                        at: options.at
                    });
                }
            });

            if ($.fn.bgiframe) {
                elem.bgiframe();
            }
            elem.offset($.extend(position, { using: options.using }));
        });
    };

    $.ui.position = {
        fit: {
            left: function (position, data) {
                var win = $(window),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
                position.left = over > 0 ? position.left - over : Math.max(position.left - data.collisionPosition.left, position.left);
            },
            top: function (position, data) {
                var win = $(window),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
                position.top = over > 0 ? position.top - over : Math.max(position.top - data.collisionPosition.top, position.top);
            }
        },

        flip: {
            left: function (position, data) {
                if (data.at[0] === center) {
                    return;
                }
                var win = $(window),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(),
				myOffset = data.my[0] === "left" ?
					-data.elemWidth :
					data.my[0] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[0] === "left" ?
					data.targetWidth :
					-data.targetWidth,
				offset = -2 * data.offset[0];
                position.left += data.collisionPosition.left < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
            },
            top: function (position, data) {
                if (data.at[1] === center) {
                    return;
                }
                var win = $(window),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(),
				myOffset = data.my[1] === "top" ?
					-data.elemHeight :
					data.my[1] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[1] === "top" ?
					data.targetHeight :
					-data.targetHeight,
				offset = -2 * data.offset[1];
                position.top += data.collisionPosition.top < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
            }
        }
    };

    // offset setter from jQuery 1.4
    if (!$.offset.setOffset) {
        $.offset.setOffset = function (elem, options) {
            // set position first, in-case top/left are set even on static elem
            if (/static/.test($.curCSS(elem, "position"))) {
                elem.style.position = "relative";
            }
            var curElem = $(elem),
			curOffset = curElem.offset(),
			curTop = parseInt($.curCSS(elem, "top", true), 10) || 0,
			curLeft = parseInt($.curCSS(elem, "left", true), 10) || 0,
			props = {
			    top: (options.top - curOffset.top) + curTop,
			    left: (options.left - curOffset.left) + curLeft
			};

            if ('using' in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        };

        $.fn.offset = function (options) {
            var elem = this[0];
            if (!elem || !elem.ownerDocument) { return null; }
            if (options) {
                return this.each(function () {
                    $.offset.setOffset(this, options);
                });
            }
            return _offset.call(this);
        };
    }

} (jQuery));

/*
* jQuery Mobile Framework : "fixHeaderFooter" plugin - on-demand positioning for headers,footers
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.fn.fixHeaderFooter = function (options) {
        if (!$.support.scrollTop) { return $(this); }
        return $(this).each(function () {
            if ($(this).data('fullscreen')) { $(this).addClass('ui-page-fullscreen'); }
            $(this).find('.ui-header[data-position="fixed"]').addClass('ui-header-fixed ui-fixed-inline fade'); //should be slidedown
            $(this).find('.ui-footer[data-position="fixed"]').addClass('ui-footer-fixed ui-fixed-inline fade'); //should be slideup		
        });
    };

    //single controller for all showing,hiding,toggling		
    $.fixedToolbars = (function () {
        if (!$.support.scrollTop) { return; }
        var currentstate = 'inline',
		delayTimer,
		ignoreTargets = 'a,input,textarea,select,button,label,.ui-header-fixed,.ui-footer-fixed',
		toolbarSelector = '.ui-header-fixed:first, .ui-footer-fixed:not(.ui-footer-duplicate):last',
		stickyFooter, //for storing quick references to duplicate footers
		supportTouch = $.support.touch,
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = supportTouch ? "touchend" : "mouseup",
		stateBefore = null,
		scrollTriggered = false,
        touchToggleEnabled = true;

        $(function () {
            $(document)
			.bind(touchStartEvent, function (event) {
			    if (touchToggleEnabled) {
			        if ($(event.target).closest(ignoreTargets).length) { return; }
			        stateBefore = currentstate;
			    }
			})
			.bind('scrollstart', function (event) {
			    if ($(event.target).closest(ignoreTargets).length) { return; } //because it could be a touchmove...
			    scrollTriggered = true;
			    if (stateBefore == null) { stateBefore = currentstate; }
			    if (stateBefore == 'overlay') {
			        $.fixedToolbars.hide(true);
			    }
			})
			.bind(touchStopEvent, function (event) {
			    if (touchToggleEnabled) {
			        if ($(event.target).closest(ignoreTargets).length) { return; }
			        if (!scrollTriggered) {
			            $.fixedToolbars.toggle(stateBefore);
			            stateBefore = null;
			        }
			    }
			})
			.bind('scrollstop', function (event) {
			    if ($(event.target).closest(ignoreTargets).length) { return; }
			    scrollTriggered = false;
			    if (stateBefore == 'overlay') {
			        $.fixedToolbars.show();
			    }
			    stateBefore = null;
			});

            //function to return another footer already in the dom with the same data-id
            function findStickyFooter(el) {
                var thisFooter = el.find('[data-role="footer"]');
                return $('.ui-footer[data-id="' + thisFooter.data('id') + '"]:not(.ui-footer-duplicate)').not(thisFooter);
            }

            //before page is shown, check for duplicate footer
            $('.ui-page').live('pagebeforeshow', function (event, ui) {
                stickyFooter = findStickyFooter($(event.target));
                if (stickyFooter.length) {
                    //if the existing footer is the first of its kind, create a placeholder before stealing it 
                    if (stickyFooter.parents('.ui-page:eq(0)').find('.ui-footer[data-id="' + stickyFooter.data('id') + '"]').length == 1) {
                        stickyFooter.before(stickyFooter.clone().addClass('ui-footer-duplicate'));
                    }
                    $(event.target).find('[data-role="footer"]').addClass('ui-footer-duplicate');
                    stickyFooter.appendTo($.pageContainer).css('top', 0);
                    setTop(stickyFooter);
                }
            });

            //after page is shown, append footer to new page
            $('.ui-page').live('pageshow', function (event, ui) {
                if (stickyFooter && stickyFooter.length) {
                    stickyFooter.appendTo(event.target).css('top', 0);
                }
                $.fixedToolbars.show(true, this);
            });

        });

        // element.getBoundingClientRect() is broken in iOS 3.2.1 on the iPad. The
        // coordinates inside of the rect it returns don't have the page scroll position
        // factored out of it like the other platforms do. To get around this,
        // we'll just calculate the top offset the old fashioned way until core has
        // a chance to figure out how to handle this situation.
        //
        // TODO: We'll need to get rid of getOffsetTop() once a fix gets folded into core.

        function getOffsetTop(ele) {
            var top = 0;
            if (ele) {
                var op = ele.offsetParent, body = document.body;
                top = ele.offsetTop;
                while (ele && ele != body) {
                    top += ele.scrollTop || 0;
                    if (ele == op) {
                        top += op.offsetTop;
                        op = ele.offsetParent;
                    }
                    ele = ele.parentNode;
                }
            }
            return top;
        }

        function setTop(el) {
            var fromTop = $(window).scrollTop(),
			thisTop = getOffsetTop(el[0]), // el.offset().top returns the wrong value on iPad iOS 3.2.1, call our workaround instead.
			thisCSStop = el.css('top') == 'auto' ? 0 : parseFloat(el.css('top')),
			screenHeight = window.innerHeight,
			thisHeight = el.outerHeight(),
			useRelative = el.parents('.ui-page:not(.ui-page-fullscreen)').length,
			relval;
            if (el.is('.ui-header-fixed')) {
                relval = fromTop - thisTop + thisCSStop;
                if (relval < thisTop) { relval = 0; }
                return el.css('top', (useRelative) ? relval : fromTop);
            }
            else {
                //relval = -1 * (thisTop - (fromTop + screenHeight) + thisCSStop + thisHeight);
                //if( relval > thisTop ){ relval = 0; }
                relval = fromTop + screenHeight - thisHeight - (thisTop - thisCSStop);
                return el.css('top', (useRelative) ? relval : fromTop + screenHeight - thisHeight);
            }
        }

        //exposed methods
        return {
            show: function (immediately, page) {
                currentstate = 'overlay';
                var $ap = page ? $(page) : ($.mobile.activePage ? $.mobile.activePage : $(".ui-page-active"));
                return $ap.children(toolbarSelector).each(function () {
                    var el = $(this),
					fromTop = $(window).scrollTop(),
					thisTop = getOffsetTop(el[0]), // el.offset().top returns the wrong value on iPad iOS 3.2.1, call our workaround instead.
					screenHeight = window.innerHeight,
					thisHeight = el.outerHeight(),
					alreadyVisible = (el.is('.ui-header-fixed') && fromTop <= thisTop + thisHeight) || (el.is('.ui-footer-fixed') && thisTop <= fromTop + screenHeight);

                    //add state class
                    el.addClass('ui-fixed-overlay').removeClass('ui-fixed-inline');

                    if (!alreadyVisible && !immediately) {
                        el.animationComplete(function () {
                            el.removeClass('in');
                        }).addClass('in');
                    }
                    setTop(el);
                });
            },
            hide: function (immediately) {
                currentstate = 'inline';
                var $ap = $.mobile.activePage ? $.mobile.activePage : $(".ui-page-active");
                return $ap.children(toolbarSelector).each(function () {
                    var el = $(this);

                    var thisCSStop = el.css('top'); thisCSStop = thisCSStop == 'auto' ? 0 : parseFloat(thisCSStop);

                    //add state class
                    el.addClass('ui-fixed-inline').removeClass('ui-fixed-overlay');

                    if (thisCSStop < 0 || (el.is('.ui-header-fixed') && thisCSStop != 0)) {
                        if (immediately) {
                            el.css('top', 0);
                        }
                        else {
                            if (el.css('top') !== 'auto' && parseFloat(el.css('top')) !== 0) {
                                var classes = 'out reverse';
                                el.animationComplete(function () {
                                    el.removeClass(classes);
                                    el.css('top', 0);
                                }).addClass(classes);
                            }
                        }
                    }
                });
            },
            hideAfterDelay: function () {
                delayTimer = setTimeout(function () {
                    $.fixedToolbars.hide();
                }, 3000);
            },
            toggle: function (from) {
                if (from) { currentstate = from; }
                return (currentstate == 'overlay') ? $.fixedToolbars.hide() : $.fixedToolbars.show();
            },
            setTouchToggleEnabled: function (enabled) {
                touchToggleEnabled = enabled;
            }
        };
    })();

})(jQuery);

/*
* jQuery Mobile Framework : "checkboxradio" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.widget("mobile.checkboxradio", $.mobile.widget, {
        options: {
            theme: null
        },
        _create: function () {
            var input = this.element,
			label = $("label[for='" + input.attr("id") + "']"),
			inputtype = input.attr("type"),
			checkedicon = "ui-icon-" + inputtype + "-on",
			uncheckedicon = "ui-icon-" + inputtype + "-off";

            if (inputtype != "checkbox" && inputtype != "radio") { return; }

            label
			.buttonMarkup({
			    theme: this.options.theme,
			    icon: this.element.parents("[data-type='horizontal']").length ? undefined : uncheckedicon,
			    shadow: false
			});

            // wrap the input + label in a div 
            input
			.add(label)
			.wrapAll("<div class='ui-" + inputtype + "'></div>");

            label.bind({
                mouseover: function () {
                    if ($(this).parent().is('.ui-disabled')) { return false; }
                },

                mousedown: function () {
                    if ($(this).parent().is('.ui-disabled')) { return false; }
                    label.data("state", input.attr("checked"));
                },

                click: function () {
                    setTimeout(function () {
                        if (input.attr("checked") === label.data("state")) {
                            input.trigger("click");
                        }
                    }, 1);
                }
            });

            input
			.bind({

			    click: function () {
			        $("input[name='" + input.attr("name") + "'][type='" + inputtype + "']").checkboxradio("refresh");
			    },

			    focus: function () {
			        label.addClass("ui-focus");
			    },

			    blur: function () {
			        label.removeClass("ui-focus");
			    }
			});

            this.refresh();

        },

        refresh: function () {
            var input = this.element,
			label = $("label[for='" + input.attr("id") + "']"),
			inputtype = input.attr("type"),
			icon = label.find(".ui-icon"),
			checkedicon = "ui-icon-" + inputtype + "-on",
			uncheckedicon = "ui-icon-" + inputtype + "-off";

            if (input[0].checked) {
                label.addClass("ui-btn-active");
                icon.addClass(checkedicon);
                icon.removeClass(uncheckedicon);

            } else {
                label.removeClass("ui-btn-active");
                icon.removeClass(checkedicon);
                icon.addClass(uncheckedicon);
            }

            if (input.is(":disabled")) {
                this.disable();
            }
            else {
                this.enable();
            }
        },

        disable: function () {
            this.element.attr("disabled", true).parent().addClass("ui-disabled");
        },

        enable: function () {
            this.element.attr("disabled", false).parent().removeClass("ui-disabled");
        }
    });
})(jQuery);


/*
* jQuery Mobile Framework : "textinput" plugin for text inputs, textareas
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.widget("mobile.textinput", $.mobile.widget, {
        options: {
            theme: null
        },
        _create: function () {
            var input = this.element,
			o = this.options,
			theme = o.theme,
			themeclass;

            if (!theme) {
                var themedParent = this.element.closest("[class*='ui-bar-'],[class*='ui-body-']");
                theme = themedParent.length ?
					/ui-(bar|body)-([a-z])/.exec(themedParent.attr("class"))[2] :
					"c";
            }

            themeclass = " ui-body-" + theme;

            $('label[for=' + input.attr('id') + ']').addClass('ui-input-text');

            input.addClass('ui-input-text ui-body-' + o.theme);

            var focusedEl = input;

            //"search" input widget
            if (input.is('[type="search"],[data-type="search"]')) {
                focusedEl = input.wrap('<div class="ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-search' + themeclass + '"></div>').parent();
                var clearbtn = $('<a href="#" class="ui-input-clear" title="clear text">clear text</a>')
				.click(function () {
				    input.val('').focus();
				    input.trigger('change');
				    clearbtn.addClass('ui-input-clear-hidden');
				    return false;
				})
				.appendTo(focusedEl)
				.buttonMarkup({ icon: 'delete', iconpos: 'notext', corners: true, shadow: true });

                function toggleClear() {
                    if (input.val() == '') {
                        clearbtn.addClass('ui-input-clear-hidden');
                    }
                    else {
                        clearbtn.removeClass('ui-input-clear-hidden');
                    }
                }

                toggleClear();
                input.keyup(toggleClear);
            }
            else {
                input.addClass('ui-corner-all ui-shadow-inset' + themeclass);
            }

            input
			.focus(function () {
			    focusedEl.addClass('ui-focus');
			})
			.blur(function () {
			    focusedEl.removeClass('ui-focus');
			});

            //autogrow
            if (input.is('textarea')) {
                var extraLineHeight = 15,
				keyupTimeoutBuffer = 100,
				keyup = function () {
				    var scrollHeight = input[0].scrollHeight,
						clientHeight = input[0].clientHeight;
				    if (clientHeight < scrollHeight) {
				        input.css({ height: (scrollHeight + extraLineHeight) });
				    }
				},
				keyupTimeout;
                input.keyup(function () {
                    clearTimeout(keyupTimeout);
                    keyupTimeout = setTimeout(keyup, keyupTimeoutBuffer);
                });
            }
        },

        disable: function () {
            (this.element.attr("disabled", true).is('[type="search"],[data-type="search"]') ? this.element.parent() : this.element).addClass("ui-disabled");
        },

        enable: function () {
            (this.element.attr("disabled", false).is('[type="search"],[data-type="search"]') ? this.element.parent() : this.element).removeClass("ui-disabled");
        }
    });
})(jQuery);


/*
* jQuery Mobile Framework : "selectmenu" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.widget("mobile.selectmenu", $.mobile.widget, {
        options: {
            theme: null,
            disabled: false,
            icon: 'arrow-d',
            iconpos: 'right',
            inline: null,
            corners: true,
            shadow: true,
            iconshadow: true,
            menuPageTheme: 'b',
            overlayTheme: 'a',
            hidePlaceholderMenuItems: true
        },
        _create: function () {

            var self = this,

			o = this.options,

			select = this.element
						.attr("tabindex", "-1")
						.wrap("<div class='ui-select'>"),

			selectID = select.attr("id"),

			label = $("label[for=" + selectID + "]").addClass("ui-select"),

			buttonId = selectID + "-button",

			menuId = selectID + "-menu",

			thisPage = select.closest(".ui-page"),

			button = $("<a>", {
			    "href": "#",
			    "role": "button",
			    "id": buttonId,
			    "aria-haspopup": "true",
			    "aria-owns": menuId
			})
				.text($(select[0].options.item(select[0].selectedIndex)).text())
				.insertBefore(select)
				.buttonMarkup({
				    theme: o.theme,
				    icon: o.icon,
				    iconpos: o.iconpos,
				    inline: o.inline,
				    corners: o.corners,
				    shadow: o.shadow,
				    iconshadow: o.iconshadow
				}),

			theme = /ui-btn-up-([a-z])/.exec(button.attr("class"))[1],

			menuPage = $("<div data-role='dialog' data-theme='" + o.menuPageTheme + "'>" +
						"<div data-role='header'>" +
							"<div class='ui-title'>" + label.text() + "</div>" +
						"</div>" +
						"<div data-role='content'></div>" +
					"</div>")
					.appendTo($.mobile.pageContainer)
					.page(),

			menuPageContent = menuPage.find(".ui-content"),

			screen = $("<div>", { "class": "ui-selectmenu-screen ui-screen-hidden" })
						.appendTo(thisPage),

			listbox = $("<div>", { "class": "ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all pop ui-body-" + o.overlayTheme })
					.insertAfter(screen),

			list = $("<ul>", {
			    "class": "ui-selectmenu-list",
			    "id": menuId,
			    "role": "listbox",
			    "aria-labelledby": buttonId,
			    "data-theme": theme
			})
				.appendTo(listbox),

			menuType;

            //expose to other methods	
            $.extend(self, {
                select: select,
                selectID: selectID,
                label: label,
                buttonId: buttonId,
                menuId: menuId,
                thisPage: thisPage,
                button: button,
                menuPage: menuPage,
                menuPageContent: menuPageContent,
                screen: screen,
                listbox: listbox,
                list: list,
                menuType: menuType
            });


            //create list from select, update state
            self.refresh();

            //disable if specified
            if (this.options.disabled) { this.disable(); }

            //events on native select
            select
			.change(function () {
			    self.refresh();
			})
			.focus(function () {
			    $(this).blur();
			    button.focus();
			});

            //button events
            button.bind($.support.touch ? "touchstart" : "click", function (event) {
                self.open();
                event.preventDefault();
            });

            //events for list items
            list.delegate("li:not(.ui-disabled, .ui-li-divider)", "click", function (event) {
                //update select	
                var newIndex = list.find("li:not(.ui-li-divider)").index(this),
					prevIndex = select[0].selectedIndex;

                select[0].selectedIndex = newIndex;

                //trigger change event
                if (newIndex !== prevIndex) {
                    select.trigger("change");
                }

                self.refresh();

                //hide custom select
                self.close();
                event.preventDefault();
            });

            //events on "screen" overlay
            screen.click(function (event) {
                self.close();
                event.preventDefault();
            });
        },

        _buildList: function () {
            var self = this,
			optgroups = [],
			o = this.options;

            self.list.empty().filter('.ui-listview').listview('destroy');

            //populate menu with options from select element
            self.select.find("option").each(function (i) {
                var $this = $(this),
				$parent = $this.parent();

                // are we inside an optgroup?
                if ($parent.is("optgroup")) {
                    var optLabel = $parent.attr("label");

                    // has this optgroup already been built yet?
                    if ($.inArray(optLabel, optgroups) === -1) {
                        var optgroup = $('<li data-role="list-divider"></li>')
						.text(optLabel)
						.appendTo(self.list);

                        optgroups.push(optLabel);
                    }
                }

                var anchor = $("<a>", {
                    "role": "option",
                    "href": "#",
                    "text": $(this).text()
                }),

			item = $("<li>", { "data-icon": "checkbox-on" });

                // support disabled option tags
                if (this.disabled) {
                    item
					.addClass("ui-disabled")
					.attr("aria-disabled", true);
                }

                if (o.hidePlaceholderMenuItems) {
                    if (!this.getAttribute('value') || $(this).text().length == 0 || $(this).data('placeholder')) {
                        item.addClass('ui-selectmenu-placeholder');
                    }
                }

                item
				.append(anchor)
				.appendTo(self.list);
            });

            //now populated, create listview
            self.list.listview();
        },

        refresh: function (forceRebuild) {
            var self = this,
			select = this.element,
			selected = select[0].selectedIndex;

            if (forceRebuild || select[0].options.length > self.list.find('li').length) {
                self._buildList();
            }

            self.button.find(".ui-btn-text").text($(select[0].options.item(selected)).text());
            self.list
			.find('li:not(.ui-li-divider)').removeClass($.mobile.activeBtnClass).attr('aria-selected', false)
			.eq(selected).addClass($.mobile.activeBtnClass).find('a').attr('aria-selected', true);
        },

        open: function () {
            if (this.options.disabled) { return; }

            var self = this,
			menuHeight = self.list.outerHeight(),
			menuWidth = self.list.outerWidth(),
			scrollTop = $(window).scrollTop(),
			btnOffset = self.button.offset().top,
			screenHeight = window.innerHeight,
			screenWidth = window.innerWidth;

            //add active class to button
            self.button.addClass($.mobile.activeBtnClass);

            function focusMenuItem() {
                self.list.find(".ui-btn-active").focus();
            }

            if (menuHeight > screenHeight - 80 || !$.support.scrollTop) {

                //for webos (set lastscroll using button offset)
                if (scrollTop == 0 && btnOffset > screenHeight) {
                    self.thisPage.one('pagehide', function () {
                        $(this).data('lastScroll', btnOffset);
                    });
                }

                self.menuPage.one('pageshow', focusMenuItem);

                self.menuType = "page";
                self.menuPageContent.append(self.list);
                $.mobile.changePage(self.menuPage, 'pop', false, false);
            }
            else {
                self.menuType = "overlay";

                self.screen
				.height($(document).height())
				.removeClass('ui-screen-hidden');

                self.listbox
				.append(self.list)
				.removeClass("ui-selectmenu-hidden")
				.position({
				    my: "center center",
				    at: "center center",
				    of: self.button,
				    collision: "fit"
				})
				.addClass("in");

                focusMenuItem();
            }
        },

        close: function () {
            if (this.options.disabled) { return; }
            var self = this;

            function focusButton() {
                setTimeout(function () {
                    self.button.focus();
                    //remove active class from button
                    self.button.removeClass($.mobile.activeBtnClass);
                }, 40);

                self.listbox.removeAttr('style').append(self.list);
            }

            if (self.menuType == "page") {
                $.mobile.changePage([self.menuPage, self.thisPage], 'pop', true, false);
                self.menuPage.one("pagehide", function () {
                    focusButton();
                    //return false;
                });
            }
            else {
                self.screen.addClass("ui-screen-hidden");
                self.listbox.addClass("ui-selectmenu-hidden").removeAttr("style").removeClass("in");
                focusButton();
            }

        },

        disable: function () {
            this.element.attr("disabled", true);
            this.button.addClass('ui-disabled').attr("aria-disabled", true);
            return this._setOption("disabled", true);
        },

        enable: function () {
            this.element.attr("disabled", false);
            this.button.removeClass('ui-disabled').attr("aria-disabled", false);
            return this._setOption("disabled", false);
        }
    });
})(jQuery);



/*
* jQuery Mobile Framework : plugin for making button-like links
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {

    $.fn.buttonMarkup = function (options) {
        return this.each(function () {
            var el = $(this),
		    o = $.extend({}, $.fn.buttonMarkup.defaults, el.data(), options),

            // Classes Defined
			buttonClass,
			innerClass = "ui-btn-inner",
			iconClass;

            if (attachEvents) {
                attachEvents();
            }

            // if not, try to find closest theme container
            if (!o.theme) {
                var themedParent = el.closest("[class*='ui-bar-'],[class*='ui-body-']");
                o.theme = themedParent.length ?
				/ui-(bar|body)-([a-z])/.exec(themedParent.attr("class"))[2] :
				"c";
            }

            buttonClass = "ui-btn ui-btn-up-" + o.theme;

            if (o.inline) {
                buttonClass += " ui-btn-inline";
            }

            if (o.icon) {
                o.icon = "ui-icon-" + o.icon;
                o.iconpos = o.iconpos || "left";

                iconClass = "ui-icon " + o.icon;

                if (o.shadow) {
                    iconClass += " ui-icon-shadow"
                }
            }

            if (o.iconpos) {
                buttonClass += " ui-btn-icon-" + o.iconpos;

                if (o.iconpos == "notext" && !el.attr("title")) {
                    el.attr("title", el.text());
                }
            }

            if (o.corners) {
                buttonClass += " ui-btn-corner-all";
                innerClass += " ui-btn-corner-all";
            }

            if (o.shadow) {
                buttonClass += " ui-shadow";
            }

            el
			.attr("data-theme", o.theme)
			.addClass(buttonClass);

            var wrap = ("<D class='" + innerClass + "'><D class='ui-btn-text'></D>" +
			(o.icon ? "<span class='" + iconClass + "'></span>" : "") +
			"</D>").replace(/D/g, o.wrapperEls);

            el.wrapInner(wrap);
        });
    };

    $.fn.buttonMarkup.defaults = {
        corners: true,
        shadow: true,
        iconshadow: true,
        wrapperEls: "span"
    };

    var attachEvents = function () {
        $(".ui-btn:not(.ui-disabled)").live({
            mousedown: function () {
                var theme = $(this).attr("data-theme");
                $(this).removeClass("ui-btn-up-" + theme).addClass("ui-btn-down-" + theme);
            },
            mouseup: function () {
                var theme = $(this).attr("data-theme");
                $(this).removeClass("ui-btn-down-" + theme).addClass("ui-btn-up-" + theme);
            },
            "mouseover focus": function () {
                var theme = $(this).attr("data-theme");
                $(this).removeClass("ui-btn-up-" + theme).addClass("ui-btn-hover-" + theme);
            },
            "mouseout blur": function () {
                var theme = $(this).attr("data-theme");
                $(this).removeClass("ui-btn-hover-" + theme).addClass("ui-btn-up-" + theme);
            }
        });

        attachEvents = null;
    };

})(jQuery);


/*
* jQuery Mobile Framework : "button" plugin - links that proxy to native input/buttons
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.widget("mobile.button", $.mobile.widget, {
        options: {
            theme: null,
            icon: null,
            iconpos: null,
            inline: null,
            corners: true,
            shadow: true,
            iconshadow: true
        },
        _create: function () {
            var $el = this.element,
			o = this.options;

            //add ARIA role
            this.button = $("<div></div>")
			.text($el.text() || $el.val())
			.buttonMarkup({
			    theme: o.theme,
			    icon: o.icon,
			    iconpos: o.iconpos,
			    inline: o.inline,
			    corners: o.corners,
			    shadow: o.shadow,
			    iconshadow: o.iconshadow
			})
			.insertBefore($el)
			.append($el.addClass('ui-btn-hidden'));

            //add hidden input during submit
            if ($el.attr('type') !== 'reset') {
                $el.click(function () {
                    var $buttonPlaceholder = $("<input>",
						{ type: "hidden", name: $el.attr("name"), value: $el.attr("value") })
						.insertBefore($el);

                    //bind to doc to remove after submit handling	
                    $(document).submit(function () {
                        $buttonPlaceholder.remove();
                    });
                });
            }

        },

        enable: function () {
            this.element.attr("disabled", false);
            this.button.removeClass("ui-disabled").attr("aria-disabled", false);
            return this._setOption("disabled", false);
        },

        disable: function () {
            this.element.attr("disabled", true);
            this.button.addClass("ui-disabled").attr("aria-disabled", true);
            return this._setOption("disabled", true);
        }
    });
})(jQuery);

/*
* jQuery Mobile Framework : "slider" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.widget("mobile.slider", $.mobile.widget, {
        options: {
            theme: null,
            trackTheme: null,
            disabled: false
        },
        _create: function () {
            var self = this,

			control = this.element,

			parentTheme = control.parents('[class*=ui-bar-],[class*=ui-body-]').eq(0),

			parentTheme = parentTheme.length ? parentTheme.attr('class').match(/ui-(bar|body)-([a-z])/)[2] : 'c',

			theme = this.options.theme ? this.options.theme : parentTheme,

			trackTheme = this.options.trackTheme ? this.options.trackTheme : parentTheme,

			cType = control[0].nodeName.toLowerCase(),
			selectClass = (cType == 'select') ? 'ui-slider-switch' : '',
			controlID = control.attr('id'),
			labelID = controlID + '-label',
			label = $('[for=' + controlID + ']').attr('id', labelID),
			val = (cType == 'input') ? parseFloat(control.val()) : control[0].selectedIndex,
			min = (cType == 'input') ? parseFloat(control.attr('min')) : 0,
			max = (cType == 'input') ? parseFloat(control.attr('max')) : control.find('option').length - 1,
			slider = $('<div class="ui-slider ' + selectClass + ' ui-btn-down-' + trackTheme + ' ui-btn-corner-all" role="application"></div>'),
			handle = $('<a href="#" class="ui-slider-handle"></a>')
				.appendTo(slider)
				.buttonMarkup({ corners: true, theme: theme, shadow: true })
				.attr({
				    'role': 'slider',
				    'aria-valuemin': min,
				    'aria-valuemax': max,
				    'aria-valuenow': val,
				    'aria-valuetext': val,
				    'title': val,
				    'aria-labelledby': labelID
				});

            $.extend(this, {
                slider: slider,
                handle: handle,
                dragging: false,
                beforeStart: null
            });

            if (cType == 'select') {
                slider.wrapInner('<div class="ui-slider-inneroffset"></div>');
                var options = control.find('option');

                control.find('option').each(function (i) {
                    var side = (i == 0) ? 'b' : 'a',
					corners = (i == 0) ? 'right' : 'left',
					theme = (i == 0) ? ' ui-btn-down-' + trackTheme : ' ui-btn-active';
                    $('<div class="ui-slider-labelbg ui-slider-labelbg-' + side + theme + ' ui-btn-corner-' + corners + '"></div>').prependTo(slider);
                    $('<span class="ui-slider-label ui-slider-label-' + side + theme + ' ui-btn-corner-' + corners + '" role="img">' + $(this).text() + '</span>').prependTo(handle);
                });

            }

            label.addClass('ui-slider');

            control
			.addClass((cType == 'input') ? 'ui-slider-input' : 'ui-slider-switch')
			.keyup(function () {
			    self.refresh($(this).val());
			});

            $(document).bind($.support.touch ? "touchmove" : "mousemove", function (event) {
                if (self.dragging) {
                    self.refresh(event);
                    return false;
                }
            });

            slider
			.bind($.support.touch ? "touchstart" : "mousedown", function (event) {
			    self.dragging = true;
			    if (cType === "select") {
			        self.beforeStart = control[0].selectedIndex;
			    }
			    self.refresh(event);
			    return false;
			});

            slider
			.add(document)
			.bind($.support.touch ? "touchend" : "mouseup", function () {
			    if (self.dragging) {
			        self.dragging = false;
			        if (cType === "select") {
			            if (self.beforeStart === control[0].selectedIndex) {
			                //tap occurred, but value didn't change. flip it!
			                self.refresh(self.beforeStart === 0 ? 1 : 0);
			            }
			            var curval = (cType === "input") ? parseFloat(control.val()) : control[0].selectedIndex;
			            var snapped = Math.round(curval / (max - min) * 100);
			            handle
							.addClass("ui-slider-handle-snapping")
							.css("left", snapped + "%")
							.animationComplete(function () {
							    handle.removeClass("ui-slider-handle-snapping");
							});
			        }
			        return false;
			    }
			});

            slider.insertAfter(control);
            handle.bind('click', function (e) { return false; });
            this.refresh();
        },

        refresh: function (val) {
            if (this.options.disabled) { return; }

            var control = this.element, percent,
			cType = control[0].nodeName.toLowerCase(),
			min = (cType === "input") ? parseFloat(control.attr("min")) : 0,
			max = (cType === "input") ? parseFloat(control.attr("max")) : control.find("option").length - 1;

            if (typeof val === "object") {
                var data = val.originalEvent.touches ? val.originalEvent.touches[0] : val,
                // a slight tolerance helped get to the ends of the slider
				tol = 8;
                if (!this.dragging
					|| data.pageX < this.slider.offset().left - tol
					|| data.pageX > this.slider.offset().left + this.slider.width() + tol) {
                    return;
                }
                percent = Math.round(((data.pageX - this.slider.offset().left) / this.slider.width()) * 100);
            } else {
                if (val == null) {
                    val = (cType === "input") ? parseFloat(control.val()) : control[0].selectedIndex;
                }
                percent = (parseFloat(val) - min) / (max - min) * 100;
            }

            if (isNaN(percent)) { return; }
            if (percent < 0) { percent = 0; }
            if (percent > 100) { percent = 100; }

            var newval = Math.round((percent / 100) * (max - min)) + min;
            if (newval < min) { newval = min; }
            if (newval > max) { newval = max; }

            //flip the stack of the bg colors
            if (percent > 60 && cType === "select") {

            }
            this.handle.css("left", percent + "%");
            this.handle.attr({
                "aria-valuenow": (cType === "input") ? newval : control.find("option").eq(newval).attr("value"),
                "aria-valuetext": (cType === "input") ? newval : control.find("option").eq(newval).text(),
                title: newval
            });

            // add/remove classes for flip toggle switch
            if (cType === "select") {
                if (newval === 0) {
                    this.slider.addClass("ui-slider-switch-a")
					.removeClass("ui-slider-switch-b");
                } else {
                    this.slider.addClass("ui-slider-switch-b")
					.removeClass("ui-slider-switch-a");
                }
            }

            // update control's value
            if (cType === "input") {
                control.val(newval);
            } else {
                control[0].selectedIndex = newval;
            }
            control.trigger("change");
        },

        enable: function () {
            this.element.attr("disabled", false);
            this.slider.removeClass("ui-disabled").attr("aria-disabled", false);
            return this._setOption("disabled", false);
        },

        disable: function () {
            this.element.attr("disabled", true);
            this.slider.addClass("ui-disabled").attr("aria-disabled", true);
            return this._setOption("disabled", true);
        }
    });
})(jQuery);



/*
* jQuery Mobile Framework : "collapsible" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.widget("mobile.collapsible", $.mobile.widget, {
        options: {
            expandCueText: ' click to expand contents',
            collapseCueText: ' click to collapse contents',
            collapsed: false,
            heading: '>:header,>legend',
            theme: null,
            iconTheme: 'd'
        },
        _create: function () {

            var $el = this.element,
			o = this.options,
			collapsibleContain = $el.addClass('ui-collapsible-contain'),
			collapsibleHeading = $el.find(o.heading).eq(0),
			collapsibleContent = collapsibleContain.wrapInner('<div class="ui-collapsible-content"></div>').find('.ui-collapsible-content'),
			collapsibleParent = $el.closest('[data-role="collapsible-set"]').addClass('ui-collapsible-set');

            //replace collapsibleHeading if it's a legend	
            if (collapsibleHeading.is('legend')) {
                collapsibleHeading = $('<div role="heading">' + collapsibleHeading.html() + '</div>').insertBefore(collapsibleHeading);
                collapsibleHeading.next().remove();
            }

            //drop heading in before content
            collapsibleHeading.insertBefore(collapsibleContent);

            //modify markup & attributes
            collapsibleHeading.addClass('ui-collapsible-heading')
			.append('<span class="ui-collapsible-heading-status"></span>')
			.wrapInner('<a href="#" class="ui-collapsible-heading-toggle"></a>')
			.find('a:eq(0)')
			.buttonMarkup({
			    shadow: !!!collapsibleParent.length,
			    corners: false,
			    iconPos: 'left',
			    icon: 'plus',
			    theme: o.theme
			})
			.find('.ui-icon')
			.removeAttr('class')
			.buttonMarkup({
			    shadow: true,
			    corners: true,
			    iconPos: 'notext',
			    icon: 'plus',
			    theme: o.iconTheme
			});

            if (!collapsibleParent.length) {
                collapsibleHeading
					.find('a:eq(0)')
					.addClass('ui-corner-all')
						.find('.ui-btn-inner')
						.addClass('ui-corner-all');
            }
            else {
                if (collapsibleContain.data('collapsible-last')) {
                    collapsibleHeading
						.find('a:eq(0), .ui-btn-inner')
							.addClass('ui-corner-bottom');
                }
            }


            //events
            collapsibleContain
			.bind('collapse', function (event) {
			    if (!event.isDefaultPrevented()) {
			        event.preventDefault();
			        collapsibleHeading
						.addClass('ui-collapsible-heading-collapsed')
						.find('.ui-collapsible-heading-status').text(o.expandCueText);

			        collapsibleHeading.find('.ui-icon').removeClass('ui-icon-minus').addClass('ui-icon-plus');
			        collapsibleContent.addClass('ui-collapsible-content-collapsed').attr('aria-hidden', true);

			        if (collapsibleContain.data('collapsible-last')) {
			            collapsibleHeading
							.find('a:eq(0), .ui-btn-inner')
							.addClass('ui-corner-bottom');
			        }
			    }

			})
			.bind('expand', function (event) {
			    if (!event.isDefaultPrevented()) {
			        event.preventDefault();
			        collapsibleHeading
						.removeClass('ui-collapsible-heading-collapsed')
						.find('.ui-collapsible-heading-status').text(o.collapseCueText);

			        collapsibleHeading.find('.ui-icon').removeClass('ui-icon-plus').addClass('ui-icon-minus');
			        collapsibleContent.removeClass('ui-collapsible-content-collapsed').attr('aria-hidden', false);

			        if (collapsibleContain.data('collapsible-last')) {
			            collapsibleHeading
							.find('a:eq(0), .ui-btn-inner')
							.removeClass('ui-corner-bottom');
			        }

			    }
			})
			.trigger(o.collapsed ? 'collapse' : 'expand');


            //close others in a set
            if (collapsibleParent.length && !collapsibleParent.data("collapsiblebound")) {
                collapsibleParent
				.data("collapsiblebound", true)
				.bind("expand", function (event) {
				    $(this).find(".ui-collapsible-contain")
						.not($(event.target).closest(".ui-collapsible-contain"))
						.not("> .ui-collapsible-contain .ui-collapsible-contain")
						.trigger("collapse");
				})
                var set = collapsibleParent.find('[data-role=collapsible]')

                set.first()
				.find('a:eq(0)')
				.addClass('ui-corner-top')
					.find('.ui-btn-inner')
					.addClass('ui-corner-top');

                set.last().data('collapsible-last', true)
            }

            collapsibleHeading.bind($.support.touch ? "touchstart" : "click", function () {
                if (collapsibleHeading.is('.ui-collapsible-heading-collapsed')) {
                    collapsibleContain.trigger('expand');
                }
                else {
                    collapsibleContain.trigger('collapse');
                }
                return false;
            });

        }
    });
})(jQuery);

/*
* jQuery Mobile Framework: "controlgroup" plugin - corner-rounding for groups of buttons, checks, radios, etc
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.fn.controlgroup = function (options) {

        return $(this).each(function () {
            var o = $.extend({
                direction: $(this).data("type") || "vertical",
                shadow: false
            }, options);
            var groupheading = $(this).find('>legend'),
			flCorners = o.direction == 'horizontal' ? ['ui-corner-left', 'ui-corner-right'] : ['ui-corner-top', 'ui-corner-bottom'],
			type = $(this).find('input:eq(0)').attr('type');

            //replace legend with more stylable replacement div	
            if (groupheading.length) {
                $(this).wrapInner('<div class="ui-controlgroup-controls"></div>');
                $('<div role="heading" class="ui-controlgroup-label">' + groupheading.html() + '</div>').insertBefore($(this).children(0));
                groupheading.remove();
            }

            $(this).addClass('ui-corner-all ui-controlgroup ui-controlgroup-' + o.direction);

            function flipClasses(els) {
                els
				.removeClass('ui-btn-corner-all ui-shadow')
				.eq(0).addClass(flCorners[0])
				.end()
				.filter(':last').addClass(flCorners[1]).addClass('ui-controlgroup-last');
            }
            flipClasses($(this).find('.ui-btn'));
            flipClasses($(this).find('.ui-btn-inner'));
            if (o.shadow) {
                $(this).addClass('ui-shadow');
            }
        });
    };
})(jQuery);

/*
* jQuery Mobile Framework : "fieldcontain" plugin - simple class additions to make form row separators
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.fn.fieldcontain = function (options) {
        return $(this).addClass('ui-field-contain ui-body ui-br');
    };
})(jQuery);

/*
* jQuery Mobile Framework : "listview" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {

    $.widget("mobile.listview", $.mobile.widget, {
        options: {
            theme: "c",
            countTheme: "c",
            headerTheme: "b",
            dividerTheme: "b",
            splitIcon: "arrow-r",
            splitTheme: "b",
            inset: false
        },

        _create: function () {
            var $list = this.element,
			o = this.options;

            // create listview markup 
            $list
			.addClass("ui-listview")
			.attr("role", "listbox")

            if (o.inset) {
                $list.addClass("ui-listview-inset ui-corner-all ui-shadow");
            }

            $list.delegate(".ui-li", "focusin", function () {
                $(this).attr("tabindex", "0");
            });

            this._itemApply($list, $list);

            this.refresh(true);

            //keyboard events for menu items
            $list.keydown(function (e) {
                var target = $(e.target),
				li = target.closest("li");

                // switch logic based on which key was pressed
                switch (e.keyCode) {
                    // up or left arrow keys 
                    case 38:
                        var prev = li.prev();

                        // if there's a previous option, focus it
                        if (prev.length) {
                            target
							.blur()
							.attr("tabindex", "-1");

                            prev.find("a").first().focus();
                        }

                        return false;
                        break;

                    // down or right arrow keys 
                    case 40:
                        var next = li.next();

                        // if there's a next option, focus it
                        if (next.length) {
                            target
							.blur()
							.attr("tabindex", "-1");

                            next.find("a").first().focus();
                        }

                        return false;
                        break;

                    case 39:
                        var a = li.find("a.ui-li-link-alt");

                        if (a.length) {
                            target.blur();
                            a.first().focus();
                        }

                        return false;
                        break;

                    case 37:
                        var a = li.find("a.ui-link-inherit");

                        if (a.length) {
                            target.blur();
                            a.first().focus();
                        }

                        return false;
                        break;

                    // if enter or space is pressed, trigger click 
                    case 13:
                    case 32:
                        target.trigger("click");

                        return false;
                        break;
                }
            });

            // tapping the whole LI triggers click on the first link
            $list.delegate("li", "click", function (event) {
                if (!$(event.target).closest("a").length) {
                    $(this).find("a").first().trigger("click");
                    return false;
                }
            });
        },

        _itemApply: function ($list, item) {
            // TODO class has to be defined in markup
            item.find(".ui-li-count")
			.addClass("ui-btn-up-" + ($list.data("counttheme") || this.options.countTheme) + " ui-btn-corner-all");

            item.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading");

            item.find("p, dl").addClass("ui-li-desc");

            item.find("img").addClass("ui-li-thumb").each(function () {
                $(this).closest("li")
				.addClass($(this).is(".ui-li-icon") ? "ui-li-has-icon" : "ui-li-has-thumb");
            });

            var aside = item.find(".ui-li-aside");

            if (aside.length) {
                aside.each(function (i, el) {
                    $(el).prependTo($(el).parent()); //shift aside to front for css float
                });
            }

            if ($.support.cssPseudoElement || !$.nodeName(item[0], "ol")) {
                return;
            }
        },

        _removeCorners: function (li) {
            li
			.add(li.find(".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb"))
			.removeClass("ui-corner-top ui-corner-bottom ui-corner-br ui-corner-bl ui-corner-tr ui-corner-tl");
        },

        refresh: function (create) {
            this._createSubPages();

            var o = this.options,
			$list = this.element,
			self = this,
			dividertheme = $list.data("dividertheme") || o.dividerTheme,
			li = $list.children("li"),
			counter = $.support.cssPseudoElement || !$.nodeName($list[0], "ol") ? 0 : 1;

            if (counter) {
                $list.find(".ui-li-dec").remove();
            }

            li.attr({ "role": "option", "tabindex": "-1" });

            li.first().attr("tabindex", "0");

            li.each(function (pos) {
                var item = $(this),
				itemClass = "ui-li";

                // If we're creating the element, we update it regardless
                if (!create && item.hasClass("ui-li")) {
                    return;
                }

                var a = item.find("a");

                if (a.length) {
                    item
					.buttonMarkup({
					    wrapperEls: "div",
					    shadow: false,
					    corners: false,
					    iconpos: "right",
					    icon: a.length > 1 ? false : item.data("icon") || "arrow-r",
					    theme: o.theme
					});

                    a.first().addClass("ui-link-inherit");

                    if (a.length > 1) {
                        itemClass += " ui-li-has-alt";

                        var last = a.last(),
						splittheme = $list.data("splittheme") || last.data("theme") || o.splitTheme;

                        last
						.attr("title", last.text())
						.addClass("ui-li-link-alt")
						.empty()
						.buttonMarkup({
						    shadow: false,
						    corners: false,
						    theme: o.theme,
						    icon: false,
						    iconpos: false
						})
						.find(".ui-btn-inner")
							.append($("<span>").buttonMarkup({
							    shadow: true,
							    corners: true,
							    theme: splittheme,
							    iconpos: "notext",
							    icon: $list.data("spliticon") || last.data("icon") || o.splitIcon
							}));
                    }

                } else if (item.data("role") === "list-divider") {
                    itemClass += " ui-li-divider ui-btn ui-bar-" + dividertheme;
                    item.attr("role", "heading");

                    //reset counter when a divider heading is encountered
                    if (counter) {
                        counter = 1;
                    }

                } else {
                    itemClass += " ui-li-static ui-btn-up-" + o.theme;
                }


                if (o.inset) {
                    if (pos === 0) {
                        itemClass += " ui-corner-top";

                        item
							.add(item.find(".ui-btn-inner"))
							.find(".ui-li-link-alt")
								.addClass("ui-corner-tr")
							.end()
							.find(".ui-li-thumb")
								.addClass("ui-corner-tl");
                        if (item.next().next().length) {
                            self._removeCorners(item.next());
                        }

                    } else if (pos === li.length - 1) {
                        itemClass += " ui-corner-bottom";

                        item
							.add(item.find(".ui-btn-inner"))
							.find(".ui-li-link-alt")
								.addClass("ui-corner-br")
							.end()
							.find(".ui-li-thumb")
								.addClass("ui-corner-bl");

                        if (item.prev().prev().length) {
                            self._removeCorners(item.prev());
                        }
                    }
                }


                if (counter && itemClass.indexOf("ui-li-divider") < 0) {
                    item
					.find(".ui-link-inherit").first()
					.addClass("ui-li-jsnumbering")
					.prepend("<span class='ui-li-dec'>" + (counter++) + ". </span>");
                }

                item.addClass(itemClass);

                if (!create) {
                    self._itemApply($list, item);
                }
            });
        },

        //create a string for ID/subpage url creation
        _idStringEscape: function (str) {
            return str.replace(/[^a-zA-Z0-9]/g, '-');
        },

        _createSubPages: function () {
            var parentList = this.element,
			parentPage = parentList.closest(".ui-page"),
			parentId = parentPage.data("url"),
			o = this.options,
			self = this,
			persistentFooterID = parentPage.find("[data-role='footer']").data("id");

            $(parentList.find("ul, ol").toArray().reverse()).each(function (i) {
                var list = $(this),
				parent = list.parent(),
				title = $.trim(parent.contents()[0].nodeValue.split("\n")[0]) || parent.find('a:first').text(),
				id = parentId + "&" + $.mobile.subPageUrlKey + "=" + self._idStringEscape(title + " " + i),
				theme = list.data("theme") || o.theme,
				countTheme = list.data("counttheme") || parentList.data("counttheme") || o.countTheme,
				newPage = list.wrap("<div data-role='page'><div data-role='content'></div></div>")
							.parent()
								.before("<div data-role='header' data-theme='" + o.headerTheme + "'><div class='ui-title'>" + title + "</div></div>")
								.after(persistentFooterID ? $("<div>", { "data-role": "footer", "data-id": persistentFooterID, "class": "ui-footer-duplicate" }) : "")
								.parent()
									.attr({
									    "data-url": id,
									    "data-theme": theme,
									    "data-count-theme": countTheme
									})
									.appendTo($.mobile.pageContainer);



                newPage.page();
                var anchor = parent.find('a:first');
                if (!anchor.length) {
                    anchor = $("<a></a>").html(title).prependTo(parent.empty());
                }
                anchor.attr('href', '#' + id);
            }).listview();
        }
    });

})(jQuery);


/*
* jQuery Mobile Framework : "listview" filter extension
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {

    $.mobile.listview.prototype.options.filter = false;

    $("[data-role='listview']").live("listviewcreate", function () {
        var list = $(this),
		listview = list.data("listview");
        if (!listview.options.filter) {
            return;
        }

        var wrapper = $("<form>", { "class": "ui-listview-filter ui-bar-c", "role": "search" }),

		search = $("<input>", {
		    placeholder: "Filter results...",
		    "data-type": "search"
		})
			.bind("keyup change", function () {
			    var val = this.value.toLowerCase(); ;
			    list.children().show();
			    if (val) {
			        list.children().filter(function () {
			            return $(this).text().toLowerCase().indexOf(val) === -1;
			        }).hide();
			    }

			    //listview._numberItems();
			})
			.appendTo(wrapper)
			.textinput();

        wrapper.insertBefore(list);
    });

})(jQuery);


/*
* jQuery Mobile Framework : "dialog" plugin.
* Copyright (c) jQuery Project
* Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
* Note: Code is in draft form and is subject to change 
*/
(function ($, undefined) {
    $.widget("mobile.dialog", $.mobile.widget, {
        options: {},
        _create: function () {
            var self = this,
			$el = self.element,
			$prevPage = $.mobile.activePage,
			$closeBtn = $('<a href="#" data-icon="delete" data-iconpos="notext">Close</a>');

            $el.delegate("a, form", "click submit", function (e) {
                if (e.type == "click" && ($(e.target).closest('[data-back]')[0] || this == $closeBtn[0])) {
                    self.close();
                    return false;
                }
                //otherwise, assume we're headed somewhere new. set activepage to dialog so the transition will work
                $.mobile.activePage = self.element;
            });

            this.element
			.bind("pageshow", function () {
			    return false;
			})
            //add ARIA role
			.attr("role", "dialog")
			.addClass('ui-page ui-dialog ui-body-a')
			.find('[data-role=header]')
			.addClass('ui-corner-top ui-overlay-shadow')
				.prepend($closeBtn)
			.end()
			.find('.ui-content:not([class*="ui-body-"])')
				.addClass('ui-body-c')
			.end()
			.find('.ui-content,[data-role=footer]')
				.last()
				.addClass('ui-corner-bottom ui-overlay-shadow');

            $(window).bind('hashchange', function () {
                if ($el.is('.ui-page-active')) {
                    self.close();
                    $el.bind('pagehide', function () {
                        $.mobile.updateHash($prevPage.attr('data-url'), true);
                    });
                }
            });

        },

        close: function () {
            $.mobile.changePage([this.element, $.mobile.activePage], undefined, true, true);
        }
    });
})(jQuery);

/*
* jQuery Mobile Framework : "navbar" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.widget("mobile.navbar", $.mobile.widget, {
        options: {
            iconpos: 'top',
            grid: null
        },
        _create: function () {
            var $navbar = this.element,
			$navbtns = $navbar.find("a"),
			iconpos = $navbtns.filter('[data-icon]').length ? this.options.iconpos : undefined;

            $navbar
			.addClass('ui-navbar')
			.attr("role", "navigation")
			.find("ul")
				.grid({ grid: this.options.grid });

            if (!iconpos) {
                $navbar.addClass("ui-navbar-noicons");
            }

            $navbtns
			.buttonMarkup({
			    corners: false,
			    shadow: false,
			    iconpos: iconpos
			});

            $navbar.delegate("a", "click", function (event) {
                $navbtns.removeClass("ui-btn-active");
            });
        }
    });
})(jQuery);

/*
* jQuery Mobile Framework : plugin for creating CSS grids
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function ($, undefined) {
    $.fn.grid = function (options) {
        return $(this).each(function () {
            var o = $.extend({
                grid: null
            }, options);


            var $kids = $(this).children(),
			gridCols = { a: 2, b: 3, c: 4, d: 5 },
			grid = o.grid,
			iterator;

            if (!grid) {
                if ($kids.length <= 5) {
                    for (var letter in gridCols) {
                        if (gridCols[letter] == $kids.length) { grid = letter; }
                    }
                }
                else {
                    grid = 'a';
                }
            }
            iterator = gridCols[grid];

            $(this).addClass('ui-grid-' + grid);

            $kids.filter(':nth-child(' + iterator + 'n+1)').addClass('ui-block-a');
            $kids.filter(':nth-child(' + iterator + 'n+2)').addClass('ui-block-b');

            if (iterator > 2) {
                $kids.filter(':nth-child(3n+3)').addClass('ui-block-c');
            }
            if (iterator > 3) {
                $kids.filter(':nth-child(4n+4)').addClass('ui-block-d');
            }
            if (iterator > 4) {
                $kids.filter(':nth-child(5n+5)').addClass('ui-block-e');
            }

        });
    };
})(jQuery);

