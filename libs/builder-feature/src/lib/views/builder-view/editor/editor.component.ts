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
import { TagsModalComponent } from './components/tags-modal/tags-modal.component';
import { NgElementsService } from '../../../services/ng-elements.service';
import { BUILDER_EDITOR_SELECTOR, EDITOR_CLASSNAME, EDITOR_CLICK_CLASSNAME } from '../../../constants/class-names';
import { ContextMenuEnum } from '../../../types/form-types';
import { AfterViewInit } from '@angular/core';
import { CodeEditorService } from '../../../services/code-editor.service';

@Component({
  selector: BUILDER_EDITOR_SELECTOR,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements AfterViewInit {
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
    if (target?.parentElement?.localName === BUILDER_EDITOR_SELECTOR) {
      target = undefined;
    }

    
    this.toggleSelectedStatus(target);
    this.toggleContentEditableStatus(target);
    this._clickTargetElement = target;
    this.store.dispatch(setTarget({target}))
  }
  
  public _ctxTargetElement: HTMLElement | undefined;
  public _clickTargetElement: HTMLElement | undefined;
  public dragdrop = false;


  constructor
  (
    private store: Store<BuilderFeatureState>,
    public elementsSrc: NgElementsService,
    public codeEditorSvc: CodeEditorService,
  ) {
  }

  ngAfterViewInit(): void {
    
  }

  private toggleSelectedStatus(target: HTMLElement | undefined): void {
    this._clickTargetElement?.classList.remove(EDITOR_CLICK_CLASSNAME);
    target && target.classList.add(EDITOR_CLICK_CLASSNAME);
  }

  private toggleContentEditableStatus(target: HTMLElement | undefined): void {
    !target && this._clickTargetElement?.removeAttribute('contenteditable');
    target && target.setAttribute('contenteditable', 'true');
  }

  public createNode(node: string): void {
    this.elementsSrc.createNode(node, this.ctxTargetElement);
    this.codeEditorSvc.setClassNames(this.editor?.nativeElement);
  }

  contextMenuActionHandler({type, payload}: {type: ContextMenuEnum, payload?: any}): void {
    switch (type) {
      case ContextMenuEnum.addNode:
        this.tagsModal?.openNodesModal();
        return;

      case ContextMenuEnum.deleteNode:
        this.elementsSrc.deleteNode(this.ctxTargetElement);
        this.ctxTargetElement = undefined;
        return;

      case ContextMenuEnum.addDiv:
        this.elementsSrc.createNode('div', this.ctxTargetElement);
        this.codeEditorSvc.setClassNames(this.editor?.nativeElement);
        return;

      case ContextMenuEnum.cloneNode:
        this.elementsSrc.cloneNode(this.ctxTargetElement, payload);
        return;
          
      case ContextMenuEnum.clearNode:
        this.elementsSrc.clearNode(this.ctxTargetElement);
        return;    
      case ContextMenuEnum.fullScreen:
          this.elementsSrc.fullScreen(this.ctxTargetElement);
          return;        
    }
  }
}
