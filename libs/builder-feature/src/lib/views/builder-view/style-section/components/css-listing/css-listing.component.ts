import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { builderFeatureKey, BuilderFeatureState } from '@libs/builder-feature/src/lib/state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { CodeEditorService } from '../../../../../services/code-editor.service';
import { SyntaxHighlightService } from '../../../../../services/syntax-highlight.service';

@Component({
  selector: 'css-listing',
  templateUrl: './css-listing.component.html',
  styleUrls: ['./css-listing.component.scss'],
})
export class CSSListingComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('cssEditor') root!: ElementRef;
  public listing!: string;
  private destroy$: EventEmitter<void> = new EventEmitter();
  
  constructor
  (
    private codeEditorSvc: CodeEditorService,
    private highlightSvc: SyntaxHighlightService,
    private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
  ) {}
  
  ngOnInit(): void {
    this.listing = this.codeEditorSvc.getCSSListing();
  }

  ngAfterViewInit(): void {
    this.root.nativeElement.innerHTML = this.highlightSvc.setCSSHightlight(this.listing);

    this.store.select((state) => state[builderFeatureKey].stylesChanged)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.listing = this.codeEditorSvc.getCSSListing();
        this.root.nativeElement.innerHTML = this.highlightSvc.setCSSHightlight(this.listing);
      })
  }

  ngOnDestroy(): void {
      this.destroy$.next();
  }
}
