import fs from 'fs';

function curring(fn: Function) {
    const exec = (...sumArgs: any[]) => {
        if (sumArgs.length >= fn.length) {
            return fn(...sumArgs)
        }
        return (...args: any[]) => exec(...[...sumArgs, ...args])
    }
    return exec()
}

function sum(a: number, b: number, c: number, d: number) {
    return a + b + c + d
}

console.log(curring(sum)(1)(2, 3)(4));

function after(time: number, fn: Function) {
    return () => {
        if (--time <= 0) return fn()
    }
}

const fn = after(2, () => {
    console.log(obj)
})

let obj = Object.create(null);

setTimeout(() => {
    obj['name'] = 'ssr'
    fn()
}, 100)
setTimeout(() => {
    obj['skill'] = 'sr'
    fn()
}, 200)

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

