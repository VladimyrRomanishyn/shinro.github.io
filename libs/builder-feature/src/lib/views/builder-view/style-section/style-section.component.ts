import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

enum SectionsEnum {
  boxModel = 'box-model',
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
export class StyleSectionComponent implements OnInit {
  @Input() set editorStyles(value: string) {
    this._editorStyles = value;
  }
  get editorStyles(): string  {
    return this._editorStyles;
  }
  private _editorStyles!: string;
  sectionsEnum = SectionsEnum;
  section: SectionsEnum | null = null;
  sections: {name: string, value: SectionsEnum}[] = [
    {name: 'Box Model, Positioning', value: SectionsEnum.boxModel},
  ]
  constructor() {}

  ngOnInit(): void {}
}
