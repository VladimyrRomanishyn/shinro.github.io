import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CodeEditorService } from '@libs/builder-feature/src/lib/services/code-editor.service';

@Component({
  selector: 'html-listing',
  templateUrl: './html-listing.component.html',
  styleUrls: ['./html-listing.component.scss'],
})
export class HtmlListingComponent implements AfterViewInit {
  @ViewChild('htmlEditor') root!: ElementRef;
  public listing!: string;
  constructor(private codeEditorSvc: CodeEditorService) {}

  ngAfterViewInit(): void {
    this.listing = this.codeEditorSvc.getHTMLListing();
    this.root.nativeElement.innerText = this.listing;
  }
}
