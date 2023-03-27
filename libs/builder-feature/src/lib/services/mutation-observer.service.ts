import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MutationObserverService {
  
  createDOMobserverStream(el: HTMLElement) {
    const config = { 
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['contenteditable', 'class'],
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
    };
    
    const observable = new Observable(subscriber => {
    });

    const callback = (mutations: MutationRecord[], observer: MutationObserver) => {
      console.log('mutationList', mutations);
      console.log('observer', observer);
    };

    const observer = new MutationObserver(callback);
    observer.observe(el, config);

  } 
}
