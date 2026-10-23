import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid p-0">
      
      <!-- Page Title -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="font-serif fw-bold text-maroon mb-0">Platform Overview</h5>
          <small class="text-muted">Real-time statistics & verification status</small>
        </div>
        <button (click)="loadStats()" class="btn btn-sm btn-outline-secondary py-1 px-3 font-size-xs">
          <i class="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      <!-- KPI Widgets in Grid with integer classes only -->
      <div class="row g-2 mb-3">
        
        <div class="col-md-4 col-sm-6">
          <div class="card border-0 shadow-sm rounded-2 p-3 bg-white border-start border-maroon border-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted font-size-xs text-uppercase fw-semibold">Total Profiles</span>
                <h4 class="fw-bold mb-0 text-dark">{{ stats()?.total_users || 0 }}</h4>
              </div>
              <div class="p-2 rounded bg-light text-maroon">
                <i class="bi bi-people-fill fs-5"></i>
              </div>
            </div>
            <div class="mt-1 font-size-xs text-muted">Active registered accounts</div>
          </div>
        </div>

        <div class="col-md-4 col-sm-6">
          <div class="card border-0 shadow-sm rounded-2 p-3 bg-white border-start border-gold border-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted font-size-xs text-uppercase fw-semibold">Premium Users</span>
                <h4 class="fw-bold mb-0 text-dark">{{ stats()?.premium_users || 0 }}</h4>
              </div>
              <div class="p-2 rounded bg-gold-subtle text-gold">
                <i class="bi bi-star-fill fs-5"></i>
              </div>
            </div>
            <div class="mt-1 font-size-xs text-muted">Paid VIP & Membership subscribers</div>
          </div>
        </div>

        <div class="col-md-4 col-sm-6">
          <div class="card border-0 shadow-sm rounded-2 p-3 bg-white border-start border-success border-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted font-size-xs text-uppercase fw-semibold">Total Revenue</span>
                <h4 class="fw-bold mb-0 text-success">₹{{ (stats()?.total_revenue_inr || 0) | number:'1.0-2' }}</h4>
              </div>
              <div class="p-2 rounded bg-success-subtle text-success">
                <i class="bi bi-currency-rupee fs-5"></i>
              </div>
            </div>
            <div class="mt-1 font-size-xs text-muted">Processed through Razorpay</div>
          </div>
        </div>

        <div class="col-md-4 col-sm-6">
          <div class="card border-0 shadow-sm rounded-2 p-3 bg-white border-start border-info border-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted font-size-xs text-uppercase fw-semibold">Today's Signups</span>
                <h4 class="fw-bold mb-0 text-info">{{ stats()?.today_signups || 0 }}</h4>
              </div>
              <div class="p-2 rounded bg-info-subtle text-info">
                <i class="bi bi-person-plus-fill fs-5"></i>
              </div>
            </div>
            <div class="mt-1 font-size-xs text-muted">New registrations today</div>
          </div>
        </div>

        <div class="col-md-4 col-sm-6">
          <div class="card border-0 shadow-sm rounded-2 p-3 bg-white border-start border-warning border-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted font-size-xs text-uppercase fw-semibold">Pending KYC</span>
                <h4 class="fw-bold mb-0 text-warning">{{ stats()?.pending_kyc || 0 }}</h4>
              </div>
              <div class="p-2 rounded bg-warning-subtle text-warning">
                <i class="bi bi-shield-exclamation fs-5"></i>
              </div>
            </div>
            <div class="mt-1 font-size-xs text-muted">Awaiting ID moderation</div>
          </div>
        </div>

        <div class="col-md-4 col-sm-6">
          <div class="card border-0 shadow-sm rounded-2 p-3 bg-white border-start border-danger border-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted font-size-xs text-uppercase fw-semibold">Open Abuse Reports</span>
                <h4 class="fw-bold mb-0 text-danger">{{ stats()?.open_reports || 0 }}</h4>
              </div>
              <div class="p-2 rounded bg-danger-subtle text-danger">
                <i class="bi bi-flag-fill fs-5"></i>
              </div>
            </div>
            <div class="mt-1 font-size-xs text-muted">User complaints for review</div>
          </div>
        </div>

      </div>

      <!-- Recent Registered Users & Active Subscription Plans Section -->
      <div class="row g-3">
        
        <!-- Recent Users Widget -->
        <div class="col-lg-7 col-12">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div>
                <h6 class="font-serif fw-bold text-maroon mb-0">Recent User Registrations</h6>
                <small class="text-muted font-size-xs">Newest matrimonial accounts</small>
              </div>
              <a routerLink="/users" class="btn btn-outline-secondary btn-sm py-1 px-2 font-size-xs">
                View All <i class="bi bi-arrow-right ms-1"></i>
              </a>
            </div>

            <div class="table-responsive rounded-2 border">
              <table class="table table-hover align-middle mb-0 font-size-xs">
                <thead class="bg-light text-muted">
                  <tr>
                    <th class="py-2 px-2">Matrimony ID</th>
                    <th class="py-2 px-2">Candidate</th>
                    <th class="py-2 px-2">Mobile</th>
                    <th class="py-2 px-2 text-center">Plan</th>
                    <th class="py-2 px-2 text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of recentUsers()">
                    <td class="py-2 px-2 fw-semibold text-maroon">{{ u.matrimony_id }}</td>
                    <td class="py-2 px-2">
                      <div class="fw-bold text-dark">{{ u.full_name }}</div>
                      <div class="text-muted font-size-xxs">&#64;{{ u.user_name }}</div>
                    </td>
                    <td class="py-2 px-2 text-muted">{{ u.mobile }}</td>
                    <td class="py-2 px-2 text-center">
                      <span class="badge rounded-pill" [ngClass]="u.is_premium ? 'bg-gold text-dark' : 'bg-light text-muted border'">
                        {{ u.is_premium ? 'PREMIUM' : 'FREE' }}
                      </span>
                    </td>
                    <td class="py-2 px-2 text-end">
                      <span class="badge" [ngClass]="u.account_status === 'ACTIVE' ? 'bg-success' : 'bg-warning text-dark'">
                        {{ u.account_status }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="recentUsers().length === 0">
                    <td colspan="5" class="text-center py-4 text-muted">No recent registered users yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Live Subscription Plans Widget -->
        <div class="col-lg-5 col-12">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-3 h-100">
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div>
                <h6 class="font-serif fw-bold text-maroon mb-0">Active Membership Packages</h6>
                <small class="text-muted font-size-xs">Configured packages on sale</small>
              </div>
              <a routerLink="/plans" class="btn btn-outline-secondary btn-sm py-1 px-2 font-size-xs">
                Manage <i class="bi bi-gear ms-1"></i>
              </a>
            </div>

            <div class="d-flex flex-column gap-2 mt-2">
              <div *ngFor="let plan of activePlans()" class="p-2.5 rounded-2 border d-flex justify-content-between align-items-center" [ngClass]="plan.plan_code === 'GOLD' || plan.plan_code === 'ROYAL_VIP' ? 'bg-gold-subtle border-gold-subtle' : 'bg-light'">
                <div>
                  <div class="fw-bold text-dark font-size-xs d-flex align-items-center">
                    <span>{{ plan.plan_name }}</span>
                    <span *ngIf="plan.has_relationship_manager" class="badge bg-gold text-dark ms-1 font-size-xxs">VIP RM</span>
                  </div>
                  <div class="text-muted font-size-xxs">
                    {{ plan.duration_days }} Days &bull; {{ plan.contact_views_limit }} Contacts &bull; {{ plan.interests_limit }} Interests
                  </div>
                </div>
                <div class="text-end">
                  <div class="fw-bold text-maroon font-size-xs">
                    {{ plan.price_inr === 0 ? 'FREE' : ('₹' + (plan.price_inr | number)) }}
                  </div>
                  <span class="badge bg-success font-size-xxs">Live</span>
                </div>
              </div>

              <div *ngIf="activePlans().length === 0" class="text-center py-4 text-muted font-size-xs">
                No active plans configured yet.
              </div>
            </div>

          </div>
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
    .text-maroon {
      color: #7A0C1E;
    }
  `]
})
export class DashboardHomeComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  readonly stats = signal<any>(null);
  readonly recentUsers = signal<any[]>([]);
  readonly activePlans = signal<any[]>([]);

  ngOnInit() {
    this.loadStats();
    this.loadRecentUsers();
    this.loadPlans();
  }

  loadStats() {
    this.adminApi.get('admin/dashboard').subscribe({
      next: (res) => this.stats.set(res.data),
      error: (err) => console.error(err)
    });
  }

  loadRecentUsers() {
    this.adminApi.get<any[]>('admin/users', { limit: 5 }).subscribe({
      next: (res) => this.recentUsers.set(res.data || []),
      error: () => {}
    });
  }

  loadPlans() {
    this.adminApi.get<any[]>('admin/plans').subscribe({
      next: (res) => this.activePlans.set(res.data || []),
      error: () => {}
    });
  }
}
