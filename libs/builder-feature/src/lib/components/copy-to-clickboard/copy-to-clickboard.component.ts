import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'copy-to-clickboard',
  templateUrl: './copy-to-clickboard.component.html',
  styleUrls: ['./copy-to-clickboard.component.scss'],
})
export class CopyToClickboardComponent {
  @Input() callback!: () => string;
  public tooltipOpacity = 0;
  constructor(private clipboard: Clipboard) {}

  copySource() {
    this.clipboard.copy(this.callback());
    this.tooltipOpacity = 1;
    setTimeout(() => this.tooltipOpacity = 0, 300);
  }
}
