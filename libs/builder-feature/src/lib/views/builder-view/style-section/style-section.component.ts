import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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
export class StyleSectionComponent implements OnInit {
  @Input() set editorStyles(value: string) {
    this._editorStyles = value;
  }
  get editorStyles(): string  {
    return this._editorStyles;
  }
  private _editorStyles!: string;
  sectionsEnum = SectionsEnum;
  section: Section | null = null;
  sections: Section[] = [
    {name: 'Box Model, Positioning', value: SectionsEnum.boxModel},
    {name: 'Grid', value: SectionsEnum.grid},
    {name: 'Flex', value: SectionsEnum.flex},
  ]
  constructor() {}

  ngOnInit(): void {}
}
