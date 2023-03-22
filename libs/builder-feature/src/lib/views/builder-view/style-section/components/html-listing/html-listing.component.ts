import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CodeEditorService } from '@libs/builder-feature/src/lib/services/code-editor.service';

@Component({
  selector: 'html-listing',
  templateUrl: './html-listing.component.html',
  styleUrls: ['./html-listing.component.scss'],
})
export class HtmlListingComponent implements AfterViewInit, OnInit {
  @ViewChild('htmlEditor') root!: ElementRef;
  public listing!: string;
  constructor(private codeEditorSvc: CodeEditorService) {}

  ngOnInit(): void {
    this.listing = this.codeEditorSvc.getHTMLListing();
  }

  ngAfterViewInit(): void {
    this.root.nativeElement.textContent = this.listing;
  }
}
