import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Template, TemplateSection, TemplateService } from '../../../../services/template.service';
import { DeleteTemplateComponent } from '../../../../dialog/delete-template/delete-template.component';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'maxim-create-section',
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
  templateUrl: './create-section.component.html',
  styleUrl: './create-section.component.scss'
})
export class CreateSectionComponent implements OnInit {

  private readonly templateService = inject(TemplateService);

  private readonly dialogRef = inject(MatDialogRef<DeleteTemplateComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);

  private readonly snackbar = inject(MatSnackBar);

  private template?: Template;
  private templateSection?: TemplateSection;

  @ViewChild('name', { static: true }) inputName?: ElementRef<MatInput>;
  @ViewChild('description', { static: true }) inputDescription?: ElementRef<MatInput>;
  @ViewChild('content', { static: true }) inputContent?: ElementRef<MatInput>;
  @ViewChild('defaultEnabled', { static: true }) checkboxDefaultEnabled?: MatCheckbox;

  ngOnInit(): void {
    this.template = this.dialogData?.template ?? undefined;
    this.templateSection = this.dialogData?.section ?? undefined;

    if (this.templateSection && this.inputName && this.inputDescription && this.inputContent && this.checkboxDefaultEnabled) {
      this.inputName.nativeElement.value = this.templateSection.name;
      this.inputDescription.nativeElement.value = this.templateSection.description;
      this.inputContent.nativeElement.value = this.templateSection.content;
      this.checkboxDefaultEnabled.checked = this.templateSection.defaultEnabled;
    }
  }

  getTitle() {
    return this.templateSection ? `Update ${this.templateSection.name}` : 'Create section';
  }

  getFinishButtonName() {
    return this.templateSection ? 'Update' : 'Create';
  }

  showDeleteButton() {
    return this.templateSection;
  }

  deleteArgument() {
    if (this.templateSection) {
      const index = this.template?.sections.indexOf(this.templateSection) ?? -1;
      if (index !== -1) {
        this.template?.sections.splice(index, 1);
        this.templateService.updateTemplate(this.template!);

        this.dialogRef.close();
        this.snackbar.open('Deleted.');
        return;
      }
    }

    this.snackbar.open('Unable to delete section!');
  }

  updateSection() {
    const name = this.inputName?.nativeElement.value;
    const description = this.inputDescription?.nativeElement.value;
    const content = this.inputContent?.nativeElement.value;
    const defaultEnabled = this.checkboxDefaultEnabled?.checked;
    if (!(typeof(name) === 'string' && name.length > 0)) {
      this.snackbar.open('Name must be at least 1 characters long!');
      return;
    }
    if (!(typeof(description) === 'string' && description.length > 0)) {
      this.snackbar.open('Description must be at least 1 characters long!');
      return;
    }
    if (!(typeof(content) === 'string' && content.length > 0)) {
      this.snackbar.open('Content must be at least 1 characters long!');
      return;
    }

    if (!this.template) {
      this.snackbar.open('Unable to find template reference!');
      return;
    }
  
    if (this.templateSection) {
      this.templateSection.name = name;
      this.templateSection.description = description;
      this.templateSection.content = content;
      this.templateSection.defaultEnabled = defaultEnabled ?? false;
      this.templateService.updateTemplate(this.template);
      this.snackbar.open('Section updated.');
    } else {
      const section = {
        name,
        description,
        content,
        defaultEnabled: defaultEnabled ?? false,
        arguments: []
      };

      if (this.template.sections) {
        this.template.sections.push(section);
      } else {
        this.template.sections = [section];
      }

      this.templateService.updateTemplate(this.template);
      this.snackbar.open('Section created.');
    }

    this.dialogRef.close();
  }
}