import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-sand p-3">
      <div class="card border-0 shadow-lg rounded-3 overflow-hidden" style="max-width: 420px; width: 100%;">
        
        <!-- Header -->
        <div class="bg-maroon p-4 text-center text-white position-relative border-bottom border-gold border-2">
          <div class="d-inline-flex p-3 rounded-circle bg-white shadow-sm mb-2 text-maroon">
            <i class="bi bi-shield-lock-fill fs-3"></i>
          </div>
          <h4 class="font-serif fw-bold mb-0 text-white">Jeevansathi Admin</h4>
          <p class="text-white-50 small mb-0">Staff & Management Portal</p>
        </div>

        <div class="card-body p-4 bg-white">
          
          <!-- Default Credentials Info Card -->
          <div class="p-3 rounded-2 bg-gold-subtle border border-gold-subtle mb-3 small">
            <div class="fw-bold text-dark font-size-xs d-flex justify-content-between align-items-center">
              <span><i class="bi bi-key-fill text-gold me-1"></i> Admin Login Credentials:</span>
              <span class="badge bg-gold text-dark font-size-xxs">Direct</span>
            </div>
            <div class="text-muted font-size-xs mt-1">
              Username: <strong class="text-dark">superadmin</strong> &bull; Password: <strong class="text-dark">SuperPassword&#64;123</strong>
            </div>
          </div>

          <!-- Direct Login Form (Single Step, No 2FA) -->
          <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()">
            <div class="mb-3">
              <label class="form-label small fw-semibold text-secondary mb-1">Admin Username</label>
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-light text-muted border-end-0">
                  <i class="bi bi-person"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control form-control-compact border-start-0" 
                  formControlName="admin_name" 
                  placeholder="e.g. superadmin" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-semibold text-secondary mb-1">Password</label>
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-light text-muted border-end-0">
                  <i class="bi bi-key"></i>
                </span>
                <input 
                  type="password" 
                  class="form-control form-control-compact border-start-0" 
                  formControlName="password" 
                  placeholder="••••••••" />
              </div>
            </div>

            <button 
              type="submit" 
              class="btn btn-maroon w-100 py-2 d-flex align-items-center justify-content-center" 
              [disabled]="loginForm.invalid || loading()">
              <span *ngIf="loading()" class="spinner-border spinner-border-sm me-2"></span>
              <span>Login to Console</span>
              <i *ngIf="!loading()" class="bi bi-arrow-right ms-2"></i>
            </button>
          </form>

        </div>

        <div class="card-footer bg-light py-2 px-3 text-center border-0">
          <small class="text-muted font-size-xs">Secure Admin Console &bull; Role Based Access Control</small>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .font-size-xs {
      font-size: 0.75rem;
    }
    .font-size-xxs {
      font-size: 0.6875rem;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly loading = signal<boolean>(false);

  // Reactive Forms with direct login
  loginForm = this.fb.group({
    admin_name: ['superadmin', [Validators.required, Validators.minLength(3)]],
    password: ['SuperPassword@123', [Validators.required, Validators.minLength(6)]],
  });

  onLoginSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    const { admin_name, password } = this.loginForm.value;

    this.adminApi.post('admin/auth/login', { admin_name, password }).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        this.adminApi.setSession(res.data.access_token, res.data.admin);
        this.toast.success(`Welcome back, ${res.data.admin.full_name}!`, 'Login Successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err.message || 'Invalid username or password', 'Login Failed');
      }
    });
  }
}
