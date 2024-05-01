import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Template, TemplateService } from '../../services/template.service';

import { MatCardModule } from '@angular/material/card';
import { CreateTemplateComponent } from '../../dialog/create-template/create-template.component';
import { DeleteTemplateComponent } from '../../dialog/delete-template/delete-template.component';
import { DownloadService } from '../../services/download.service';


@Component({
  selector: 'maxim-dashboard',
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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export default class DashboardComponent {

  private readonly templateService = inject(TemplateService);
  private readonly downloadService = inject(DownloadService);

  private readonly dialog = inject(MatDialog);

  getTemplates() {
    return this.templateService.getTemplateList();
  }

  editTemplate(template: Template) {
    this.dialog.open(CreateTemplateComponent, {
      data: {
        template
      }
    });
  }

  exportTemplate(template: Template) {
    const jsonTemplate = this.templateService.exportTemplate(template);
    this.downloadService.downloadJson(`${template.name}.json`, jsonTemplate);
  }

  deleteTemplate(template: Template) {
    this.dialog.open(DeleteTemplateComponent, {
      data: {
        template
      }
    });
  }
}
