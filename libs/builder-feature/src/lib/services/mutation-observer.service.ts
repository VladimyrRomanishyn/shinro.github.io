import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MutationObserverService {
  
  createDOM$(el: HTMLElement, config?: MutationObserverInit): Observable<MutationRecord[]> {
    config = config ?? { 
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    };
    
    return new Observable(observer => {
      const callback = (mutations: MutationRecord[]) => {
        observer.next(mutations);
      };

      const unsubscribe = () => {
        mutObserver.disconnect();
      };
  
      const mutObserver = new MutationObserver(callback);
      mutObserver.observe(el, config);
      
      return {unsubscribe};
    });
  } 
}
