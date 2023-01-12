import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { filter, first, interval, map, Subject, take, takeUntil } from 'rxjs';
import { nodeList } from '../../nodeList';

@Component({
  selector: 'tags-modal',
  templateUrl: './tags-modal.component.html',
  styleUrls: ['./tags-modal.component.scss'],
})
export class TagsModalComponent implements OnInit, OnDestroy {
  @ViewChild('nodeSearch') nodeSearchInput: ElementRef | undefined;
  public modal = false;
  public relevantNodes: string[] = [];
  private fullNodeList: string[] = nodeList;
  public nodeSearch$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  @Output() selectedNode: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.nodeSearch$.asObservable()
      .pipe(
        map((substr: string) =>
          this.fullNodeList.filter(v => v.includes(substr))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((result: string[]) => this.relevantNodes = result);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
  
  public openNodesModal(): void {
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
      this.emitSelection(selected);
    }
  }

  public emitSelection(node: string) :void {
    this.closeNodeModal();
    this.selectedNode.emit(node);
  }
}
