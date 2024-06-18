import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../services/template.service';
import { DeleteTemplateComponent } from '../delete-template/delete-template.component';
import { Template } from './../../models/template.model';

@Component({
  selector: 'maxim-create-template',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './create-template.component.html',
  styleUrl: './create-template.component.scss'
})
export class CreateTemplateComponent implements OnInit {

  private readonly dialogRef = inject(MatDialogRef<DeleteTemplateComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);

  private readonly templateService = inject(TemplateService);
  private readonly snackbar = inject(MatSnackBar);

  readonly inputName = viewChild.required('name', { read: ElementRef<MatInput> });
  readonly inputDescription = viewChild.required('description', { read: ElementRef<MatInput> });

  readonly template = signal<Template | undefined>(undefined);

  constructor() {
    effect(() => {
      const template = this.template();
      if (template) {
        this.inputName().nativeElement.value = template.name();
        this.inputDescription().nativeElement.value = template.description();
      }
    });
  }

  ngOnInit(): void {
    this.template.set(this.dialogData?.template ?? undefined);
  }

  getTitle() {
    const template = this.template();
    return template ? `Update ${template.name()}` : 'Create template';
  }

  getFinishButtonName() {
    return this.template() ? 'Update' : 'Create';
  }

  updateTemplate() {
    const name = this.inputName().nativeElement.value;
    const description = this.inputDescription().nativeElement.value;
    if (!(typeof(name) === 'string' && name.length > 0)) {
      this.snackbar.open('Name must be at least 1 characters long!');
      return;
    }

    const template = this.template();
    if (template) {
      template.name.set(name);
      template.description.set(description ?? '');
      this.snackbar.open('Template updated.');
    } else {
      this.templateService.createTemplate({
        name: name,
        description: description,
        sections: []
      });
      this.snackbar.open('Template created.');
    }

    this.dialogRef.close();
  }
}
