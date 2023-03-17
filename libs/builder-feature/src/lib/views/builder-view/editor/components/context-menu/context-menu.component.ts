import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ContextMenuEnum, MenuStyles } from '@libs/builder-feature/src/lib/types/form-types';
@Component({
  selector: 'context-memu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  @ViewChild('contextPanel', { static: true }) public contextPanel!: ElementRef;
  @Output() contextAction: EventEmitter<{type: ContextMenuEnum, payload?: any}> = new EventEmitter();
  public contextMenuStyles: MenuStyles = { left: '', top: '', opacity: 0 };
  public contextMenuEnum = ContextMenuEnum;
  public cloneQty = 1;

  public toogleContextMenu(event?: PointerEvent | undefined): void {
    this.cloneQty = 1;
    this.contextMenuStyles.opacity = 0;
    this.contextMenuStyles.left = '';
    this.contextMenuStyles.top = '';

    if (event) {
      const { width: panelWidth, height: panelHeight }
        = this.contextPanel.nativeElement.getBoundingClientRect();
      const { width: bodyWidth, height: bodyHeight }
        = document.body.getBoundingClientRect();

      const x = bodyWidth - event.x + 2 >= panelWidth ? event.x + 2 : bodyWidth - panelWidth;
      const y = bodyHeight - event.y >= panelHeight ? event.y : bodyHeight - panelHeight;
      this.contextMenuStyles.opacity = 1;
      this.contextMenuStyles.left = `${x}px`;
      this.contextMenuStyles.top = `${y}px`;
    }
  }

  public emitActionEvent(payload: {type: ContextMenuEnum, payload?: any}): void {
    this.toogleContextMenu();
    this.contextAction.emit(payload);
  }
}
