import { Component, inject, input } from '@angular/core';
import { Template } from '../../../../models/template.model';
import { SectionTemplate } from '../../../../models/section.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditmodeService } from '../../../../services/editmode.service';

@Component({
  selector: 'maxim-argument-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './argument-list.component.html',
  styleUrl: './argument-list.component.scss'
})
export class ArgumentListComponent {

  private readonly editmodeService = inject(EditmodeService);

  readonly template = input.required<Template | undefined>();
  readonly section = input.required<SectionTemplate | undefined>();

  isEditMode() {
    return this.editmodeService.editmode();
  }

  getArguments() {
    return this.section()?.arguments();
  }

  createArgument() {

  }
}