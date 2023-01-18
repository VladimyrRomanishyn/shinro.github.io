import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit
} from '@angular/core';
import { builderFeatureKey, BuilderFeatureState } from './../../../state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StylesFormBuilder } from '../../../classes/styles-form-builder';

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
  selector: 'builder-style-section',
  templateUrl: './style-section.component.html',
  styleUrls: ['./style-section.component.scss']
})

export class StyleSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  set target(node: HTMLElement | undefined) {

    if (node) {
      this._target = new StylesFormBuilder(node)
      this.createForm();
    } else {
      this._target = undefined;
    }

    this.cd.detectChanges();
  }

  // @ts-ignore
  get target(): StylesFormBuilder  | undefined {
    return this._target
  }

  private _target: StylesFormBuilder | undefined;
  sectionsEnum = SectionsEnum;
  sections: Section[] = [
    { name: 'Box Model, Positioning', value: SectionsEnum.boxModel },
    { name: 'Grid', value: SectionsEnum.grid },
    { name: 'Flex', value: SectionsEnum.flex },
  ];
  section: Section | null = null;
  display: string | undefined;
  stylesForm!: FormGroup;
  destroy$: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  ngAfterViewInit(): void {
    this.store.select(state => state[builderFeatureKey].target)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((target: HTMLElement | undefined) => {
        this.target = target;
      })
  }

  createForm(): void {
   
    this.stylesForm = this.fb.group({
      width: this.fb.group({
        pixels: this.fb.group({
          editable: [false],
          value: 100,
        }),
        percentage: this.fb.group({
          editable: [false],
          value: [100],
        })
      }),
      height: this.fb.group({
        pixels: this.fb.group({
          editable: [false],
          value: [100],
        }),
        percentage: this.fb.group({
          editable: [false],
          value: [10],
        })
      }),
      margin: this.fb.group({
        pixels: this.fb.group({
          editable: [false],
          value: ['2px 0'],
        }),
        percentage: this.fb.group({
          editable: [false],
          value: [0],
        })
      }),
      padding: this.fb.group({
        pixels: this.fb.group({
          editable: [false],
          value: ['2px 0'],
        }),
        percentage: this.fb.group({
          editable: [false],
          value: [0],
        })
      }),
      border: this.fb.group({
        short: this.fb.group({
          editable: [false],
          value: ['1px solid black'],
        }),
        full: this.fb.group({
          editable: [false],
          value: [0],
        })
      })
    });


    this.stylesForm.valueChanges.subscribe((formData) => {
      Object.entries(formData)
        .filter(([, payload]: [string, any]) => {
          let result = false;
          Object.values(payload).map((value: any) => {
            if (value.editable) {
              result = true;
            }
          })
          return result;
        })
        .map(([prop, payload]: [string, any]) => {
          switch (prop) {
            case 'height':
            case 'width': this.defaultPropHandler(prop, payload);
              return;
            case 'margin':
            case 'padding': this.defaultPropHandler(prop, payload, false);
              return;
            case 'border': this.borderHandler(payload);
              return;
          }
        })
    });
  }

  private borderHandler(payload: any): void {
    if (payload.short.editable) {
      //@ts-ignore
      this._target.style['border'] = payload.short.value;
    }

  }

  private defaultPropHandler(prop: string, payload: any, px = true): void {
    const value = payload.pixels.editable
      ? `${payload.pixels.value + (px ? 'px' : '')}`
      : payload.percentage.editable
        ? `${payload.percentage.value}%`
        : null;

    if (value) {
      // @ts-ignore
      this._target.style[prop] = value;
    }
  }

  ngOnDestroy() {
    this.destroy$.emit();
  }

  displayEvent(event: any): void {
    console.log(this.display, event);
  }

  changeColor(target: any, value: any, pattern = ''): void {
    const result = target.value.split(' ').slice(0, -1).concat([value]).join(' ');
    target.value = result;
    this.borderHandler({ short: { editable: true, value: result } });
  }
}
