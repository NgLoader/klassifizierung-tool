import { signal } from '@angular/core';
import { ArgumentList } from './argument-list.model';
import { SectionArgument } from './argument.model';

export interface StringArgumentOptions {
  value: string

  suggestion: string[]
  defaultSuggestion: number | undefined
}

export class StringArgument extends SectionArgument<StringArgumentOptions> {

  private _value = signal('');
  readonly value = this._value.asReadonly();

  private _suggestion = signal<string[]>([]);
  readonly suggestion = this._suggestion.asReadonly();

  private _defaultSuggestion = signal<number | undefined>(undefined);
  readonly defaultSuggestion = this._defaultSuggestion.asReadonly();

  setValue(value: string) {
    this._value.set(value);
    this.changeEvent.emit();
  }

  setSuggestions(suggestions: string[]) {
    const index = this._defaultSuggestion();
    let previousDefault: string | undefined;
    if (index) {
      const previous = this.suggestion();
      if (previous.length >= index) {
        previousDefault = previous[index];
      }
    }

    this._suggestion.set(suggestions);
    this.setDefaultSuggestion(previousDefault, index);
    // already called by setDefaultSuggestion
    // this.changeEvent.emit();
  }

  addSuggestion(suggestion: string) {
    this.setSuggestions([
      ... this.suggestion(),
      suggestion
    ]);
  }

  removeSuggestion(suggestion: string) {
    const suggestions = this.suggestion();
    const index = suggestions.indexOf(suggestion);
    if (index > -1) {
      suggestions.slice(index, 1);
      this.setSuggestions(suggestions);
    }
  }

  clearSuggestions() {
    this.setSuggestions([]);
  }

  setDefaultSuggestion(suggestion: string | undefined, previousIndex: number = -1) {
    if (!suggestion) {
      this._defaultSuggestion.set(undefined);
      this.changeEvent.emit();
      return;
    }

    const suggestions = this.suggestion();
    const index = suggestions.indexOf(suggestion) ?? previousIndex;
    if (index > -1) {
      this._defaultSuggestion.set(index);
      this.changeEvent.emit();
    }
  }

  protected override loadOptions(options: StringArgumentOptions): void {
    this._value.set(options.value ?? '');
    this._suggestion.set(options.suggestion ?? []);
  }

  protected override saveOptions(): StringArgumentOptions {
    return {
      value: this.value(),
      suggestion: this.suggestion(),
      defaultSuggestion: this.defaultSuggestion()
    };
  }

  override get type(): ArgumentList {
    return ArgumentList.string;
  }

}