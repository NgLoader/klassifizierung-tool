import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Template, TemplateService } from '../../services/template.service';
import { DeleteTemplateComponent } from '../delete-template/delete-template.component';

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

  private readonly templateService = inject(TemplateService);

  private readonly dialogRef = inject(MatDialogRef<DeleteTemplateComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);

  private readonly snackbar = inject(MatSnackBar);

  private template?: Template;

  @ViewChild('name', { static: true }) inputName?: ElementRef<MatInput>;

  @ViewChild('description', { static: true }) inputDescription?: ElementRef<MatInput>;

  ngOnInit(): void {
    this.template = this.dialogData?.template ?? undefined;

    if (this.template && this.inputName && this.inputDescription) {
      this.inputName.nativeElement.value = this.template.name;
      this.inputDescription.nativeElement.value = this.template.description;
    }
  }

  getTitle() {
    return this.template ? `Update ${this.template.name}` : 'Create template';
  }

  getFinishButtonName() {
    return this.template ? 'Update' : 'Create';
  }

  updateTemplate() {
    const name = this.inputName?.nativeElement.value;
    const description = this.inputDescription?.nativeElement.value;
    if (!(typeof(name) === 'string' && name.length > 5)) {
      this.snackbar.open('Name must be at least 6 characters long!');
      return;
    }
    if (!(typeof(description) === 'string' && description.length > 5)) {
      this.snackbar.open('Description must be at least 6 characters long!');
      return;
    }

    if (this.template) {
      this.template.name = name;
      this.template.description = description;
      this.templateService.updateTemplate(this.template);
      this.snackbar.open('Template updated.');
    } else {
      this.templateService.updateTemplate({
        name,
        description,
        sections: []
      });
      this.snackbar.open('Template created.');
    }

    this.dialogRef.close();
  }
}
