import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'copy-to-clickboard',
  templateUrl: './copy-to-clickboard.component.html',
  styleUrls: ['./copy-to-clickboard.component.scss'],
})
export class CopyToClickboardComponent {
  @Input() source!: string;
  constructor(private clipboard: Clipboard) {}

  copySource() {
    this.clipboard.copy(this.source);
  }
}
