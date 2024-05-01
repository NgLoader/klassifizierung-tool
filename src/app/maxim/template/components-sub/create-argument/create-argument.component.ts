import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteTemplateComponent } from '../../../../dialog/delete-template/delete-template.component';
import { SectionArgument, Template, TemplateSection, TemplateService } from '../../../../services/template.service';

@Component({
  selector: 'maxim-create-argument',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './create-argument.component.html',
  styleUrl: './create-argument.component.scss'
})
export class CreateArgumentComponent implements OnInit {

  private readonly templateService = inject(TemplateService);

  private readonly dialogRef = inject(MatDialogRef<DeleteTemplateComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);

  private readonly snackbar = inject(MatSnackBar);

  private template?: Template;
  private templateSection?: TemplateSection;
  private templateArgument?: SectionArgument;

  @ViewChild('type', { static: true }) inputType?: MatSelect;
  @ViewChild('key', { static: true }) inputKey?: ElementRef<MatInput>;
  @ViewChild('name', { static: true }) inputName?: ElementRef<MatInput>;
  @ViewChild('value', { static: true }) inputValue?: ElementRef<MatInput>;

  ngOnInit(): void {
    this.template = this.dialogData?.template ?? undefined;
    this.templateSection = this.dialogData?.section ?? undefined;
    this.templateArgument = this.dialogData?.argument ?? undefined;

    if (this.templateArgument && this.inputType && this.inputKey && this.inputName && this.inputValue) {
      this.inputType.value = this.templateArgument.type;
      this.inputKey.nativeElement.value = this.templateArgument.key;
      this.inputName.nativeElement.value = this.templateArgument.name;
      this.inputValue.nativeElement.value = this.templateArgument.defaultValue;
    }
  }

  getTitle() {
    return this.templateArgument ? `Update` : 'Create argument';
  }

  getFinishButtonName() {
    return this.templateArgument ? 'Update' : 'Create';
  }

  showDeleteButton() {
    return this.templateArgument;
  }

  deleteArgument() {
    if (this.templateArgument) {
      const index = this.templateSection?.arguments.indexOf(this.templateArgument) ?? -1;
      if (index !== -1) {
        this.templateSection?.arguments.splice(index, 1);
        this.templateService.updateTemplate(this.template!);

        this.dialogRef.close();
        this.snackbar.open('Deleted.');
        return;
      }
    }

    this.snackbar.open('Unable to delete argument!');
  }

  updateArgument() {
    const type = this.inputType?.value;
    const key = this.inputKey?.nativeElement.value;
    const name = this.inputName?.nativeElement.value;
    const value = this.inputValue?.nativeElement.value;
    if (!(typeof (type) === 'string' && type.length > 0)) {
      this.snackbar.open('Type must be at least 1 characters long!');
      return;
    }
    if (!(typeof (key) === 'string' && key.length > 0)) {
      this.snackbar.open('Key must be at least 1 characters long!');
      return;
    }
    if (!(typeof (name) === 'string' && name.length > 0)) {
      this.snackbar.open('Name must be at least 1 characters long!');
      return;
    }
    if (typeof (value) !== 'string') {
      this.snackbar.open('Value is not a string!');
      return;
    }

    if (!this.template) {
      this.snackbar.open('Unable to find template reference!');
      return;
    }

    if (this.templateArgument) {
      this.templateArgument.type = type;
      this.templateArgument.key = key;
      this.templateArgument.name = name;
      this.templateArgument.defaultValue = value;
      this.templateService.updateTemplate(this.template);
      this.snackbar.open('Argument updated.');
    } else {
      if (!this.templateSection) {
        this.snackbar.open('Unable to find template section reference!');
        return;
      }

      const argument = {
        type,
        key,
        name,
        defaultValue: value
      };

      if (this.templateSection.arguments) {
        this.templateSection.arguments.push(argument);
      } else {
        this.templateSection.arguments = [argument];
      }

      this.templateService.updateTemplate(this.template);
      this.snackbar.open('Argument created.');
    }

    this.dialogRef.close();
  }
}