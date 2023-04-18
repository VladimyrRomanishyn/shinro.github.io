import { Observable, concatMap, delay, filter, first, from, interval, map, of, switchAll, switchMap, tap } from 'rxjs';
import { EDITOR_CLASSNAME, EDITOR_CHILD_CLASSNAME, EDITOR_CLICK_CLASSNAME } from '../constants/class-names';
import { HTML_BLUEPRINT, CSS_BASE, HTML_BLUEPRINT_INTERNAL, DUMB, TS_ANGULAR_BLUEPRINT } from '../constants/export-blueprints';
import { MessageService } from 'primeng/api';

export type FileType = 'Angular' | 'internalStyles' | 'separate';
export interface ExportParams {
    element: HTMLElement;
    names: Map<string, string>;
    fileType: FileType;  
    messageSvc?: MessageService;
    electron?: boolean;
}
export class ExportGenerator {
    public static generateExport(params: ExportParams): void {
        if (!params.element.innerHTML) {  
            throw new Error('There is nothing to export!');
        }
        
        params.element = params.element.cloneNode(true) as HTMLElement; 
        this.addClassNames(params.element);
        const files = this.getFiles(params);
        this.downloadFiles(files, params.electron, params.messageSvc);
        params.element.remove();
    }

    private static getFiles(params: ExportParams): File[] {
        switch(params.fileType) {
            case 'internalStyles': 
                return [this.generateHTML(params)];
            case 'separate' :
                return [this.generateCSS(params), this.generateHTML(params)];
            case 'Angular':
                return [this.generateCSS(params), this.generateHTML(params), this.generateCode(params)];         
        }
    }

    private static generateCode(params: ExportParams): File {
        const name = params.names.get('code') as string;
        const componentName = this.getName(name, 'component');
        const selector = this.getName(name, 'selector');
        const fileName = this.getName(name, 'file');
        const template = TS_ANGULAR_BLUEPRINT
                            .replace('{{SELECTOR}}', selector)
                            .replaceAll('{{FILE_NAME}}', fileName)
                            .replace('{{COMPONENT_NAME}}', componentName);

        return new File([template],fileName + '.ts', {type: 'application/typescript'});
    }

    private static getName(name: string, type: 'file' | 'component' | 'selector'): string {
        const filtered: string = name.replace('component', '').replace(/\W/, '').toLocaleLowerCase();
        
        switch(type) {
            case 'file': 
                return filtered + '-component';
            case 'selector': 
                return filtered;    
            case 'component':
                return filtered.charAt(0).toLocaleUpperCase() + filtered.slice(1) +  'Component';
        }
    }

    private static generateHTML(params: ExportParams): File {
        const styles = params.fileType === 'internalStyles' ? this.createRulesList(params.element) : '';
        const content = this.reformatHTML(params.element);
        let name = params.names.get('markup') as string || '';
        let template = '';

        switch(params.fileType) {
            case 'internalStyles':
                template = HTML_BLUEPRINT_INTERNAL
                            .replace(/{{innerHTML}}/, content)
                            .replace(/{{STYLES}}/, styles);
                break;

            case 'separate': 
                template = HTML_BLUEPRINT.replace(/{{innerHTML}}/, content);
                break;
                
            case 'Angular':
                name = this.getName(params.names.get('code') as string, 'file');     
                template = content;
        }

        return new File([template], name, {type: 'text/html'});
    }

    private static generateCSS(params: ExportParams): File {
        const rules = this.createRulesList(params.element);
        let fileBits =  [CSS_BASE,rules];
        let name =  params.names.get('styles') as string;

        if (params.fileType === 'Angular') {
            name = this.getName(params.names.get('code') as string, 'file');
            fileBits = [rules];
        }

        return new File(fileBits, name, {type: 'text/css'});
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

    private static async downloadFiles(files: File[], electron = false, messageSvc?: MessageService): Promise<void> {
       if (electron) {
        this.setSavePathElectron();
        this.checkDownloadPath()
            .pipe(
                filter(Boolean),
                tap(() => {
                    if (messageSvc) {
                        messageSvc.add({severity: 'success', summary: 'Exported'})
                    }
                }),
                switchMap(() => from(files)),
                concatMap(file => of(file)
                 .pipe(delay(300)))
            )
            .subscribe((file) => {
                const link = document.createElement('a');
                link.download = file.name;
                link.href = URL.createObjectURL(file);
                link.click();
                URL.revokeObjectURL(link.href)
            })
       } else {
            files.map((file: File) => {
                const link = document.createElement('a');
                link.download = file.name;
                link.href = URL.createObjectURL(file);
                link.click();
                URL.revokeObjectURL(link.href)
            });

            if (messageSvc) {
                messageSvc.add({severity: 'success', summary: 'Exported'})
            }
       }  
    }

    public static checkDownloadPath(): Observable<boolean> {
        return interval(200)
            .pipe(
                filter(() =>!!localStorage.getItem('downloadPath')),
                map(() => localStorage.getItem('downloadPath') !== 'undefined'),
                first()
            );
    }

    public static setSavePathElectron(): void {
        localStorage.removeItem('downloadPath');
        const file = new File([''], DUMB);
        const link = document.createElement('a');
        link.download = file.name;
        link.href = URL.createObjectURL(file);
        link.click();
        URL.revokeObjectURL(link.href)
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