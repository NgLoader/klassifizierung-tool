import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SectionArgument, Template, TemplateSection } from '../../../../services/template.service';
import { CreateArgumentComponent } from '../create-argument/create-argument.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'maxim-argument-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './argument-select.component.html',
  styleUrl: './argument-select.component.scss'
})
export class ArgumentSelectComponent implements OnInit {

  private readonly dialog = inject(MatDialog);

  @Input() template!: Template;
  @Input() section!: TemplateSection;
  @Input() argument!: SectionArgument;

  @Output() valueChanged: EventEmitter<string> = new EventEmitter();

  keywords: string[] = [];
  selected: string = '';

  ngOnInit(): void {
    const options: { keywords: string[]; default: string } = JSON.parse(this.argument.option);
    this.keywords = [...options.keywords];
    this.selected = options.default;
    this.changeArgument();
  }

  changeArgument() {
    this.valueChanged.emit(this.selected);
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
