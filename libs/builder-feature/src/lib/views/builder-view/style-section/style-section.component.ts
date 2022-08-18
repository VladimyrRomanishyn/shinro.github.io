import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { builderFeatureKey, BuilderFeatureState } from '@libs/builder-feature/src/lib/state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';

enum SectionsEnum {
  boxModel = 'box-model',
  grid = 'grid',
  flex = 'flex',
}

interface Section {
  name: string,
  value: SectionsEnum
}
@Component({
  selector: 'pets-style-section',
  templateUrl: './style-section.component.html',
  styleUrls: ['./style-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StyleSectionComponent implements OnInit, OnDestroy {
  @Input() set editorStyles(value: string) {
    this._editorStyles = value;
  }
  get editorStyles(): string  {
    return this._editorStyles;
  }
  private _editorStyles!: string;

  @Input() set target(v:  HTMLElement | undefined) {
    this._target = v;

    if (v) {
      this.compStyles = getComputedStyle(v);
    }
  }
  get target(): HTMLElement | undefined {
    return this._target
  }

  private _target: HTMLElement | undefined;
  compStyles: CSSStyleDeclaration | undefined;
  sectionsEnum = SectionsEnum;
  sections: Section[] = [
    {name: 'Box Model, Positioning', value: SectionsEnum.boxModel},
    {name: 'Grid', value: SectionsEnum.grid},
    {name: 'Flex', value: SectionsEnum.flex},
  ];
  section: Section | null = this.sections[0];
  display: string | undefined;
  stylesModel: any = {
    width: 10,
    height: 10
  }
  destroy$: EventEmitter<any> = new EventEmitter<any>();
  constructor(private store: Store<{[builderFeatureKey]: BuilderFeatureState}>) {}

  ngOnInit(): void {
    this.store.select(state => state[builderFeatureKey].target)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((target: HTMLElement | undefined) => this.target = target)
  }

  ngOnDestroy() {
    this.destroy$.emit();
  }

  displayEvent(ev: any): void {
    console.log(this.display);
  }
}
