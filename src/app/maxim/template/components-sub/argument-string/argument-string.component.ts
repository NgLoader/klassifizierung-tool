import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { SectionArgument, Template, TemplateSection } from '../../../../services/template.service';
import { CreateArgumentComponent } from '../create-argument/create-argument.component';

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

  @ViewChild('input', { static: true }) inputElement?: ElementRef<MatInput>;

  changeArgument() {
    if (this.inputElement) {
      this.valueChanged.emit(this.inputElement.nativeElement.value);
    }
  }

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
