import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {
  constructor(private readonly authService: AuthService) { }

  public login() {
    this.authService.login();
  }
}
