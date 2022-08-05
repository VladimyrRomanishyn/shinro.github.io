import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pets-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
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
  constructor() {}

  ngOnInit(): void {}
}
