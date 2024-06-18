import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditmodeService {

  private readonly _editmode = signal(false);
  readonly editmode = this._editmode.asReadonly();

  setEditmode(value: boolean) {
    this._editmode.set(value);
  }
}
