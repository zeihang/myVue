import {observe} from "./observe/index";

export function initState(vm: Vue) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
}

function initData(vm: Vue) {
    let data = vm.$options.data
    if (typeof data === 'function') {
        data = data.call(vm)
    }
    observe(data)
    vm._data = data
    if (typeof data === 'object' && data !== null) {
        Object.keys(data).forEach((key) => {
            proxy(vm, key)
        })
    }
}

function proxy(vm: Vue, key: string) {
    Object.defineProperty(vm, key, {
        get() {
            return vm._data[key]
        },
        set(newValue) {
            vm._data[key] = newValue
        }
    })
}