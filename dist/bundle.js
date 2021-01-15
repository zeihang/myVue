'use strict';

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

function curring(fn) {
    var exec = function () {
        var sumArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sumArgs[_i] = arguments[_i];
        }
        if (sumArgs.length >= fn.length) {
            return fn.apply(void 0, sumArgs);
        }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return exec.apply(void 0, __spreadArrays(sumArgs, args));
        };
    };
    return exec();
}
function sum(a, b, c, d) {
    return a + b + c + d;
}
console.log(curring(sum)(1)(2, 3)(4));
function after(time, fn) {
    return function () {
        if (--time <= 0)
            return fn();
    };
}
var fn = after(2, function () {
    console.log(obj);
});
var obj = Object.create(null);
setTimeout(function () {
    obj['name'] = 'ssr';
    fn();
}, 100);
setTimeout(function () {
    obj['skill'] = 'sr';
    fn();
}, 200);
// fs.readFile('../one.text', 'utf8', (err, data) => {
//     console.log(data)
//     obj['name'] = data
//     fn()
// })
// fs.readFile('../two.text', 'utf8', (err, data) => {
//     console.log(data)
//     obj['skill'] = data
//     fn()
// })
