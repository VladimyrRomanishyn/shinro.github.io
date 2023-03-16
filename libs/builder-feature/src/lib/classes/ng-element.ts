import { EDITOR_CLASSNAME, EDITOR_CLICK_CLASSNAME, EDITOR_CHILD_CLASSNAME } from "../constants/class-names";

export interface NodeParams {
    type: string;
    context: HTMLElement | undefined;
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
}