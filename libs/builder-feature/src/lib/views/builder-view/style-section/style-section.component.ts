import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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
  constructor() {}

  ngOnInit(): void {}
}
