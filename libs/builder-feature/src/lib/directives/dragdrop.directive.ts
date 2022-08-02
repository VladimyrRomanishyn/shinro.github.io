import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[petsDragdrop]'
})
export class DragdropDirective {

  constructor(private elRef: ElementRef) { }

  @HostListener('pointerdown', ['$event'])
  pointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement;
    if (target?.draggable) {
      const {left: bLeft, right: bRight, top: bTop, bottom: bBottom} =
        this.elRef.nativeElement.getBoundingClientRect();
      const {left: tLeft, top: tTop, width: tWidth, height: tHeight} = target.getBoundingClientRect();

      const offsetLeft = event.x - tLeft + bLeft;
      const offsetTop = event.y - tTop + bTop;

      target.ondragstart = () => false;
      target.onpointermove = (pointerEvent: PointerEvent) => {
        const {x: eventX, y: eventY} = pointerEvent;
        // check top left borders
        let newLeft = eventX - offsetLeft > 0 ? eventX - offsetLeft : 0;
        let newTop = eventY - offsetTop > 0 ? eventY - offsetTop: 0;
        // check right bottom borders
        newLeft = eventX + (tWidth - offsetLeft) < bRight ? newLeft : bRight - tWidth - bLeft;
        newTop = eventY - (tHeight - offsetTop) < bBottom ? newTop : bBottom - tHeight - bTop;

        target.style.left = `${newLeft}px`;
        target.style.top = `${newTop}px`;
        target.style.position = 'absolute';
        target.style.zIndex = '10';
      }

      target.onmouseleave = () => {
        target.onpointermove = null;
        target.onmouseleave = null;
      }

      this.elRef.nativeElement.onpointerup = () => {
        target.onpointermove = null;
        this.elRef.nativeElement.onpointerup = null
      }
    }
  }
}
