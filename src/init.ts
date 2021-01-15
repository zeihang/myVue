import {initState} from "./state";
import {compileToFunction} from "./compiler/index";

export function initMixin(Vue: Function) {
    Vue.prototype._init = function(options: any) {
        const vm = this;
        console.log(options);
        vm.$options = options;
        initState(vm);
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el: string) {
        const vm = this;
        const options = vm.$options
        const elDom = document.querySelector(el)
        console.log(elDom);
        if (!options.render) {
            let template = options.template
            if (!template && elDom) {
                template = elDom.outerHTML
                options.template = template;
                options.render = compileToFunction(template);
            }
        }
    }
}