import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'pets-builder-view',
  templateUrl: './builder-view.component.html',
  styleUrls: ['./builder-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderViewComponent implements OnInit {
  editorChanges: string = '';
  targetElement: HTMLElement | undefined;
  constructor() {}
  ngOnInit(): void {}
}
