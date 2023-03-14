import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ExportGenerator } from '../../../classes/export-generator';
import { builderFeatureKey, BuilderFeatureState } from '../../../state/builder-feature.reducer';

@Component({
  selector: 'builder-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent  {
  // public target: HTMLElement | undefined;
  // private destroy$: EventEmitter<void> = new EventEmitter()
  
  // constructor(
  //   private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
  // ) { }

  // ngOnInit(): void {
  //   this.store.select(state => state[builderFeatureKey].target)
  //   .pipe(
  //     takeUntil(this.destroy$)
  //   )
  //   .subscribe((target: HTMLElement | undefined) => {
  //     this.target = target;
  //   })
  // }

  // ngOnDestroy(): void {
  //     this.destroy$.emit();
  // }

  public export(): void {
    ExportGenerator.generate(document.querySelector('.editor') as HTMLElement);
  }
}
