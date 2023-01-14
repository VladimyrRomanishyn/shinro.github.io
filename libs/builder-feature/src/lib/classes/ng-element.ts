export const EDITOR_CHILD_CLASSNAME = 'editor__child';

export interface NgElement extends HTMLElement{
    test?: any;
}

export interface NodeParams {
    type: string;
    context: HTMLElement;
}

export abstract class Creator {
    public static createElement(payload: NodeParams): void {
        document.createElement(payload.type);
    }
}

export class NgElementCreator extends Creator  {
    constructor(
        private type: string,
        private context: HTMLElement
    ) { 
        super();
        const nodeElement = document.createElement(type);
        nodeElement.classList.add(EDITOR_CHILD_CLASSNAME);
        context.append(nodeElement);
    }
    
    public static override createElement (payload: NodeParams) {
        new NgElementCreator(payload.type, payload.context);
    }
}