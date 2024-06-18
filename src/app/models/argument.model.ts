import { Signal, effect, signal } from '@angular/core';
import { SectionTemplate } from './section.model';
import { ArgumentType } from './arguments/argument-type.model';
import { ComponentType } from '@angular/cdk/portal';

export interface SectionArgumentOptions<T> {
  name: string
  key: string
  type: ArgumentType
  data: T
}

export abstract class SectionArgument<TOptions> {

  readonly section: Signal<SectionTemplate>;

  readonly name = signal('');
  readonly key = signal('');

  readonly value = signal('');

  private ignoreFirstCall: boolean = true;

  constructor(section: SectionTemplate) {
    this.section = signal(section).asReadonly();
  }

  abstract get type(): ArgumentType;
  
  abstract getDisplayComponent(): ComponentType<object>;
  abstract getEditComponent(): ComponentType<object>;
  abstract replaceContent(content: string): string;

  protected abstract load(options: TOptions): void;
  protected abstract save(): TOptions;

  protected setup(options: SectionArgumentOptions<TOptions>, effectListener: () => void) {
    this.loadConfig(options);

    effect(() => {
      // ignore initalize call
      if (this.ignoreFirstCall) {
        this.ignoreFirstCall = false;

        // enable change listener
        this.name();
        this.key();
        effectListener();
        return;
      }

      console.log('SAVE CALLED argument2', this.name());
      this.section().template().saveToLocalStorage();
    });
  }

  loadConfig(options: SectionArgumentOptions<TOptions>) {
    this.name.set(options.name);
    this.key.set(options.key);
    this.load(options as TOptions);
  }

  saveConfig(): SectionArgumentOptions<TOptions> {
    return {
      name: this.name(),
      key: this.key(),
      type: this.type,
      data: this.save()
    };
  }
}