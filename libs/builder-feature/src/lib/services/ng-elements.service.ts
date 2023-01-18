import { Injectable } from '@angular/core';
import { NgElementCreator } from '../classes/ng-element';

@Injectable({
  providedIn: 'root'
})
export class NgElementsService {
  public cloneNode(node: HTMLElement | undefined): void {
    NgElementCreator.cloneElement(node);
  }

  public deleteNode(context: HTMLElement | undefined): void {
    NgElementCreator.deleteElement(context);
  }

  public createNode(type: string, context: HTMLElement | undefined) {
    NgElementCreator.createElement({type, context});
  }
}
