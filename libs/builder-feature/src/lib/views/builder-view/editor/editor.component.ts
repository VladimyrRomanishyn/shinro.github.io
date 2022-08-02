import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import { nodeList } from '@libs/builder-feature/src/lib/views/builder-view/editor/nodeList';
import { filter, first, interval, map, Subject, take, takeUntil, tap } from 'rxjs';

interface MenuStyles {
  left: string,
  top: string,
  opacity: number;
}

enum ContextMenuEnum {
  addNode = 'addNode',
  deleteNode = 'deleteNode',
  addDiv = 'addDiv'
}

@Component({
  selector: 'pets-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('nodeSearch') nodeSearchInput: ElementRef | undefined;
  @ViewChild('editor', { static: true }) editor: ElementRef | undefined;
  @ViewChild('contextPanel', { static: true })
  contextPanel!: ElementRef;
  contextMenuStyles: MenuStyles = { left: '', top: '', opacity: 0 };
  relevantNodes: string[] = [];
  fullNodeList: string[] = nodeList;
  nodeSearch$: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();
  modal: boolean = false;
  targetElement: EventTarget | undefined | null;
  @Output() changes: EventEmitter<string> = new EventEmitter<string>();
  contextMenuEnum = ContextMenuEnum;

  constructor() {
  }

  ngOnInit() {
    this.nodeSearch$.asObservable()
      .pipe(
        map((substr: string) =>
          this.fullNodeList.filter(v => v.includes(substr))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((result: string[]) => this.relevantNodes = result);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  contextEvent(event?: PointerEvent | undefined): void {
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

  ctxActionHandler(action: string): void {
    this.contextEvent();
    switch (action) {
      case ContextMenuEnum.addNode:
        this.addNodeModal();
        return;

      case ContextMenuEnum.deleteNode:
        this.deleteNode();
        return;

      case ContextMenuEnum.addDiv:
        this.createNode('div', this.targetElement);
        return;
    }
  }

  private deleteNode(): void {
    if ((this.targetElement as HTMLElement)?.parentElement?.localName === 'pets-editor') {
      return;
    }
    (this.targetElement as HTMLElement)?.remove();
    this.changes.emit(this.editor?.nativeElement.innerHTML);
  }

  private addNodeModal(): void {
    this.modal = true;
    interval(100)
      .pipe(
        take(30),
        filter(() => this.nodeSearchInput?.nativeElement),
        first()
      )
      .subscribe(() => {
        this.nodeSearchInput?.nativeElement.select();
        this.nodeSearchInput?.nativeElement.focus();
      });
  }

  createNode(node: string, target: EventTarget | undefined | null) {
    this.closeNodeModal();
    if (!target) {
      return;
    }

    const newNode: HTMLElement = document.createElement(node);
    newNode.style.border = '2px solid black';
    newNode.style.minHeight = '50px';
    newNode.style.marginBottom = '5px';
    newNode.style.padding = '5px';
    newNode.style.resize = 'both';
    newNode.style.overflow = 'auto';
    newNode.style.maxWidth = '100%';
    newNode.style.width = '30%';
    newNode.draggable = true;
    newNode.addEventListener('drop', (event) => {console.log(event)});
    (target as HTMLElement).append(newNode);
    this.changes.emit(this.editor?.nativeElement.innerHTML);
  }

  closeNodeModal(): void {
    this.relevantNodes = [];
    this.modal = false;
  }

  hoverNode(event: any, up?: boolean): void {
    if (!this.relevantNodes.length) {return; }

    const items = [...event.querySelector('.tags-modal__results')?.children];
    const selected = items?.find(i => i.className.includes('hover'));

    if (selected) {
      const direction = up ? 'previousElementSibling' : 'nextElementSibling';
      const defaultIndex = up ? items.length - 1 : 0;

      selected.classList.remove('hover');
      selected[direction]
        ? selected[direction].classList.add('hover')
        : items[defaultIndex].classList.add('hover');

      return;
    }
    items[0].classList.add('hover')
  }

  selectNode(event: any): void {
    if (!this.relevantNodes.length) {return; }

    const items = [...event.querySelector('.tags-modal__results')?.children];
    const selected = items?.find(i => i.className.includes('hover'));

    if (selected) {
      this.createNode(selected.innerText, this.targetElement);
    }
  }


  drag(event: any, type: string): void {
    // console.log(type);
    // console.log(event);
    // event.preventDefault();
  }

}
