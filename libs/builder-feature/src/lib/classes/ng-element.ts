import { EDITOR_CLASSNAME, EDITOR_CLICK_CLASSNAME, EDITOR_CHILD_CLASSNAME } from "@core-tb";
import { v4 } from "uuid";
export interface NodeParams {
    type: string;
    context: HTMLElement | undefined;
}

export class NgElementCreator {
    public static cloneElement(source: HTMLElement | undefined, qty: number): void {
        if (source && source.className !== EDITOR_CLASSNAME && qty > 0) {
            Array(qty).fill(0).map(() => {
                const clone = source?.cloneNode(true) as HTMLElement;
                clone.dataset['id'] = v4();
                clone.classList.remove(EDITOR_CLICK_CLASSNAME);
                source.after(clone);
            }) 
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
            nodeElement.dataset['id'] = v4();
            nodeElement.style.height = '50px';
            nodeElement.classList.add(EDITOR_CHILD_CLASSNAME);
            context.append(nodeElement);
        }
    }

    public static clearNode(source: HTMLElement | undefined): void {
        if (source) {
            source.innerHTML = '';
        }
    }

    public static fullScreen(source: HTMLElement | undefined): void {
        if (source) {
            source.style.height = '100%';
        }
    }
}