import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T = any> {
  key: string;
  header: string;
  type?: 'text' | 'badge' | 'currency' | 'date';
  badgeClass?: (item: T) => string;
  format?: (value: any, item: T) => string;
}

export interface TableAction<T = any> {
  label: string;
  icon?: string;
  btnClass?: string;
  action: string;
  condition?: (item: T) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-responsive rounded-2 border bg-white shadow-sm">
      <table class="table table-hover align-middle mb-0 compact-table">
        <thead class="admin-table-head">
          <tr>
            <th *ngFor="let col of columns()" class="py-2 px-2 text-uppercase fw-semibold">
              {{ col.header }}
            </th>
            <th *ngIf="actions().length > 0" class="py-2 px-2 text-end fw-semibold">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading -->
          <tr *ngIf="loading()">
            <td [attr.colspan]="columns().length + (actions().length > 0 ? 1 : 0)" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-maroon me-2" role="status"></div>
              <span class="text-muted small">Loading records...</span>
            </td>
          </tr>

          <!-- Empty -->
          <tr *ngIf="!loading() && (!data() || data().length === 0)">
            <td [attr.colspan]="columns().length + (actions().length > 0 ? 1 : 0)" class="text-center py-4">
              <i class="bi bi-folder2-open text-muted fs-4 d-block mb-1"></i>
              <span class="text-muted small">{{ emptyMessage() }}</span>
            </td>
          </tr>

          <!-- Rows -->
          <tr *ngFor="let row of data()" class="admin-table-row">
            <td *ngFor="let col of columns()" class="py-2 px-2 text-truncate" style="max-width: 250px;">
              
              <!-- Badge -->
              <ng-container *ngIf="col.type === 'badge'">
                <span class="badge rounded-pill px-2 py-1 fw-medium" [ngClass]="col.badgeClass ? col.badgeClass(row) : 'bg-light text-dark'">
                  {{ col.format ? col.format(getVal(row, col.key), row) : getVal(row, col.key) }}
                </span>
              </ng-container>

              <!-- Currency -->
              <ng-container *ngIf="col.type === 'currency'">
                <span class="fw-semibold text-dark">₹{{ (getVal(row, col.key) || 0) | number:'1.0-2' }}</span>
              </ng-container>

              <!-- Date -->
              <ng-container *ngIf="col.type === 'date'">
                <span class="text-muted">{{ getVal(row, col.key) | date:'mediumDate' }}</span>
              </ng-container>

              <!-- Standard Text -->
              <ng-container *ngIf="!col.type || col.type === 'text'">
                <span>{{ col.format ? col.format(getVal(row, col.key), row) : (getVal(row, col.key) ?? '-') }}</span>
              </ng-container>
            </td>

            <!-- Actions -->
            <td *ngIf="actions().length > 0" class="py-2 px-2 text-end text-nowrap">
              <div class="btn-group btn-group-sm">
                <ng-container *ngFor="let act of actions()">
                  <button 
                    *ngIf="!act.condition || act.condition(row)"
                    type="button" 
                    class="btn btn-sm px-2 py-1 mx-1" 
                    [ngClass]="act.btnClass || 'btn-outline-secondary'"
                    (click)="onAction(act.action, row)">
                    <i *ngIf="act.icon" [class]="'bi ' + act.icon + ' me-1'"></i>
                    <span>{{ act.label }}</span>
                  </button>
                </ng-container>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .admin-table-head {
      background: linear-gradient(135deg, #7A0C1E, #500713);
      color: #FFFDF9;
      font-size: 0.75rem;
      border-bottom: 2px solid #D4AF37;
    }
    .compact-table td {
      font-size: 0.8125rem;
      line-height: 1.35;
    }
    .admin-table-row:hover {
      background-color: #FDF9EE !important;
    }
    .text-maroon {
      color: #7A0C1E;
    }
  `]
})
export class DataTableComponent<T extends Record<string, any> = any> {
  columns = input.required<TableColumn<T>[]>();
  data = input<T[]>([]);
  actions = input<TableAction<T>[]>([]);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No records found');

  actionTriggered = output<{ action: string; item: T }>();

  getVal(row: any, key: string): any {
    if (!row || !key) return '';
    return row[key];
  }

  onAction(action: string, item: T) {
    this.actionTriggered.emit({ action, item });
  }
}
