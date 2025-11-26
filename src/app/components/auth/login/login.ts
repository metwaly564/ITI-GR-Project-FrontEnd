import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  route = inject(ActivatedRoute);
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  success: string | null = null;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.success = this.route.snapshot.queryParams['success'];
    console.log(this.success);
  }

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
          message: err.message,
        });
        alert(' Login failed. Check console for details.');
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
