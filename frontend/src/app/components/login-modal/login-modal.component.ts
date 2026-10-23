import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatrimonyService } from '../../services/matrimony.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {
  readonly close = output<void>();
  readonly openRegister = output<void>();

  readonly matrimonyService = inject(MatrimonyService);
  readonly loginMode = signal<'otp' | 'password'>('otp');
  readonly otpSent = signal<boolean>(false);

  // Angular Reactive Forms
  readonly loginForm = new FormGroup({
    mobileOrEmail: new FormControl<string>('9876543210', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>(''),
    otp: new FormControl<string>('')
  });

  sendOtp(): void {
    if (!this.loginForm.get('mobileOrEmail')?.value) {
      this.matrimonyService.showToast('Please enter your mobile number or ID.', 'warning');
      return;
    }
    this.otpSent.set(true);
    this.loginForm.patchValue({ otp: '7721' });
    this.matrimonyService.showToast('OTP sent! (Demo code: 7721)', 'info');
  }

  onLogin(): void {
    this.matrimonyService.showToast('✨ Welcome back! You are now logged into Vivah.', 'success');
    this.close.emit();
  }
}
