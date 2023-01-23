export const EDITOR_CLASSNAME = 'editor';
export const EDITOR_CHILD_CLASSNAME = 'editor__child';
export const EDITOR_CLICK_CLASSNAME = 'editor__click';
export const BUILDER_EDITOR_SELECTOR = 'builder-editor';

export interface NodeParams {
    type: string;
    context: HTMLElement | undefined;
}

export class CustomDiv extends HTMLDivElement {
    public test = 'test';

    constructor() {
        super();
    }

    getTest() {
        return this.test;
    }
}

export class NgElementCreator {
    public static cloneElement(source: HTMLElement | undefined): void {
        if (source && source.className !== EDITOR_CLASSNAME) {
            const clone = source?.cloneNode(true) as HTMLElement;
            clone.classList.remove(EDITOR_CLICK_CLASSNAME);
            source.after(clone);
          }
    }

    public static deleteElement(source: HTMLElement | undefined): void {
        if (source) {
            source.remove();
        }
    }
    
    public static createElement ({context, type}: NodeParams) {
        if (context) {
            const nodeElement = document.createElement(type);
            nodeElement.classList.add(EDITOR_CHILD_CLASSNAME);
            context.append(nodeElement);
        }
    }

    public static createCustom({context, type}: NodeParams) {
        if (context) {
            customElements.define('custom-div', CustomDiv, {extends: 'div'});
            const nodeElement = document.createElement('div', {is: 'custom-div'});
            nodeElement.classList.add(EDITOR_CHILD_CLASSNAME);
            // nodeElement.setAttribute('is', 'custom-div');
            context.append(nodeElement);
        }
    }
}