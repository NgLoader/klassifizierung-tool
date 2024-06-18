import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { SectionArgument } from '../argument.model';
import { SectionTemplate } from '../section.model';

@Component({
  standalone: true,
  imports: [
    CommonModule
  ],
  template: ''
})
export abstract class ArgumentDisplayComponent<TArgument extends SectionArgument<object>> {

  readonly section = input.required<SectionTemplate>();
  readonly argument = input.required<TArgument>();
}