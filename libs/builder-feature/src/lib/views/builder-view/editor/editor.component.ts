import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { nodeList } from '@libs/builder-feature/src/lib/views/builder-view/editor/nodeList';
import { filter, first, interval, map, Subject, take, takeUntil } from 'rxjs';
import { BuilderFeatureState } from '@libs/builder-feature/src/lib/state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { setTarget } from '@libs/builder-feature/src/lib/state/builder-feature.actions';
import { ContextMenuEnum } from './context-menu/context-menu.component';

@Component({
  selector: 'pets-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('nodeSearch') nodeSearchInput: ElementRef | undefined;
  @ViewChild('editor', { static: true }) editor: ElementRef | undefined;
  
  public relevantNodes: string[] = [];
  private fullNodeList: string[] = nodeList;
  public nodeSearch$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  public modal = false;

  set ctxTargetElement(target: HTMLElement | undefined) {
    if (target && target?.parentElement?.localName !== 'pets-editor') {
      this._ctxTargetElement = target;
      return;
    }
    this._ctxTargetElement = undefined;
  }

  get ctxTargetElement(): HTMLElement | undefined {
    return this._ctxTargetElement;
  }
  
  set clickTargetElement(target: HTMLElement | undefined) {
    this._clickTargetElement?.classList?.toggle('editor__click');
    this._clickTargetElement = target;
    this._clickTargetElement?.classList?.toggle('editor__click');

    if (target && target?.parentElement?.localName === 'pets-editor') {
      this._clickTargetElement?.classList?.remove('editor__click');
      this._clickTargetElement = undefined;
    }

    this.store.dispatch(setTarget({target: this._clickTargetElement}))
  }
  
  public _ctxTargetElement: HTMLElement | undefined;
  public _clickTargetElement: HTMLElement | undefined;
  
  public dragdrop = false;
  @Output() changes: EventEmitter<string> = new EventEmitter<string>();
  @Output() clickTargetSelect: EventEmitter<HTMLElement> = new EventEmitter<HTMLElement>();


  constructor(private store: Store<BuilderFeatureState>) {
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

  contextMenuActionHandler(action: string): void {
    switch (action) {
      case ContextMenuEnum.addNode:
        this.addNodeModal();
        return;

      case ContextMenuEnum.deleteNode:
        this.deleteNode();
        return;

      case ContextMenuEnum.addDiv:
        this.createNode('div', this.ctxTargetElement);
        return;

      case ContextMenuEnum.cloneNode:
        this.cloneNode(this.ctxTargetElement);
        return;
    }
  }

  private cloneNode(node: HTMLElement | undefined): void {
    if (node && node.className !== 'editor') {
      const clone = node?.cloneNode(true) as HTMLElement;
      clone.classList.remove('editor__click');
      node.after(clone);
    }
  }

  private deleteNode(): void {
    this.ctxTargetElement?.remove();
    this.ctxTargetElement = undefined;
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

  createNode(node: string, target = this.editor?.nativeElement) {
    this.closeNodeModal();
    const newNode: HTMLElement = document.createElement(node);
    newNode.classList.add('editor__child');
    target.append(newNode);
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
      this.createNode(selected.innerText, this.ctxTargetElement);
    }
  }
}
