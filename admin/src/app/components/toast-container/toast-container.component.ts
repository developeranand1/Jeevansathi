import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1090;">
      <div 
        *ngFor="let toast of toastService.toasts()"
        class="toast show shadow-lg border-0 mb-3 rounded-3 overflow-hidden fade-in-toast"
        role="alert">
        
        <div class="d-flex align-items-center p-3 text-white" [ngClass]="getHeaderClass(toast.type)">
          <div class="me-2 d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-20" style="width: 28px; height: 28px;">
            <i [class]="getIcon(toast.type) + ' fs-6'"></i>
          </div>
          
          <div class="flex-grow-1">
            <div class="fw-bold font-serif font-size-xs">{{ toast.title || getDefaultTitle(toast.type) }}</div>
            <div class="font-sans font-size-xs opacity-90">{{ toast.message }}</div>
          </div>

          <button 
            type="button" 
            class="btn-close btn-close-white btn-sm ms-2" 
            aria-label="Close"
            (click)="toastService.remove(toast.id)">
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .font-size-xs {
      font-size: 0.8125rem;
      line-height: 1.35;
    }
    .fade-in-toast {
      animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      min-width: 320px;
      max-width: 380px;
    }
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  getHeaderClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-maroon';
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info text-dark';
      default: return 'bg-dark';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'bi bi-check-circle-fill text-white';
      case 'error': return 'bi bi-x-circle-fill text-white';
      case 'warning': return 'bi bi-exclamation-triangle-fill text-dark';
      case 'info': return 'bi bi-info-circle-fill text-dark';
      default: return 'bi bi-bell-fill text-white';
    }
  }

  getDefaultTitle(type: string): string {
    switch (type) {
      case 'success': return 'Success Action';
      case 'error': return 'Failed Action';
      case 'warning': return 'Attention Required';
      case 'info': return 'System Update';
      default: return 'Notification';
    }
  }
}
