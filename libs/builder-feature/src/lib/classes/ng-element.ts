export const EDITOR_CLASSNAME = 'editor';
export const EDITOR_CHILD_CLASSNAME = 'editor__child';
export const EDITOR_CLICK_CLASSNAME = 'editor__click';
export const BUILDER_EDITOR_SELECTOR = 'builder-editor';

export interface NgElement extends HTMLElement{
    ngId?: string;
}

export interface NodeParams {
    type: string;
    context: HTMLElement | undefined;
}

export abstract class Creator {
    public static createElement(payload: NodeParams): void {
        document.createElement(payload.type);
    }

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
}

export class NgElementCreator extends Creator  {
    constructor(
        private type: string,
        private context: HTMLElement | undefined
    ) { 
        super();
        if (context) {
            const nodeElement = document.createElement(type);
            nodeElement.classList.add(EDITOR_CHILD_CLASSNAME);
            context.append(nodeElement);
        }
    }
    
    public static override createElement (payload: NodeParams) {
        new NgElementCreator(payload.type, payload.context);
    }
}