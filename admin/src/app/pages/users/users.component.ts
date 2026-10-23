import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { DataTableComponent, TableColumn, TableAction } from '../../components/data-table/data-table.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent],
  template: `
    <div class="container-fluid p-0">
      
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="font-serif fw-bold text-maroon mb-0">User Management</h5>
          <small class="text-muted">Manage member accounts, membership tiers & status</small>
        </div>
      </div>

      <!-- Filters using Reactive Forms with minimal padding -->
      <div class="card border-0 shadow-sm rounded-2 p-3 mb-3 bg-white">
        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="row g-2 align-items-center">
          
          <div class="col-md-4 col-12">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
              <input 
                type="text" 
                class="form-control form-control-compact" 
                formControlName="search" 
                placeholder="Search by Matrimony ID, Name, Mobile, Email..." />
            </div>
          </div>

          <div class="col-md-3 col-6">
            <select class="form-select form-select-compact" formControlName="status">
              <option value="">All Account Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="BANNED">BANNED</option>
            </select>
          </div>

          <div class="col-md-3 col-6">
            <select class="form-select form-select-compact" formControlName="is_premium">
              <option value="">All Memberships</option>
              <option value="true">Premium Only</option>
              <option value="false">Free Members</option>
            </select>
          </div>

          <div class="col-md-2 col-12 d-flex gap-1.5">
            <button type="submit" class="btn btn-maroon btn-sm w-100">
              <i class="bi bi-filter me-1"></i> Apply
            </button>
            <button type="button" (click)="resetFilters()" class="btn btn-outline-secondary btn-sm">
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>

        </form>
      </div>

      <!-- User Reusable Data Table -->
      <app-data-table 
        [columns]="columns" 
        [data]="users()" 
        [actions]="actions" 
        [loading]="loading()" 
        emptyMessage="No matrimonial user records match your criteria."
        (actionTriggered)="handleAction($event)">
      </app-data-table>

    </div>
  `
})
export class UsersPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly users = signal<any[]>([]);
  readonly loading = signal<boolean>(false);

  // Reactive Form Filters
  filterForm = this.fb.group({
    search: [''],
    status: [''],
    is_premium: [''],
  });

  // Table Columns Definition
  readonly columns: TableColumn[] = [
    { key: 'matrimony_id', header: 'Matrimony ID' },
    { key: 'full_name', header: 'Full Name' },
    { key: 'user_name', header: 'Username' },
    { key: 'mobile', header: 'Mobile' },
    { 
      key: 'is_premium', 
      header: 'Plan', 
      type: 'badge',
      format: (val) => val ? 'PREMIUM' : 'FREE',
      badgeClass: (item) => item.is_premium ? 'bg-gold text-dark' : 'bg-light text-muted border'
    },
    { 
      key: 'account_status', 
      header: 'Status', 
      type: 'badge',
      badgeClass: (item) => {
        switch (item.account_status) {
          case 'ACTIVE': return 'bg-success text-white';
          case 'PENDING_VERIFICATION': return 'bg-warning text-dark';
          case 'SUSPENDED': return 'bg-secondary text-white';
          case 'BANNED': return 'bg-danger text-white';
          default: return 'bg-light text-dark';
        }
      }
    },
    { key: 'created_at', header: 'Registered', type: 'date' }
  ];

  // Actions on Table
  readonly actions: TableAction[] = [
    { 
      label: 'Suspend', 
      icon: 'bi-pause-circle', 
      btnClass: 'btn-outline-warning', 
      action: 'suspend',
      condition: (u) => u.account_status === 'ACTIVE'
    },
    { 
      label: 'Activate', 
      icon: 'bi-check-circle', 
      btnClass: 'btn-outline-success', 
      action: 'activate',
      condition: (u) => u.account_status !== 'ACTIVE'
    },
    { 
      label: 'Ban', 
      icon: 'bi-slash-circle', 
      btnClass: 'btn-outline-danger', 
      action: 'ban',
      condition: (u) => u.account_status !== 'BANNED'
    }
  ];

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading.set(true);
    const filters = this.filterForm.value;
    const params: any = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.is_premium) params.is_premium = filters.is_premium;

    this.adminApi.get<any[]>('admin/users', params).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.users.set(res.data || []);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err.message, 'Failed to load users');
      }
    });
  }

  applyFilters() {
    this.fetchUsers();
  }

  resetFilters() {
    this.filterForm.reset({ search: '', status: '', is_premium: '' });
    this.fetchUsers();
  }

  handleAction(event: { action: string; item: any }) {
    const user = event.item;
    let newStatus = '';
    let promptReason = 'Actioned by admin';

    if (event.action === 'suspend') newStatus = 'SUSPENDED';
    if (event.action === 'activate') newStatus = 'ACTIVE';
    if (event.action === 'ban') newStatus = 'BANNED';

    if (!newStatus) return;

    this.adminApi.patch(`admin/users/${user.user_id}/status`, {
      account_status: newStatus,
      reason: promptReason
    }).subscribe({
      next: () => {
        this.toast.success(`User ${user.full_name} status updated to ${newStatus}`, 'Status Changed');
        this.fetchUsers();
      },
      error: (err) => this.toast.error(err.message, 'Update Failed')
    });
  }
}
