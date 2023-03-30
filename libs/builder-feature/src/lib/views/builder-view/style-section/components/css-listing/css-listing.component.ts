import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { MutationObserverService } from '@libs/builder-feature/src/lib/services/mutation-observer.service';
import { listingChanges } from '@libs/builder-feature/src/lib/state/builder-feature.actions';
import { builderFeatureKey, BuilderFeatureState } from '@libs/builder-feature/src/lib/state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { merge } from 'rxjs';
import { debounceTime, skip, takeUntil } from 'rxjs/operators';
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
  public copyListing!: string;
  private destroy$: EventEmitter<void> = new EventEmitter();
  
  constructor
  (
    private codeEditorSvc: CodeEditorService,
    private highlightSvc: SyntaxHighlightService,
    private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
    private domObserverSvc: MutationObserverService 
  ) {}
  
  ngOnInit(): void {
    this.listing = this.codeEditorSvc.getCSSListing();
    this.copyListing = this.codeEditorSvc.getCSSListing(false);
  }

  ngAfterViewInit(): void {

    merge(
      this.store.select((state) => state[builderFeatureKey].stylesChanged),
      this.store.select((state) => state[builderFeatureKey].editorDomChanged)
    )
      .pipe(
        takeUntil(this.destroy$),
        skip(1)
      )
      .subscribe(() => {
        this.listing = this.codeEditorSvc.getCSSListing();
        this.copyListing = this.codeEditorSvc.getCSSListing(false);
        this.root.nativeElement.innerHTML = this.highlightSvc.setCSSHightlight(this.listing);
        this.addHandlers(this.root.nativeElement);
      });

      this.domObserverSvc.createDOM$(this.root.nativeElement, {
        subtree: true,
        characterData: true,
        characterDataOldValue: true,
      })
        .pipe(
          takeUntil(this.destroy$),
          debounceTime(300)
        )
        .subscribe(([changes]: MutationRecord[]) => {
            const ruleElement = this.getElement(changes.target as HTMLElement, 'rule');
            const propWrapper = this.getElement(changes.target as HTMLElement, 'prop-wrapper');
           
            const prop = (propWrapper?.querySelector('.prop') as HTMLElement).innerText;
            const value = (propWrapper?.querySelector('.value') as HTMLElement).innerText;
            const id = ruleElement?.dataset['id'] || '';
            const changeType = 'set-property';

            if (prop && value && id) {
              this.store.dispatch(listingChanges({listingChanges: {id, data: `${prop}:${value}`, changeType}}));
            }
        });
  }

  ngOnDestroy(): void {
      this.destroy$.next();
  }

  private getElement(target: HTMLElement, className: string): HTMLElement | null {
    let parent = target as HTMLElement;
    if (!parent) {return null}

    while(parent?.className as string != className ) {
      
      parent = parent?.parentElement as HTMLElement;
    }

    return parent;
  }

  private addHandlers(el: HTMLElement): void  {
    const removers = Array.from(el.querySelectorAll('.remove-prop')) as HTMLElement[];
    const inserters = Array.from(el.querySelectorAll('.add-prop')) as HTMLElement[];
    const contenteditable = Array.from(el.querySelectorAll('[contenteditable]')) as HTMLElement[];

    removers.map(el => {
      el.onclick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const ruleElement = this.getElement(target, 'rule');

        const data = (target.parentElement?.querySelector('.prop')as HTMLElement)?.innerText as string;
        const id = ruleElement?.dataset['id'] as string;
        const changeType = 'remove-property';
        this.store.dispatch(listingChanges({listingChanges: {id, data, changeType}}));
      }
    });

    inserters.map(el => {
      el.onclick = (event: MouseEvent) => {
        const newLine = document.createElement('span');
        newLine.className = 'prop-wrapper';
        newLine.innerHTML = '\n&nbsp;&nbsp;'+
                            '<span class="remove-prop">x</span>' +
                            '<span contenteditable class="prop"></span>' +
                            '<span class="colon">&nbsp;:&nbsp;</span>' +
                            '<span contenteditable class="value"></span>' + 
                            '<span class="semi">&nbsp;;</span>' +
                            '<span class="add-prop">+</span>';
        (event.target as HTMLElement).parentElement?.after(newLine);
        //this.addHandlers(newLine);
        (newLine.querySelector('.prop') as HTMLElement).focus();
      }
    })

    contenteditable.map(el => {
      el.onkeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const addButton = (event.target as HTMLElement).parentElement?.querySelector('.add-prop') as HTMLElement;
          addButton?.click();
        }
      }
    })
  }
}
