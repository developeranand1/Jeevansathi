import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatrimonyService } from '../../services/matrimony.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly router = inject(Router);
  readonly matrimonyService = inject(MatrimonyService);
  readonly apiService = inject(ApiService);

  readonly loginMode = signal<'otp' | 'password'>('otp');
  readonly otpSent = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly loginForm = new FormGroup({
    identifier: new FormControl<string>('9876543210', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>(''),
    otp: new FormControl<string>('')
  });

  sendOtp(): void {
    const val = this.loginForm.get('identifier')?.value;
    if (!val || val.trim().length < 10) {
      this.matrimonyService.showToast('Please enter a valid 10-digit mobile number or Email.', 'warning');
      return;
    }

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.otpSent.set(true);
      this.loginForm.patchValue({ otp: '5824' });
      this.matrimonyService.showToast('OTP sent successfully! (Demo OTP: 5824)', 'info');
    }, 700);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.matrimonyService.showToast('Please enter your credentials.', 'warning');
      return;
    }

    const { identifier, password, otp } = this.loginForm.getRawValue();
    this.isLoading.set(true);

    this.apiService.post<any>('v1/auth/login', {
      login_id: identifier,
      password: password || 'Pass@1234'
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const user = res.data?.user || res.data;
        if (res.data?.access_token) {
          localStorage.setItem('user_token', res.data.access_token);
          localStorage.setItem('user_data', JSON.stringify(user));
        }
        this.matrimonyService.showToast(`Welcome back, ${user?.full_name || 'Member'}!`, 'success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.matrimonyService.showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      }
    });
  }
}
