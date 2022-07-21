import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pets-html-markup',
  templateUrl: './html-markup.component.html',
  styleUrls: ['./html-markup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlMarkupComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
