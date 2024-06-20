import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  url = 'http://localhost:5283/auth';
  constructor(private http: HttpClient) {}

  checkAuthStatus(): Observable<boolean> {
    return this.http.get<{ isAuthenticated: boolean }>(`${this.url}/IsAuthenticated`, { withCredentials: true }).pipe(
      map((response: { isAuthenticated: boolean }) => {
        console.log("checkAuthStatus response is: "+response.isAuthenticated);
        this.isAuthenticated = response.isAuthenticated;
        return response.isAuthenticated;
      }),
      catchError(error => {
        console.error('Error checking auth status', error);
        return of(false);
      })
    );
  }

  getAuthStatus(): boolean {
    return this.isAuthenticated;
  }
}
