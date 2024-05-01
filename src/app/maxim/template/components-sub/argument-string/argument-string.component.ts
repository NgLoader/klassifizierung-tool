import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';
import { SectionArgument, Template, TemplateSection } from '../../../../services/template.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateArgumentComponent } from '../create-argument/create-argument.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'maxim-argument-string',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './argument-string.component.html',
  styleUrl: './argument-string.component.scss'
})
export class ArgumentStringComponent {

  private readonly dialog = inject(MatDialog);

  @Input() template!: Template;
  @Input() section!: TemplateSection;
  @Input() argument!: SectionArgument;

  @Output() valueChanged: EventEmitter<string> = new EventEmitter();

  updateArgument(event: Event) {
    event.stopPropagation();

    this.dialog.open(CreateArgumentComponent, {
      data: {
        template: this.template,
        section: this.section,
        argument: this.argument
      }
    });
  }

  
}
