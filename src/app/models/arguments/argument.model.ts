import { EventEmitter, signal } from '@angular/core';
import { SectionTemplate } from '../section.model';
import { ArgumentList as ArgumentType } from './argument-list.model';

export interface SectionArgumentOptions {
  name: string
  key: string
  data: object
}

export abstract class SectionArgument<TOptions> {

  private _section: SectionTemplate;

  private _name = signal('');
  readonly name = this._name.asReadonly();

  private _key = signal('');
  readonly key = this._key.asReadonly();

  readonly changeEvent = new EventEmitter();

  protected abstract loadOptions(options: TOptions): void;
  protected abstract saveOptions(): TOptions;

  abstract get type(): ArgumentType;

  constructor(section: SectionTemplate) {
    this._section = section;
  }

  setName(name: string) {
    this._name.set(name);
    this.changeEvent.emit();
  }

  setKey(key: string) {
    this._key.set(key);
    this.changeEvent.emit();
  }

  load(options: SectionArgumentOptions) {
    // TODO validate and throw error
    this._name.set(options.name);
    this._key.set(options.key);
    this.loadOptions(options as TOptions);
  }

  save(): SectionArgumentOptions {
    try {
      return {
        name: this.name(),
        key: this.key(),
        data: this.saveOptions() as object
      };
    } finally {
      this.changeEvent.emit();
    }
  }

  get section() {
    return this._section;
  }

  get template() {
    return this.section.template;
  }
}