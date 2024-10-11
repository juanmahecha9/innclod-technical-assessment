import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexeddbService } from '../../shared/services/indexeddb.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isCreateAccount = false;
  form!: FormGroup;
  formLogin!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private indexedDBService: IndexeddbService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      names: ['', Validators.required],
    });
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    localStorage.clear();
  }

  createAccount() {
    this.isCreateAccount = !this.isCreateAccount;
  }

  createUser() {
    if (!this.form.valid) {
      this.toastr.error('Error in fields');
      return;
    }

    this.indexedDBService
      .addUser({
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
        id: uuidv4(),
        names: this.form.get('names')?.value,
      })
      .then((res) => {
        this.toastr.success('User created successfully', '');
        //this.router.navigate(['/login']);
        this.isCreateAccount = false;
      })
      .catch((e) => {
        this.toastr.error('Is not possible create the user', '');
      });
  }

  searchUser() {
    if (!this.formLogin.valid) {
      this.toastr.error('Fields are required');
      return;
    }

    this.indexedDBService
      .getUserByEmail(this.formLogin.get('email')?.value)
      .then((res) => {
        if (res == null || res.length == 0) {
          this.toastr.error('User not found');
          return;
        }

        if (res.password !== this.formLogin.get('password')?.value) {
          this.toastr.error('Incorrect password');
          return;
        }

        localStorage.setItem('token', `${uuidv4()}`);
        this.toastr.success('Welcome ' + res.names);
        this.router.navigate(['/home']);
      });
  }
}
