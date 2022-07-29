import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

interface MenuStyles {
  left: string,
  top: string,
  opacity: number;
}

enum ContextMenuEnum {
  addNode = 'addNode'
}

@Component({
  selector: 'pets-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  @ViewChild('contextPanel', {static: true})
  contextPanel!: ElementRef;
  contextMenuStyles: MenuStyles = {left: '', top: '', opacity: 0}
  relevantNodes: string[] = ['div', 'span'];
  modal: boolean = false;
  constructor() {}

  contextEvent(event: PointerEvent | null): void {
    this.contextMenuStyles.opacity = 0;
    this.contextMenuStyles.left = '';
    this.contextMenuStyles.top = '';

    if (event) {
      const {width: panelWidth, height: panelHeight}
        = this.contextPanel.nativeElement.getBoundingClientRect();
      const {width: bodyWidth, height: bodyHeight}
        = document.body.getBoundingClientRect();

      const x = bodyWidth - event.x + 2 >= panelWidth ? event.x + 2 : bodyWidth - panelWidth;
      const y = bodyHeight - event.y >= panelHeight ? event.y : bodyHeight - panelHeight;
      this.contextMenuStyles.opacity = 1;
      this.contextMenuStyles.left = `${x}px`;
      this.contextMenuStyles.top = `${y}px`;
    }
  }

  ctxActionHandler(action: string): void {
    switch (action) {
      case ContextMenuEnum.addNode: this.addNode();
    }
  }

  private  addNode(): void {
    this.modal = true;
  }
}
