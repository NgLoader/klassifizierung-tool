import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SectionTemplate, SectionTemplateOptions } from '../../../../models/section.model';
import { ArgumentListComponent } from '../argument-list/argument-list.component';
import { SectionCreateComponent } from '../section-create/section-create.component';
import { Template } from './../../../../models/template.model';
import { EditmodeService } from '../../../../services/editmode.service';

@Component({
  selector: 'maxim-section-list',
  standalone: true,
  imports: [
    CommonModule,
    ArgumentListComponent,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss'
})
export class SectionListComponent {

  private readonly editmodeService = inject(EditmodeService);
  private readonly dialog = inject(MatDialog);

  readonly template = input.required<Template | undefined>();

  readonly sectionAccordion = viewChild.required('sectionList', { read: MatAccordion });

  readonly sectionCount = computed(() => this.getSections()?.length ?? 0);

  private step = 0;

  isEditMode() {
    return this.editmodeService.editmode();
  }

  openAllSections() {
    this.sectionAccordion().openAll();
  }

  closeAllSections() {
    this.sectionAccordion().closeAll();
  }

  getSections() {
    return this.template()?.sections();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  createSection(section?: SectionTemplate | SectionTemplateOptions) {
    this.dialog.open(SectionCreateComponent, {
      data: {
        template: this.template(),
        section
      }
    });
  }

  editSection(event: Event, section: SectionTemplate) {
    event.stopPropagation();
    this.createSection(section);
  }

  toggleSection(section: SectionTemplate, event: MatCheckboxChange) {
    section.enabled.set(event.checked);
  }

  moveSection(event: Event, section: SectionTemplate, direction: 'up' | 'down') {
    event.stopPropagation();
    const template = this.template();
    if (template) {
      const sections = template.sections();
      const index = sections.indexOf(section);
      if (index !== -1) {
        this.moveArray(sections, index, direction === 'up' ? (index - 1) : (index + 1));
      }
      template.sections.set(sections);
    }
  }

  cloneSection(event: Event, section: SectionTemplate) {
    event.stopPropagation();
    const template = this.template();
    if (template) {
      this.createSection(section.saveConfig());
    }
  }

  moveArray(array: (object | undefined)[], oldIndex: number, newIndex: number) {
    if (newIndex >= array.length) {
      let k = newIndex - array.length + 1;
      while (k--) {
        array.push(undefined);
      }
    }

    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
  }
}
