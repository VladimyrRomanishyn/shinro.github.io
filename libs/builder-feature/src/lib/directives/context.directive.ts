import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[petsContext]'
})
export class ContextDirective {
  localName: string | undefined;
  @Output() contextEvent: EventEmitter<PointerEvent> = new EventEmitter<PointerEvent>();

  constructor(private el: ElementRef ) {
    this.localName = el.nativeElement.parentElement.localName;
  }

  @HostListener('document:contextmenu', ['$event'])
  context(
    event: PointerEvent,
    target: HTMLElement | null = event.target as HTMLElement
  ) {
    if (target?.localName === 'body') {
      return;
    }

    if (target?.localName === this.localName) {
      event.preventDefault();
      this.contextEvent.emit(event);
      return;
    }

    this.context(event, target?.parentElement);
  }
}
