import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CreateTemplateComponent } from '../../dialog/create-template/create-template.component';
import { Template } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';
import { SectionListComponent } from './sub-components/section-list/section-list.component';

@Component({
  selector: 'maxim-template',
  standalone: true,
  imports: [
    SectionListComponent,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTooltipModule
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

  readonly editmode = signal(true);

  readonly template = signal<Template | undefined>(undefined);
  readonly sectionCount = computed(() => {
    const template = this.template();
    return template ? template.sections().length : 0;
  });

  readonly code = signal('');
  readonly codeRows = computed(() => this.code().split(/\r?\n/).length);

  readonly dragger = viewChild.required('dragger', { read: ElementRef<HTMLDivElement> });
  draggerHolding = signal(false);
  draggerOffset = signal(0);

  constructor() {
    const offset = Number(localStorage.getItem('dragger-section-position'));
    if (typeof(offset) === 'number') {
      this.draggerOffset.set(offset);
    }

    effect(() => {
      const draggerHolding = this.draggerHolding();
      const offset = untracked(() => this.draggerOffset());
      if (!draggerHolding && offset !== 0) {
        localStorage.setItem('dragger-section-position', `${offset}`);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const template = this.service.getTemplate(id ?? '');
    this.template.set(template);

    if (!template) {
      this.router.navigateByUrl('/');
      this.snackbar.open('Were unable the find the selected template id!');
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  draggerMouseUp(event: MouseEvent) {
    event.stopPropagation();
    this.draggerHolding.set(false);
  }

  draggerMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.draggerHolding.set(true);
  }

  draggerMouseMove(event: MouseEvent) {
    if (this.dragger() && this.draggerHolding()) {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.draggerOffset.set(event.clientX);
    }
  }

  getName() {
    return this.template()?.name() ?? 'Loading';
  }

  editName() {
    this.dialog.open(CreateTemplateComponent, {
      data: {
        template: this.template()
      }
    });
  }

  generate() {
    const template = this.template();
    if (!template) {
      return;
    }

    let message = '';
    for (const section of template.sections()) {
      if (!section.enabled()) {
        continue;
      }

      let content = section.content();
      for (const argument of section.arguments()) {
        content = argument.replaceContent(content);
      }
      message += `\n${content}`;
    }

    const code = message.trim();
    console.log(code);
    this.code.set(code);
  }
}
