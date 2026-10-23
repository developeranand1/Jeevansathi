import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { DataTableComponent, TableColumn, TableAction } from '../../components/data-table/data-table.component';

@Component({
  selector: 'app-staff-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent],
  template: `
    <div class="container-fluid p-0">
      
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="font-serif fw-bold text-maroon mb-0">Staff & Admin Roles</h5>
          <small class="text-muted">Create administrators, assign roles & configure granular permissions</small>
        </div>
        <button (click)="openCreateModal()" class="btn btn-maroon btn-sm">
          <i class="bi bi-person-plus-fill me-1"></i> Add Admin / Staff
        </button>
      </div>

      <!-- Filters using Reactive Forms -->
      <div class="card border-0 shadow-sm rounded-2 p-3 mb-3 bg-white">
        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="row g-2 align-items-center">
          
          <div class="col-md-5 col-12">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
              <input 
                type="text" 
                class="form-control form-control-compact" 
                formControlName="search" 
                placeholder="Search staff by Name, Username, Email..." />
            </div>
          </div>

          <div class="col-md-4 col-6">
            <select class="form-select form-select-compact" formControlName="role">
              <option value="">All Staff Roles</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="KYC_MODERATOR">KYC_MODERATOR</option>
              <option value="FINANCE_MANAGER">FINANCE_MANAGER</option>
              <option value="RELATIONSHIP_MANAGER">RELATIONSHIP_MANAGER</option>
              <option value="SUPPORT_AGENT">SUPPORT_AGENT</option>
              <option value="CONTENT_EDITOR">CONTENT_EDITOR</option>
            </select>
          </div>

          <div class="col-md-3 col-6 d-flex gap-1">
            <button type="submit" class="btn btn-maroon btn-sm w-100">
              <i class="bi bi-filter me-1"></i> Filter
            </button>
            <button type="button" (click)="resetFilters()" class="btn btn-outline-secondary btn-sm">
              <i class="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>

        </form>
      </div>

      <!-- Staff Data Table -->
      <app-data-table 
        [columns]="columns" 
        [data]="staffList()" 
        [actions]="actions" 
        [loading]="loading()" 
        emptyMessage="No admin/staff records found."
        (actionTriggered)="handleAction($event)">
      </app-data-table>

      <!-- Create / Edit Staff Modal -->
      <div *ngIf="showModal()" class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content rounded-3 border-0 shadow">
            
            <div class="modal-header py-2 px-3 bg-maroon text-white border-bottom border-gold">
              <h6 class="modal-title font-serif fw-bold mb-0">
                {{ editingAdminId() ? 'Edit Staff Role & Permissions' : 'Create New Admin / Staff Account' }}
              </h6>
              <button type="button" class="btn-close btn-close-white" (click)="closeModal()"></button>
            </div>

            <form [formGroup]="staffForm" (ngSubmit)="saveStaff()">
              <div class="modal-body p-3">
                
                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Full Name</label>
                    <input type="text" class="form-control form-control-compact" formControlName="full_name" placeholder="e.g. Priya Sharma" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Admin Username</label>
                    <input type="text" class="form-control form-control-compact" formControlName="admin_name" placeholder="e.g. kyc_priya" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Official Email</label>
                    <input type="email" class="form-control form-control-compact" formControlName="email" placeholder="priya@vivah.com" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Mobile Number</label>
                    <input type="text" class="form-control form-control-compact" formControlName="mobile" placeholder="9876543210" />
                  </div>

                  <div *ngIf="!editingAdminId()" class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Password</label>
                    <input type="password" class="form-control form-control-compact" formControlName="password" placeholder="••••••••" />
                  </div>

                  <div [ngClass]="editingAdminId() ? 'col-md-12' : 'col-md-6'">
                    <label class="form-label small fw-semibold text-secondary mb-1">Assigned Role</label>
                    <select class="form-select form-select-compact" formControlName="admin_role" (change)="onRoleChange()">
                      <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                      <option value="ADMIN">ADMIN (User & Plan Moderation)</option>
                      <option value="KYC_MODERATOR">KYC_MODERATOR (Approve KYC & Photos)</option>
                      <option value="FINANCE_MANAGER">FINANCE_MANAGER (Payments & Refunds)</option>
                      <option value="RELATIONSHIP_MANAGER">RELATIONSHIP_MANAGER (VIP Matchmaking)</option>
                      <option value="SUPPORT_AGENT">SUPPORT_AGENT (Complaints & Queries)</option>
                      <option value="CONTENT_EDITOR">CONTENT_EDITOR (Blogs, Stories & CMS)</option>
                    </select>
                  </div>

                  <!-- Granular Permissions Checklist -->
                  <div class="col-12 mt-2">
                    <label class="form-label small fw-semibold text-secondary mb-1">Assigned Permissions</label>
                    <div class="p-2 rounded bg-light border row g-1">
                      <div *ngFor="let perm of availablePermissions" class="col-md-4 col-sm-6">
                        <div class="form-check">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            [value]="perm.key" 
                            [checked]="isPermSelected(perm.key)" 
                            (change)="togglePermission(perm.key)" 
                            [id]="'perm_' + perm.key">
                          <label class="form-check-label font-size-xs" [for]="'perm_' + perm.key">
                            {{ perm.label }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <div class="modal-footer py-2 px-3 bg-light">
                <button type="button" class="btn btn-outline-secondary btn-sm" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-maroon btn-sm" [disabled]="staffForm.invalid">
                  {{ editingAdminId() ? 'Update Staff Member' : 'Create Account' }}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .font-size-xs {
      font-size: 0.75rem;
    }
  `]
})
export class StaffPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly staffList = signal<any[]>([]);
  readonly loading = signal<boolean>(false);
  readonly showModal = signal<boolean>(false);
  readonly editingAdminId = signal<string | null>(null);
  readonly selectedPermissions = signal<string[]>([]);

  readonly availablePermissions = [
    { key: 'users.view', label: 'View Users' },
    { key: 'users.ban', label: 'Ban/Suspend Users' },
    { key: 'kyc.approve', label: 'Approve/Reject KYC' },
    { key: 'photos.moderate', label: 'Moderate Photos' },
    { key: 'plans.manage', label: 'Create/Edit Plans' },
    { key: 'payments.view', label: 'View Transactions' },
    { key: 'payments.refund', label: 'Issue Refunds' },
    { key: 'reports.handle', label: 'Handle Abuse Reports' },
    { key: 'rm.matchmake', label: 'VIP Matchmaking' },
    { key: 'cms.edit', label: 'Manage CMS & Blogs' },
  ];

  filterForm = this.fb.group({
    search: [''],
    role: [''],
  });

  staffForm = this.fb.group({
    full_name: ['', Validators.required],
    admin_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    password: [''],
    admin_role: ['KYC_MODERATOR', Validators.required],
  });

  readonly columns: TableColumn[] = [
    { key: 'full_name', header: 'Full Name' },
    { key: 'admin_name', header: 'Username' },
    { key: 'email', header: 'Email' },
    { key: 'mobile', header: 'Mobile' },
    { 
      key: 'admin_role', 
      header: 'Assigned Role', 
      type: 'badge',
      badgeClass: (item) => {
        switch (item.admin_role) {
          case 'SUPER_ADMIN': return 'bg-maroon text-white';
          case 'ADMIN': return 'bg-danger text-white';
          case 'KYC_MODERATOR': return 'bg-warning text-dark';
          case 'FINANCE_MANAGER': return 'bg-success text-white';
          case 'RELATIONSHIP_MANAGER': return 'bg-gold text-dark';
          default: return 'bg-secondary text-white';
        }
      }
    },
    { 
      key: 'is_active', 
      header: 'Status', 
      type: 'badge',
      format: (val) => val ? 'ACTIVE' : 'DEACTIVATED',
      badgeClass: (item) => item.is_active ? 'bg-success text-white' : 'bg-secondary text-white'
    },
    { key: 'created_at', header: 'Created On', type: 'date' }
  ];

  readonly actions: TableAction[] = [
    { label: 'Edit Role', icon: 'bi-pencil', btnClass: 'btn-outline-primary', action: 'edit' },
    { 
      label: 'Deactivate', 
      icon: 'bi-slash-circle', 
      btnClass: 'btn-outline-danger', 
      action: 'deactivate',
      condition: (a) => a.is_active && a.admin_role !== 'SUPER_ADMIN'
    }
  ];

  ngOnInit() {
    this.fetchStaff();
  }

  fetchStaff() {
    this.loading.set(true);
    const filter = this.filterForm.value;
    const params: any = {};
    if (filter.search) params.search = filter.search;
    if (filter.role) params.role = filter.role;

    this.adminApi.get<any[]>('admin/admins', params).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.staffList.set(res.data || []);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err.message, 'Failed to fetch staff');
      }
    });
  }

  applyFilters() {
    this.fetchStaff();
  }

  resetFilters() {
    this.filterForm.reset({ search: '', role: '' });
    this.fetchStaff();
  }

  openCreateModal() {
    this.editingAdminId.set(null);
    this.selectedPermissions.set(['kyc.approve', 'photos.moderate']);
    this.staffForm.reset({
      full_name: '',
      admin_name: '',
      email: '',
      mobile: '',
      password: 'AdminPassword@123',
      admin_role: 'KYC_MODERATOR',
    });
    this.staffForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.staffForm.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  isPermSelected(key: string): boolean {
    return this.selectedPermissions().includes(key);
  }

  togglePermission(key: string) {
    const current = [...this.selectedPermissions()];
    const index = current.indexOf(key);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(key);
    }
    this.selectedPermissions.set(current);
  }

  onRoleChange() {
    const role = this.staffForm.value.admin_role;
    if (role === 'KYC_MODERATOR') {
      this.selectedPermissions.set(['kyc.approve', 'photos.moderate']);
    } else if (role === 'FINANCE_MANAGER') {
      this.selectedPermissions.set(['payments.view', 'payments.refund']);
    } else if (role === 'RELATIONSHIP_MANAGER') {
      this.selectedPermissions.set(['users.view', 'rm.matchmake']);
    } else if (role === 'ADMIN') {
      this.selectedPermissions.set(['users.view', 'users.ban', 'plans.manage', 'reports.handle']);
    } else if (role === 'SUPER_ADMIN') {
      this.selectedPermissions.set(this.availablePermissions.map(p => p.key));
    }
  }

  saveStaff() {
    if (this.staffForm.invalid) return;

    const payload = {
      ...this.staffForm.value,
      permissions: this.selectedPermissions(),
    };

    const adminId = this.editingAdminId();

    if (adminId) {
      this.adminApi.patch(`admin/admins/${adminId}`, payload).subscribe({
        next: () => {
          this.toast.success('Staff account updated successfully', 'Updated');
          this.closeModal();
          this.fetchStaff();
        },
        error: (err) => this.toast.error(err.message, 'Update Failed')
      });
    } else {
      this.adminApi.post('admin/admins', payload).subscribe({
        next: () => {
          this.toast.success('New admin/staff account created!', 'Staff Added');
          this.closeModal();
          this.fetchStaff();
        },
        error: (err) => this.toast.error(err.message, 'Creation Failed')
      });
    }
  }

  handleAction(event: { action: string; item: any }) {
    const admin = event.item;
    if (event.action === 'edit') {
      this.editingAdminId.set(admin.admin_id);
      this.selectedPermissions.set(admin.permissions || []);
      this.staffForm.patchValue({
        full_name: admin.full_name,
        admin_name: admin.admin_name,
        email: admin.email,
        mobile: admin.mobile,
        admin_role: admin.admin_role,
      });
      this.staffForm.get('password')?.clearValidators();
      this.staffForm.get('password')?.updateValueAndValidity();
      this.showModal.set(true);
    } else if (event.action === 'deactivate') {
      if (!confirm(`Deactivate staff account for "${admin.full_name}"?`)) return;
      this.adminApi.delete(`admin/admins/${admin.admin_id}`).subscribe({
        next: () => {
          this.toast.warning(`Account for ${admin.full_name} deactivated.`, 'Deactivated');
          this.fetchStaff();
        },
        error: (err) => this.toast.error(err.message, 'Deactivation Failed')
      });
    }
  }
}
