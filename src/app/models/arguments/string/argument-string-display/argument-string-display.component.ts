import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map, startWith } from 'rxjs';
import { ArgumentDisplayComponent } from '../../argument-display-component';
import { StringArgument } from '../argument-string.model';
import { EditmodeService } from '../../../../services/editmode.service';

@Component({
  selector: 'maxim-argument-string-display',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    AsyncPipe
  ],
  templateUrl: './argument-string-display.component.html',
  styleUrl: './argument-string-display.component.scss'
})
export class ArgumentStringDisplayComponent extends ArgumentDisplayComponent<StringArgument> {

  private readonly editmodeService = inject(EditmodeService);

  readonly control = new FormControl('');

  suggestions = signal<string[]>([]);
  suggestionFiltered = this.control.valueChanges.pipe(
    startWith(this.control.value),
    map(this.filterSuggestions.bind(this)));

  private filterSuggestions(value: string | null) {
    const valueLowerCase = (value ?? '').toLowerCase();
    return this.suggestions().filter(suggestion => suggestion.toLowerCase().includes(valueLowerCase));
  }

  constructor() {
    super();

    effect(() => {
      const section = this.section();
      const argument = this.argument();
      if (section && argument) {
        untracked(() => this.suggestions.set(this.argument().suggestion()));
      }
    });
  }

  isEditMode() {
    return this.editmodeService.editmode();
  }

  isInputEditable() {
    return this.argument().editable();
  }

  getName() {
    return this.argument().name();
  }

  getDefaultInput() {
    const suggestions = this.argument().suggestion();
    const suggestionIndex = this.argument().defaultSuggestion();
    if (suggestions && suggestionIndex && suggestions.length > suggestionIndex) {
      return suggestions[suggestionIndex];
    }
    return undefined;
  }
}
