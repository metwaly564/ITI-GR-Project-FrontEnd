import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';   // 👈 مهم جداً
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,     // ngModel
    CommonModule     // ngClass + *ngIf + pipe ops
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private auth: Auth) {}

  onLogin() {

    this.isLoading = true;

    console.log(' Sending login request...');
    console.log(' Email:', this.email);
    console.log(' Password:', this.password);

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log(' Login success:', res);

        if (res.token) {
          localStorage.setItem('token', res.token);
          alert('Logged in successfully!');
        } else {
          alert('Login successful but no token received');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        console.log(' Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        });
        alert(' Login failed. Check console for details.');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
