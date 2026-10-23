import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  error_code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private readonly http = inject(HttpClient);
  // Backend runs on port 5000 with prefix /api/v1
  private readonly baseUrl = 'http://localhost:5000/api/v1';

  // Signals for token & admin auth state
  readonly token = signal<string | null>(localStorage.getItem('admin_token'));
  readonly currentAdmin = signal<any | null>(
    localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')!) : null
  );

  // Signals for state management
  readonly isLoading = signal<boolean>(false);
  readonly activeRequests = signal<number>(0);
  readonly lastError = signal<string | null>(null);

  constructor() {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const currentToken = this.token();
    if (currentToken) {
      headers = headers.set('Authorization', `Bearer ${currentToken}`);
    }
    return headers;
  }

  setSession(token: string, admin: any) {
    this.token.set(token);
    this.currentAdmin.set(admin);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(admin));
  }

  clearSession() {
    this.token.set(null);
    this.currentAdmin.set(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  /**
   * Universal GET API
   */
  get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<ApiResponse<T>> {
    this.startLoading();
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          httpParams = httpParams.set(k, String(v));
        }
      });
    }

    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams,
    }).pipe(
      tap(() => this.lastError.set(null)),
      catchError(err => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Universal POST API
   */
  post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    this.startLoading();
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body, {
      headers: this.getHeaders(),
    }).pipe(
      tap(() => this.lastError.set(null)),
      catchError(err => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Universal PUT API
   */
  put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    this.startLoading();
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body, {
      headers: this.getHeaders(),
    }).pipe(
      tap(() => this.lastError.set(null)),
      catchError(err => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Universal PATCH API
   */
  patch<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    this.startLoading();
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body, {
      headers: this.getHeaders(),
    }).pipe(
      tap(() => this.lastError.set(null)),
      catchError(err => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Universal DELETE API
   */
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    this.startLoading();
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(),
    }).pipe(
      tap(() => this.lastError.set(null)),
      catchError(err => this.handleError(err)),
      finalize(() => this.stopLoading())
    );
  }

  private startLoading() {
    this.activeRequests.update(c => c + 1);
    this.isLoading.set(true);
  }

  private stopLoading() {
    this.activeRequests.update(c => Math.max(0, c - 1));
    if (this.activeRequests() === 0) {
      this.isLoading.set(false);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message || error.statusText || 'Error processing request';
    this.lastError.set(msg);
    return throwError(() => new Error(msg));
  }
}
