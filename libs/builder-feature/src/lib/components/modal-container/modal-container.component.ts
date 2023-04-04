import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
})
export class ModalContainerComponent implements OnInit, OnDestroy  {
  @Input() set status(isOpen: boolean) {
    this._status = isOpen;
  }

  get status(): boolean {
    return this._status;
  }
  
  private _status = false;

  public toggleStatus(): void {
    this._status = !this._status;
  }

  private listener!: (event: KeyboardEvent) => void;

  ngOnInit(): void {
    this.listener = (event: KeyboardEvent): void  => {
      if (this._status && event.key === 'Escape') {
        this.status = false;
      }
    }

    document.addEventListener('keydown', this.listener);
  }

  ngOnDestroy(): void {
      document.removeEventListener('keydown', this.listener);
  }
}
