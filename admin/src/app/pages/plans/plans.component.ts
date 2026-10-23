import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { DataTableComponent, TableColumn, TableAction } from '../../components/data-table/data-table.component';

@Component({
  selector: 'app-plans-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent],
  template: `
    <div class="container-fluid p-0">
      
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="font-serif fw-bold text-maroon mb-0">Subscription Plans</h5>
          <small class="text-muted">Manage membership packages, features, contact limits & pricing</small>
        </div>
        <button (click)="openCreateModal()" class="btn btn-maroon btn-sm">
          <i class="bi bi-plus-lg me-1"></i> Add New Plan
        </button>
      </div>

      <!-- Plans Data Table -->
      <app-data-table 
        [columns]="columns" 
        [data]="plans()" 
        [actions]="actions" 
        [loading]="loading()" 
        emptyMessage="No subscription packages configured."
        (actionTriggered)="handleAction($event)">
      </app-data-table>

      <!-- Plan Form Modal (Reactive Forms) -->
      <div *ngIf="showModal()" class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-3 border-0 shadow">
            
            <div class="modal-header py-2 px-3 bg-maroon text-white border-bottom border-gold">
              <h6 class="modal-title font-serif fw-bold mb-0">
                {{ editingPlanId() ? 'Edit Subscription Plan' : 'Create Subscription Plan' }}
              </h6>
              <button type="button" class="btn-close btn-close-white" (click)="closeModal()"></button>
            </div>

            <form [formGroup]="planForm" (ngSubmit)="savePlan()">
              <div class="modal-body p-3">
                
                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Plan Code</label>
                    <select class="form-select form-select-compact" formControlName="plan_code">
                      <option value="FREE">FREE</option>
                      <option value="SILVER">SILVER</option>
                      <option value="GOLD">GOLD</option>
                      <option value="ROYAL_VIP">ROYAL_VIP</option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Display Name</label>
                    <input type="text" class="form-control form-control-compact" formControlName="plan_name" placeholder="e.g. Gold 3 Months" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Price (₹ INR)</label>
                    <input type="number" class="form-control form-control-compact" formControlName="price_inr" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Duration (Days)</label>
                    <input type="number" class="form-control form-control-compact" formControlName="duration_days" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Contact Views</label>
                    <input type="number" class="form-control form-control-compact" formControlName="contact_views_limit" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary mb-1">Interests Quota</label>
                    <input type="number" class="form-control form-control-compact" formControlName="interests_limit" />
                  </div>

                  <div class="col-12 mt-2">
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" formControlName="has_relationship_manager" id="rmCheck">
                      <label class="form-check-label small" for="rmCheck">Dedicated Relationship Manager (VIP)</label>
                    </div>
                  </div>
                </div>

              </div>

              <div class="modal-footer py-2 px-3 bg-light">
                <button type="button" class="btn btn-outline-secondary btn-sm" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-maroon btn-sm" [disabled]="planForm.invalid">
                  {{ editingPlanId() ? 'Update Plan' : 'Save Plan' }}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

    </div>
  `
})
export class PlansPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly plans = signal<any[]>([]);
  readonly loading = signal<boolean>(false);
  readonly showModal = signal<boolean>(false);
  readonly editingPlanId = signal<string | null>(null);

  // Reactive Forms
  planForm = this.fb.group({
    plan_code: ['SILVER', Validators.required],
    plan_name: ['', Validators.required],
    price_inr: [1999, [Validators.required, Validators.min(0)]],
    duration_days: [90, [Validators.required, Validators.min(1)]],
    contact_views_limit: [25, [Validators.required, Validators.min(0)]],
    interests_limit: [100, [Validators.required, Validators.min(0)]],
    has_relationship_manager: [false],
    is_active: [true]
  });

  readonly columns: TableColumn[] = [
    { key: 'plan_code', header: 'Plan Code', type: 'badge', badgeClass: () => 'bg-maroon text-white' },
    { key: 'plan_name', header: 'Display Name' },
    { key: 'price_inr', header: 'Price', type: 'currency' },
    { key: 'duration_days', header: 'Duration', format: (val) => `${val} Days` },
    { key: 'contact_views_limit', header: 'Contacts Allowed' },
    { key: 'interests_limit', header: 'Interests Limit' },
    { 
      key: 'has_relationship_manager', 
      header: 'VIP RM', 
      type: 'badge',
      format: (val) => val ? 'YES' : 'NO',
      badgeClass: (item) => item.has_relationship_manager ? 'bg-gold text-dark' : 'bg-light text-muted'
    }
  ];

  readonly actions: TableAction[] = [
    { label: 'Edit', icon: 'bi-pencil', btnClass: 'btn-outline-primary', action: 'edit' },
    { label: 'Delete', icon: 'bi-trash', btnClass: 'btn-outline-danger', action: 'delete' }
  ];

  ngOnInit() {
    this.fetchPlans();
  }

  fetchPlans() {
    this.loading.set(true);
    this.adminApi.get<any[]>('admin/plans').subscribe({
      next: (res) => {
        this.loading.set(false);
        this.plans.set(res.data || []);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err.message, 'Failed to load plans');
      }
    });
  }

  openCreateModal() {
    this.editingPlanId.set(null);
    this.planForm.reset({
      plan_code: 'SILVER',
      plan_name: '',
      price_inr: 1999,
      duration_days: 90,
      contact_views_limit: 25,
      interests_limit: 100,
      has_relationship_manager: false,
      is_active: true
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  savePlan() {
    if (this.planForm.invalid) return;

    const payload = this.planForm.value;
    const planId = this.editingPlanId();

    if (planId) {
      this.adminApi.patch(`admin/plans/${planId}`, payload).subscribe({
        next: () => {
          this.toast.success(`Plan "${payload.plan_name}" updated successfully!`, 'Plan Updated');
          this.closeModal();
          this.fetchPlans();
        },
        error: (err) => this.toast.error(err.message, 'Update Failed')
      });
    } else {
      this.adminApi.post('admin/plans', payload).subscribe({
        next: () => {
          this.toast.success(`Plan "${payload.plan_name}" created successfully!`, 'Plan Created');
          this.closeModal();
          this.fetchPlans();
        },
        error: (err) => this.toast.error(err.message, 'Creation Failed')
      });
    }
  }

  handleAction(event: { action: string; item: any }) {
    const plan = event.item;
    if (event.action === 'edit') {
      this.editingPlanId.set(plan.plan_id);
      this.planForm.patchValue({
        plan_code: plan.plan_code,
        plan_name: plan.plan_name,
        price_inr: plan.price_inr,
        duration_days: plan.duration_days,
        contact_views_limit: plan.contact_views_limit,
        interests_limit: plan.interests_limit,
        has_relationship_manager: plan.has_relationship_manager,
        is_active: plan.is_active
      });
      this.showModal.set(true);
    } else if (event.action === 'delete') {
      if (!confirm(`Delete plan "${plan.plan_name}"?`)) return;
      this.adminApi.delete(`admin/plans/${plan.plan_id}`).subscribe({
        next: () => {
          this.toast.success(`Plan "${plan.plan_name}" deleted.`, 'Plan Removed');
          this.fetchPlans();
        },
        error: (err) => this.toast.error(err.message, 'Deletion Failed')
      });
    }
  }
}
