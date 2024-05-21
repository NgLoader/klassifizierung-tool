import { Component, effect, input } from '@angular/core';
import { SectionTemplate } from '../section.model';
import { SectionArgument, SectionArgumentOptions } from '../argument.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule
  ],
  template: ''
})
export abstract class ArgumentComponent<TOptions> {

  readonly section = input.required<SectionTemplate>();
  readonly argument = input<SectionArgument<SectionArgumentOptions<TOptions>> | SectionArgumentOptions<TOptions> | undefined>();

  constructor() {
    effect(() => {
      const section = this.section();
      const argument = this.argument();
      if (section && argument) {
        if (argument instanceof SectionArgument) {
          this.update(argument.saveConfig() as SectionArgumentOptions<TOptions>);
        } else {
          this.update(argument);
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(options: SectionArgumentOptions<TOptions>): void {
  }
}