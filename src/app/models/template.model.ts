import { Signal, effect, signal } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { SectionTemplate, SectionTemplateOptions } from './section.model';

export interface TemplateOptions {
  name: string
  description: string
  sections: SectionTemplateOptions[]
}

export class Template {

  readonly service: Signal<TemplateService>;
  readonly id: Signal<string>;

  readonly name = signal('');
  readonly description = signal('');

  readonly sections = signal<SectionTemplate[]>([]);

  private ignoreFirstCall: boolean = true;

  constructor(service: TemplateService, id: string, options: TemplateOptions) {
    this.service = signal(service).asReadonly();
    this.id = signal(id).asReadonly();

    if (options) {
      this.loadConfig(options);
    }

    effect(() => {
      // ignore initalize call
      if (this.ignoreFirstCall) {
        this.ignoreFirstCall = false;

        // enable change listener
        this.name();
        this.description();
        this.sections();
        return;
      }

      this.service().saveTemplate(this);
    });
  }

  createSection(options: SectionTemplateOptions) {
    const section = this.service().runInInjectionContext(() => new SectionTemplate(this, options));

    const sections = this.sections();
    this.sections.set([ ...sections, section ]);
  }

  removeSection(section: SectionTemplate) {
    const sections = this.sections();
    const index = sections.indexOf(section);
    if (index !== -1) {
      sections.splice(index, 1);
    }
    this.sections.set([...sections]);
  }

  loadConfig(options: TemplateOptions) {
    this.name.set(options.name);
    this.description.set(options.description);

    const sectionList: SectionTemplate[] = [];
    for (const sectionOptions of options.sections) {
      const section = new SectionTemplate(this, sectionOptions);
      sectionList.push(section);
    }
    this.sections.set([...sectionList]);
  }

  saveConfig(): TemplateOptions {
    return {
      name: this.name(),
      description: this.description(),
      sections: this.sections().map(section => section.saveConfig())
    };
  }

  saveToLocalStorage() {
    this.service().saveTemplate(this);
  }
}