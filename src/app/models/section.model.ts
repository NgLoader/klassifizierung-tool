import { Signal, effect, signal } from '@angular/core';
import { StringArgument, StringArgumentOptions } from './arguments/string/argument-string.model';
import { ArgumentType } from './arguments/argument-type.model';
import { SectionArgument, SectionArgumentOptions } from './argument.model';
import { Template } from './template.model';

export interface SectionTemplateOptions {
  name: string
  description: string
  content: string
  defaultEnabled: boolean
  arguments: SectionArgumentOptions<object>[]
}

export class SectionTemplate {

  readonly template: Signal<Template>;

  readonly name = signal('');
  // readonly name = this._name.asReadonly();

  readonly description = signal('');
  // readonly description = this._description.asReadonly();

  readonly content = signal('');
  // readonly content = this._content.asReadonly();

  readonly defaultEnabled = signal(false);
  // readonly defaultEnabled = this._defaultEnabled.asReadonly();

  private readonly _arguments = signal<SectionArgument<object>[]>([]);
  readonly arguments = this._arguments.asReadonly();

  private ignoreFirstCall: boolean = true;

  // Temp variables
  readonly enabled = signal(this.defaultEnabled());

  constructor(template: Template, options: SectionTemplateOptions) {
    this.template = signal(template).asReadonly();
    this.loadConfig(options);

    effect(() => {
      // ignore initalize call
      if (this.ignoreFirstCall) {
        this.ignoreFirstCall = false;

        // enable change listener
        this.name();
        this.description();
        this.content();
        this.defaultEnabled();
        this.arguments();
        return;
      }

      this.template().saveToLocalStorage();
    });
  }

  private constructArgument(options: SectionArgumentOptions<object>) {
    return this.template().service().runInInjectionContext(() => {
      switch (options.type) {
        case ArgumentType.string:
          return new StringArgument(this, options as SectionArgumentOptions<StringArgumentOptions>);

        default: throw `Argument type ${options.type} is not registered!`;
      }
    });
  }

  createArgument(options: SectionArgumentOptions<object>) {
    const argument = this.constructArgument(options);
    const argumentList = this.arguments();
    this._arguments.set([ ...argumentList, argument ]);
  }

  removeArgument(argument: SectionArgument<object>) {
    const argumentList = this.arguments();
    const index = argumentList.indexOf(argument);
    if (index !== -1) {
      argumentList.splice(index, 1);
    }
    this._arguments.set([...argumentList]);
  }

  loadConfig(options: SectionTemplateOptions) {
    this.name.set(options.name);
    this.description.set(options.description);
    this.content.set(options.content);
    this.defaultEnabled.set(options.defaultEnabled);

    this.enabled.set(this.defaultEnabled());

    const argumentList: SectionArgument<object>[] = [];
    for (const argumentOptions of options.arguments) {
      const argument = this.constructArgument(argumentOptions);
      argumentList.push(argument);
      this.createArgument(argumentOptions);
    }
    this._arguments.set([...argumentList]);
  }

  saveConfig(): SectionTemplateOptions {
    return {
      name: this.name(),
      description: this.description(),
      content: this.content(),
      defaultEnabled: this.defaultEnabled(),
      arguments: this.arguments().map(argument => argument.saveConfig())
    };
  }
}