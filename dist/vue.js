(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var arrayMethods = Object.create(Array.prototype);
    var methods = [
        'push',
        'pop',
        'shift',
        'unshift',
        'reserve',
        'sort',
        'splice'
    ];
    methods.forEach(function (method) {
        arrayMethods[method] = function () {
            var _a;
            var agr = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                agr[_i] = arguments[_i];
            }
            var inserted;
            var ob = this.__ob__;
            console.log('数组发生变化', this);
            // @ts-ignore
            (_a = Array.prototype[method]).call.apply(_a, __spreadArrays([this], agr));
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = agr;
                    break;
                case 'splice':
                    inserted = agr.slice(2);
                    break;
            }
            if (inserted) {
                console.log('inserted', inserted);
                ob.observeArray(inserted);
            }
        };
    });
    console.log(arrayMethods);

    var Observe = /** @class */ (function () {
        function Observe(data) {
            // @ts-ignore
            Object.defineProperty(data, '__ob__', {
                value: this,
                enumerable: false
            });
            if (Array.isArray(data)) {
                // @ts-ignore
                data.__proto__ = arrayMethods;
                this.observeArray(data);
            }
            else {
                this.walk(data);
            }
        }
        Observe.prototype.observeArray = function (data) {
            data.forEach(function (item) {
                observe(item);
            });
        };
        Observe.prototype.walk = function (data) {
            if (data === null)
                return;
            Object.keys(data).forEach(function (key) {
                // @ts-ignore
                defineProperty(data, key, data[key]);
            });
        };
        return Observe;
    }());
    function defineProperty(obj, key, value) {
        observe(value);
        Object.defineProperty(obj, key, {
            get: function () {
                return value;
            },
            set: function (newValue) {
                observe(newValue);
                value = newValue;
            }
        });
    }
    function observe(data) {
        if (typeof data === 'object' && data !== null) {
            if (data.__ob__)
                return;
            new Observe(data);
        }
    }

    function initState(vm) {
        var opts = vm.$options;
        if (opts.data) {
            initData(vm);
        }
    }
    function initData(vm) {
        var data = vm.$options.data;
        if (typeof data === 'function') {
            data = data.call(vm);
        }
        observe(data);
        vm._data = data;
        if (typeof data === 'object' && data !== null) {
            Object.keys(data).forEach(function (key) {
                proxy(vm, key);
            });
        }
    }
    function proxy(vm, key) {
        Object.defineProperty(vm, key, {
            get: function () {
                return vm._data[key];
            },
            set: function (newValue) {
                vm._data[key] = newValue;
            }
        });
    }

    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
    var startTagOpen = new RegExp("^<" + qnameCapture);
    var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var startTagClose = /^\s*(\/?)>/;
    function compileToFunction(template) {
        parserHTML(template);
    }
    var root;
    var stack = [];
    function createAstElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1,
            parent: null,
            children: [],
            attrs: attrs
        };
    }
    function parserHTML(html) {
        function advance(len) {
            html = html.substring(len);
        }
        function parseStartTag() {
            var start = html.match(startTagOpen);
            if (start) {
                advance(start[0].length);
                var match = {
                    tagName: start[1],
                    attrs: []
                };
                var end_1;
                var attr = void 0;
                while (!(end_1 = html.match(startTagClose)) && (attr = html.match(attribute))) {
                    advance(attr[0].length);
                    // @ts-ignore
                    match.attrs.push({ attr: attr[1], value: attr[3] || attr[4] || attr[5] });
                }
                end_1 && advance(end_1[0].length);
                // @ts-ignore
                if (end_1[1])
                    stack.pop();
                return match;
            }
            return false;
            // @ts-ignore
        }
        function start(tagName, attribute) {
            var parent = stack[stack.length - 1];
            var element = createAstElement(tagName, attribute);
            // @ts-ignore
            if (!root)
                root = element;
            stack.push(element);
            if (parent) {
                parent.children.push(element);
                element.parent = parent;
            }
        }
        function chars(text) {
            var parent = stack[stack.length - 1];
            text.replace(/\s*/g, ' ');
            if (!text)
                return;
            if (parent) {
                parent.children.push({
                    type: 3,
                    text: text
                });
            }
            else {
                throw new Error('忘了判断了～');
            }
        }
        function end(tagName) {
            var element = stack.pop();
            if (element.tag !== tagName) {
                throw new Error('错误的闭合标签～');
            }
        }
        while (html) {
            var textEnd = html.indexOf('<');
            if (textEnd === 0) {
                var startTagMatch = parseStartTag();
                if (startTagMatch) {
                    start(startTagMatch.tagName, startTagMatch.attrs);
                    continue;
                }
                var endTagMatch = html.match(endTag);
                if (endTagMatch) {
                    end(endTagMatch[1]);
                    advance(endTagMatch[0].length);
                }
            }
            var text = void 0;
            if (textEnd > 0) {
                text = html.substring(0, textEnd);
                advance(text.length);
                if (text.trimStart()) {
                    chars(text);
                }
            }
        }
        console.log('root', root);
    }

    function initMixin(Vue) {
        Vue.prototype._init = function (options) {
            var vm = this;
            console.log(options);
            vm.$options = options;
            initState(vm);
            if (vm.$options.el) {
                vm.$mount(vm.$options.el);
            }
        };
        Vue.prototype.$mount = function (el) {
            var vm = this;
            var options = vm.$options;
            var elDom = document.querySelector(el);
            console.log(elDom);
            if (!options.render) {
                var template = options.template;
                if (!template && elDom) {
                    template = elDom.outerHTML;
                    options.template = template;
                    options.render = compileToFunction(template);
                }
            }
        };
    }

    function Vue(options) {
        // @ts-ignore
        this._init(options);
    }
    initMixin(Vue);

    return Vue;

})));
