const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\r?|\n)+?)\}\}/g

export function compileToFunction(template: string) {
    parserHTML(template)
}

let root: any;
let stack: any[] = [];

function createAstElement(tagName: string, attrs: any[]) {
    return {
        tag: tagName,
        type: 1,
        parent: null,
        children: [],
        attrs
    }
}

function parserHTML(html: string) {
    function advance(len: number) {
        html = html.substring(len)
    }
    function parseStartTag() {
        const start: RegExpMatchArray | null = html.match(startTagOpen)
        if (start) {
            advance(start[0].length)
            const match = {
                tagName: start[1],
                attrs: []
            }
            let end;
            let attr;
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                // @ts-ignore
                match.attrs.push({attr: attr[1], value: attr[3] || attr[4] || attr[5]})
            }
            end && advance(end[0].length)
            // @ts-ignore
            if (end[1]) stack.pop()
            return match
        }
        return false
        // @ts-ignore
    }
    function start(tagName: string, attribute: any[]) {
        const parent = stack[stack.length - 1]
        const element = createAstElement(tagName, attribute)
        // @ts-ignore
        if (!root) root = element
        stack.push(element)
        if (parent) {
            parent.children.push(element)
            element.parent = parent
        }
    }
    function chars(text: string) {
        const parent = stack[stack.length - 1]
        text.replace(/\s*/g, ' ')
        if (!text) return
        if (parent) {
            parent.children.push({
                type: 3,
                text: text
            })
        } else {
            throw new Error('忘了判断了～')
        }
    }
    function end(tagName: string) {
        const element = stack.pop()
        if (element.tag !== tagName) {
            throw new Error('错误的闭合标签～')
        }
    }
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            const endTagMatch: RegExpMatchArray | null = html.match(endTag)
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
            }
        }
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
            advance(text.length)
            if (text.trimStart()) {
                chars(text)
            }
        }
    }
    console.log('root', root);
}