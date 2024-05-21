import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteTemplateComponent } from '../../../../dialog/delete-template/delete-template.component';
import { SectionTemplate, SectionTemplateOptions } from '../../../../models/section.model';
import { Template } from '../../../../models/template.model';

@Component({
  selector: 'maxim-section-create',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './section-create.component.html',
  styleUrl: './section-create.component.scss'
})
export class SectionCreateComponent implements OnInit {

  private readonly dialogRef = inject(MatDialogRef<DeleteTemplateComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);

  private readonly snackbar = inject(MatSnackBar);

  readonly template = signal<Template | undefined>(undefined);
  readonly section = signal<SectionTemplate | SectionTemplateOptions | undefined>(undefined);

  readonly inputName = viewChild.required('name', { read: ElementRef<MatInput> });
  readonly inputDescription = viewChild.required('description', { read: ElementRef<MatInput> });
  readonly inputContent = viewChild.required('content', { read: ElementRef<MatInput> });
  readonly checkboxDefaultEnabled = viewChild.required('defaultEnabled', { read: MatCheckbox });

  constructor() {
    effect(() => {
      const template = this.template();
      const section = this.section();
      if (template && section) {
        if (section instanceof SectionTemplate) {
          // load from initalized section object
          this.inputName().nativeElement.value = section.name();
          this.inputDescription().nativeElement.value = section.description();
          this.inputContent().nativeElement.value = section.content();
          this.checkboxDefaultEnabled().checked = section.defaultEnabled();
        } else {
          // load from config
          this.inputName().nativeElement.value = section.name;
          this.inputDescription().nativeElement.value = section.description;
          this.inputContent().nativeElement.value = section.content;
          this.checkboxDefaultEnabled().checked = section.defaultEnabled;
        }
      }
    });
  }

  ngOnInit(): void {
    this.template.set(this.dialogData.template);
    this.section.set(this.dialogData.section);
  }

  getTitle() {
    const section = this.section();
    return section instanceof SectionTemplate ? `Update ${section.name()}` : 'Create section';
  }

  getFinishButtonName() {
    return this.section() instanceof SectionTemplate ? 'Update' : 'Create';
  }

  showDeleteButton() {
    return this.section() instanceof SectionTemplate;
  }

  deleteSection() {
    const template = this.template();
    const section = this.section();
    if (template && section instanceof SectionTemplate) {
      template.removeSection(section);
      this.dialogRef.close();
      this.snackbar.open('Deleted.');
    } else {
      this.snackbar.open('Unable to delete section!');
    }
  }

  updateSection() {
    const name = this.inputName().nativeElement.value;
    const description = this.inputDescription().nativeElement.value ?? '';
    const content = this.inputContent().nativeElement.value ?? '';
    const defaultEnabled = this.checkboxDefaultEnabled().checked ?? false;
    if (!(typeof(name) === 'string' && name.length > 0)) {
      this.snackbar.open('Name must be at least 1 characters long!');
      return;
    }
  
    const section = this.section();
    if (section instanceof SectionTemplate) {
      section.name.set(name);
      section.description.set(description);
      section.content.set(content);
      section.defaultEnabled.set(defaultEnabled);
      this.snackbar.open('Section updated.');
    } else {
      const template = this.template();
      if (template) {
        template.createSection({
          name,
          description,
          content,
          defaultEnabled: defaultEnabled ?? false,
          arguments: []
        });
        this.snackbar.open('Section created.');
      }
    }

    this.dialogRef.close();
  }
}
