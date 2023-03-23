import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SyntaxHighlightService {

  constructor() { }

  setHTMLHightlight(listing: string): string {
    
    if (!listing) {return ''}
    // <div>Hello world</div> --> 
    //<span class='text'>Hello World</span><span class='tag'>/&rt</span>
    const replaceParams = [
      [/>/, '<span class="tag">&#62;</span>'],
      [/</, '<span class="tag">&#60;</span>'],
      [/&#60;\w+.*&#62;(.*)&#60;\/?\w+\n*&#62;/, '<span class="tag-text">$1</span>'],
      [/&#60;\/?(\w+.*)&#62;/, '<span class="tag">$1</span>'],
    ];
    const byLine = listing.split('\n');
    byLine.map(line => {
      console.log(line);
    })
    return listing;
  }

  //setCSSHightlight(listing: string): string {}
}
