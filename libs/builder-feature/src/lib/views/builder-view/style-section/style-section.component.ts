import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { builderFeatureKey, BuilderFeatureState } from '@libs/builder-feature/src/lib/state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

enum SectionsEnum {
  boxModel = 'box-model',
  grid = 'grid',
  flex = 'flex',
}

interface Section {
  name: string,
  value: SectionsEnum
}

interface StylesForm {
  width: {
    pixels: number,
    percentage: number
  }
}
@Component({
  selector: 'pets-style-section',
  templateUrl: './style-section.component.html',
  styleUrls: ['./style-section.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StyleSectionComponent implements OnInit, OnDestroy {
  @Input() set target(v:  HTMLElement | undefined) {
    this._target = v;

    if (v) {
      this.compStyles = getComputedStyle(v);
      this.createForm();
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
  section: Section | null = null;
  display: string | undefined;
  stylesForm!: FormGroup;
  destroy$: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private store: Store<{[builderFeatureKey]: BuilderFeatureState}>,
    private fb: FormBuilder,
    // private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.store.select(state => state[builderFeatureKey].target)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((target: HTMLElement | undefined) => {
        this.target = target;
      })
  }

  createForm(): void {
    const width = this.compStyles?.getPropertyValue('width').slice(0, -2) ?? 0;
    this.stylesForm = this.fb.group({
      metricsEditable: [false],
      width: this.fb.group({
        pixels: [width],
        percentage: [100],
      }),
      height: this.fb.group({
        pixels: [width],
        percentage: [5],
      })
    });
    this.stylesForm.valueChanges.subscribe((formData) => {
      console.log(formData);
      if (formData.metricsEditable) {
        this._target!.style.width = `${formData.width.percentage}%`;
        this._target!.style.height = `${formData.height.percentage}%`;
      }

    });
  }

  ngOnDestroy() {
    this.destroy$.emit();
  }

  displayEvent(ev: any): void {
    console.log(this.display);
  }
}
