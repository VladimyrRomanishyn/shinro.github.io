import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

interface MenuStyles {
  left: string,
  top: string,
  opacity: number;
}

export enum ContextMenuEnum {
  addNode = 'addNode',
  deleteNode = 'deleteNode',
  addDiv = 'addDiv',
  cloneNode = 'cloneNode'
}

@Component({
  selector: 'context-memu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  @ViewChild('contextPanel', { static: true }) public contextPanel!: ElementRef;
  @Output() contextAction: EventEmitter<ContextMenuEnum> = new EventEmitter();
  public contextMenuStyles: MenuStyles = { left: '', top: '', opacity: 0 };
  public contextMenuEnum = ContextMenuEnum;
  
  public toogleContextMenu(event?: PointerEvent | undefined): void {
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

  public emitActionEvent(type: ContextMenuEnum): void {
    this.toogleContextMenu();
    this.contextAction.emit(type);
  }
}
