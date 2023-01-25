import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { builderFeatureKey, BuilderFeatureState } from './../../../state/builder-feature.reducer';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { StylesFormBuilder } from '../../../classes/styles-form-builder';
import { Section, sectionsCofig, SectionsEnum } from './sections-config';
@Component({
  selector: 'builder-style-section',
  templateUrl: './style-section.component.html',
  styleUrls: ['./style-section.component.scss']
})

export class StyleSectionComponent implements OnDestroy, AfterViewInit {
  set target(node: HTMLElement | undefined) {

    if (node) {
      this._target = new StylesFormBuilder(node)
    } else {
      this._target = undefined;
    }

    if (this._target && this.section) {
      this.createForm(this._target, this.section);
    }

    this.cd.detectChanges();
  }

  // @ts-ignore
  get target(): StylesFormBuilder | undefined {
    return this._target
  }

  private _target: StylesFormBuilder | undefined;
  sectionsEnum = SectionsEnum;
  sections: Section[] = sectionsCofig;
  section: Section | null = null;
  display: string | undefined;
  stylesForm!: FormGroup;
  destroy$: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private store: Store<{ [builderFeatureKey]: BuilderFeatureState }>,
    private cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.store.select(state => state[builderFeatureKey].target)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((target: HTMLElement | undefined) => {
        this.target = target;
      })
  }

  createForm(target: StylesFormBuilder ,section: Section): void {
    target.createStylesForm(section.stylesFormCofig);
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

  toggleSection(item: Section): void {
    this.section = item; 

    if (this._target && this.section) {
      this.createForm(this._target, this.section);
    }
  }
}
