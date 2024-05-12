import { EventEmitter, signal } from '@angular/core';
import { SectionTemplate, SectionTemplateOptions } from './section.model';

export interface TemplateOptions {
  name: string
  description: string
  sections: SectionTemplateOptions[]
}

export class Template {

  private _id: string;

  private _name = signal('');
  readonly name = this._name.asReadonly();

  private _description = signal('');
  readonly description = this._description.asReadonly();

  private _sections = signal<SectionTemplate[]>([]);
  private sections = this._sections.asReadonly();

  readonly changeEvent = new EventEmitter();

  constructor(id: string, options: TemplateOptions) {
    this._id = id;

    if (options) {
      this.load(options);
    }
  }

  setName(name: string) {
    this._name.set(name);
    this.changeEvent.emit();
  }

  setDescription(description: string) {
    this._description.set(description);
    this.changeEvent.emit();
  }

  load(options: TemplateOptions) {
    // TODO validate and throw error
    this._name.set(options.name);
    this._description.set(options.description);

    const sectionList: SectionTemplate[] = [];
    for (const sectionOptions of options.sections) {
      const section = new SectionTemplate(this);
      section.load(sectionOptions);
      sectionList.push(section);
    }
    this._sections.set(sectionList);
  }

  save(): TemplateOptions {
    try {
      return {
        name: this.name(),
        description: this.description(),
        sections: this.sections().map(section => section.save())
      };
    } finally {
      this.changeEvent.emit();
    }
  }

  get id() {
    return this._id;
  }
}