import { EnvironmentInjector, Injectable, computed, inject, runInInjectionContext, signal } from '@angular/core';
import { Template, TemplateOptions } from './../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private readonly injector = inject(EnvironmentInjector);

  private readonly storagePrefix = 'template-';

  private _templates = signal<Template[]>([]);
  readonly templates = this._templates.asReadonly();

  readonly templateCount = computed(() => this.templates.length);

  constructor() {
    this.loadTemplates();
  }

  private generateRandomId() {
    let key;
    do {
      key = 'xxxxxxxx'.replace(/[xy]/g, function() {
        const r = Math.random() * 16 | 0;
        return r.toString(16);
      });
    } while (localStorage.getItem(key) != undefined);
    return key;
  }

  private loadTemplates() {
    const storageLength = localStorage.length;
    for (let index = 0; index < storageLength; index++) {
      const storageKey = localStorage.key(index);
      if (storageKey?.startsWith(this.storagePrefix)) {
        const value = localStorage.getItem(storageKey);
        if (value) {
          const templateOptions = this.parseTemplate(value);
          if (templateOptions && templateOptions.length > 0) {
            const options = templateOptions[0];
            const key = storageKey.replace(this.storagePrefix, '');
            const template = new Template(this, key, options);
            this.addTemplate(template);
          }
        }
      }
    }
  }

  private addTemplate(template: Template) {
    this._templates.set([ template, ...this.templates() ]);
  }

  createTemplate(options: TemplateOptions): Template {
    const template = this.runInInjectionContext(() => {
      return new Template(this, this.generateRandomId(), options);
    });
    this.saveTemplate(template);
    this.addTemplate(template);
    return template;
  }

  saveTemplate(template: Template) {
    const key = template.id();
    const data = template.saveConfig();
    localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(data));
  }

  resetTemplate(template: Template) {
    const storageContent = localStorage.getItem(`${this.storagePrefix}${template.id()}`);
    if (!storageContent) {
      // TODO log error because no storage content was found
      return;
    }

    const options = this.parseTemplate(storageContent);
    if (options && options.length > 0) {
      template.loadConfig(options[0]);
    } else {
      // TODO log error because storage content is invalid
    }
  }

  exportTemplate(template: Template) {
    return JSON.stringify(template.saveConfig());
  }

  exportAllTemplates() {
    const templates: TemplateOptions[] = [];
    for (const template of this.templates()) {
      templates.push(template.saveConfig());
    }

    const json = JSON.stringify({
      templates
    });
    return templates.length > 0 ? json : undefined;
  }

  parseTemplate(json: string): TemplateOptions[] | undefined {
    const templates: TemplateOptions[] = [];
    try {
      const parse = JSON.parse(json);

      if (parse.templates && typeof(parse.templates) === 'object') {
        for (const template of parse.templates) {
          if (this.validTemplate(template)) {
            templates.push(template);
          }
        }
      } else if (parse.name && typeof(parse.name) === 'string') {
        if (this.validTemplate(parse)) {
          templates.push(parse);
        }
      }
    } catch (error) {
      return undefined;
    }

    return templates;
  }

  validTemplate(template: TemplateOptions): boolean {
    if (template.name && template.description) {
      return true;
    }
    return false;
  }

  removeTemplate(template: Template) {
    const key = template.id();
    localStorage.removeItem(`${this.storagePrefix}${key}`);

    const templates = this.templates();
    const index = templates.indexOf(template);
    if (index !== -1) {
      templates.splice(index, 1);
    }
    this._templates.set(templates);
  }

  getTemplate(id: string) {
    return this.templates().find(template => template.id() === id);
  }

  runInInjectionContext<T>(fn: () => T): T {
    return runInInjectionContext(this.injector, fn);
  }
}
