import { Injectable } from '@angular/core';
import { Template, TemplateOptions } from './../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private readonly storagePrefix = 'template-';

  private templateList: { [key: string]: Template } = {};

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
            this.templateList[key] = new Template(key, options);
          }
        }
      }
    }
  }

  createTemplate(options: TemplateOptions) {
    return new Template(this.generateRandomId(), options);
  }

  getTemplate(key: string) {
    return this.templateList[key];
  }

  saveTemplate(template: Template) {
    const key = template.id;
    const data = template.save();
    localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(data));
  }

  removeTemplate(template: Template) {
    const key = template.id;
    localStorage.removeItem(`${this.storagePrefix}${key}`);
    delete this.templateList[key];
  }

  resetTemplate(template: Template) {
    const storageContent = localStorage.getItem(`${this.storagePrefix}${template.id}`);
    if (!storageContent) {
      // TODO log error because no storage content was found
      return;
    }

    const options = this.parseTemplate(storageContent);
    if (options && options.length > 0) {
      template.load(options[0]);
    } else {
      // TODO log error because storage content is invalid
    }
  }

  exportTemplate(template: Template) {
    return JSON.stringify(template.save());
  }

  exportAllTemplates() {
    const templates: TemplateOptions[] = [];
    for (const template of Object.values(this.templateList)) {
      templates.push(template.save());
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

  getTemplateKeys() {
    return Object.keys(this.templateList);
  }

  getTemplateList() {
    return Object.values(this.templateList);
  }
}
