export let arrayMethods = Object.create(Array.prototype)

const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reserve',
    'sort',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function (...agr: any[]) {
        let inserted;
        let ob = this.__ob__;
        console.log('数组发生变化', this);
        // @ts-ignore
        Array.prototype[method].call(this, ...agr)
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = agr;
                break;
            case 'splice':
                inserted = agr.slice(2)
                break;
            default:
                break;
        }
        if (inserted) {
            console.log('inserted', inserted);
            ob.observeArray(inserted);
        }
    }

})

console.log(arrayMethods);