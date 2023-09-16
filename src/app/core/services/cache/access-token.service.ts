import { Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@core/enums';
import { IAccessTokenResponse } from '@core/models';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessTokenService {
  private readonly _accessToken$ = new BehaviorSubject<string>('');
  constructor() { }
  public get accessToken$(): Observable<IAccessTokenResponse> {
    if (!this._accessToken$.value) {
      this._accessToken$.next(JSON.parse(localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) || ''));
    }
    return this._accessToken$.asObservable().pipe(map((res: string) => { return { accessToken: res } }));
  }

  public setAccessToken(data: string): void {
    if (!data) localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
    this._accessToken$.next(data);
    localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, JSON.stringify(data));
  }
}
