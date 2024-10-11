import { Component, inject, OnDestroy } from '@angular/core';
import { HttpResquests } from '../../shared/requests/requests';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';
import {
  ResponseTask,
  TasksService,
} from '../../shared/services/api/task.service';
import {
  ProjectsService,
  ResponseProject,
} from '../../shared/services/api/projects.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnDestroy {
  private http = inject(HttpResquests).request;
  private tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);
  private subscriptions: Subscription = new Subscription();

  form!: FormGroup;

  tasks: ResponseTask[] = [];
  projects: { id: number; name: string }[] = [];

  visible: boolean = false;

  modalTitle: string = 'Add Task';

  editButton: boolean = false;
  index: number = 0;

  constructor(private toastr: ToastrService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      completed: new FormControl(false, [Validators.required]),
      UserId: new FormControl(1, [Validators.required]),
      id: new FormControl(0),
    });
    this.getData();
  }

  getProjectsData() {
    const subscription = this.http(
      this.projectsService.getProjects()
    ).subscribe({
      next: (res) => {
        this.projects = (res as ResponseProject[]).map((e: ResponseProject) => {
          return {
            id: e.id,
            name: e.name,
          };
        });
      },
      error: (error) => {
        this.toastr.error(error.error.message, '');
      },
    });
    this.subscriptions.add(subscription);
  }

  getData() {
    const subscription = this.http(this.tasksService.getTasks()).subscribe({
      next: (res) => {
        this.tasks = res as ResponseTask[];
      },
      error: (error) => {
        this.toastr.error(error.error.message, '');
      },
    });
    this.subscriptions.add(subscription);
  }

  openDialog(type: 'add' | 'edit', task?: ResponseTask, index?: number) {
    this.visible = !this.visible;
    if (type === 'add') {
      this.modalTitle = 'Add Task';
      this.editButton = false;
    } else {
      this.modalTitle = 'Edit Task';
      this.editButton = true;
      this.index = index!;
      this.form.patchValue(task as ResponseTask);
    }
  }

  addNewTask() {
    if (!this.form.valid) {
      this.toastr.warning('Please fill all the fields', '');
      return;
    }
    this.form.patchValue({
      UserId: 1,
      id: this.tasks.length + 1,
    });
    this.tasks.push(this.form.value);
    this.visible = false;
    this.form.patchValue({
      title: '',
      completed: false,
    });
    return;
  }

  updateTask() {
    if (!this.form.valid) {
      this.toastr.warning('Please fill all the fields', '');
      return;
    }

    this.tasks[this.index] = this.form.value;
    this.visible = false;
    this.form.patchValue({
      title: '',
      completed: false,
    });
    return;
  }

  deleteTask(indexToDelete: number) {
    if (indexToDelete > -1 && indexToDelete < this.tasks.length) {
      this.tasks.splice(indexToDelete, 1); // Elimina 1 elemento en el índice especificado
      return;
    } else {
      return;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Cancelar todas las suscripciones
  }
}
