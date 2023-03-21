import { EDITOR_CLASSNAME } from '../constants/class-names';
import { HTML_BLUEPRINT, HTML_FILE_NAME, CSS_BASE, CSS_FILE_NAME } from '../constants/export-blueprints';

export class ExportGenerator {
    public static generate(element: HTMLElement): void {
        if (!element.innerHTML) {  
            throw new Error('There is nothing to export!');
        }
        
        const cloned = element.cloneNode(true) as HTMLElement; 
        // add classes
        this.addClassNames(cloned);
        // generate files
        const files = [this.generateCSS(cloned), this.generateHTML(cloned)];
        // download files
        this.downloadFiles(files);
        cloned.remove();
    }

    private static generateHTML(element: HTMLElement): File {
        const content = this.reformatHTML(element);
        const template = HTML_BLUEPRINT.replace(/{{innerHTML}}/, content);

        return new File([template], HTML_FILE_NAME, {type: 'text/html'});
    }

    private static generateCSS(element: HTMLElement): File {
        const rules = this.createRulesList(element);   
        return new File([CSS_BASE,rules], CSS_FILE_NAME, {type: 'text/css'});
    }

    public static reformatHTML(element: HTMLElement, depth = 0): string {
        if (element.className === EDITOR_CLASSNAME && !element.childNodes.length) {
            return '';
        }

        this.removeArrtibutes(element);

        const childOffset = Array(depth).fill(0).map(() => '\t').join('') || '';
        const parentOffset = childOffset.slice(0,-1) || '';

        if (!element.childNodes.length) {
            return element.outerHTML ? `${element.outerHTML}`: `${element.nodeValue}`;
        }
        
        depth++

        const newInner = (Array.from(element.childNodes) as HTMLElement[])
            .reduce((acc, el, i) => {
                acc += i 
                    ? `\n${childOffset}${this.reformatHTML(el, depth)}`
                    : `${childOffset}${this.reformatHTML(el, depth)}`;
                return acc;
        }, '')
        
        element.innerHTML = element.className === EDITOR_CLASSNAME 
            ? newInner 
            :`\n${newInner}\n${parentOffset}`;
        
        return element.className === EDITOR_CLASSNAME
            ? `${element.innerHTML}` 
            : `${element.outerHTML}`;
    }

    public static createRulesList(element: HTMLElement): string {
        if (element.className === EDITOR_CLASSNAME && !element.childNodes.length) {
            return '';
        }

        let root = '';

        if (element?.className !== EDITOR_CLASSNAME) {
            root = this.createRule(element);
        }
        
        if (!element.childNodes.length) {
            return root;
        }
        
        return (Array.from(element.childNodes) as HTMLElement[]).reduce((acc, el) => {
            acc += this.createRulesList(el);
            return acc;
        }, root)
    }

    private static removeArrtibutes(element: HTMLElement): void {
        if (
            (element.className === EDITOR_CLASSNAME && !element.childNodes.length)
            || element.nodeName === '#text'
            ) {
            return;
        }

        const attribs =  ['style', 'contenteditable'];
        attribs.map(attr => element.removeAttribute(attr));
        (Array.from(element.childNodes) as HTMLElement[]).map(el => this.removeArrtibutes(el))
    }

    private static createRule(el: HTMLElement): string {
        if (!el.style) { return ''}

        const selector = this.createSelector(el);
        const styles = el.style?.cssText.split(';').map(el => el.trim()).join(';\n\t').slice(0, -1);

        return styles ?  `${selector} {\n\t${styles}}\n\n` : `${selector} {}\n\n`;
    };

    private static createSelector(el: HTMLElement): string {
        let selector = '';
        let parentElement = el;
       
        while(parentElement?.className !== EDITOR_CLASSNAME) {
            selector = `.${parentElement.className} ${selector}`
            parentElement = parentElement.parentElement as HTMLElement;
        }
        
        return selector;
    }

    private static downloadFiles(files: File[]): void {
        files.map((file: File) => {
            const link = document.createElement('a');
            link.download = file.name;
            link.href = URL.createObjectURL(file);
            link.click();
            URL.revokeObjectURL(link.href)
        })
    }

    public static addClassNames(element: HTMLElement): void {
        const children = Array.from(element.childNodes) as HTMLElement[];
        if (element.className == EDITOR_CLASSNAME) {
            children.map((el: HTMLElement, i: number) => el.className = 'section-' + i)
        } else if (/^section-\d+$/.test(element.className)) {
            children.map((el: HTMLElement, i: number) => 
                el.className = `sub-${i}`);
        } else {
            children.map((el: HTMLElement, i: number) => 
                el.className = `${el.tagName}-${i}`);
        }

        children.map(el => {
            if (el.childNodes.length) {
                this.addClassNames(el);
            }
        })
    }
}