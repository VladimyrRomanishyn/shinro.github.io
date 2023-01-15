import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'builder-html-markup',
  templateUrl: './html-markup.component.html',
  styleUrls: ['./html-markup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlMarkupComponent implements OnInit {
  @Input() set markup(value: string) {
    this._markup = value;
  }
  get markup(): string  {
    return this._markup;
  }
  private _markup!: string;
  constructor() {}

  ngOnInit(): void {}
}
