import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  onlogin() {
    console.log('Logging in with', this.email);
    console.log('Password:', this.password);
    alert('login successful!');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  } 


}
