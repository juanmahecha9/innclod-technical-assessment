import { Component, inject, OnDestroy } from '@angular/core';
import { HttpResquests } from '../../shared/requests/requests';
import { Subscription } from 'rxjs';
import {
  ProjectsService,
  ResponseProject,
} from '../../shared/services/api/projects.service';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements OnDestroy {
  private http = inject(HttpResquests).request;
  private projectsService = inject(ProjectsService);
  private subscriptions: Subscription = new Subscription();

  projects: ResponseProject[] = [];
  form!: FormGroup;

  visible: boolean = false;

  modalTitle: string = 'Add Project';

  editButton: boolean = false;
  index: number = 0;

  constructor(private toastr: ToastrService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),

      street: new FormControl('', [Validators.required]),
      suite: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),

      lat: new FormControl('', [Validators.required]),
      lng: new FormControl('', [Validators.required]),

      phone: new FormControl('', [Validators.required]),
      website: new FormControl(''),

      companyName: new FormControl('', [Validators.required]),
      catchPhrase: new FormControl(''),
      bs: new FormControl(''),
    });
    this.getData();
  }

  getData() {
    const subscription = this.http(
      this.projectsService.getProjects()
    ).subscribe({
      next: (res) => {
        this.projects = res;
      },
      error: (error) => {
        this.toastr.error(error.error.message, '');
      },
    });
    this.subscriptions.add(subscription);
  }

  openDialog(type: 'add' | 'edit', project?: ResponseProject, index?: number) {
    this.visible = !this.visible;
    if (type === 'add') {
      this.modalTitle = 'Add Task';
      this.editButton = false;
    } else {
      this.modalTitle = 'Edit Task';
      this.editButton = true;
      this.index = index!;
      const formValues: any = {
        name: project?.name || '',
        username: project?.username || '',
        email: project?.email || '',
        phone: project?.phone || '',
        website: project?.website || '',
        street: project?.address?.street || '',
        suite: project?.address?.suite || '',
        city: project?.address?.city || '',
        zipcode: project?.address?.zipcode || '',
        lat: project?.address?.geo?.lat || '',
        lng: project?.address?.geo?.lng || '',
        companyName: project?.company?.name || '',
        catchPhrase: project?.company?.catchPhrase || '',
        bs: project?.company?.bs || '',
      };
      this.form.patchValue(formValues);
    }
  }

  updateProject() {
    if (!this.form.valid) {
      this.toastr.warning('Please fill all the fields', '');
      return;
    }

    const formValues = this.form.value;
    const jsonOutput = {
      id: formValues.id || null, // O el valor que desees asignar
      name: formValues.name,
      username: formValues.username,
      email: formValues.email,
      address: {
        street: formValues.street,
        suite: formValues.suite,
        city: formValues.city,
        zipcode: formValues.zipcode,
        geo: {
          lat: formValues.lat,
          lng: formValues.lng,
        },
      },
      phone: formValues.phone,
      website: formValues.website,
      company: {
        name: formValues.companyName,
        catchPhrase: formValues.catchPhrase,
        bs: formValues.bs,
      },
    };
    this.projects[this.index] = jsonOutput;
    this.visible = false;
    this.form.reset();
    return;
  }

  addProject() {
    if (!this.form.valid) {
      this.toastr.warning('Please fill all the fields', '');
      return;
    }

    const formValues = this.form.value;
    const jsonOutput = {
      id: formValues.id || null, // O el valor que desees asignar
      name: formValues.name,
      username: formValues.username,
      email: formValues.email,
      address: {
        street: formValues.street,
        suite: formValues.suite,
        city: formValues.city,
        zipcode: formValues.zipcode,
        geo: {
          lat: formValues.lat,
          lng: formValues.lng,
        },
      },
      phone: formValues.phone,
      website: formValues.website,
      company: {
        name: formValues.companyName,
        catchPhrase: formValues.catchPhrase,
        bs: formValues.bs,
      },
    };
    this.projects.push(jsonOutput);
    this.visible = false;
    this.form.reset();
    return;
  }

  deleteProject(indexToDelete: number) {
    if (indexToDelete > -1 && indexToDelete < this.projects.length) {
      this.projects.splice(indexToDelete, 1); // Elimina 1 elemento en el índice especificado
      return;
    } else {
      return;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Cancelar todas las suscripciones
  }
}
