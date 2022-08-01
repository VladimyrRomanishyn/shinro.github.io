import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[mouseEvents]'
})
export class mouseEventsDirective {
  localName: string | undefined;
  @Output() contextEvent: EventEmitter<PointerEvent | undefined>
    = new EventEmitter<PointerEvent | undefined>();
  @Output() clickEvent: EventEmitter<PointerEvent | undefined>
    = new EventEmitter<PointerEvent | undefined>();

  constructor(private el: ElementRef ) {
    this.localName = el.nativeElement.parentElement.localName;
  }

  @HostListener('click', ['$event'])
  click(event: PointerEvent): void  {
    this.clickEvent.emit(this.insideNode(event) ? event : undefined);
  }
  @HostListener('contextmenu', ['$event'])
  context(event: PointerEvent): void {
    this.contextEvent.emit(this.insideNode(event) ? event : undefined);
  }

  private insideNode
  (
    event: PointerEvent,
    target: HTMLElement | null = event.target as HTMLElement
  ): boolean {
    if (!target || target?.localName === 'body') {
      return false;
    }

    if (target?.localName === this.localName) {
      event.preventDefault();
      return true;
    }

    return this.insideNode(event, target?.parentElement);
  }
}
