import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TemplateService } from '../../services/template.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'maxim-delete-template',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-template.component.html',
  styleUrl: './delete-template.component.scss'
})
export class DeleteTemplateComponent {

  private readonly templateService = inject(TemplateService);

  private readonly dialogRef = inject(MatDialogRef<DeleteTemplateComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);

  private readonly snackbar = inject(MatSnackBar);

  getName() {
    return this.dialogData.template.name;
  }

  deleteTemplate() {
    this.dialogRef.close();
    this.templateService.removeTemplate(this.dialogData.template);
    this.snackbar.open('Deleted');
  }
}
