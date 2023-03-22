import { Injectable } from '@angular/core';
import { NgElementCreator } from '../classes/ng-element';

@Injectable({
  providedIn: 'root'
})
export class NgElementsService {
  public cloneNode(node: HTMLElement | undefined, qty: number): void {
    NgElementCreator.cloneElement(node, qty);
  }

  public deleteNode(context: HTMLElement | undefined): void {
    NgElementCreator.deleteElement(context);
  }

  public createNode(type: string, context: HTMLElement | undefined) {
    NgElementCreator.createElement({type, context});
  }

  public clearNode(context: HTMLElement | undefined) {
    NgElementCreator.clearNode(context);
  }

  public fullScreen(context: HTMLElement | undefined) {
    NgElementCreator.fullScreen(context);
  }
}