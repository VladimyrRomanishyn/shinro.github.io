import { EDITOR_CLASSNAME } from './ng-element';
export class ExportGenerator {
    public static generate(element: HTMLElement): void {
        if (!element.innerHTML) {  
            throw new Error('There is nothing to export!');
        }
        const cloned = element.cloneNode(true) as HTMLElement; 
        // add classes
        this.addClassNames(cloned);
        // generate files
        const files = [this.generateHTML(cloned), this.generateCSS(cloned)];
        // download files
        this.downloadFiles(files);
        cloned.remove();
    }

    private static generateHTML(element: HTMLElement): File {
        const content = 
`<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <base href="/">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    ${element.innerHTML}
</body>
</html>`

        return new File([content], 'index.html', {type: 'text/html'});
    }

    private static generateCSS(element: HTMLElement): File {
        const baseRules = 
`* {
    margin: 0;
    padding:0
}

body {
    width: 100vw;
    height: 100vh;
}\n`;
        const rules = this.createRulesList(element);   
        return new File([baseRules,rules], 'styles.css', {type: 'text/css'});
    }

    private static createRulesList(element: HTMLElement): string {
        let root = '';

        if (element.className !== EDITOR_CLASSNAME) {
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

    private static createRule(el: HTMLElement): string {
        const selector = this.createSelector(el);
        const styles = el.style.cssText.split(';').map(el => el.trim()).join(';\n\t').slice(0, -1);
        return `${selector} {\n\t${styles}}\n`;
    };

    private static createSelector(el: HTMLElement): string {
        let selector = `.${el.className}`;
        let parentNode = el;
        
        while(parentNode?.className === EDITOR_CLASSNAME) {
            selector += `.${parentNode.className}`
            parentNode = el.parentNode as HTMLElement;
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

    private static addClassNames(element: HTMLElement): void {
        const children = Array.from(element.childNodes) as HTMLElement[];
        if (element.className == EDITOR_CLASSNAME) {
            children.map((el: HTMLElement, i: number) => el.className = 'section-' + i)
        } else if (/^section-\d+$/.test(element.className)) {
            children.map((el: HTMLElement, i: number) => 
                el.className = `${el.parentElement?.className}__sub-${i}`);
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