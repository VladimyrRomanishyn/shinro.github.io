import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CodeEditorService } from '../../../../../services/code-editor.service';

@Component({
  selector: 'css-listing',
  templateUrl: './css-listing.component.html',
  styleUrls: ['./css-listing.component.scss'],
})
export class CSSListingComponent implements AfterViewInit {
  @ViewChild('cssEditor') root!: ElementRef;
  public listing!: string;
  constructor(private codeEditorSvc: CodeEditorService) {}

  ngAfterViewInit(): void {
    this.listing = this.codeEditorSvc.getCSSListing();
    this.root.nativeElement.innerHTML = this.listing;
  }
}
