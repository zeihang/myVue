import {initMixin} from "./init";

function Vue(options: any) {
    // @ts-ignore
    this._init(options)
}

initMixin(Vue)

export default Vue;