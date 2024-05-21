import { Component } from '@angular/core';
import { ArgumentComponent } from '../../argument-component';
import { StringArgumentOptions } from '../argument-string.model';
import { SectionArgumentOptions } from '../../../argument.model';

@Component({
  selector: 'maxim-argument-string-edit',
  standalone: true,
  imports: [],
  templateUrl: './argument-string-edit.component.html',
  styleUrl: './argument-string-edit.component.scss'
})
export class ArgumentStringEditComponent extends ArgumentComponent<StringArgumentOptions> {

  override update(options: SectionArgumentOptions<StringArgumentOptions>): void {
    
  }
}
