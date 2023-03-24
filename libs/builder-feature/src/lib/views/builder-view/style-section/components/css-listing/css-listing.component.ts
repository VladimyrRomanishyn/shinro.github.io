import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CodeEditorService } from '../../../../../services/code-editor.service';
import { SyntaxHighlightService } from '../../../../../services/syntax-highlight.service';

@Component({
  selector: 'css-listing',
  templateUrl: './css-listing.component.html',
  styleUrls: ['./css-listing.component.scss'],
})
export class CSSListingComponent implements AfterViewInit, OnInit {
  @ViewChild('cssEditor') root!: ElementRef;
  public listing!: string;
  
  constructor
  (
    private codeEditorSvc: CodeEditorService,
    private higlightSvc: SyntaxHighlightService
  ) {}
  
  ngOnInit(): void {
    this.listing = this.codeEditorSvc.getCSSListing();
  }

  ngAfterViewInit(): void {
    this.root.nativeElement.innerHTML = this.higlightSvc.setCSSHightlight(this.listing)
  }
}
