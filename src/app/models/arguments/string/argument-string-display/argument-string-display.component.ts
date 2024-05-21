import { Component } from '@angular/core';
import { ArgumentComponent } from '../../argument-component';
import { StringArgumentOptions } from '../argument-string.model';

@Component({
  selector: 'maxim-argument-string-display',
  standalone: true,
  imports: [],
  templateUrl: './argument-string-display.component.html',
  styleUrl: './argument-string-display.component.scss'
})
export class ArgumentStringDisplayComponent extends ArgumentComponent<StringArgumentOptions> {
}
