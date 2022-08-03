import { Directive, ElementRef, HostListener } from '@angular/core';
import { map, Observable, Subscriber } from 'rxjs';

@Directive({
  selector: '[petsDragdrop]'
})
export class DragdropDirective {

  constructor(private elRef: ElementRef) {
  }

  @HostListener('pointerdown', ['$event'])
  pointerDown(event: PointerEvent) {
    this.moveNode(event);
  }

  private moveNode(event: PointerEvent): void {
    const target = event.target as HTMLElement;

    if (target?.draggable) {
      target.ondragstart = () => false;

      const {left: bLeft, right: bRight, top: bTop, bottom: bBottom} =
        this.elRef.nativeElement.getBoundingClientRect();
      const offsetLeft = event.offsetX + bLeft;
      const offsetTop = event.offsetY + bTop;


      const moveAt = new Observable((subscriber:Subscriber<PointerEvent>) => {
        target.onpointermove = (pointerEvent: PointerEvent) => {
          this.highlightDroppable(pointerEvent);
          subscriber.next(pointerEvent);
        }
      }).pipe(
        map((event: PointerEvent) => {
          target.style.opacity = `0`;
          target.style.position = 'absolute';
          target.style.zIndex = '10';
          target.classList.remove('editor__child');
          target.classList.add('drag-active');
          const {x: eventX, y: eventY} = event;
          // check top & left borders
          const left = eventX - offsetLeft > 0 ? eventX - offsetLeft : 0;
          const top = eventY - offsetTop > 0 ? eventY - offsetTop: 0;
          return {left, top};
        })
      ).subscribe(({left, top}: {left: number, top: number}) => {
        target.style.left = `${Math.round(left).toFixed()}px`;
        target.style.top = `${Math.round(top).toFixed()}px`;
        const {bottom: tBottom, right: tRight, width: tWidth, height: tHeight} =
          target.getBoundingClientRect();
        // check right & bottom borders
        target.style.left = tRight <= bRight ? target.style.left : `${bRight - tWidth - bLeft}px`;
        target.style.top = tBottom <= bBottom ? target.style.top : `${bBottom - tHeight - bTop}px`;
        target.style.opacity = `1`;
      })

      const cleanUp = () => {
        this.drop(target)
        setTimeout(() => {
          moveAt.unsubscribe();
          target.style.zIndex = `auto`;
          target.onpointermove = null;
          target.onmouseleave = null;
          target.classList.remove('drag-active');
          target.classList.add('editor__child');
          this.elRef.nativeElement.onpointerup = null;
        });
      };

      target.onmouseleave = cleanUp;
      this.elRef.nativeElement.onpointerup = cleanUp;
    }
  }

  private removeHighlight(children: HTMLElement[] = [...this.elRef.nativeElement.children]): void {
   children.forEach((c: HTMLElement) => {
     // debugger;
     if (c.children.length) {
       // @ts-ignore
       this.removeHighlight([...c.children])
     } else {
       c.classList.remove('editor__droppable');
     }
   })
  }

  private drop(target: HTMLElement): void {
    const droppable = [...this.elRef.nativeElement.children]
      .filter((c => c.classList.contains('editor__droppable')))[0];

    if (droppable) {
      droppable.append(target);
      target.style.top = '';
      target.style.left = '';
      droppable.classList.remove('editor__droppable');
      this.removeHighlight();
    }
  }

  private highlightDroppable({ clientY, clientX }: PointerEvent): void {
    const pointNodes = [...document.elementsFromPoint(clientX, clientY)].slice(1);
    const droppable = pointNodes.filter((node) => node.classList.contains('editor__child'))[0] as HTMLElement;
    this.removeHighlight();

    if (!droppable) {return;}
    droppable.classList.add('editor__droppable');
  }
}
