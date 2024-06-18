import { ComponentType } from '@angular/cdk/portal';
import { signal } from '@angular/core';
import { SectionTemplate } from '../../section.model';
import { ArgumentType } from '../argument-type.model';
import { SectionArgument, SectionArgumentOptions } from '../../argument.model';
import { ArgumentStringDisplayComponent } from './argument-string-display/argument-string-display.component';
import { ArgumentStringEditComponent } from './argument-string-edit/argument-string-edit.component';

export interface StringArgumentOptions {
  editable: boolean

  suggestion: string[]
  defaultSuggestion: number | undefined
}

export class StringArgument extends SectionArgument<StringArgumentOptions> {

  private _editable = signal<boolean>(false);
  readonly editable = this._editable.asReadonly();

  private _suggestion = signal<string[]>([]);
  readonly suggestion = this._suggestion.asReadonly();

  private _defaultSuggestion = signal<number | undefined>(undefined);
  readonly defaultSuggestion = this._defaultSuggestion.asReadonly();

  constructor(section: SectionTemplate, options: SectionArgumentOptions<StringArgumentOptions>) {
    super(section);

    // setup listener for save detection
    this.setup(options, () => {
      this.editable();
      this.suggestion();
      this.defaultSuggestion();
    });
  }

  override get type(): ArgumentType {
    return ArgumentType.string;
  }

  override getDisplayComponent(): ComponentType<object> {
    return ArgumentStringDisplayComponent;
  }

  override getEditComponent(): ComponentType<object> {
    return ArgumentStringEditComponent;
  }

  override replaceContent(content: string): string {
    return content.replaceAll(this.key(), this.value());
  }

  protected override load(options: StringArgumentOptions): void {
    this._editable.set(options.editable ?? true);
    this.setSuggestions(options.suggestion ?? []);
    this._defaultSuggestion.set(options.defaultSuggestion);

    const suggestions = this.suggestion();
    const suggestionIndex = this.defaultSuggestion();
    if (suggestionIndex && suggestions.length > suggestionIndex) {
      this.value.set(suggestions[suggestionIndex] ?? '');
    }
  }

  protected override save(): StringArgumentOptions {
    return {
      editable: this.editable(),
      suggestion: this.suggestion(),
      defaultSuggestion: this.defaultSuggestion()
    };
  }

  setEditable(editable: boolean) {
    this._editable.set(editable);
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

    this._suggestion.set([...suggestions]);
    this.setDefaultSuggestion(previousDefault, index);
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
      return;
    }

    const suggestions = this.suggestion();
    const index = suggestions.indexOf(suggestion) ?? previousIndex;
    if (index > -1) {
      this._defaultSuggestion.set(index);
    }
  }
}