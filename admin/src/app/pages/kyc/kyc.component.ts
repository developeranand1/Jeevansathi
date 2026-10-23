import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { DataTableComponent, TableColumn, TableAction } from '../../components/data-table/data-table.component';

@Component({
  selector: 'app-kyc-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="container-fluid p-0">
      
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="font-serif fw-bold text-maroon mb-0">KYC & Document Verification</h5>
          <small class="text-muted">Review government ID documents & issue blue verification ticks</small>
        </div>
        <div class="btn-group btn-group-sm">
          <button (click)="filterStatus('PENDING')" class="btn btn-sm" [ngClass]="currentStatus() === 'PENDING' ? 'btn-maroon' : 'btn-outline-secondary'">
            Pending Review
          </button>
          <button (click)="filterStatus('APPROVED')" class="btn btn-sm" [ngClass]="currentStatus() === 'APPROVED' ? 'btn-maroon' : 'btn-outline-secondary'">
            Approved
          </button>
          <button (click)="filterStatus('REJECTED')" class="btn btn-sm" [ngClass]="currentStatus() === 'REJECTED' ? 'btn-maroon' : 'btn-outline-secondary'">
            Rejected
          </button>
        </div>
      </div>

      <!-- KYC Table -->
      <app-data-table 
        [columns]="columns" 
        [data]="kycList()" 
        [actions]="actions" 
        [loading]="loading()" 
        emptyMessage="No KYC verification records found."
        (actionTriggered)="handleAction($event)">
      </app-data-table>

    </div>
  `
})
export class KycPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastService);

  readonly kycList = signal<any[]>([]);
  readonly loading = signal<boolean>(false);
  readonly currentStatus = signal<string>('PENDING');

  readonly columns: TableColumn[] = [
    { 
      key: 'user_id', 
      header: 'Applicant',
      format: (val) => val?.full_name ? `${val.full_name} (${val.matrimony_id || ''})` : '-'
    },
    { key: 'id_proof_type', header: 'Proof Type' },
    { key: 'id_number_masked', header: 'ID Number' },
    { 
      key: 'status', 
      header: 'KYC Status', 
      type: 'badge',
      badgeClass: (item) => {
        if (item.status === 'APPROVED') return 'bg-success text-white';
        if (item.status === 'PENDING') return 'bg-warning text-dark';
        return 'bg-danger text-white';
      }
    },
    { key: 'submitted_at', header: 'Submitted', type: 'date' }
  ];

  readonly actions: TableAction[] = [
    { 
      label: 'Approve', 
      icon: 'bi-check2-circle', 
      btnClass: 'btn-outline-success', 
      action: 'approve',
      condition: (k) => k.status === 'PENDING'
    },
    { 
      label: 'Reject', 
      icon: 'bi-x-circle', 
      btnClass: 'btn-outline-danger', 
      action: 'reject',
      condition: (k) => k.status === 'PENDING'
    }
  ];

  ngOnInit() {
    this.fetchKyc();
  }

  filterStatus(status: string) {
    this.currentStatus.set(status);
    this.fetchKyc();
  }

  fetchKyc() {
    this.loading.set(true);
    this.adminApi.get<any[]>('admin/kyc', { status: this.currentStatus() }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.kycList.set(res.data || []);
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err.message, 'Failed to load KYC');
      }
    });
  }

  handleAction(event: { action: string; item: any }) {
    const kyc = event.item;
    if (event.action === 'approve') {
      if (!confirm('Approve KYC document and assign Blue Verification tick?')) return;
      this.adminApi.patch(`admin/kyc/${kyc.kyc_id}/approve`, {}).subscribe({
        next: () => {
          this.toast.success('KYC document approved & blue verification tick granted!', 'Verified');
          this.fetchKyc();
        },
        error: (err) => this.toast.error(err.message, 'Approval Failed')
      });
    } else if (event.action === 'reject') {
      const reason = prompt('Please specify rejection reason:');
      if (!reason) return;
      this.adminApi.patch(`admin/kyc/${kyc.kyc_id}/reject`, { reject_reason: reason }).subscribe({
        next: () => {
          this.toast.warning('KYC document has been rejected.', 'Document Rejected');
          this.fetchKyc();
        },
        error: (err) => this.toast.error(err.message, 'Rejection Failed')
      });
    }
  }
}
