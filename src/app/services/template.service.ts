import { Injectable } from '@angular/core';

export interface Template {
  _id?: string;

  name: string;
  description: string;

  sections: TemplateSection[];
}

export interface TemplateSection {
  name: string;
  description: string;
  content: string;
  defaultEnabled: boolean;
  arguments: SectionArgument[];
}

export interface SectionArgument {
  type: string;
  name: string;
  key: string;
  option: string;
}

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
          const templates = this.parseTemplate(value);
          if (templates && templates.length > 0) {
            const template = templates[0];
            const key = storageKey.replace(this.storagePrefix, '');

            if (template._id === key) {
              this.templateList[key] = template;
            } else {
              console.log(`Updating outdatted template id '${key}' to '${template._id}'!`);
              localStorage.removeItem(storageKey);
              this.updateTemplate(template);
            }
          }
        }
      }
    }
  }

  getTemplate(key: string) {
    return this.templateList[key];
  }

  updateTemplate(template: Template) {
    let key = template._id;
    if (!key) {
      key = this.generateRandomId();
      template._id = key;
    }

    localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(template));
    this.templateList[key] = template;
  }

  removeTemplate(template: Template) {
    const key = template._id;
    if (key) {
      localStorage.removeItem(`${this.storagePrefix}${key}`);
      delete this.templateList[key];
    }
  }

  exportTemplate(template: Template) {
    const clone = Object.assign({}, template);
    delete clone._id;
    const exportString = JSON.stringify(clone);
    return exportString;
  }

  exportAllTemplates() {
    const templates: Template[] = [];
    for (const template of Object.values(this.templateList)) {
      const templateClone = Object.assign({}, template);
      delete templateClone._id;
      templates.push(templateClone);
    }

    const json = JSON.stringify({
      templates
    });
    return templates.length > 0 ? json : undefined;
  }

  parseTemplate(json: string): Template[] | undefined {
    const templates: Template[] = [];
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
          if (typeof(parse._id) !== 'string') {
            parse._id = this.generateRandomId();
          }

          templates.push(parse);
        }
      }
    } catch (error) {
      return undefined;
    }

    return templates;
  }

  validTemplate(template: Template): boolean {
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
