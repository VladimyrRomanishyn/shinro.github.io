import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { BuilderFeatureState } from '@libs/builder-feature/src/lib/state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { setTarget } from '@libs/builder-feature/src/lib/state/builder-feature.actions';
import { ContextMenuEnum } from './components/context-menu/context-menu.component';
import { TagsModalComponent } from './components/tags-modal/tags-modal.component';

@Component({
  selector: 'pets-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent {
  @ViewChild('editor', { static: true }) editor: ElementRef | undefined;
  @ViewChild(TagsModalComponent) tagsModal: TagsModalComponent | undefined;
  
  public relevantNodes: string[] = [];
  public nodeSearch$: Subject<string> = new Subject<string>();
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

  contextMenuActionHandler(action: string): void {
    switch (action) {
      case ContextMenuEnum.addNode:
        this.tagsModal?.openNodesModal();
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

  createNode(node: string, target = this.editor?.nativeElement) {
    const newNode: HTMLElement = document.createElement(node);
    newNode.classList.add('editor__child');
    target.append(newNode);
    this.changes.emit(this.editor?.nativeElement.innerHTML);
  }
}
