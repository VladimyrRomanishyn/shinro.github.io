import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CodeEditorService } from '@libs/builder-feature/src/lib/services/code-editor.service';
import { SyntaxHighlightService } from '@libs/builder-feature/src/lib/services/syntax-highlight.service';

@Component({
  selector: 'html-listing',
  templateUrl: './html-listing.component.html',
  styleUrls: ['./html-listing.component.scss'],
})
export class HtmlListingComponent implements AfterViewInit, OnInit {
  @ViewChild('htmlEditor') root!: ElementRef;
  public listing!: string;
  constructor
  (
    private codeEditorSvc: CodeEditorService,
    private highLightSvc: SyntaxHighlightService
  ) {}

  ngOnInit(): void {
    this.listing = this.codeEditorSvc.getHTMLListing();
    console.log(this.highLightSvc.setHTMLHightlight(this.listing));
  }

  ngAfterViewInit(): void {
    this.root.nativeElement.textContent = this.listing;
  }
}
