import {isObject} from "../utils";
import {arrayMethods} from "./array";

class Observe {
    constructor(data: object) {
        // @ts-ignore
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        if (Array.isArray(data)) {
            // @ts-ignore
            data.__proto__ = arrayMethods
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    observeArray(data: any[]) {
        data.forEach(item => {
            observe(item)
        })
    }
    walk<T extends object, K extends keyof T>(data: T) {
        if (data === null ) return
        Object.keys(data).forEach((key) => {
            // @ts-ignore
            defineProperty(data, key, data[key]);
        })
    }
}

function defineProperty(obj: object, key: string, value: any) {
    observe(value)
    Object.defineProperty(obj, key, {
        get() {
            return value;
        },
        set(newValue) {
            observe(newValue)
            value = newValue;
        }
    })
}

export function observe(data: any) {
    if (typeof data === 'object' && data !== null) {
        if (data.__ob__) return;
        new Observe(data)
    }
}