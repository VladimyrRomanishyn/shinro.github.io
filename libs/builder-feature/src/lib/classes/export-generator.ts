import { EDITOR_CLASSNAME, EDITOR_CHILD_CLASSNAME, EDITOR_CLICK_CLASSNAME } from '../constants/class-names';
import { HTML_BLUEPRINT, HTML_FILE_NAME, CSS_BASE, CSS_FILE_NAME, HTML_BLUEPRINT_INTERNAL } from '../constants/export-blueprints';

export class ExportGenerator {
    public static generateExport(element: HTMLElement, internalStyles = false): void {
        if (!element.innerHTML) {  
            throw new Error('There is nothing to export!');
        }
        
        const cloned = element.cloneNode(true) as HTMLElement; 
        // add classes
        this.addClassNames(cloned);
        // generate files
        const files = internalStyles 
            ? [this.generateHTML(cloned, true)]
            : [this.generateCSS(cloned), this.generateHTML(cloned)];
        // download files
        this.downloadFiles(files);
        cloned.remove();
    }

    private static generateHTML(element: HTMLElement, internalStyles = false): File {
        const styles = internalStyles ? this.createRulesList(element) : '';
        const content = this.reformatHTML(element);
        
        const blueprint = internalStyles 
            ? HTML_BLUEPRINT_INTERNAL.replace(/{{innerHTML}}/, content) 
            : HTML_BLUEPRINT.replace(/{{innerHTML}}/, content);
        
        const template = internalStyles 
            ? blueprint.replace(/{{STYLES}}/, styles)
            : blueprint;

        return new File([template], HTML_FILE_NAME, {type: 'text/html'});
    }

    private static generateCSS(element: HTMLElement): File {
        const rules = this.createRulesList(element);   
        return new File([CSS_BASE,rules], CSS_FILE_NAME, {type: 'text/css'});
    }

    public static reformatHTML(element: HTMLElement, whiteList: string[] = [], depth = 0): string {
        if (element.className === EDITOR_CLASSNAME && !element.childNodes.length) {
            return '';
        }

        this.removeArrtibutes(element, whiteList);

        const childOffset = Array(depth).fill(0).map(() => '\t').join('') || '';
        const parentOffset = childOffset.slice(0,-1) || '';

        if (!element.childNodes.length) {
            return element.outerHTML ? `${element.outerHTML}`: `${element.nodeValue}`;
        }
        
        depth++

        const newInner = (Array.from(element.childNodes) as HTMLElement[])
            .reduce((acc, el, i) => {
                acc += i 
                    ? `\n${childOffset}${this.reformatHTML(el, whiteList, depth)}`
                    : `${childOffset}${this.reformatHTML(el, whiteList ,depth)}`;
                return acc;
        }, '')
        
        element.innerHTML = element.className === EDITOR_CLASSNAME 
            ? newInner 
            :`\n${newInner}\n${parentOffset}`;
        
        return element.className === EDITOR_CLASSNAME
            ? `${element.innerHTML}` 
            : `${element.outerHTML}`;
    }

    public static createRulesList(element: HTMLElement, dataId = false): string {
        if (element.className === EDITOR_CLASSNAME && !element.childNodes.length) {
            return '';
        }

        let root = '';

        if (element?.className !== EDITOR_CLASSNAME) {
            root = this.createRule(element, dataId);
        }
        
        if (!element.childNodes.length) {
            return root;
        }
        
        return (Array.from(element.childNodes) as HTMLElement[]).reduce((acc, el) => {
            acc += this.createRulesList(el, dataId);
            return acc;
        }, root)
    }

    private static removeArrtibutes(element: HTMLElement, whiteList: string[] = []): void {
        if (
            (element.className === EDITOR_CLASSNAME && !element.childNodes.length)
            || element.nodeName === '#text'
            ) {
            return;
        }
        
        const attribs =  ['style', 'contenteditable', 'data-id']
            .filter(e => !whiteList.includes(e));
            
        attribs.map(attr => element.removeAttribute(attr));
        (Array.from(element.childNodes) as HTMLElement[]).map(el => this.removeArrtibutes(el, whiteList))
    }

    private static createRule(el: HTMLElement, dataId = false): string {
        if (!el.style) { return ''}
        const id = dataId ? `<${el.dataset['id']}>`: '';
        const selector = this.createSelector(el);
        const styles = el.style?.cssText.split(';').map(el => el.trim()).join(';\n\t').slice(0, -1);

        return styles 
            ?  `${selector} {${id}\n\t${styles}}\n\n`
            : `${selector} {}\n\n`;
    };

    private static createSelector(el: HTMLElement): string {
        let selector = '';
        let parentElement = el;
       
        while(parentElement?.className !== EDITOR_CLASSNAME) {
            const classLine = Array.from(parentElement.classList)
                .reduce((acc, e) => {
                    acc += `.${e}`
                    return acc;
                }, '')
            selector = `${classLine} ${selector}`
            parentElement = parentElement.parentElement as HTMLElement;
        }
        
        return selector;
    }

    private static async downloadFiles(files: File[]): Promise<void> {
       
        files.map((file: File) => {
            const link = document.createElement('a');
            link.download = file.name;
            link.href = URL.createObjectURL(file);
            link.click();
            URL.revokeObjectURL(link.href)
        })
    }

    public static addClassNames(element: HTMLElement, removeSystem = true): void {
        const children = Array.from(element.childNodes) as HTMLElement[];
        
        const classListCheck = (el: HTMLElement): boolean => {
            if (el.nodeName === '#text') { return false }
            
            if (removeSystem) {
                el.classList.remove(EDITOR_CHILD_CLASSNAME, EDITOR_CLICK_CLASSNAME);
            }

            return !Array.from(el.classList)
                .filter(name => (![EDITOR_CHILD_CLASSNAME, EDITOR_CLICK_CLASSNAME]
                    .includes(name))).length;        
        }

        if (element.className == EDITOR_CLASSNAME) {
            children.map((el: HTMLElement, i: number) => {
                classListCheck(el) && el.classList.add('section-' + i);
            })

        } else if (/^section-\d+$/.test(element.className)) {
            children.map((el: HTMLElement, i: number) => {
                classListCheck(el) && el.classList.add(`sub-${i}`);
            });

        } else {
            children.map((el: HTMLElement, i: number) => {
                classListCheck(el) && el.classList.add(`${el.tagName.toLocaleLowerCase()}-${i}`);
            });
        }

        children.map(el => {
            if (el.childNodes.length, removeSystem) {
                this.addClassNames(el);
            }
        })
    }
}