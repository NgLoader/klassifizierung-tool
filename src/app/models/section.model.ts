import { EventEmitter, signal } from '@angular/core';
import { SectionArgument, SectionArgumentOptions } from './arguments/argument.model';
import { StringArgument } from './arguments/argument-string.model';
import { Template } from './template.model';

export interface SectionTemplateOptions {
  name: string
  description: string
  content: string
  defaultEnabled: boolean
  arguments: SectionArgumentOptions[]
}

export class SectionTemplate {

  private _template: Template;

  private _name = signal('');
  readonly name = this._name.asReadonly();

  private _description = signal('');
  readonly description = this._description.asReadonly();

  private _content = signal('');
  readonly content = this._content.asReadonly();

  private _enabled = signal(false);
  readonly enabled = this._enabled.asReadonly();

  private _arguments = signal<SectionArgument<object>[]>([]);
  private arguments = this._arguments.asReadonly();

  readonly changeEvent = new EventEmitter();

  constructor(template: Template) {
    this._template = template;
  }

  setName(name: string) {
    this._name.set(name);
    this.changeEvent.emit();
  }

  setDescription(description: string) {
    this._description.set(description);
    this.changeEvent.emit();
  }

  setContent(content: string) {
    this._content.set(content);
    this.changeEvent.emit();
  }

  setEnabled(enabled: boolean) {
    this._enabled.set(enabled);
    this.changeEvent.emit();
  }

  load(options: SectionTemplateOptions) {
    // TODO validate and throw error
    this._name.set(options.name);
    this._description.set(options.description);
    this._content.set(options.content);
    this._enabled.set(options.defaultEnabled);

    const argumentList: SectionArgument<object>[] = [];
    for (const argumentOptions of options.arguments) {
      const argument = new StringArgument(this);
      argument.load(argumentOptions);
      argumentList.push(argument);
    }
    this._arguments.set(argumentList);
  }

  save(): SectionTemplateOptions {
    try {
      return {
        name: this.name(),
        description: this.description(),
        content: this.content(),
        defaultEnabled: this.enabled(),
        arguments: this.arguments().map(argument => argument.save())
      };
    } finally {
      this.changeEvent.emit();
    }
  }

  get template() {
    return this._template;
  }
}