import { Component, Input } from '@angular/core';

@Component({
  selector: 'builder-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() set target(v:  HTMLElement | undefined) {
    this._target = v;

    if (v) {
      this.compStyles = getComputedStyle(v);
    }
  }
  get target(): HTMLElement | undefined {
    return this._target
  }

  private _target: HTMLElement | undefined;
  compStyles: CSSStyleDeclaration | undefined;
}
