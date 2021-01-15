export function isFunction(fn: unknown): boolean {
    return Object.prototype.toString.call(fn) === '[object Function]'
}
export function isObject(data: unknown): boolean {
    return Object.prototype.toString.call(data) === '[object Object]'
}