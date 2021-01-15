interface Vue {
    $options: {
        el: string | HTMLElement
        data: {[key: string]: any} | Function | null,
        render?: Function,
        template?: string
    }
    _data: any
}
interface Obj {
    [key: string]: any
    [key: number]: any
}