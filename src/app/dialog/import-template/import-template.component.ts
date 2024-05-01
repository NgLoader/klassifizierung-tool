import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { TemplateService } from '../../services/template.service';
import { DeleteTemplateComponent } from '../delete-template/delete-template.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'maxim-import-template',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './import-template.component.html',
  styleUrl: './import-template.component.scss'
})
export class ImportTemplateComponent {

  private readonly templateService = inject(TemplateService);

  private readonly dialogRef = inject(MatDialogRef<DeleteTemplateComponent>);
  private readonly snackbar = inject(MatSnackBar);

  @ViewChild(MatInput, { static: true }) textfield?: MatInput;

  importFromFile() {

  }

  importTemplate() {
    const value = this.textfield?.value;
    if (value && typeof(value) === 'string' && value.trim().length > 0) {
      const result = this.templateService.parseTemplate(value);
      if (result) {
        if (result.length > 0) {
          this.dialogRef.close();
          for (const template of result) {
            this.templateService.updateTemplate(template);
          }

          this.snackbar.open(`Successful inserted ${result.length} templates.`);
        } else {
          this.snackbar.open('No templates found in json file!');
        }
      } else {
        this.snackbar.open('Unable to parse input content!');
      }
    } else {
      this.snackbar.open('Please enter a valid json file!');
    }
  }
}
