import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportTemplateComponent } from '../../dialog/import-template/import-template.component';
import { DownloadService } from '../../services/download.service';
import { CreateTemplateComponent } from '../../dialog/create-template/create-template.component';

@Component({
  selector: 'maxim-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {

  private readonly templateService = inject(TemplateService);
  private readonly downloadService = inject(DownloadService);

  private readonly snackbar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  createTemplate() {
    this.dialog.open(CreateTemplateComponent);
  }

  openImport() {
    this.dialog.open(ImportTemplateComponent);
  }

  exportAll() {
    const jsonTemplate = this.templateService.exportAllTemplates();
    if (jsonTemplate) {
      this.downloadService.downloadJson(`export-all.json`, jsonTemplate);
    } else {
      this.snackbar.open('You need to have at least one template!');
    }
  }
}
