import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="d-flex min-vh-100 bg-sand">
      
      <!-- ==============================================
           PREMIUM ROYAL MAROON SIDEBAR
           ============================================== -->
      <aside 
        class="admin-sidebar d-flex flex-column text-white p-0 border-end border-gold-subtle shadow-lg"
        [class.sidebar-collapsed]="isCollapsed()">
        
        <!-- Sidebar Brand -->
        <div class="sidebar-brand-box p-3 border-bottom border-white border-opacity-10 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center overflow-hidden">
            <div class="brand-logo-icon rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm">
              <i class="bi bi-gem-fill text-gold fs-5"></i>
            </div>
            <div *ngIf="!isCollapsed()" class="text-truncate animate-fade-in">
              <h6 class="font-serif fw-bold text-white mb-0 text-nowrap letter-spacing-1">JEEVANSATHI</h6>
              <div class="badge-console font-sans">ROYAL ADMIN CONSOLE</div>
            </div>
          </div>
          <button 
            type="button" 
            class="btn btn-sm btn-link text-white-50 p-1 d-none d-lg-block text-decoration-none" 
            (click)="toggleSidebar()" 
            title="Toggle Sidebar">
            <i class="bi" [ngClass]="isCollapsed() ? 'bi-text-indent-left' : 'bi-text-indent-right'"></i>
          </button>
        </div>

        <!-- Admin Profile Identity Chip -->
        <div *ngIf="!isCollapsed()" class="admin-profile-chip px-3 py-2 border-bottom border-white border-opacity-10 animate-fade-in">
          <div class="d-flex align-items-center">
            <div class="position-relative me-2">
              <div class="admin-avatar rounded-circle d-flex align-items-center justify-content-center text-dark fw-bold">
                {{ (adminApi.currentAdmin()?.full_name || 'A')[0] }}
              </div>
              <span class="status-indicator-dot"></span>
            </div>
            <div class="text-truncate">
              <div class="text-white small fw-bold text-truncate font-sans">{{ adminApi.currentAdmin()?.full_name || 'System Super Admin' }}</div>
              <div class="d-flex align-items-center mt-1">
                <span class="role-badge">{{ adminApi.currentAdmin()?.admin_role || 'SUPER_ADMIN' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-grow-1 p-2 overflow-y-auto">
          <div *ngIf="!isCollapsed()" class="nav-section-title px-2 py-1 font-sans">MAIN NAVIGATION</div>
          
          <ul class="nav nav-pills flex-column gap-1">
            <li class="nav-item">
              <a routerLink="/dashboard" routerLinkActive="active-royal-link" class="nav-link py-2 px-2 text-white-50 d-flex align-items-center rounded-2">
                <div class="nav-icon-wrap"><i class="bi bi-grid-1x2-fill"></i></div>
                <span *ngIf="!isCollapsed()" class="nav-label ms-2 font-sans">Dashboard</span>
              </a>
            </li>

            <li class="nav-item">
              <a routerLink="/users" routerLinkActive="active-royal-link" class="nav-link py-2 px-2 text-white-50 d-flex align-items-center rounded-2">
                <div class="nav-icon-wrap"><i class="bi bi-people-fill"></i></div>
                <span *ngIf="!isCollapsed()" class="nav-label ms-2 font-sans">User Management</span>
              </a>
            </li>

            <li class="nav-item">
              <a routerLink="/kyc" routerLinkActive="active-royal-link" class="nav-link py-2 px-2 text-white-50 d-flex align-items-center rounded-2">
                <div class="nav-icon-wrap"><i class="bi bi-shield-check"></i></div>
                <span *ngIf="!isCollapsed()" class="nav-label ms-2 font-sans">KYC Moderation</span>
                <span *ngIf="!isCollapsed() && pendingKycCount() > 0" class="badge bg-warning text-dark ms-auto font-size-xxs px-1.5 py-0.5 rounded-pill">
                  {{ pendingKycCount() }}
                </span>
              </a>
            </li>

            <li class="nav-item">
              <a routerLink="/plans" routerLinkActive="active-royal-link" class="nav-link py-2 px-2 text-white-50 d-flex align-items-center rounded-2">
                <div class="nav-icon-wrap"><i class="bi bi-gem"></i></div>
                <span *ngIf="!isCollapsed()" class="nav-label ms-2 font-sans">Subscription Plans</span>
              </a>
            </li>

            <li class="nav-item">
              <a routerLink="/kundli" routerLinkActive="active-royal-link" class="nav-link py-2 px-2 text-white-50 d-flex align-items-center rounded-2">
                <div class="nav-icon-wrap"><i class="bi bi-moon-stars-fill"></i></div>
                <span *ngIf="!isCollapsed()" class="nav-label ms-2 font-sans">Kundli Milan</span>
              </a>
            </li>

            <li class="nav-item">
              <a routerLink="/staff" routerLinkActive="active-royal-link" class="nav-link py-2 px-2 text-white-50 d-flex align-items-center rounded-2">
                <div class="nav-icon-wrap"><i class="bi bi-person-badge-fill"></i></div>
                <span *ngIf="!isCollapsed()" class="nav-label ms-2 font-sans">Staff & Roles</span>
              </a>
            </li>
          </ul>

          <div *ngIf="!isCollapsed()" class="nav-section-title px-2 py-1 mt-3 font-sans">QUICK PLATFORM</div>
          <ul class="nav nav-pills flex-column gap-1">
            <li class="nav-item">
              <a href="http://localhost:4200" target="_blank" class="nav-link py-2 px-2 text-white-50 d-flex align-items-center rounded-2 external-link">
                <div class="nav-icon-wrap"><i class="bi bi-arrow-up-right-circle"></i></div>
                <span *ngIf="!isCollapsed()" class="nav-label ms-2 font-sans">Live Website</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-2 border-top border-white border-opacity-10 sidebar-footer">
          <button (click)="logout()" class="btn btn-outline-danger btn-sm w-100 py-1.5 text-start d-flex align-items-center rounded-2 font-size-xs text-white">
            <i class="bi bi-power me-2 text-danger fs-6"></i>
            <span *ngIf="!isCollapsed()">Logout Console</span>
          </button>
        </div>

      </aside>

      <!-- ==============================================
           MAIN WORKSPACE & HEADER
           ============================================== -->
      <div class="d-flex flex-column flex-grow-1 overflow-x-hidden">
        
        <!-- Premium Glassmorphic Header -->
        <header class="admin-top-header sticky-top py-2 px-3 d-flex align-items-center justify-content-between border-bottom shadow-sm">
          
          <!-- Left side: Mobile Toggle & Breadcrumb / Status -->
          <div class="d-flex align-items-center">
            <button 
              type="button" 
              class="btn btn-sm btn-light me-2 d-lg-none" 
              (click)="toggleSidebar()">
              <i class="bi bi-list fs-5"></i>
            </button>
            
            <div class="d-flex align-items-center">
              <div class="live-pill me-2 d-none d-sm-flex align-items-center">
                <span class="live-pulse me-1"></span>
                <span>SYSTEM ONLINE</span>
              </div>
              <span class="text-secondary small fw-medium d-none d-md-inline font-sans">
                Portal: <strong class="text-maroon">Jeevansathi Matrimonial Core</strong>
              </span>
            </div>
          </div>

          <!-- Right side: Notifications & Profile Dropdown -->
          <div class="d-flex align-items-center gap-2">
            
            <!-- Global Loading Sync Indicator -->
            <div *ngIf="adminApi.isLoading()" class="sync-pill py-1 px-2 d-flex align-items-center text-maroon me-1">
              <div class="spinner-border spinner-border-sm me-1 text-maroon" role="status"></div>
              <span class="font-size-xs fw-semibold">Syncing</span>
            </div>

            <!-- Notifications Dropdown -->
            <div class="dropdown position-relative">
              <button 
                type="button" 
                class="btn btn-sm btn-header-action rounded-circle position-relative" 
                (click)="toggleNotifications()"
                title="Notifications">
                <i class="bi bi-bell-fill fs-6 text-secondary"></i>
                <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
              </button>

              <!-- Notifications Menu -->
              <div *ngIf="showNotifications()" class="dropdown-menu dropdown-menu-end show shadow-lg border-0 p-0 rounded-3 notify-dropdown">
                <div class="p-2 bg-maroon text-white d-flex justify-content-between align-items-center rounded-top-3">
                  <span class="font-serif fw-bold small">System Alerts</span>
                  <span class="badge bg-gold text-dark font-size-xxs">Live</span>
                </div>
                <div class="p-2 notify-list">
                  <div class="notify-item p-2 rounded-2 mb-1 border-bottom">
                    <div class="fw-semibold text-dark font-size-xs"><i class="bi bi-shield-check text-warning me-1"></i> New KYC Submitted</div>
                    <div class="text-muted font-size-xxs">Applicant waiting for document verification</div>
                  </div>
                  <div class="notify-item p-2 rounded-2 border-bottom">
                    <div class="fw-semibold text-dark font-size-xs"><i class="bi bi-check-circle-fill text-success me-1"></i> Database Connected</div>
                    <div class="text-muted font-size-xxs">Atlas Replica Set health normal</div>
                  </div>
                </div>
                <div class="p-1 text-center bg-light rounded-bottom-3">
                  <a routerLink="/kyc" (click)="showNotifications.set(false)" class="small text-maroon fw-semibold text-decoration-none font-size-xs">View Moderation Queue &rarr;</a>
                </div>
              </div>
            </div>

            <!-- Admin Profile Dropdown -->
            <div class="dropdown position-relative">
              <button 
                type="button" 
                class="btn btn-sm btn-header-user py-1 px-2 d-flex align-items-center rounded-pill" 
                (click)="toggleProfileMenu()">
                <div class="user-avatar-sm rounded-circle text-dark fw-bold me-1.5">
                  {{ (adminApi.currentAdmin()?.full_name || 'A')[0] }}
                </div>
                <span class="small fw-semibold text-dark d-none d-sm-inline me-1">
                  {{ adminApi.currentAdmin()?.admin_name || 'superadmin' }}
                </span>
                <i class="bi bi-chevron-down text-muted font-size-xxs"></i>
              </button>

              <!-- Profile Menu Dropdown -->
              <div *ngIf="showProfileMenu()" class="dropdown-menu dropdown-menu-end show shadow-lg border-0 p-2 rounded-3 mt-2 user-dropdown">
                <div class="px-2 py-1.5 border-bottom mb-1">
                  <div class="fw-bold text-dark font-size-xs">{{ adminApi.currentAdmin()?.full_name || 'System Super Admin' }}</div>
                  <div class="text-muted font-size-xxs">{{ adminApi.currentAdmin()?.email || 'admin@vivah.com' }}</div>
                  <span class="badge bg-gold-subtle text-gold mt-1 font-size-xxs">{{ adminApi.currentAdmin()?.admin_role || 'SUPER_ADMIN' }}</span>
                </div>
                
                <a routerLink="/staff" (click)="showProfileMenu.set(false)" class="dropdown-item py-1.5 px-2 rounded-2 font-size-xs">
                  <i class="bi bi-person-gear me-2 text-maroon"></i> Staff Accounts
                </a>
                <a routerLink="/dashboard" (click)="showProfileMenu.set(false)" class="dropdown-item py-1.5 px-2 rounded-2 font-size-xs">
                  <i class="bi bi-sliders me-2 text-maroon"></i> Platform Stats
                </a>
                
                <div class="dropdown-divider my-1"></div>
                <button (click)="logout()" class="dropdown-item py-1.5 px-2 rounded-2 font-size-xs text-danger">
                  <i class="bi bi-power me-2"></i> Logout
                </button>
              </div>
            </div>

          </div>
        </header>

        <!-- Dynamic Page Content -->
        <main class="p-3 flex-grow-1 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>

      </div>

    </div>
  `,
  styles: [`
    /* ============================================================
       ROYAL MAROON SIDEBAR STYLES
       ============================================================ */
    .admin-sidebar {
      width: 240px;
      min-width: 240px;
      background: linear-gradient(180deg, #38040C 0%, #500713 50%, #7A0C1E 100%);
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1040;
    }
    .sidebar-collapsed {
      width: 68px !important;
      min-width: 68px !important;
    }
    .brand-logo-icon {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, #7A0C1E, #38040C);
      border: 1.5px solid #D4AF37;
    }
    .badge-console {
      font-size: 0.625rem;
      color: #D4AF37;
      letter-spacing: 0.75px;
      font-weight: 700;
    }
    .admin-profile-chip {
      background: rgba(0, 0, 0, 0.25);
    }
    .admin-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #E8C863, #D4AF37);
      font-size: 0.8125rem;
    }
    .status-indicator-dot {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 9px;
      height: 9px;
      background-color: #2b8a3e;
      border: 1.5px solid #38040C;
      border-radius: 50%;
    }
    .role-badge {
      font-size: 0.625rem;
      background: rgba(212, 175, 55, 0.18);
      color: #E8C863;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .nav-section-title {
      font-size: 0.625rem;
      letter-spacing: 0.75px;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 700;
    }
    .nav-icon-wrap {
      width: 24px;
      text-align: center;
      font-size: 1rem;
      color: #D4AF37;
    }
    .nav-link {
      transition: all 0.15s ease-in-out;
    }
    .nav-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff !important;
    }
    .active-royal-link {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(122, 12, 30, 0.6)) !important;
      color: #FFFDF9 !important;
      font-weight: 600;
      border-left: 3px solid #D4AF37;
      box-shadow: inset 0 0 12px rgba(212, 175, 55, 0.15);
    }
    .active-royal-link .nav-icon-wrap {
      color: #FFFDF9 !important;
    }
    .external-link:hover .nav-icon-wrap {
      color: #E8C863;
    }

    /* ============================================================
       TOP HEADER STYLES
       ============================================================ */
    .admin-top-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      z-index: 1020;
    }
    .live-pill {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #2b8a3e;
      background: #ebfbee;
      padding: 2px 8px;
      border-radius: 20px;
    }
    .live-pulse {
      width: 6px;
      height: 6px;
      background-color: #2b8a3e;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-green 1.5s infinite;
    }
    @keyframes pulse-green {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(43, 138, 62, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(43, 138, 62, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(43, 138, 62, 0); }
    }
    .sync-pill {
      background: #fdf9ee;
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 20px;
    }
    .btn-header-action {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #faf7f2;
      border: 1px solid #ebe3d7;
      transition: all 0.15s;
    }
    .btn-header-action:hover {
      background: #f5efeb;
    }
    .btn-header-user {
      background: #faf7f2;
      border: 1px solid #ebe3d7;
    }
    .user-avatar-sm {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #E8C863, #D4AF37);
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .notify-dropdown {
      width: 280px;
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 8px !important;
      margin-right: 8px !important;
      z-index: 1060;
    }
    .user-dropdown {
      width: 220px;
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 8px !important;
      margin-right: 12px !important;
      z-index: 1060;
    }
    .font-size-xxs {
      font-size: 0.6875rem;
    }
    .font-size-xs {
      font-size: 0.75rem;
    }
    .letter-spacing-1 {
      letter-spacing: 1px;
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly isCollapsed = signal<boolean>(false);
  readonly showNotifications = signal<boolean>(false);
  readonly showProfileMenu = signal<boolean>(false);
  readonly pendingKycCount = signal<number>(0);

  ngOnInit() {
    if (!this.adminApi.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchPendingKyc();
  }

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    if (this.showNotifications()) {
      this.showProfileMenu.set(false);
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu.update(v => !v);
    if (this.showProfileMenu()) {
      this.showNotifications.set(false);
    }
  }

  fetchPendingKyc() {
    this.adminApi.get<any[]>('admin/kyc', { status: 'PENDING' }).subscribe({
      next: (res) => {
        this.pendingKycCount.set(res.data?.length || 0);
      },
      error: () => {}
    });
  }

  logout() {
    this.adminApi.post('admin/auth/logout', {}).subscribe({
      next: () => {
        this.adminApi.clearSession();
        this.toast.info('Session logged out successfully', 'Logged Out');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.adminApi.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}
