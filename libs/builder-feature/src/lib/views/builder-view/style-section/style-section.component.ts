import {
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
  styleUrls: ['./style-section.component.scss']
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
    const height = this.compStyles?.getPropertyValue('height').slice(0, -2) ?? 0;
    this.stylesForm = this.fb.group({
      width: this.fb.group({
        pixels: this.fb.group({
          editable: [false],
          value: width,
        }),
        percentage: this.fb.group({
          editable: [false],
          value: [100],
        })
      }),
      height: this.fb.group({
        pixels: this.fb.group({
          editable: [false],
          value: [height],
        }),
        percentage: this.fb.group({
          editable: [false],
          value: [10],
        })
      })
    });
    this.stylesForm.valueChanges.subscribe((formData) => {
      Object.entries(formData).map(([prop, payload]: [string, any]) => {
        const value = payload.pixels.editable
            ? `${payload.pixels.value}px`
            : payload.percentage.editable
            ? `${payload.percentage.value}%`
            : null;

        if (value) {
          // @ts-ignore
          this._target!.style[prop] = value;
        }
      })

    });
  }

  ngOnDestroy() {
    this.destroy$.emit();
  }

  displayEvent(ev: any): void {
    console.log(this.display);
  }
}
