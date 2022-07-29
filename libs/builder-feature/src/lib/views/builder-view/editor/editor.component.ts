import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, OnDestroy, OnInit,
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
  addNode = 'addNode'
}

@Component({
  selector: 'pets-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('nodeSearch') nodeSearchInput: ElementRef | undefined;
  @ViewChild('contextPanel', {static: true})
  contextPanel!: ElementRef;
  contextMenuStyles: MenuStyles = {left: '', top: '', opacity: 0}
  relevantNodes: string[] = [];
  fullNodeList: string[] = nodeList;
  nodeSearch$: Subject<string> = new Subject<string>();
  destroy$: Subject<void> = new Subject<void>();
  modal: boolean = false;
  constructor() {}

  ngOnInit() {
    this.nodeSearch$.asObservable()
      .pipe(
        map((substr: string) =>
          this.fullNodeList.filter(v => v.includes(substr))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((result: string[]) => this.relevantNodes = result)
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

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
      case ContextMenuEnum.addNode: this.addNodeModal();

      return;
    }
  }

  private  addNodeModal(): void {
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
      })
  }
}
