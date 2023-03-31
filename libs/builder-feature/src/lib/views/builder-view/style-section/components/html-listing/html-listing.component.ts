import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { CodeEditorService } from '@libs/builder-feature/src/lib/services/code-editor.service';
import { SyntaxHighlightService } from '@libs/builder-feature/src/lib/services/syntax-highlight.service';
import { Store } from '@ngrx/store';
import { builderFeatureKey, BuilderFeatureState } from '../../../../../state/builder-feature.reducer';
import { debounceTime, filter, takeUntil } from 'rxjs';
import { MutationObserverService } from '@libs/builder-feature/src/lib/services/mutation-observer.service';
import { listingChanges } from '../../../../../state/builder-feature.actions';

@Component({
  selector: 'html-listing',
  templateUrl: './html-listing.component.html',
  styleUrls: ['./html-listing.component.scss'],
})
export class HtmlListingComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('htmlEditor') root!: ElementRef;
  public listing!: string;
  public !: string;
  private destroy$: EventEmitter<void> = new EventEmitter();
  public typing = false;

  constructor
  (
    private codeEditorSvc: CodeEditorService,
    private highLightSvc: SyntaxHighlightService,
    private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
    private domObserverSvc: MutationObserverService 
  ) {}

  ngOnInit(): void {
    this.listing = this.codeEditorSvc.getHTMLListing();
  }

  ngOnDestroy(): void {
      this.destroy$.next();
  }

  ngAfterViewInit(): void {
    this.domObserverSvc.createDOM$(this.root.nativeElement, {
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    })
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300)
      )
      .subscribe((changes: MutationRecord[]) => {
          const id = changes[0].target.parentElement?.dataset['id'] || '';
          const data = changes[0].target.parentElement?.innerHTML || '';
          const changeType = changes[0].target.parentElement?.className || '';
          
          this.store.dispatch(listingChanges({listingChanges: {id, data, changeType}}))
      });

    this.store.select((state) => state[builderFeatureKey].editorDomChanged)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !this.typing)
      )
      .subscribe(() => {
        this.listing = this.codeEditorSvc.getHTMLListing();
        this.root.nativeElement.innerHTML = this.highLightSvc.setHTMLHightlight(this.listing);
        this.addListeners();
      })
  }

  private addListeners() {
    Array.from(this.root.nativeElement.querySelectorAll('[contenteditable]') as HTMLElement[])
      .map((node: HTMLElement) => {
        node.addEventListener('focus', () => this.typing = true)
        node.addEventListener('blur', () => this.typing = false)
      })
  }

  public copyListing(): () => string {
    return () => this.codeEditorSvc.getHTMLListing(false);
  }
}
