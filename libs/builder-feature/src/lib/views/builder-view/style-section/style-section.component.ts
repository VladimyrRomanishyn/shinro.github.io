import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pets-style-section',
  templateUrl: './style-section.component.html',
  styleUrls: ['./style-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StyleSectionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
