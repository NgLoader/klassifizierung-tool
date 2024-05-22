import { Component } from '@angular/core';
import { ArgumentEditComponent } from '../../argument-edit-component';
import { StringArgumentOptions } from '../argument-string.model';

@Component({
  selector: 'maxim-argument-string-edit',
  standalone: true,
  imports: [],
  templateUrl: './argument-string-edit.component.html',
  styleUrl: './argument-string-edit.component.scss'
})
export class ArgumentStringEditComponent extends ArgumentEditComponent<StringArgumentOptions> {
}
