import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  // Dynamic Base API: uses production domain on production or non-localhost hostnames
  private readonly baseUrl = (
    environment.production ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ) ? 'https://api.jeevansathimarriage.com/api' : (environment.apiUrl || 'http://localhost:6000/api');

  // Signals for global loading state and error tracking
  readonly isLoading = signal<boolean>(false);
  readonly activeRequestsCount = signal<number>(0);
  readonly lastError = signal<string | null>(null);

  /**
   * Generic GET Request
   * @param endpoint - API path (e.g. 'profiles' or 'kundli/match')
   * @param params - Optional query parameters
   */
  get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Observable<T> {
    this.startLoading();
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          httpParams = httpParams.set(key, String(val));
        }
      });
    }

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams }).pipe(
      tap(() => this.lastError.set(null)),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Generic POST Request
   * @param endpoint - API path
   * @param body - Request payload
   * @param headers - Optional custom headers
   */
  post<T>(endpoint: string, body: unknown, headers?: HttpHeaders): Observable<T> {
    this.startLoading();
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers }).pipe(
      tap(() => this.lastError.set(null)),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Generic PUT Request
   * @param endpoint - API path
   * @param body - Request payload
   */
  put<T>(endpoint: string, body: unknown): Observable<T> {
    this.startLoading();
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      tap(() => this.lastError.set(null)),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Generic PATCH Request
   * @param endpoint - API path
   * @param body - Partial update payload
   */
  patch<T>(endpoint: string, body: unknown): Observable<T> {
    this.startLoading();
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      tap(() => this.lastError.set(null)),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  /**
   * Generic DELETE Request
   * @param endpoint - API path
   */
  delete<T>(endpoint: string): Observable<T> {
    this.startLoading();
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      tap(() => this.lastError.set(null)),
      catchError(error => this.handleError(error)),
      finalize(() => this.stopLoading())
    );
  }

  // Request counter and loading indicator helpers
  private startLoading(): void {
    this.activeRequestsCount.update(count => count + 1);
    this.isLoading.set(true);
  }

  private stopLoading(): void {
    this.activeRequestsCount.update(count => Math.max(0, count - 1));
    if (this.activeRequestsCount() === 0) {
      this.isLoading.set(false);
    }
  }

  // Centralized Error Handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.error instanceof ErrorEvent) {
      // Client-side / network error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Server-side response error
      errorMessage = error.error?.message || `Server Error (Code: ${error.status}): ${error.statusText}`;
    }
    this.lastError.set(errorMessage);
    console.error('[ApiService Error]:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
