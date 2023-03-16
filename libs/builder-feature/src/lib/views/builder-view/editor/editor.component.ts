import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { BuilderFeatureState } from '@libs/builder-feature/src/lib/state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { setTarget } from '@libs/builder-feature/src/lib/state/builder-feature.actions';
import { ContextMenuEnum } from './components/context-menu/context-menu.component';
import { TagsModalComponent } from './components/tags-modal/tags-modal.component';
import { NgElementsService } from '../../../services/ng-elements.service';
import { BUILDER_EDITOR_SELECTOR, EDITOR_CLASSNAME, EDITOR_CLICK_CLASSNAME } from '../../../constants/class-names';

@Component({
  selector: BUILDER_EDITOR_SELECTOR,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent {
  @ViewChild(EDITOR_CLASSNAME, { static: true }) editor: ElementRef | undefined;
  @ViewChild(TagsModalComponent) tagsModal: TagsModalComponent | undefined;
  
  public relevantNodes: string[] = [];
  public nodeSearch$: Subject<string> = new Subject<string>();

  set ctxTargetElement(target: HTMLElement | undefined) {
    if (target && target?.parentElement?.localName !== BUILDER_EDITOR_SELECTOR) {
      this._ctxTargetElement = target;
      return;
    }
    this._ctxTargetElement = undefined;
  }

  get ctxTargetElement(): HTMLElement | undefined {
    return this._ctxTargetElement ?? this.editor?.nativeElement;
  }
  
  set clickTargetElement(target: HTMLElement | undefined) {
    this._clickTargetElement?.classList?.toggle(EDITOR_CLICK_CLASSNAME);
    this._clickTargetElement = target;
    this._clickTargetElement?.classList?.toggle(EDITOR_CLICK_CLASSNAME);

    if (target && target?.parentElement?.localName === BUILDER_EDITOR_SELECTOR) {
      this._clickTargetElement?.classList?.remove(EDITOR_CLICK_CLASSNAME);
      this._clickTargetElement = undefined;
    }

    this.store.dispatch(setTarget({target: this._clickTargetElement}))
  }
  
  public _ctxTargetElement: HTMLElement | undefined;
  public _clickTargetElement: HTMLElement | undefined;
  public dragdrop = false;


  constructor
  (
    private store: Store<BuilderFeatureState>,
    public elementsSrc: NgElementsService
  ) {
  }

  contextMenuActionHandler(action: string): void {
    switch (action) {
      case ContextMenuEnum.addNode:
        this.tagsModal?.openNodesModal();
        return;

      case ContextMenuEnum.deleteNode:
        this.elementsSrc.deleteNode(this.ctxTargetElement);
        this.ctxTargetElement = undefined;
        return;

      case ContextMenuEnum.addDiv:
        this.elementsSrc.createNode('div', this.ctxTargetElement);
        return;

      case ContextMenuEnum.cloneNode:
        this.elementsSrc.cloneNode(this.ctxTargetElement);
        return;
    }
  }
}
