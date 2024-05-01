import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreateSectionComponent } from './components-sub/create-section/create-section.component';
import { CreateTemplateComponent } from '../../dialog/create-template/create-template.component';
import { SectionArgument, Template, TemplateSection, TemplateService } from '../../services/template.service';
import { ArgumentStringComponent } from './components-sub/argument-string/argument-string.component';
import { CreateArgumentComponent } from './components-sub/create-argument/create-argument.component';

@Component({
  selector: 'maxim-template',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ArgumentStringComponent
  ],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})
export default class TemplateComponent implements OnInit {

  private readonly service = inject(TemplateService);

  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(MatSnackBar);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private sectionSelected: TemplateSection[] = [];

  private argumentIndex: SectionArgument[] = [];
  private argumentValues: string[] = [];

  template?: Template;

  @ViewChild('dragger', { static: true }) dragger?: ElementRef<HTMLDivElement>;
  @ViewChild('code', { static: true }) resultCode?: ElementRef<MatInput>;

  draggerHolding: boolean = false;
  draggerOffset: number = 0;

  loading: boolean = true;

  step: number = 0;

  ngOnInit(): void {
    this.draggerOffset = Number(localStorage.getItem('dragger-section-position'));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.template = this.service.getTemplate(id);
      this.loading = false;

      for (const section of this.template.sections) {
        if (section.defaultEnabled) {
          this.sectionSelected.push(section);
        }
      }
    } else {
      this.router.navigateByUrl('/');
      this.snackbar.open('Were unable the find the selected template id!');
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  draggerMouseUp(event: MouseEvent) {
    event.stopPropagation();
    this.draggerHolding = false;

    localStorage.setItem('dragger-section-position', `${this.draggerOffset}`);
  }

  draggerMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.draggerHolding = true;
  }

  draggerMouseMove(event: MouseEvent) {
    if (this.dragger && this.draggerHolding) {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.draggerOffset = event.clientX;
    }
  }

  getName() {
    return this.template?.name;
  }

  editName() {
    this.dialog.open(CreateTemplateComponent, {
      data: {
        template: this.template
      }
    });
  }

  createSection(section?: TemplateSection) {
    this.dialog.open(CreateSectionComponent, {
      data: {
        template: this.template,
        section
      }
    });
  }

  editSection(event: Event, section: TemplateSection) {
    event.stopPropagation();
    this.createSection(section);
  }

  toggleSection(event: MatCheckboxChange, section: TemplateSection) {
    const index = this.sectionSelected.indexOf(section);
    if (event.checked) {
      if (index == -1) {
        this.sectionSelected.push(section);
      }
    } else if (index != -1) {
      this.sectionSelected.splice(index, 1);
    }
  }

  hasSections() {
    return this.template!.sections.length > 0;
  }

  getSections() {
    return this.template!.sections;
  }

  createArgument(section: TemplateSection, argument?: SectionArgument) {
    this.dialog.open(CreateArgumentComponent, {
      data: {
        template: this.template,
        section,
        argument
      }
    });
  }

  argumentValueChanged(argument: SectionArgument, value: string) {
    let index = this.argumentIndex.indexOf(argument);
    if (index == -1) {
      index = this.argumentIndex.length;
      this.argumentIndex.push(argument);
    }

    this.argumentValues[index] = value;
  }

  generate() {
    if (!(this.template && this.resultCode)) {
      return;
    }

    let message = '';
    for (const section of this.template.sections) {
      if (this.sectionSelected.indexOf(section) == -1) {
        continue;
      }

      let content = section.content;
      for (const argument of section.arguments) {
        const index = this.argumentIndex.indexOf(argument);
        let value;
        if (index !== -1) {
          value = this.argumentValues[index];
        } else {
          value = argument.defaultValue;
        }

        content = content.replaceAll(argument.key, value);
      }
      message += `\n${content}`;
    }

    this.resultCode.nativeElement.value = message.trim();
  }
}
